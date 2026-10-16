import OpenAI from 'openai'
import { MAX_OUTPUT, NO_USAGE, ProviderError, problemOf, type Adapter, type Usage } from './types.ts'

/**
 * DeepSeek, through OpenAI's SDK at DeepSeek's address (its API is OpenAI-compatible), called from this browser with
 * the player's key. Its JSON mode guarantees valid JSON, not the schema, so the instructions carry the schema (the
 * API's brief for DeepSeek does that) and the API's checks do the rest. JSON mode can come back empty; that counts as
 * unfinished. One request per call: the SDK's own retries are off.
 */
const client = (apiKey: string) =>
  new OpenAI({ apiKey, baseURL: 'https://api.deepseek.com', dangerouslyAllowBrowser: true, maxRetries: 0 })

/** DeepSeek counts the prompt's cache hits and misses itself, beside OpenAI's usual fields. */
interface DeepSeekUsage {
  prompt_tokens?: number
  completion_tokens?: number
  prompt_cache_hit_tokens?: number
  prompt_cache_miss_tokens?: number
}

function usageOf(usage: DeepSeekUsage | null | undefined): Usage {
  if (!usage) return NO_USAGE
  const hit = usage.prompt_cache_hit_tokens ?? 0
  return {
    input: usage.prompt_cache_miss_tokens ?? (usage.prompt_tokens ?? 0) - hit,
    cached_input: hit,
    cache_write: 0,
    output: usage.completion_tokens ?? 0,
  }
}

function problem(error: unknown): ProviderError {
  if (error instanceof ProviderError) return error
  if (error instanceof OpenAI.APIUserAbortError) return new ProviderError('stopped', 'Stopped.')
  if (error instanceof OpenAI.APIError) return problemOf(error.status, error.message)
  return new ProviderError('network', error instanceof Error ? error.message : String(error))
}

export const deepseek: Adapter = {
  async check(key, model) {
    try {
      const page = await client(key).models.list()
      if (!page.data.some((found) => found.id === model)) {
        throw new ProviderError('model', `${model} isn't one of this key's models.`)
      }
    } catch (error) {
      throw problem(error)
    }
  },

  async write({ key, model, prompt, signal, onText }) {
    try {
      const chunks = await client(key).chat.completions.create(
        {
          model,
          messages: [
            { role: 'system', content: prompt.instructions },
            ...prompt.messages.map((message) => ({ role: message.role, content: message.text })),
          ],
          max_tokens: MAX_OUTPUT,
          ...(prompt.schema && { response_format: { type: 'json_object' as const } }),
          stream: true,
          stream_options: { include_usage: true },
        },
        { signal },
      )
      let text = ''
      let stop = ''
      let usage = NO_USAGE
      let requestId = ''
      for await (const chunk of chunks) {
        requestId ||= chunk.id
        const choice = chunk.choices[0]
        if (choice?.delta?.content) {
          text += choice.delta.content
          onText(text.length)
        }
        stop = choice?.finish_reason ?? stop
        if (chunk.usage) usage = usageOf(chunk.usage as DeepSeekUsage)
      }
      return { text, stop: text.trim() ? stop : 'empty', usage, requestId }
    } catch (error) {
      throw problem(error)
    }
  },
}
