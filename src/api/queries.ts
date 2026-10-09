import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query'
import { inViewerTimeZone } from '../calendar.ts'
import {
  hands,
  leagues,
  leaks,
  practice,
  ranges,
  review,
  sessions,
  spots,
  stats,
  tracker,
  users,
} from './client.ts'
import type {
  HandsListParams,
  LeaksListParams,
  SessionsListParams,
  SessionsPatternsRetrieveParams,
  SpotCountRequestRequest,
  StatsLinesRetrieveParams,
  StatsListParams,
  StatsPurposesListParams,
  StatsSizingRetrieveParams,
  TestReport,
  TestState,
} from './generated/data-contracts.ts'

/**
 * Every query the app makes: its key, how to fetch it, and how long its data stays fresh (TanStack Query).
 *
 * A key starts with what the data is about, so a save can refresh a whole kind (`['stats']`) or one thing
 * (`['hands', 'detail', 42]`); src/api/changes.ts says which saves refresh what. How long data stays fresh follows
 * what changes it:
 *
 * - **forever:** a stored hand, the vocabularies. Nothing the user does changes them.
 * - **until an upload:** what is worked out from the user's hands. UploadWatcher refreshes it when the tracker
 *   status shows a new upload, and the saves that change some of it refresh that at once.
 * - **settings:** the user's own presets, spots, ranges and notes, which only their saves change.
 * - **always:** practice and match state, and classes, which other people, other tabs and the server's clock
 *   change. Fetched afresh on every visit.
 *
 * Queries don't hand TanStack's abort signal to the API. With it, React's development StrictMode, which mounts every
 * component twice, would cancel the first request and send a second: the double request deduplication removes.
 */

const FOREVER = Infinity
const UNTIL_UPLOAD = 10 * 60_000 // a backstop: uploads and saves refresh it sooner
const SETTINGS = 5 * 60_000 // for changes made on another device

/** Practice and match state the page plays on: never served from the cache, and never refetched mid-move. */
const PLAYING = { staleTime: 0, gcTime: 0, refetchOnWindowFocus: false } as const

const data = <T>(request: Promise<{ data: T }>) => request.then((response) => response.data)

/** The cursor in a page's `next` link, which the generated client takes as a parameter. */
export function cursorOf(url: string) {
  return new URL(url).searchParams.get('cursor') ?? undefined
}

/** A list's next page, from the cursor in its `next` link: the shape of every cursor-paginated endpoint. */
function nextPage(page: { next?: string | null }) {
  return page.next ? cursorOf(page.next) : undefined
}

export const queries = {
  tracker: {
    /** What the user's trackers have uploaded. Its observers poll it; UploadWatcher refreshes the rest from it. Fresh
     * for a moment, so a page that shows it doesn't ask again just after UploadWatcher has. */
    status: () =>
      queryOptions({
        queryKey: ['tracker', 'status'],
        queryFn: () => data(tracker.trackerStatusRetrieve()),
        staleTime: 15_000,
      }),
  },

  hands: {
    /** The game history, page by page; the filters' last results stay on screen while the next ones load. */
    list: (params: Omit<HandsListParams, 'cursor'>) =>
      infiniteQueryOptions({
        queryKey: ['hands', 'list', params],
        queryFn: ({ pageParam }) => data(hands.handsList({ ...params, cursor: pageParam })),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: nextPage,
        staleTime: UNTIL_UPLOAD,
        placeholderData: keepPreviousData,
      }),
    /** A first page alone, for a card that shows a few hands. */
    recent: (params: Omit<HandsListParams, 'cursor'>) =>
      queryOptions({
        queryKey: ['hands', 'recent', params],
        queryFn: () => data(hands.handsList(params)),
        staleTime: UNTIL_UPLOAD,
        placeholderData: keepPreviousData,
      }),
    /** The days played, in the viewer's time zone; `today` in the key starts it afresh at midnight. */
    days: (today: string) =>
      queryOptions({
        queryKey: ['hands', 'days', today],
        queryFn: () => inViewerTimeZone((tz) => data(hands.handsDaysRetrieve({ tz }))),
        staleTime: UNTIL_UPLOAD,
        placeholderData: keepPreviousData, // yesterday's, until today's arrive
      }),
    tags: () =>
      queryOptions({ queryKey: ['hands', 'tags'], queryFn: () => data(hands.handsTagsList()), staleTime: UNTIL_UPLOAD }),
    /** A stored hand: it never changes, so one fetch serves every visit (and Game History prefetches it). */
    detail: (id: number) =>
      queryOptions({
        queryKey: ['hands', 'detail', id],
        queryFn: () => data(hands.handsRetrieve({ id })),
        staleTime: FOREVER,
        gcTime: 30 * 60_000,
      }),
    notes: (id: number) =>
      queryOptions({
        queryKey: ['hands', 'notes', id],
        queryFn: () => data(hands.handsNotesList({ id })),
        staleTime: SETTINGS,
      }),
  },

  /** The review queue, and the user's note tags with the suggested ones. */
  review: () => queryOptions({ queryKey: ['review'], queryFn: () => data(review.reviewRetrieve()), staleTime: SETTINGS }),

  stats: {
    /** The hero's statistics in one grouping, days in the viewer's time zone. */
    groups: (params: Omit<StatsListParams, 'tz'>) =>
      queryOptions({
        queryKey: ['stats', 'groups', params],
        queryFn: () => inViewerTimeZone((tz) => data(stats.statsList({ ...params, tz }))),
        staleTime: UNTIL_UPLOAD,
        placeholderData: keepPreviousData,
      }),
    /** A page's own mix of statistics, loaded together as it always was: `name` keeps pages' mixes apart. */
    report: <T>(name: string, params: object, load: () => Promise<T>) =>
      queryOptions({
        queryKey: ['stats', 'report', name, params],
        queryFn: load,
        staleTime: UNTIL_UPLOAD,
        placeholderData: keepPreviousData,
      }),
    purposes: (params: StatsPurposesListParams) =>
      queryOptions({
        queryKey: ['stats', 'purposes', params],
        queryFn: () => data(stats.statsPurposesList(params)),
        staleTime: UNTIL_UPLOAD,
        placeholderData: keepPreviousData,
      }),
    sizing: (params: Omit<StatsSizingRetrieveParams, 'tz'>) =>
      queryOptions({
        queryKey: ['stats', 'sizing', params],
        queryFn: () => inViewerTimeZone((tz) => data(stats.statsSizingRetrieve({ ...params, tz }))),
        staleTime: UNTIL_UPLOAD,
        placeholderData: keepPreviousData,
      }),
    lines: (params: Omit<StatsLinesRetrieveParams, 'tz'>) =>
      queryOptions({
        queryKey: ['stats', 'lines', params],
        queryFn: () => inViewerTimeZone((tz) => data(stats.statsLinesRetrieve({ ...params, tz }))),
        staleTime: UNTIL_UPLOAD,
        placeholderData: keepPreviousData,
      }),
  },

  leaks: {
    list: (params: Omit<LeaksListParams, 'tz'>) =>
      queryOptions({
        queryKey: ['leaks', 'list', params],
        queryFn: () => inViewerTimeZone((tz) => data(leaks.leaksList({ ...params, tz }))),
        staleTime: UNTIL_UPLOAD,
        placeholderData: keepPreviousData,
      }),
    presets: () =>
      queryOptions({ queryKey: ['leaks', 'presets'], queryFn: () => data(leaks.leaksPresetsList()), staleTime: SETTINGS }),
  },

  sessions: {
    list: (params: Omit<SessionsListParams, 'cursor'>) =>
      infiniteQueryOptions({
        queryKey: ['sessions', 'list', params],
        queryFn: ({ pageParam }) => data(sessions.sessionsList({ ...params, cursor: pageParam })),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: nextPage,
        staleTime: UNTIL_UPLOAD,
        placeholderData: keepPreviousData,
      }),
    detail: (id: number) =>
      queryOptions({
        queryKey: ['sessions', 'detail', id],
        queryFn: () => data(sessions.sessionsRetrieve({ id })),
        staleTime: UNTIL_UPLOAD,
      }),
    patterns: (params: Omit<SessionsPatternsRetrieveParams, 'tz'>) =>
      queryOptions({
        queryKey: ['sessions', 'patterns', params],
        queryFn: () => inViewerTimeZone((tz) => data(sessions.sessionsPatternsRetrieve({ ...params, tz }))),
        staleTime: UNTIL_UPLOAD,
        placeholderData: keepPreviousData,
      }),
  },

  spots: {
    list: () => queryOptions({ queryKey: ['spots', 'list'], queryFn: () => data(spots.spotsList()), staleTime: SETTINGS }),
    fields: () =>
      queryOptions({ queryKey: ['spots', 'fields'], queryFn: () => data(spots.spotsFieldsList()), staleTime: FOREVER }),
    /** How many of the user's hands a spec matches. A POST, for the spec's length, but it saves nothing. */
    count: (request: SpotCountRequestRequest) =>
      queryOptions({
        queryKey: ['spots', 'count', request],
        queryFn: () => data(spots.spotsCountCreate(request)),
        staleTime: UNTIL_UPLOAD,
        placeholderData: keepPreviousData,
      }),
  },

  ranges: () => queryOptions({ queryKey: ['ranges'], queryFn: () => data(ranges.rangesList()), staleTime: SETTINGS }),

  /** The tracker's client token: the same until the user makes a new one. */
  clientToken: () =>
    queryOptions({
      queryKey: ['users', 'client-token'],
      queryFn: () => data(users.usersMeClientTokenRetrieve()),
      staleTime: FOREVER,
    }),

  practice: {
    profile: () =>
      queryOptions({
        queryKey: ['practice', 'profile'],
        queryFn: () => inViewerTimeZone((tz) => data(practice.practiceProfileRetrieve({ tz }))),
        staleTime: 0,
      }),
    /** Today's set, made by the server the first time it is asked for on the viewer's day. */
    today: () =>
      queryOptions({
        queryKey: ['practice', 'sets', 'today'],
        queryFn: () => inViewerTimeZone((tz) => data(practice.practiceSetsTodayRetrieve({ tz }))),
        staleTime: 0,
      }),
    set: (id: number) =>
      queryOptions({
        queryKey: ['practice', 'sets', id],
        queryFn: () => data(practice.practiceSetsRetrieve({ id })),
        ...PLAYING,
      }),
    tests: () =>
      queryOptions({ queryKey: ['practice', 'tests', 'list'], queryFn: () => data(practice.practiceTestsList()), staleTime: 0 }),
    /** A test as it stands, with its report once it is over. Asking for its next spot again gives the same one. */
    test: (id: number) =>
      queryOptions({
        queryKey: ['practice', 'tests', id],
        queryFn: async (): Promise<{ state: TestState; report?: TestReport }> => {
          const state = await data(practice.practiceTestsNextRetrieve({ id }))
          if (!state.finished) return { state }
          return { state, report: await data(practice.practiceTestsRetrieve({ id })) }
        },
        ...PLAYING,
      }),
    matches: () =>
      queryOptions({
        queryKey: ['practice', 'matches', 'list'],
        queryFn: () => data(practice.practiceMatchesList()),
        staleTime: 0,
      }),
    match: (id: number) =>
      queryOptions({
        queryKey: ['practice', 'matches', id],
        queryFn: () => data(practice.practiceMatchesRetrieve({ id })),
        ...PLAYING,
      }),
    /** A finished match's debrief and the playbook it was played by: neither changes once the match is over. */
    debrief: (id: number) =>
      queryOptions({
        queryKey: ['practice', 'matches', id, 'debrief'],
        queryFn: async () => {
          const debrief = await data(practice.practiceMatchesDebriefRetrieve({ id }))
          const match = await data(practice.practiceMatchesRetrieve({ id }))
          const playbook = await data(practice.practicePlaybooksRetrieve({ id: match.playbook }))
          return { debrief, playbook }
        },
        staleTime: FOREVER,
      }),
    tables: () =>
      queryOptions({ queryKey: ['practice', 'tables', 'list'], queryFn: () => data(practice.practiceTablesList()), staleTime: 0 }),
    table: (id: number) =>
      queryOptions({
        queryKey: ['practice', 'tables', id],
        queryFn: () => data(practice.practiceTablesRetrieve({ id })),
        ...PLAYING,
      }),
    /** The playbooks the user can play by: theirs, the house's and their classes', which coaches change. */
    playbooks: () =>
      queryOptions({
        queryKey: ['practice', 'playbooks', 'list'],
        queryFn: () => data(practice.practicePlaybooksList()),
        staleTime: 0,
      }),
    /** A playbook version's cards, with the user's stage in each family, which a match moves on. */
    playbook: (id: number) =>
      queryOptions({
        queryKey: ['practice', 'playbooks', id],
        queryFn: () => data(practice.practicePlaybooksRetrieve({ id })),
        staleTime: 0,
      }),
    vocabulary: () =>
      queryOptions({
        queryKey: ['practice', 'playbooks', 'vocabulary'],
        queryFn: () => data(practice.practicePlaybooksVocabularyRetrieve()),
        staleTime: FOREVER,
      }),
    /** By the book: how the user's hands kept a playbook's rules, and with `rule`, where it applied. */
    book: (playbook: number, rule?: string) =>
      queryOptions({
        queryKey: ['practice', 'book', playbook, rule ?? null],
        queryFn: () => data(practice.practiceHandsByTheBookRetrieve({ playbook, rule })),
        staleTime: UNTIL_UPLOAD,
      }),
  },

  leagues: {
    list: () => queryOptions({ queryKey: ['leagues', 'list'], queryFn: () => data(leagues.leaguesList()), staleTime: 0 }),
    detail: (id: number) =>
      queryOptions({ queryKey: ['leagues', id], queryFn: () => data(leagues.leaguesRetrieve({ id })), staleTime: 0 }),
    progress: (id: number) =>
      queryOptions({
        queryKey: ['leagues', id, 'progress'],
        queryFn: () => data(leagues.leaguesProgressList({ id })),
        staleTime: 0,
      }),
    /** One sharing member's progress with by the book, which reads their hands: only when a coach asks. */
    memberProgress: (id: number, member: number) =>
      queryOptions({
        queryKey: ['leagues', id, 'progress', member],
        queryFn: () => data(leagues.leaguesProgressRetrieve({ id, memberPk: member })),
        staleTime: 0,
      }),
  },
}

/** Everything worked out from the user's hands, which an upload changes. A stored hand itself doesn't change. */
export const FROM_HANDS = [
  ['hands', 'list'],
  ['hands', 'recent'],
  ['hands', 'days'],
  ['hands', 'tags'],
  ['stats'],
  ['leaks', 'list'],
  ['sessions'],
  ['spots', 'count'],
  ['practice', 'book'],
] as const
