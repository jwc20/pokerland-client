import { useSyncExternalStore } from 'react'
import type { Effort, ProviderId } from './providers/types.ts'

/**
 * How the player likes explanations written, remembered on this device: the model (and so its provider), how hard
 * it thinks, whether OpenAI's answers stream, and which providers' notices they have accepted
 * (pokerland-llm-reports.md, 7). None of it is secret; the keys live in keyStore.ts.
 */
export interface Choices {
  provider: ProviderId | null
  model: string | null
  effort: Effort
  noStream: Partial<Record<ProviderId, boolean>>
  consented: Partial<Record<ProviderId, boolean>>
}

const KEY = 'pokerland-explain-choices'
const DEFAULTS: Choices = { provider: null, model: null, effort: 'medium', noStream: {}, consented: {} }

const listeners = new Set<() => void>()
let cached: Choices | undefined

function load(): Choices {
  if (cached) return cached
  try {
    const raw = localStorage.getItem(KEY)
    cached = raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Choices>) } : DEFAULTS
  } catch {
    cached = DEFAULTS // storage blocked: the defaults, for this visit
  }
  return cached
}

export function updateChoices(change: Partial<Choices>) {
  cached = { ...load(), ...change }
  try {
    localStorage.setItem(KEY, JSON.stringify(cached))
  } catch {
    // not remembered: it still applies until the page reloads
  }
  for (const listener of listeners) listener()
}

export function useChoices(): Choices {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    load,
  )
}
