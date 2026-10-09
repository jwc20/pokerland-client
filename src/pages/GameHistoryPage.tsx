import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { errorMessage } from '../api/client.ts'
import type { HandsListParams } from '../api/generated/data-contracts.ts'
import { queries } from '../api/queries.ts'
import { browserTimeZone } from '../calendar.ts'
import HandTable from '../components/HandTable.tsx'
import HistoryFilterBar from '../components/HistoryFilterBar.tsx'
import { historyParams, narrowed, readHistoryFilters, type HistoryFilters } from '../historyFilters.ts'
import './GameHistoryPage.css'

/** The API's parameters for the filters; days are the viewer's, as the home page's calendar counts them. */
function listParams(filters: HistoryFilters): HandsListParams {
  return {
    tag: filters.tags.length ? filters.tags : undefined,
    since: filters.since,
    until: filters.until,
    stat: filters.stat,
    did: filters.stat ? filters.did : undefined,
    result: filters.result,
    review: filters.review,
    note_tag: filters.noteTag,
    leak: filters.leak,
    session: filters.session,
    sort: filters.sort,
    tz: browserTimeZone(),
  }
}

/**
 * All the user's hands, narrowed by the filters in the URL (tags, days, a
 * statistic's chances, results) and sorted: newest, oldest, or by result.
 */
function GameHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.toString()
  const filters = useMemo(() => readHistoryFilters(new URLSearchParams(search)), [search])
  // The filters offer "Any" alone until the tags load, or if they don't, and only a note tag already in the URL.
  const tags = useQuery(queries.hands.tags()).data
  const noteTags = useQuery(queries.review()).data?.tags

  return (
    <section className="game-history">
      <h1>Game History</h1>
      <p className="game-history-intro">
        {narrowed(filters) ? (
          'Your hands that match these filters.'
        ) : (
          <>
            This shows the most recent hands you've played across all tables on PokerStars. Hands appear here shortly
            after they finish, once your tracker has uploaded them; set it up on your{' '}
            <Link to="/settings">settings page</Link>.
          </>
        )}
      </p>
      <HistoryFilterBar
        filters={filters}
        tags={tags}
        noteTags={noteTags}
        onChange={(update) => {
          // The URL as it is now: React Router renders a navigation later, so `filters` may be a change behind.
          const latest = readHistoryFilters(new URLSearchParams(window.location.search))
          setSearchParams(historyParams(update(latest)), { replace: true })
        }}
      />
      <HandList filters={filters} />
    </section>
  )
}

/** The hands, a page at a time ("Load more"). Other filters start again from the first page; until it arrives, the
 * last filters' hands stay on screen, faded. */
function HandList({ filters }: { filters: HistoryFilters }) {
  const query = useInfiniteQuery(queries.hands.list(listParams(filters)))
  const rows = useMemo(() => query.data?.pages.flatMap((page) => page.results), [query.data])
  const error = query.error ? errorMessage(query.error) : null
  const loadingMore = query.isFetchingNextPage

  return (
    <>
      {rows === undefined ? (
        !error && <p>Loading…</p>
      ) : rows.length === 0 ? (
        <p className="game-history-empty">
          {narrowed(filters)
            ? 'None of your hands match these filters.'
            : 'No hands yet. Play a hand with the tracker running and it shows up here.'}
        </p>
      ) : (
        <div className={query.isPlaceholderData ? 'is-updating' : undefined} aria-busy={query.isPlaceholderData}>
          <HandTable hands={rows} />
        </div>
      )}

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      {query.hasNextPage && !query.isPlaceholderData && (
        <button
          type="button"
          className="button game-history-more"
          onClick={() => void query.fetchNextPage()}
          disabled={loadingMore}
        >
          {loadingMore ? 'Loading…' : 'Load more'}
        </button>
      )}
    </>
  )
}

export default GameHistoryPage
