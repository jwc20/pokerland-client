import type { Stat } from '../api/generated/data-contracts.ts'
import { enough, formatPct, MIN_CHANCES, type ShownStat } from '../playerStats.ts'
import './StatTile.css'

/**
 * A statistic as PokerTracker counts it, how often you did something out of
 * how often you could have: the share, its sample, and its 95% range on a
 * 0–100% bar.
 */
function StatTile({ label, hint, stat }: { label: string; hint: string; stat: Stat }) {
  return (
    <div className="stat-tile">
      <div className="stat-tile-label">{label}</div>
      {enough(stat) ? (
        <>
          <div className="stat-tile-value">{formatPct(stat.pct)}</div>
          <ShareBar stat={stat} />
          <div className="stat-tile-sample">
            <span className="stat-tile-whole">
              {stat.did.toLocaleString()} of {stat.could.toLocaleString()}
            </span>
            <span>
              95% range{' '}
              <span className="stat-tile-whole">
                {formatPct(stat.ci_low)}–{formatPct(stat.ci_high)}
              </span>
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="stat-tile-value none">—</div>
          <div className="stat-tile-sample">
            Too few chances: {stat.could.toLocaleString()} of {MIN_CHANCES}
          </div>
        </>
      )}
      <p className="stat-tile-hint">{hint}</p>
    </div>
  )
}

/** A share on a 0–100% track: its 95% range as a bar, the share itself as a dot. */
export function ShareBar({ stat }: { stat: ShownStat }) {
  const range = `${formatPct(stat.ci_low)} to ${formatPct(stat.ci_high)}`
  return (
    <div
      className="share-bar"
      role="img"
      aria-label={`${formatPct(stat.pct)}, 95% range ${range}`}
      title={`${formatPct(stat.pct)} (${stat.did} of ${stat.could}), 95% range ${range}`}
    >
      <span className="share-bar-track" />
      <span className="share-bar-range" style={{ left: `${stat.ci_low}%`, width: `${stat.ci_high - stat.ci_low}%` }} />
      <span className="share-bar-dot" style={{ left: `${stat.pct}%` }} />
    </div>
  )
}

export default StatTile
