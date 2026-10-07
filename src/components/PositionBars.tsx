import { Link } from 'react-router'
import type { StatGroup } from '../api/generated/data-contracts.ts'
import { formatRate, RANGE_MIN_HANDS, winRate } from '../winRate.ts'
import './PositionBars.css'

/**
 * Win rate by position: a bar per position from zero to its bb/100, with its
 * 95% range drawn across it once it has the hands for one. Money flows to late
 * position, so you would expect the button highest and the blinds below zero
 * [MIT 3]. With `positionUrl`, each row links to its position's hands.
 */
function PositionBars({
  groups,
  positionUrl,
}: {
  groups: StatGroup[]
  positionUrl?: (position: string) => string
}) {
  const rows = groups.flatMap((group) => {
    const result = winRate(group)
    return result ? [{ group, ...result }] : []
  })
  if (!rows.length) return <p className="card-hint">No hands yet.</p>

  // The scale runs from the lowest rate or range end to the highest, taking in zero.
  const ends = rows.flatMap(({ rate, range }) => (range ? [rate, range.low, range.high] : [rate]))
  const from = Math.min(0, ...ends)
  const to = Math.max(0, ...ends)
  const margin = (to - from || 1) * 0.04
  const at = (value: number) => ((value - from + margin) / (to - from + 2 * margin)) * 100
  const zero = at(0)

  return (
    <figure className="position-bars">
      <div className="position-bars-grid">
        {rows.map(({ group, rate, range }) => {
          const side = rate > 0 ? 'above' : rate < 0 ? 'below' : 'even'
          const rangeText = range ? `95% range ${formatRate(range.low)} to ${formatRate(range.high)}` : 'too few hands for a range'
          const summary = `${group.key}: ${formatRate(rate)} bb/100 over ${group.hands.toLocaleString()} hands, ${rangeText}`
          const cells = (
            <>
              <span className="position-bars-label">{group.key}</span>
              <span className="position-bars-plot" aria-hidden="true">
                <span className="position-bars-zero" style={{ left: `${zero}%` }} />
                <span
                  className={`position-bars-bar ${side}${range ? '' : ' unsure'}`}
                  style={{ left: `${Math.min(zero, at(rate))}%`, width: `${Math.abs(at(rate) - zero)}%` }}
                />
                {range && (
                  <span
                    className="position-bars-range"
                    style={{ left: `${at(range.low)}%`, width: `${at(range.high) - at(range.low)}%` }}
                  />
                )}
              </span>
              <span className="position-bars-value">{formatRate(rate)}</span>
              <span className="position-bars-hands">{group.hands.toLocaleString()}</span>
            </>
          )
          return positionUrl ? (
            <Link
              key={group.key}
              className="position-bars-row linked"
              to={positionUrl(group.key)}
              title={`${summary}. See these hands in Game History.`}
              aria-label={`${summary}; see these hands`}
            >
              {cells}
            </Link>
          ) : (
            <div key={group.key} className="position-bars-row" title={summary}>
              {cells}
            </div>
          )
        })}
        <div className="position-bars-row axis" aria-hidden="true">
          <span />
          <span className="position-bars-plot">
            {from < 0 && <span style={{ left: '0%' }}>{formatRate(from)}</span>}
            <span style={{ left: `${zero}%` }}>0</span>
            {to > 0 && <span style={{ left: '100%' }}>{formatRate(to)}</span>}
          </span>
          <span className="position-bars-value">bb/100</span>
          <span className="position-bars-hands">hands</span>
        </div>
      </div>
      <figcaption>
        The line across each bar is its 95% range; faded bars have fewer than {RANGE_MIN_HANDS} hands, too few for
        one.
      </figcaption>
      <details className="position-bars-table">
        <summary>Show as a table</summary>
        <table>
          <thead>
            <tr>
              <th scope="col">Position</th>
              <th scope="col">Hands</th>
              <th scope="col">bb/100</th>
              <th scope="col">95% range</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ group, rate, range }) => (
              <tr key={group.key}>
                <th scope="row">{group.key}</th>
                <td>{group.hands.toLocaleString()}</td>
                <td>{formatRate(rate)}</td>
                <td>{range ? `${formatRate(range.low)} to ${formatRate(range.high)}` : 'Too few hands'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  )
}

export default PositionBars
