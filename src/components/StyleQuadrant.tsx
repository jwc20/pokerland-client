import type { StatGroup } from '../api/generated/data-contracts.ts'
import { AGGRESSIVE, enough, formatPct, LOOSE_VPIP, MIN_CHANCES, playerType } from '../playerStats.ts'
import './StyleQuadrant.css'

const WIDTH = 360
const HEIGHT = 250
const PAD = { left: 54, right: 14, top: 12, bottom: 36 } // room on the left for the ticks and, apart from them, the axis title
const PLOT_WIDTH = WIDTH - PAD.left - PAD.right
const PLOT_HEIGHT = HEIGHT - PAD.top - PAD.bottom

/** A group's place on the chart, once both of its axes have chances enough. */
function place(group: StatGroup) {
  const { vpip, aggression } = group.stats
  return enough(vpip) && enough(aggression) ? { vpip: vpip.pct, aggression: aggression.pct } : undefined
}

function monthLabel(key: string) {
  const [year, month] = key.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/**
 * Your style on two axes, how often you play a hand (VPIP) and how often you
 * bet or raise after the flop, with the four player types of the MIT course as
 * its regions [MIT 1], and a trail of where each month put you.
 */
function StyleQuadrant({ overall, months }: { overall: StatGroup; months: StatGroup[] }) {
  const you = place(overall)
  if (!you) {
    return (
      <p className="card-hint">
        Too few hands to place you yet: it takes {MIN_CHANCES} hands you could play and {MIN_CHANCES} moves after the
        flop.
      </p>
    )
  }
  const trail = months.flatMap((group) => {
    const point = place(group)
    return point ? [{ key: group.key, hands: group.hands, ...point }] : []
  })
  const widest = Math.max(you.vpip, ...trail.map((point) => point.vpip))
  const xMax = Math.min(100, Math.max(60, Math.ceil((widest + 5) / 20) * 20))
  const x = (vpip: number) => PAD.left + (vpip / xMax) * PLOT_WIDTH
  const y = (aggression: number) => PAD.top + PLOT_HEIGHT - (aggression / 100) * PLOT_HEIGHT
  const xTicks = Array.from({ length: xMax / 20 + 1 }, (_, i) => i * 20)
  const type = playerType(you.vpip, you.aggression)

  return (
    <figure className="style-quadrant">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`Your style: VPIP ${formatPct(you.vpip)}, aggression ${formatPct(you.aggression)}, ${type}`}
      >
        <rect className="style-quadrant-frame" x={PAD.left} y={PAD.top} width={PLOT_WIDTH} height={PLOT_HEIGHT} />
        <line className="style-quadrant-split" x1={x(LOOSE_VPIP)} x2={x(LOOSE_VPIP)} y1={PAD.top} y2={PAD.top + PLOT_HEIGHT} />
        <line className="style-quadrant-split" x1={PAD.left} x2={PAD.left + PLOT_WIDTH} y1={y(AGGRESSIVE)} y2={y(AGGRESSIVE)} />

        <text className="style-quadrant-region" x={PAD.left + 6} y={PAD.top + 14}>
          Tight-aggressive
        </text>
        <text className="style-quadrant-region end" x={PAD.left + PLOT_WIDTH - 6} y={PAD.top + 14}>
          Loose-aggressive
        </text>
        <text className="style-quadrant-region" x={PAD.left + 6} y={PAD.top + PLOT_HEIGHT - 8}>
          Rock
        </text>
        <text className="style-quadrant-region end" x={PAD.left + PLOT_WIDTH - 6} y={PAD.top + PLOT_HEIGHT - 8}>
          Calling station
        </text>

        {xTicks.map((tick) => (
          <text key={tick} className="style-quadrant-tick" x={x(tick)} y={PAD.top + PLOT_HEIGHT + 14}>
            {tick}%
          </text>
        ))}
        {[0, 50, 100].map((tick) => (
          <text key={tick} className="style-quadrant-tick end" x={PAD.left - 6} y={y(tick) + 4}>
            {tick}%
          </text>
        ))}
        <text className="style-quadrant-axis" x={PAD.left + PLOT_WIDTH / 2} y={HEIGHT - 4}>
          VPIP: hands you play
        </text>
        <text
          className="style-quadrant-axis"
          transform={`translate(11 ${PAD.top + PLOT_HEIGHT / 2}) rotate(-90)`}
        >
          Aggression after the flop
        </text>

        {trail.length > 1 && (
          <polyline
            className="style-quadrant-trail"
            points={trail.map((point) => `${x(point.vpip)},${y(point.aggression)}`).join(' ')}
          />
        )}
        {trail.map((point) => (
          <circle key={point.key} className="style-quadrant-month" cx={x(point.vpip)} cy={y(point.aggression)} r={4}>
            <title>
              {`${monthLabel(point.key)}: VPIP ${formatPct(point.vpip)}, aggression ${formatPct(point.aggression)}, ${point.hands.toLocaleString()} hands`}
            </title>
          </circle>
        ))}
        <circle className="style-quadrant-you" cx={x(you.vpip)} cy={y(you.aggression)} r={6}>
          <title>{`You: VPIP ${formatPct(you.vpip)}, aggression ${formatPct(you.aggression)}`}</title>
        </circle>
        <text
          className={you.vpip > xMax * 0.8 ? 'style-quadrant-you-label end' : 'style-quadrant-you-label'}
          x={x(you.vpip) + (you.vpip > xMax * 0.8 ? -10 : 10)}
          y={y(you.aggression) + 4}
        >
          You
        </text>
      </svg>
      <figcaption>
        Over these hands you play like <strong>{type}</strong>: VPIP {formatPct(you.vpip)}, aggression{' '}
        {formatPct(you.aggression)}.
        {trail.length > 1 && ' The grey dots trace each month.'} The lines at VPIP {LOOSE_VPIP}% and aggression{' '}
        {AGGRESSIVE}% are rough splits, not rules.
      </figcaption>
    </figure>
  )
}

export default StyleQuadrant
