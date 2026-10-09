import type { HandsListParams, ReviewStateEnum } from './api/generated/data-contracts.ts'

export type HistoryStat = NonNullable<HandsListParams['stat']>
export type HistoryResult = NonNullable<HandsListParams['result']>
export type HistorySort = NonNullable<HandsListParams['sort']>
export type HistoryLeak = NonNullable<HandsListParams['leak']>

/** What the game history is narrowed to and sorted by, as its URL keeps it. */
export interface HistoryFilters {
  /** Keys from /api/hands/tags/, every one of which a hand must have: "position:BTN", "format:cash", ... */
  tags: string[]
  /** Days in the viewer's time zone, "YYYY-MM-DD", both ends included. */
  since?: string
  until?: string
  /** Hands that gave the hero a chance at a statistic, and with `did`, those where they took it or not. */
  stat?: HistoryStat
  did?: boolean
  result?: HistoryResult
  sort?: HistorySort
  /** Hands flagged to review, or reviewed; and hands with one of the user's own tags, such as "cooler". */
  review?: ReviewStateEnum
  noteTag?: string
  /** Hands in which the hero broke a preflop discipline check's rule, as /api/leaks/ counts them. */
  leak?: HistoryLeak
  /** The hands of one session, by its id. */
  session?: number
  /** The hands of one of the user's saved spots, by its id, or of a spec of conditions, as JSON (FND-3). */
  spot?: number
  spec?: string
  /** The hands an opponent was dealt into, and the hands of a tournament, by their ids. */
  opponent?: number
  tournament?: number
}

export const RESULT_LABELS: Record<HistoryResult, string> = { won: 'Won', lost: 'Lost', even: 'Broke even' }

export const SORT_LABELS: Record<HistorySort, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
  biggest_win: 'Biggest wins first',
  biggest_loss: 'Biggest losses first',
}

/** The game history with these filters, e.g. "/games?tag=position%3AUTG%2B1&stat=rfi". */
export function historyUrl(filters: Partial<HistoryFilters>): string {
  const query = historyParams(filters).toString()
  return query ? `/games?${query}` : '/games'
}

/** The filters as the game history's query. URLSearchParams escapes them: a bare "+" in "UTG+1" would arrive as a space. */
export function historyParams(filters: Partial<HistoryFilters>): URLSearchParams {
  const params = new URLSearchParams()
  for (const tag of filters.tags ?? []) {
    if (tag !== 'all') params.append('tag', tag)
  }
  for (const name of ['since', 'until', 'stat', 'result'] as const) {
    const value = filters[name]
    if (value) params.set(name, value)
  }
  if (filters.stat && filters.did !== undefined) params.set('did', String(filters.did))
  if (filters.review) params.set('review', filters.review)
  if (filters.noteTag) params.set('note_tag', filters.noteTag)
  if (filters.leak) params.set('leak', filters.leak)
  if (filters.session) params.set('session', String(filters.session))
  if (filters.spot) params.set('spot', String(filters.spot))
  if (filters.spec) params.set('spec', filters.spec)
  if (filters.opponent) params.set('opponent', String(filters.opponent))
  if (filters.tournament) params.set('tournament', String(filters.tournament))
  if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort)
  return params
}

/** The filters in a game history URL. An older link's single `date` is a day from `since` to `until`. */
export function readHistoryFilters(params: URLSearchParams): HistoryFilters {
  const date = params.get('date') || undefined
  const did = params.get('did')
  return {
    tags: params.getAll('tag').filter((tag) => tag && tag !== 'all'),
    since: params.get('since') || date,
    until: params.get('until') || date,
    stat: (params.get('stat') || undefined) as HistoryStat | undefined,
    did: did === 'true' ? true : did === 'false' ? false : undefined,
    result: (params.get('result') || undefined) as HistoryResult | undefined,
    sort: (params.get('sort') || undefined) as HistorySort | undefined,
    review: (params.get('review') || undefined) as ReviewStateEnum | undefined,
    noteTag: params.get('note_tag') || undefined,
    leak: (params.get('leak') || undefined) as HistoryLeak | undefined,
    session: Number(params.get('session')) || undefined,
    spot: Number(params.get('spot')) || undefined,
    spec: params.get('spec') || undefined,
    opponent: Number(params.get('opponent')) || undefined,
    tournament: Number(params.get('tournament')) || undefined,
  }
}

/** Whether the filters leave out any hands; a sort alone doesn't. */
export function narrowed(filters: HistoryFilters) {
  return Boolean(
    filters.tags.length ||
      filters.since ||
      filters.until ||
      filters.stat ||
      filters.result ||
      filters.review ||
      filters.noteTag ||
      filters.leak ||
      filters.session ||
      filters.spot ||
      filters.spec ||
      filters.opponent ||
      filters.tournament,
  )
}

/**
 * The hands a card counts, as the API's parameters, from the game history query its page's filters make: tags,
 * days, and a spot or a spec.
 */
export function apiScope(query: URLSearchParams) {
  return {
    tag: query.getAll('tag'),
    since: query.get('since') || undefined,
    until: query.get('until') || undefined,
    spot: Number(query.get('spot')) || undefined,
    spec: query.get('spec') || undefined,
  }
}

/** The first and last day of a month such as "2026-10", as filters. */
export function monthDays(month: string): { since: string; until: string } {
  const [year, number] = month.split('-').map(Number)
  const last = new Date(Date.UTC(year, number, 0)).getUTCDate()
  return { since: `${month}-01`, until: `${month}-${String(last).padStart(2, '0')}` }
}

/** A month's days, cut to the filters' own when they begin later or end earlier. ISO days compare as text. */
export function within(days: { since: string; until: string }, filters: Pick<HistoryFilters, 'since' | 'until'>) {
  return {
    since: filters.since && filters.since > days.since ? filters.since : days.since,
    until: filters.until && filters.until < days.until ? filters.until : days.until,
  }
}
