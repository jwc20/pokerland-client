import type { Query, QueryClient, QueryKey } from '@tanstack/react-query'
import { FROM_HANDS } from './queries.ts'

/**
 * What each save changes, as the queries to refresh (src/api/queries.ts): the ones on screen are fetched again at
 * once, the rest when next shown. Each is as narrow as the data allows: a note refreshes the queue and the purposes,
 * not every statistic.
 */

function refresh(client: QueryClient, ...keys: QueryKey[]) {
  return Promise.all(keys.map((queryKey) => client.invalidateQueries({ queryKey })))
}

/** Whether a query was asked with this saved spot as its filter. */
function filteredBySpot(spot: number) {
  return (query: Query) =>
    query.queryKey.some((part) => typeof part === 'object' && part !== null && 'spot' in part && part.spot === spot)
}

export const changes = {
  /** New hands are in: everything worked out from them. */
  upload: (client: QueryClient) => refresh(client, ...FROM_HANDS),

  /** A note, tag, review state or bet purpose on a hand: the queue, the purposes, and the lists filtered by them. */
  note: (client: QueryClient) =>
    refresh(client, ['review'], ['stats', 'purposes'], ['hands', 'list'], ['sessions', 'list']),

  /** The leak checks' thresholds changed (put in the cache by the save), or a check was marked reviewed: the checks. */
  leaks: (client: QueryClient) => refresh(client, ['leaks', 'list']),

  /** A saved spot changed: the list, and everything filtered by it. */
  spot: (client: QueryClient, id: number) =>
    Promise.all([refresh(client, ['spots', 'list']), client.invalidateQueries({ predicate: filteredBySpot(id) })]),

  ranges: (client: QueryClient) => refresh(client, ['ranges']),

  /** An answer, or "again later": the profile's skills and reviews, and today's set if it was one of its spots. */
  answer: (client: QueryClient) => refresh(client, ['practice', 'profile'], ['practice', 'sets', 'today']),

  /** A new set, match, table or test: the lists of recent ones. */
  practiceList: (client: QueryClient, kind: 'tests' | 'matches' | 'tables') =>
    refresh(client, ['practice', kind, 'list']),

  /** A match moved on: the list of recent ones, and the user's stage in each family it played. */
  match: (client: QueryClient) => refresh(client, ['practice', 'matches', 'list'], ['practice', 'playbooks']),

  /** A test ended: the list, and the ratings on the profile. */
  test: (client: QueryClient) => refresh(client, ['practice', 'tests', 'list'], ['practice', 'profile']),

  /** A playbook copied, saved as a new version, put away or assigned: the playbooks, and the classes they're in. */
  playbook: (client: QueryClient) => refresh(client, ['practice', 'playbooks'], ['leagues']),

  /** A class joined, started, left or changed, or something put before it: classes, and the playbooks they assign. */
  league: (client: QueryClient) => refresh(client, ['leagues'], ['practice', 'playbooks', 'list']),
}
