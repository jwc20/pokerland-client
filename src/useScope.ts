import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { hands, spots as spotsApi } from './api/client.ts'
import type { HandTag, SavedSpot } from './api/generated/data-contracts.ts'
import type { HistoryFilters } from './historyFilters.ts'

/** The API's parameters for a page's hands: one tag, days, and a saved spot or a spec of conditions. */
export interface ScopeQuery {
  tag?: string[]
  since?: string
  until?: string
  spot?: number
  spec?: string
}

/**
 * The hands a My game page looks at, kept in its URL: a format, game or stakes tag, a stretch of days, and a saved
 * spot (`spot`) or conditions not saved yet (`spec`, as JSON). `base` is the same as game history filters, which
 * every link to the history starts from, and `query` as the API's parameters; `key` changes with them.
 */
export function useScope() {
  const [params, setParams] = useSearchParams()
  const tag = params.get('tag') ?? ''
  const since = params.get('since') ?? ''
  const until = params.get('until') ?? ''
  const spot = Number(params.get('spot')) || undefined
  const spec = params.get('spec') || undefined
  const base: HistoryFilters = {
    tags: tag ? [tag] : [],
    since: since || undefined,
    until: until || undefined,
    spot,
    spec,
  }
  const query: ScopeQuery = {
    tag: tag ? [tag] : undefined,
    since: since || undefined,
    until: until || undefined,
    spot,
    spec,
  }

  /** Sets one of the page's parameters, or several, as the URL stands now: a navigation renders later. */
  function setFilters(changes: Record<string, string | undefined>) {
    const next = new URLSearchParams(window.location.search)
    for (const [name, value] of Object.entries(changes)) {
      if (value) next.set(name, value)
      else next.delete(name)
    }
    setParams(next, { replace: true })
  }

  /** Clears the hands' filters, keeping the page's own parameters (its tab, its mode). */
  function clear(keep: string[] = []) {
    const next = new URLSearchParams()
    for (const name of keep) {
      const value = new URLSearchParams(window.location.search).get(name)
      if (value) next.set(name, value)
    }
    setParams(next, { replace: true })
  }

  const narrowed = Boolean(tag || since || until || spot || spec)
  return { params, tag, since, until, spot, spec, base, query, key: params.toString(), setFilters, clear, narrowed }
}

/** The user's position, game, stakes and format tags; none until they load, or if they don't. */
export function useHandTags() {
  const [tags, setTags] = useState<HandTag[]>()
  useEffect(() => {
    let active = true
    hands.handsTagsList().then(
      ({ data }) => {
        if (active) setTags(data)
      },
      () => {}, // the filters offer all hands alone
    )
    return () => {
      active = false
    }
  }, [])
  return tags
}

/** The user's saved spots, and a way to load them again after one is saved or deleted. */
export function useSavedSpots() {
  const [spots, setSpots] = useState<SavedSpot[]>()
  const [version, setVersion] = useState(0)
  useEffect(() => {
    let active = true
    spotsApi.spotsList().then(
      ({ data }) => {
        if (active) setSpots(data)
      },
      () => {}, // no saved spots to offer
    )
    return () => {
      active = false
    }
  }, [version])
  return { spots, reload: () => setVersion((n) => n + 1) }
}
