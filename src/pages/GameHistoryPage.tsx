import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { errorMessage, hands } from '../api/client.ts'
import type { HandSummary, HandTag, HandsListParams } from '../api/generated/data-contracts.ts'
import { browserTimeZone } from '../calendar.ts'
import HandTable from '../components/HandTable.tsx'
import HistoryFilterBar from '../components/HistoryFilterBar.tsx'
import { historyParams, narrowed, readHistoryFilters, type HistoryFilters } from '../historyFilters.ts'
import './GameHistoryPage.css'

/** The cursor in a page's `next` link, which the generated client takes as a parameter. */
function cursorOf(url: string) {
  return new URL(url).searchParams.get('cursor') ?? undefined
}

/** The API's parameters for the filters; days are the viewer's, as the home page's calendar counts them. */
function listParams(filters: HistoryFilters): HandsListParams {
  return {
    tag: filters.tags.length ? filters.tags : undefined,
    since: filters.since,
    until: filters.until,
    stat: filters.stat,
    did: filters.stat ? filters.did : undefined,
    result: filters.result,
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
  const tags = useTags()

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
        onChange={(update) => {
          // The URL as it is now: React Router renders a navigation later, so `filters` may be a change behind.
          const latest = readHistoryFilters(new URLSearchParams(window.location.search))
          setSearchParams(historyParams(update(latest)), { replace: true })
        }}
      />
      {/* Keyed, so other filters start again from the first page. */}
      <HandList key={search} filters={filters} />
    </section>
  )
}

/** The user's tags, for the filters' choices; until they load, or if they don't, none. */
function useTags() {
  const [tags, setTags] = useState<HandTag[]>()
  useEffect(() => {
    let active = true
    hands.handsTagsList().then(
      ({ data }) => {
        if (active) setTags(data)
      },
      () => {}, // the filters offer "Any" alone
    )
    return () => {
      active = false
    }
  }, [])
  return tags
}

function HandList({ filters }: { filters: HistoryFilters }) {
  // The page keys this list by its URL, so the filters it starts with are its own.
  const [params] = useState(() => listParams(filters))
  const [rows, setRows] = useState<HandSummary[]>()
  const [next, setNext] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    let active = true
    hands.handsList(params).then(
      ({ data }) => {
        if (!active) return
        setRows(data.results)
        setNext(data.next ?? null)
      },
      (err) => {
        if (active) setError(errorMessage(err))
      },
    )
    return () => {
      active = false
    }
  }, [params])

  async function loadMore() {
    if (!next) return
    setLoadingMore(true)
    setError(null)
    try {
      // The client builds the query from its parameters, so the filters go along with the cursor.
      const { data } = await hands.handsList({ ...params, cursor: cursorOf(next) })
      setRows((current) => [...(current ?? []), ...data.results])
      setNext(data.next ?? null)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoadingMore(false)
    }
  }

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
        <HandTable hands={rows} />
      )}

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      {next && (
        <button type="button" className="button game-history-more" onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? 'Loading…' : 'Load more'}
        </button>
      )}
    </>
  )
}

export default GameHistoryPage
