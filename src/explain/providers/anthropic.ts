import Anthropic from '@anthropic-ai/sdk'
import { MAX_OUTPUT, ProviderError, problemOf, type Adapter, type Prompt } from './types.ts'

/**
 * Claude, through Anthropic's SDK, called from this browser with the player's key. `dangerouslyAllowBrowser` adds the
 * header Anthropic's API needs for a cross-origin call; the name warns against shipping a site's own key to every
 * visitor, while this key belongs to the person at the keyboard. No automatic retries: one request per call.
 */
const client = (apiKey: string) => new Anthropic({ apiKey, dangerouslyAllowBrowser: true, maxRetries: 0 })

/** The instructions, cached across calls in a row; a follow-up also caches the conversation before the question. */
function request(model: string, effort: string, prompt: Prompt) {
  const last = prompt.messages.length - 1
  return {
    model,
    max_tokens: MAX_OUTPUT,
    system: [{ type: 'text' as const, text: prompt.instructions, cache_control: { type: 'ephemeral' as const } }],
    messages: prompt.messages.map((message, index) => ({
      role: message.role,
      content:
        index === last - 1
          ? [{ type: 'text' as const, text: message.text, cache_control: { type: 'ephemeral' as const } }]
          : message.text,
    })),
    output_config: {
      effort: effort as 'low' | 'medium' | 'high',
      ...(prompt.schema && { format: { type: 'json_schema' as const, schema: prompt.schema } }),
    },
  }
}

function problem(error: unknown): ProviderError {
  if (error instanceof ProviderError) return error
  if (error instanceof Anthropic.APIUserAbortError) return new ProviderError('stopped', 'Stopped.')
  if (error instanceof Anthropic.APIError) return problemOf(error.status, error.message)
  return new ProviderError('network', error instanceof Error ? error.message : String(error))
}

export const anthropic: Adapter = {
  async check(key, model) {
    try {
      await client(key).models.retrieve(model)
    } catch (error) {
      throw problem(error)
    }
  },

  async write({ key, model, effort, prompt, signal, onText }) {
    try {
      const stream = client(key).messages.stream(request(model, effort, prompt), { signal })
      stream.on('text', (_delta, snapshot) => onText(snapshot.length))
      const message = await stream.finalMessage()
      return {
        text: message.content.flatMap((block) => (block.type === 'text' ? [block.text] : [])).join(''),
        stop: message.stop_reason ?? '',
        usage: {
          input: message.usage.input_tokens,
          cached_input: message.usage.cache_read_input_tokens ?? 0,
          cache_write: message.usage.cache_creation_input_tokens ?? 0,
          output: message.usage.output_tokens,
        },
        requestId: stream.request_id ?? '',
      }
    } catch (error) {
      throw problem(error)
    }
  },
}
