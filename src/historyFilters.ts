import type { HandsListParams } from './api/generated/data-contracts.ts'

export type HistoryStat = NonNullable<HandsListParams['stat']>
export type HistoryResult = NonNullable<HandsListParams['result']>
export type HistorySort = NonNullable<HandsListParams['sort']>

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
  }
}

/** Whether the filters leave out any hands; a sort alone doesn't. */
export function narrowed(filters: HistoryFilters) {
  return Boolean(filters.tags.length || filters.since || filters.until || filters.stat || filters.result)
}

/** The first and last day of a month such as "2026-10", as filters. */
export function monthDays(month: string): { since: string; until: string } {
  const [year, number] = month.split('-').map(Number)
  const last = new Date(Date.UTC(year, number, 0)).getUTCDate()
  return { since: `${month}-01`, until: `${month}-${String(last).padStart(2, '0')}` }
}
