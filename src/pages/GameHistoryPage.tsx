import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { errorMessage, hands } from '../api/client.ts'
import type { HandSummary, HandTag } from '../api/generated/data-contracts.ts'
import { browserTimeZone, formatDayKey } from '../calendar.ts'
import HandTable from '../components/HandTable.tsx'
import { tagLabel } from '../handFormat.ts'
import './GameHistoryPage.css'

/** The cursor in a page's `next` link, which the generated client takes as a parameter. */
function cursorOf(url: string) {
  return new URL(url).searchParams.get('cursor') ?? undefined
}

/** All the user's hands, or with ?tag= (a key from /api/hands/tags/) or ?date= those of a tag or a day. */
function GameHistoryPage() {
  const [searchParams] = useSearchParams()
  const tag = searchParams.get('tag') ?? undefined
  const date = searchParams.get('date') ?? undefined

  return (
    <section className="game-history">
      <h1>Game History</h1>
      {tag !== undefined || date !== undefined ? (
        <p className="game-history-intro">
          <FilterLabel tag={tag} date={date} /> · <Link to="/games">Show all hands</Link>
        </p>
      ) : (
        <p className="game-history-intro">
          This shows the most recent hands you've played across all tables on PokerStars. Hands appear here
          shortly after they finish, once your tracker has uploaded them; set it up on your{' '}
          <Link to="/settings">settings page</Link>.
        </p>
      )}
      {/* Keyed, so other filters start again from the first page. */}
      <HandList key={searchParams.toString()} tag={tag} date={date} />
    </section>
  )
}

/** "BTN hands", "Hands on Sun, Oct 4, 2026": what the history is narrowed to. */
function FilterLabel({ tag, date }: { tag?: string; date?: string }) {
  const label = useTagLabel(tag)
  const day = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? formatDayKey(date) : date
  return (
    <strong>
      {label ? `${label} hands` : 'Hands'}
      {day && ` on ${day}`}
    </strong>
  )
}

/** The chip label of the tag with `key`; until the tags load, or for a tag without hands, its value. */
function useTagLabel(key?: string) {
  const [tags, setTags] = useState<HandTag[]>()

  useEffect(() => {
    if (key === undefined) return
    let active = true
    hands.handsTagsList().then(
      ({ data }) => {
        if (active) setTags(data)
      },
      () => {}, // the value stands in
    )
    return () => {
      active = false
    }
  }, [key])

  if (key === undefined) return undefined
  const tag = tags?.find((candidate) => candidate.key === key)
  return tag ? tagLabel(tag) : key.slice(key.indexOf(':') + 1)
}

function HandList({ tag, date }: { tag?: string; date?: string }) {
  // A date is a day in the viewer's time zone, as the home page's calendar counts them.
  const filters = useMemo(() => ({ tag, date, tz: date === undefined ? undefined : browserTimeZone() }), [tag, date])
  const [rows, setRows] = useState<HandSummary[]>()
  const [next, setNext] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    let active = true
    hands.handsList(filters).then(
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
  }, [filters])

  async function loadMore() {
    if (!next) return
    setLoadingMore(true)
    setError(null)
    try {
      // The client builds the query from its parameters, so the filters go along with the cursor.
      const { data } = await hands.handsList({ ...filters, cursor: cursorOf(next) })
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
          {tag !== undefined || date !== undefined
            ? 'None of your hands match.'
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
