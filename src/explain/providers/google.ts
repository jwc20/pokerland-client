import { ApiError, GoogleGenAI, ThinkingLevel, type GenerateContentResponse } from '@google/genai'
import { MAX_OUTPUT, NO_USAGE, ProviderError, problemOf, type Adapter, type Effort, type Usage } from './types.ts'

/**
 * Gemini, through Google's SDK, called from this browser with the player's key. The SDK sends the key in the
 * `x-goog-api-key` header, never as the `?key=` query parameter the API also takes. One attempt per call: retries are
 * set to a single attempt rather than left to the SDK's defaults.
 */
const client = (apiKey: string) => new GoogleGenAI({ apiKey, httpOptions: { retryOptions: { attempts: 1 } } })

const LEVELS: Record<Effort, ThinkingLevel> = {
  low: ThinkingLevel.LOW,
  medium: ThinkingLevel.MEDIUM,
  high: ThinkingLevel.HIGH,
}

function usageOf(chunk: GenerateContentResponse): Usage {
  const usage = chunk.usageMetadata
  if (!usage) return NO_USAGE
  const cached = usage.cachedContentTokenCount ?? 0
  return {
    input: (usage.promptTokenCount ?? 0) - cached,
    cached_input: cached,
    cache_write: 0,
    output: (usage.candidatesTokenCount ?? 0) + (usage.thoughtsTokenCount ?? 0),
  }
}

function problem(error: unknown, signal: AbortSignal): ProviderError {
  if (error instanceof ProviderError) return error
  if (signal.aborted) return new ProviderError('stopped', 'Stopped.')
  if (error instanceof ApiError) return problemOf(error.status, error.message)
  return new ProviderError('network', error instanceof Error ? error.message : String(error))
}

export const google: Adapter = {
  async check(key, model) {
    const signal = new AbortController().signal
    try {
      await client(key).models.get({ model })
    } catch (error) {
      throw problem(error, signal)
    }
  },

  async write({ key, model, effort, prompt, signal, onText }) {
    try {
      const stream = await client(key).models.generateContentStream({
        model,
        contents: prompt.messages.map((message) => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.text }],
        })),
        config: {
          systemInstruction: prompt.instructions,
          maxOutputTokens: MAX_OUTPUT,
          thinkingConfig: { thinkingLevel: LEVELS[effort] },
          abortSignal: signal,
          ...(prompt.schema && { responseMimeType: 'application/json', responseJsonSchema: prompt.schema }),
        },
      })
      let text = ''
      let stop = ''
      let usage = NO_USAGE
      let requestId = ''
      for await (const chunk of stream) {
        text += chunk.text ?? ''
        onText(text.length)
        stop = chunk.candidates?.[0]?.finishReason ?? stop
        if (chunk.usageMetadata) usage = usageOf(chunk)
        requestId = chunk.responseId ?? requestId
      }
      return { text, stop, usage, requestId }
    } catch (error) {
      throw problem(error, signal)
    }
  },
}
