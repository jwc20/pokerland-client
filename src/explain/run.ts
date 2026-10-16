import { errorMessage, explanations } from '../api/client.ts'
import type {
  Explanation,
  ExplanationKindEnum,
  ExplanationTurn,
} from '../api/generated/data-contracts.ts'
import type { HttpResponse } from '../api/generated/http-client.ts'
import { readKey } from './keyStore.ts'
import { adapterFor } from './providers/index.ts'
import { ProviderError, type Effort, type Prompt, type ProviderId, type Written } from './providers/types.ts'

/**
 * Explaining a subject, and asking about an explanation (pokerland-llm-reports.md, 5.1): Pokerland's API gives the
 * brief, the player's browser calls the provider with their key, and the API checks and saves the answer. The key goes
 * only to the provider. Nothing here retries: a failure becomes an ExplainError saying what happened, and only the
 * player's click tries again.
 */

export interface Subject {
  kind: ExplanationKindEnum
  id: number
}

/** The model to write with, as the page resolved it from the player's choices and the catalogue. */
export interface Choice {
  provider: ProviderId
  company: string
  model: string
  label: string
  effort: Effort
  stream: boolean
  /** The stop value the provider gives a finished answer: anything else isn't saved. */
  finished: string
}

/** Why an explanation or an answer didn't come, in plain words; `key` when the key dialog can fix it. */
export class ExplainError extends Error {
  readonly key: boolean

  constructor(message: string, key = false) {
    super(message)
    this.key = key
  }
}

/** Anthropic's, OpenAI's and DeepSeek's keys start "sk-"; Google's "AIza". The API removes them from saved text too. */
const KEY_SHAPE = /\bsk-[A-Za-z0-9_-]{16,}|\bAIza[0-9A-Za-z_-]{30,}/

export function looksLikeKey(text: string) {
  return KEY_SHAPE.test(text)
}

function fromProvider(error: ProviderError, choice: Choice): ExplainError {
  const who = choice.company
  switch (error.kind) {
    case 'key':
      return new ExplainError(`${who} refused this key. Check it, or add another.`, true)
    case 'credit':
      return new ExplainError(`Your account with ${who} needs credit.`)
    case 'model':
      return new ExplainError(`This key can't use ${choice.label}. Pick another model.`)
    case 'rate':
      return new ExplainError(`${who}'s rate limit: try again in a minute.`)
    case 'busy':
      return new ExplainError(`${who} is busy. Try again in a moment.`)
    case 'stream':
      return new ExplainError(
        'OpenAI wants a verified organisation to stream this model. Verify it, or turn streaming off in the key ' +
          'settings.',
        true,
      )
    case 'stopped':
      return new ExplainError('Stopped. Nothing was saved.')
    case 'network':
      return new ExplainError(`Couldn't reach ${who}. Check your connection and try again.`)
    default:
      return new ExplainError(`${who} didn't answer: ${error.message}`)
  }
}

const SHORT = 'ran out of room'
const DECLINED = 'declined this one'
const WHY_UNFINISHED: Record<string, string> = {
  max_tokens: SHORT,
  length: SHORT,
  MAX_TOKENS: SHORT,
  incomplete: SHORT,
  refusal: DECLINED,
  SAFETY: DECLINED,
  PROHIBITED_CONTENT: DECLINED,
  empty: 'sent an empty answer',
}

function unfinished(stop: string): ExplainError {
  const why = WHY_UNFINISHED[stop] ?? `stopped early (${stop || 'no reason given'})`
  return new ExplainError(`The model ${why}. Nothing was saved: try again, or pick another model.`)
}

/** DRF's nested errors in a line: what failed the checks. */
function flatten(value: unknown): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(flatten).join(' ')
  if (value && typeof value === 'object') return Object.values(value).map(flatten).join(' ')
  return String(value)
}

/** A call to Pokerland's API: its data, or an ExplainError saying what went wrong. */
async function api<T>(request: () => Promise<HttpResponse<T, unknown>>): Promise<T> {
  try {
    return (await request()).data
  } catch (error) {
    const body = error instanceof Response ? (error as HttpResponse<unknown, unknown>).error : null
    if (body && typeof body === 'object' && 'content' in body) {
      throw new ExplainError(
        `The model's answer didn't pass Pokerland's checks, so nothing was saved: ${flatten(body.content)}`,
      )
    }
    throw new ExplainError(errorMessage(error))
  }
}

async function write(
  choice: Choice,
  owner: number,
  prompt: Prompt,
  signal: AbortSignal,
  onText: (chars: number) => void,
): Promise<Written> {
  const key = readKey(choice.provider, owner)
  if (!key) throw new ExplainError(`Add your ${choice.company} key first.`, true)
  const adapter = await adapterFor(choice.provider)
  try {
    return await adapter.write({
      key,
      model: choice.model,
      effort: choice.effort,
      prompt,
      stream: choice.stream,
      signal,
      onText,
    })
  } catch (error) {
    throw error instanceof ProviderError ? fromProvider(error, choice) : new ExplainError(String(error))
  }
}

/** A model's JSON, tolerating a code fence around it. */
function parsed(text: string): unknown {
  const bare = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  try {
    return JSON.parse(bare)
  } catch {
    throw new ExplainError(
      "The model's answer wasn't valid JSON, so nothing was saved. Try again, or pick another model.",
    )
  }
}

/** Has the chosen model explain a subject, and saves what passes the API's checks. */
export async function explain(
  subject: Subject,
  choice: Choice,
  owner: number,
  signal: AbortSignal,
  onText: (chars: number) => void,
): Promise<Explanation> {
  const brief = await api(() =>
    explanations.explanationsBriefCreate({ kind: subject.kind, id: subject.id, provider: choice.provider }),
  )
  const prompt = {
    instructions: brief.instructions,
    messages: [{ role: 'user' as const, text: brief.input }],
    schema: brief.schema as Record<string, unknown>,
  }
  const written = await write(choice, owner, prompt, signal, onText)
  if (written.stop !== choice.finished) throw unfinished(written.stop)
  const content = parsed(written.text)
  return api(() =>
    explanations.explanationsCreate({
      kind: subject.kind,
      id: subject.id,
      provider: choice.provider,
      model: choice.model,
      brief_hash: brief.hash,
      effort: choice.effort,
      stop: written.stop,
      content,
      usage: written.usage,
      request_id: written.requestId.slice(0, 128),
    }),
  )
}

/** Asks the chosen model a question about an explanation, with the conversation so far, and saves the answer. */
export async function ask(
  explanation: Explanation,
  question: string,
  choice: Choice,
  owner: number,
  signal: AbortSignal,
  onText: (chars: number) => void,
): Promise<ExplanationTurn> {
  if (looksLikeKey(question)) throw new ExplainError('That looks like an API key. Take it out before asking.')
  const conversation = await api(() => explanations.explanationsTurnsBriefRetrieve({ id: explanation.id }))
  const prompt = {
    instructions: conversation.instructions,
    messages: [...conversation.messages, { role: 'user' as const, text: question }],
  }
  const written = await write({ ...choice, effort: 'low' }, owner, prompt, signal, onText)
  const answer = written.text.trim()
  if (written.stop !== choice.finished) throw unfinished(written.stop)
  if (!answer) throw unfinished('empty')
  return api(() =>
    explanations.explanationsTurnsCreate(
      { id: explanation.id },
      {
        after: conversation.after,
        provider: choice.provider,
        model: choice.model,
        question,
        answer: answer.slice(0, 8000),
        stop: written.stop,
        usage: written.usage,
        request_id: written.requestId.slice(0, 128),
      },
    ),
  )
}
