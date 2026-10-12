import { useSyncExternalStore } from 'react'
import type { ProviderId } from './providers/types.ts'

/**
 * The player's API keys for the model providers, kept in this browser and nowhere else (pokerland-llm-reports.md, 4).
 *
 * Keys stay in this tab (sessionStorage, the default) or on this device (localStorage), one per provider, under the
 * account they were added with. They never go to Pokerland's API, into a cookie, a URL or the query cache: only a
 * provider's adapter (src/explain/providers/) reads one, at the start of a call to that provider. Signing out, or
 * another account signing in, forgets them all.
 *
 * This is the only module that touches the keys' storage; a lint rule keeps the storage name out of the others.
 */

export type KeepIn = 'tab' | 'device'

interface Stored {
  owner: number
  keys: Partial<Record<ProviderId, string>>
}

const STORE = 'pokerland-model-keys'
const WHERE = 'pokerland-model-keys-where' // which store, a preference: no key is kept under it

const listeners = new Set<() => void>()
let version = 0

function changed() {
  version += 1
  for (const listener of listeners) listener()
}

function storageFor(where: KeepIn): Storage | null {
  try {
    return where === 'tab' ? sessionStorage : localStorage
  } catch {
    return null // storage blocked: nothing is kept, and calls need the key typed again
  }
}

function read(where: KeepIn): Stored | null {
  try {
    const raw = storageFor(where)?.getItem(STORE)
    return raw ? (JSON.parse(raw) as Stored) : null
  } catch {
    return null
  }
}

function write(where: KeepIn, stored: Stored | null) {
  try {
    const storage = storageFor(where)
    if (stored && Object.keys(stored.keys).length) storage?.setItem(STORE, JSON.stringify(stored))
    else storage?.removeItem(STORE)
  } catch {
    // not kept: the key works for this call only
  }
}

/** Where keys are kept: in this tab unless the player chose this device. */
export function keepIn(): KeepIn {
  try {
    return localStorage.getItem(WHERE) === 'device' ? 'device' : 'tab'
  } catch {
    return 'tab'
  }
}

function current(owner: number): Stored {
  const stored = read(keepIn())
  return stored && stored.owner === owner ? stored : { owner, keys: {} }
}

/** The key for a provider, if the signed-in user has one here. */
export function readKey(provider: ProviderId, owner: number): string | null {
  return current(owner).keys[provider] ?? null
}

export function saveKey(provider: ProviderId, key: string, owner: number) {
  const stored = current(owner)
  write(keepIn(), { owner, keys: { ...stored.keys, [provider]: key.trim() } })
  changed()
}

export function forgetKey(provider: ProviderId, owner: number) {
  const stored = current(owner)
  const keys = { ...stored.keys }
  delete keys[provider]
  write(keepIn(), { owner, keys })
  changed()
}

/** Every key, in both stores: on signing out, or when another account signs in. */
export function forgetAll() {
  write('tab', null)
  write('device', null)
  changed()
}

/** Forgets the keys if they were added under another account than the one now signed in. */
export function keepOnlyFor(owner: number) {
  for (const where of ['tab', 'device'] as const) {
    const stored = read(where)
    if (stored && stored.owner !== owner) write(where, null)
  }
  changed()
}

/** Moves the keys to the other store. */
export function setKeepIn(where: KeepIn, owner: number) {
  const from = keepIn()
  if (from === where) return
  const stored = current(owner)
  write(from, null)
  try {
    localStorage.setItem(WHERE, where)
  } catch {
    // the preference isn't kept: keys stay in the tab
  }
  write(where, stored)
  changed()
}

/** A key shown without most of it: "sk-ant-…a1B2". */
export function hint(key: string) {
  return key.length > 14 ? `${key.slice(0, 7)}…${key.slice(-4)}` : '…'
}

/** Which providers have a key, and a hint of each, kept fresh as keys are added and forgotten. */
export function useKeys(owner: number | undefined) {
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => version,
  )
  const keys = owner === undefined ? {} : current(owner).keys
  return {
    has: (provider: ProviderId) => Boolean(keys[provider]),
    hint: (provider: ProviderId) => (keys[provider] ? hint(keys[provider]) : null),
    where: keepIn(),
  }
}
