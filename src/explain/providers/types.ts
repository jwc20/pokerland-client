/**
 * What every provider's adapter does: check a key, and write an answer to a prompt (pokerland-llm-reports.md, 5.3).
 *
 * The rest of the app never knows which provider it's talking to. Each adapter makes one request per call and never
 * retries: a failure comes back as a ProviderError, and only the player's click tries again.
 */

export type ProviderId = 'anthropic' | 'openai' | 'google' | 'deepseek'
export type Effort = 'low' | 'medium' | 'high'

export interface Message {
  role: 'user' | 'assistant'
  text: string
}

/** What the model is told. With a schema, the answer is JSON of that shape; without one, plain text. */
export interface Prompt {
  instructions: string
  messages: Message[]
  schema?: Record<string, unknown>
}

/** Tokens as Pokerland prices them: `input` counts only those read afresh, and `output` includes reasoning. */
export interface Usage {
  input: number
  cached_input: number
  cache_write: number
  output: number
}

export interface Written {
  text: string
  /** The provider's own stop value: the API saves an answer only when it says the answer finished. */
  stop: string
  usage: Usage
  requestId: string
}

export interface Call {
  key: string
  model: string
  effort: Effort
  prompt: Prompt
  stream: boolean
  signal: AbortSignal
  /** How much of the answer has arrived, in characters, as it streams. */
  onText: (chars: number) => void
}

export interface Adapter {
  check(key: string, model: string): Promise<void>
  write(call: Call): Promise<Written>
}

export type ProblemKind = 'key' | 'credit' | 'model' | 'rate' | 'busy' | 'stream' | 'network' | 'stopped' | 'other'

/** A call that failed, sorted so the page can say why in plain words (pokerland-llm-reports.md, 5.3). */
export class ProviderError extends Error {
  readonly kind: ProblemKind

  constructor(kind: ProblemKind, message: string) {
    super(message)
    this.kind = kind
  }
}

/** The kind of problem an HTTP status from a provider means. */
export function problemOf(status: number | undefined, message = ''): ProviderError {
  const text = message.toLowerCase()
  if (status === 401 || text.includes('api key not valid') || text.includes('api_key_invalid')) {
    return new ProviderError('key', message)
  }
  if (status === 402 || text.includes('insufficient_quota') || text.includes('insufficient balance')) {
    return new ProviderError('credit', message)
  }
  if (text.includes('verified') && text.includes('stream')) return new ProviderError('stream', message)
  if (status === 403 || status === 404) return new ProviderError('model', message)
  if (status === 429) return new ProviderError('rate', message)
  if (status !== undefined && status >= 500) return new ProviderError('busy', message)
  if (status === undefined) return new ProviderError('network', message)
  return new ProviderError('other', message)
}

export const NO_USAGE: Usage = { input: 0, cached_input: 0, cache_write: 0, output: 0 }

/** The most an answer may run to: a ceiling, since a hand takes about 3,000 tokens with the reasoning. */
export const MAX_OUTPUT = 16000
