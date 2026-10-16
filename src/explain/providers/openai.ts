import OpenAI from 'openai'
import type { Response as OpenAIResponse, ResponseCreateParamsBase } from 'openai/resources/responses/responses'
import { MAX_OUTPUT, ProviderError, problemOf, type Adapter, type Prompt, type Written } from './types.ts'

/**
 * OpenAI's GPT models, through the Responses API, called from this browser with the player's key. One request per
 * call: the SDK's own retries are off. OpenAI has required a verified organisation to stream some models; that
 * refusal comes back as a "stream" problem, and Settings offers to stop streaming. Nothing switches by itself.
 */
const client = (apiKey: string) => new OpenAI({ apiKey, dangerouslyAllowBrowser: true, maxRetries: 0 })

function request(model: string, effort: string, prompt: Prompt): ResponseCreateParamsBase {
  return {
    model,
    instructions: prompt.instructions,
    input: prompt.messages.map((message) => ({ role: message.role, content: message.text })),
    reasoning: { effort: effort as 'low' | 'medium' | 'high' },
    max_output_tokens: MAX_OUTPUT,
    ...(prompt.schema && {
      text: { format: { type: 'json_schema' as const, name: 'explanation', schema: prompt.schema, strict: true } },
    }),
  }
}

/** The answer and how it ended: a refusal counts as unfinished, whatever the status says. */
function written(response: OpenAIResponse, streamed: string): Written {
  const parts = response.output.flatMap((item) => (item.type === 'message' ? item.content : []))
  const refused = parts.some((part) => part.type === 'refusal')
  const text = streamed || parts.flatMap((part) => (part.type === 'output_text' ? [part.text] : [])).join('')
  const usage = response.usage
  const cached = usage?.input_tokens_details?.cached_tokens ?? 0
  return {
    text,
    stop: refused ? 'refusal' : response.status ?? '',
    usage: {
      input: (usage?.input_tokens ?? 0) - cached,
      cached_input: cached,
      cache_write: 0,
      output: usage?.output_tokens ?? 0,
    },
    requestId: response.id,
  }
}

function problem(error: unknown): ProviderError {
  if (error instanceof ProviderError) return error
  if (error instanceof OpenAI.APIUserAbortError) return new ProviderError('stopped', 'Stopped.')
  if (error instanceof OpenAI.APIError) return problemOf(error.status, error.message)
  return new ProviderError('network', error instanceof Error ? error.message : String(error))
}

export const openai: Adapter = {
  async check(key, model) {
    try {
      await client(key).models.retrieve(model)
    } catch (error) {
      throw problem(error)
    }
  },

  async write({ key, model, effort, prompt, stream, signal, onText }) {
    try {
      if (!stream) {
        const params = { ...request(model, effort, prompt), stream: false as const }
        const response = await client(key).responses.create(params, { signal })
        onText(response.output_text.length)
        return written(response, '')
      }
      const events = await client(key).responses.create({ ...request(model, effort, prompt), stream: true }, { signal })
      let text = ''
      for await (const event of events) {
        if (event.type === 'response.output_text.delta') {
          text += event.delta
          onText(text.length)
        } else if (
          event.type === 'response.completed' ||
          event.type === 'response.incomplete' ||
          event.type === 'response.failed'
        ) {
          return written(event.response, text)
        } else if (event.type === 'error') {
          throw new ProviderError('busy', event.message)
        }
      }
      throw new ProviderError('network', 'The answer stopped arriving.')
    } catch (error) {
      throw problem(error)
    }
  },
}
