import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { errorMessage } from '../api/client.ts'
import type { Session } from '../api/generated/data-contracts.ts'
import { queries } from '../api/queries.ts'
import { browserTimeZone } from '../calendar.ts'
import PositionBars from '../components/PositionBars.tsx'
import { formatBb, formatDateTime } from '../handFormat.ts'
import { historyUrl } from '../historyFilters.ts'
import { formatMinutes, PATTERNS, patternLabel } from '../sessions.ts'
import { formatRate } from '../winRate.ts'
import './SessionsPage.css'

/**
 * The user's sessions (F1): stretches of play with no gap of over half an
 * hour, and their results set against the hour into the session, the time of
 * day, the day of the week and the tables played at once.
 */
function SessionsPage() {
  const [params, setParams] = useSearchParams()
  const since = params.get('since') ?? ''
  const until = params.get('until') ?? ''

  function setFilter(name: string, value: string) {
    // The URL as it is now: React Router renders a navigation later, so `params` may be a change behind.
    const next = new URLSearchParams(window.location.search)
    if (value) next.set(name, value)
    else next.delete(name)
    setParams(next, { replace: true })
  }

  return (
    <section className="sessions">
      <header className="sessions-header">
        <h1>Sessions</h1>
        <p>
          Your hands grouped into sessions: a gap of more than half an hour between hands, at any table, starts a new
          one. Part of the game is deciding whether to play at all [MIT 1], and for how long [JHU 9].
        </p>
      </header>

      <div className="filter-bar" role="group" aria-label="Which sessions">
        <label>
          From
          <input type="date" value={since} max={until || undefined} onChange={(e) => setFilter('since', e.target.value)} />
        </label>
        <label>
          To
          <input type="date" value={until} min={since || undefined} onChange={(e) => setFilter('until', e.target.value)} />
        </label>
        {(since || until) && (
          <button type="button" className="link-button" onClick={() => setParams({}, { replace: true })}>
            Every session
          </button>
        )}
      </div>

      <Patterns since={since} until={until} />
      <SessionList since={since} until={until} />
    </section>
  )
}

function Patterns({ since, until }: { since: string; until: string }) {
  // Other days keep the last patterns on screen, faded, until theirs arrive; an upload refreshes them.
  const query = useQuery(queries.sessions.patterns({ since: since || undefined, until: until || undefined }))
  const current = query.error ? { error: errorMessage(query.error) } : query.data && { patterns: query.data }
  return (
    <section className="card" aria-labelledby="sessions-patterns">
      <h2 id="sessions-patterns" className="card-header">
        When you play well
      </h2>
      <div className={query.isPlaceholderData ? 'card-body is-updating' : 'card-body'}>
        <p className="card-hint">
          bb/100 in each, with its 95% range. Ranges this wide are the honest answer: it takes many hands to tell.
        </p>
        {current?.error ? (
          <p className="error-message" role="alert">
            {current.error}
          </p>
        ) : current?.patterns ? (
          <div className="sessions-patterns">
            {PATTERNS.map(({ name, title, heading, hint }) => (
              <section key={name} className="sessions-pattern" aria-label={title}>
                <h3>{title}</h3>
                <p className="sessions-pattern-hint">{hint}</p>
                {current.patterns && current.patterns[name].length ? (
                  <PositionBars
                    groups={current.patterns[name]}
                    labelOf={(group) => patternLabel(name, group)}
                    heading={heading}
                    labelWidth={96}
                  />
                ) : (
                  <p className="card-hint">No hands yet.</p>
                )}
              </section>
            ))}
          </div>
        ) : (
          <p>Loading…</p>
        )}
      </div>
    </section>
  )
}

/** The sessions, the latest first, a page at a time. Other days start again from the latest; until they arrive,
 * the last days' sessions stay on screen, faded. */
function SessionList({ since, until }: { since: string; until: string }) {
  const query = useInfiniteQuery(
    queries.sessions.list({ since: since || undefined, until: until || undefined, tz: browserTimeZone() }),
  )
  const rows: Session[] | undefined = useMemo(() => query.data?.pages.flatMap((page) => page.results), [query.data])
  const error = query.error ? errorMessage(query.error) : undefined
  const loadingMore = query.isFetchingNextPage
  const next = query.hasNextPage && !query.isPlaceholderData
  const loadMore = () => void query.fetchNextPage()

  return (
    <section className="card" aria-labelledby="sessions-list">
      <h2 id="sessions-list" className="card-header">
        Your sessions
      </h2>
      <div className={query.isPlaceholderData ? 'card-body is-updating' : 'card-body'}>
        {rows === undefined ? (
          !error && <p>Loading…</p>
        ) : rows.length === 0 ? (
          <p className="card-hint">No sessions in these days.</p>
        ) : (
          <div className="history-table-scroll">
            <table className="history-table sessions-table">
              <thead>
                <tr>
                  <th scope="col">Started</th>
                  <th scope="col">Length</th>
                  <th scope="col">Hands</th>
                  <th scope="col">Tables</th>
                  <th scope="col">Result</th>
                  <th scope="col">bb/100</th>
                  <th scope="col" title="Adjusted for all-in equity">
                    All-in adjusted
                  </th>
                  <th scope="col">Biggest pot</th>
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((session) => (
                  <SessionRow key={session.id} session={session} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        {next && (
          <button type="button" className="button sessions-more" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        )}
      </div>
    </section>
  )
}

function SessionRow({ session }: { session: Session }) {
  const result = session.net_bb > 0 ? 'win' : session.net_bb < 0 ? 'loss' : 'even'
  const notes = [
    session.flagged > 0 && `${session.flagged} to review`,
    session.noted > 0 && `${session.noted} with notes`,
  ].filter(Boolean)
  return (
    <tr>
      <th scope="row" className="nowrap">
        <Link to={historyUrl({ tags: [], session: session.id })} title="See this session's hands in Game History">
          {formatDateTime(session.start)}
        </Link>
      </th>
      <td className="nowrap">{formatMinutes(session.minutes)}</td>
      <td>{session.hands.toLocaleString()}</td>
      <td className="nowrap">
        {session.tables}
        {session.most_tables > 1 && `, ${session.most_tables} at once`}
      </td>
      <td className={`nowrap history-result ${result}`}>{formatBb(session.net_bb)}</td>
      <td>{formatRate((session.net_bb / session.hands) * 100)}</td>
      <td className="nowrap">{formatBb(session.ev_net_bb)}</td>
      <td className="nowrap">{formatBb(session.biggest_pot_bb, false)}</td>
      <td className="nowrap">{notes.join(', ') || '—'}</td>
    </tr>
  )
}

export default SessionsPage
