import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { errorMessage, stats } from '../api/client.ts'
import type { PurposeStat } from '../api/generated/data-contracts.ts'
import { streetLabel } from '../handFormat.ts'
import { apiScope, historyParams, type HistoryFilters } from '../historyFilters.ts'
import { PURPOSE_LABELS } from '../notes.ts'
import { enough, formatPct, MIN_CHANCES } from '../playerStats.ts'
import './PurposeCard.css'

const BLUFFS = new Set(['bluff', 'semi_bluff'])

/**
 * How the user's bets went, by the purpose they gave them in the replay (E1):
 * how often each kind took the pot at once, was called or was raised, its
 * average size, and the folds a bluff of that size needs. `base` is the page's hands.
 */
function PurposeCard({ base }: { base: HistoryFilters }) {
  const key = historyParams(base).toString()
  const [loaded, setLoaded] = useState<{ key: string; rows?: PurposeStat[]; error?: string }>()

  useEffect(() => {
    const query = new URLSearchParams(key)
    let active = true
    stats
      .statsPurposesList(apiScope(query))
      .then(
        ({ data }) => {
          if (active) setLoaded({ key, rows: data })
        },
        (err) => {
          if (active) setLoaded({ key, error: errorMessage(err) })
        },
      )
    return () => {
      active = false
    }
  }, [key])

  const current = loaded?.key === key ? loaded : undefined
  return (
    <section className="card" aria-labelledby="my-game-purposes">
      <h2 id="my-game-purposes" className="card-header">
        Why you bet
      </h2>
      <div className="card-body">
        {current?.error ? (
          <p className="error-message" role="alert">
            {current.error}
          </p>
        ) : !current?.rows ? (
          <p>Loading…</p>
        ) : current.rows.length === 0 ? (
          <p className="card-hint">
            In a replay, the decision panel asks why you made each bet or raise: for value, as a bluff, to protect
            your hand… Say why, and this shows how each kind went. Start from your{' '}
            <Link to="/games">game history</Link>.
          </p>
        ) : (
          <PurposeTable rows={current.rows} />
        )}
      </div>
    </section>
  )
}

function PurposeTable({ rows }: { rows: PurposeStat[] }) {
  const bluffs = rows.filter((row) => BLUFFS.has(row.purpose) && enough(row.took_pot) && row.needed !== null)
  return (
    <>
      {bluffs.map((row) => (
        <p key={`${row.purpose}:${row.street}`} className="purpose-card-line">
          Your {streetLabel(row.street).toLowerCase()} {PURPOSE_LABELS[row.purpose].toLowerCase()}s took the pot{' '}
          {formatPct(row.took_pot.pct ?? 0)} of the time ({row.took_pot.did} of {row.took_pot.could}); at your average
          size, {formatPct(100 * (row.size ?? 0))} of the pot, they needed {formatPct(100 * (row.needed ?? 0))}.
        </p>
      ))}
      <div className="history-table-scroll">
        <table className="history-table purpose-table">
          <caption className="purpose-table-caption">Your bets and raises by why you made them</caption>
          <thead>
            <tr>
              <th scope="col">Why</th>
              <th scope="col">Street</th>
              <th scope="col">Bets</th>
              <th scope="col">Took the pot</th>
              <th scope="col">Called</th>
              <th scope="col">Raised</th>
              <th scope="col">Average size</th>
              <th scope="col">A bluff needs</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.purpose}:${row.street}`}>
                <th scope="row">{PURPOSE_LABELS[row.purpose]}</th>
                <td>{streetLabel(row.street)}</td>
                <td>{row.bets.toLocaleString()}</td>
                <td>
                  {enough(row.took_pot) ? (
                    <span title={`95% range ${formatPct(row.took_pot.ci_low)}–${formatPct(row.took_pot.ci_high)}`}>
                      {formatPct(row.took_pot.pct)}
                    </span>
                  ) : (
                    `${row.took_pot.did} of ${row.took_pot.could}`
                  )}
                </td>
                <td>{row.called.toLocaleString()}</td>
                <td>{row.raised.toLocaleString()}</td>
                <td>{row.size === null ? '—' : formatPct(100 * row.size)}</td>
                <td>{row.needed === null ? '—' : formatPct(100 * row.needed)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="card-hint">
        Took the pot: nobody called or raised. Sizes are shares of everything in the middle before the bet. A bluff
        of that size breaks even when they fold the share in the last column. Shares show from {MIN_CHANCES} bets;
        hover one for its 95% range.
      </p>
    </>
  )
}

export default PurposeCard
