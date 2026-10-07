import type { HandTag } from '../api/generated/data-contracts.ts'
import { formatBb, tagLabel } from '../handFormat.ts'
import './TagGauge.css'

const SIZE = 132
const RADIUS = 54
const START = 135 // degrees clockwise from 3 o'clock: the arc opens at the bottom
const SWEEP = 270
const GAP = (2 / RADIUS) * (180 / Math.PI) // 2px of background between segments, in degrees

function point(degrees: number) {
  const radians = (degrees * Math.PI) / 180
  return `${SIZE / 2 + RADIUS * Math.cos(radians)} ${SIZE / 2 + RADIUS * Math.sin(radians)}`
}

function arc(from: number, to: number) {
  return `M ${point(from)} A ${RADIUS} ${RADIUS} 0 ${to - from > 180 ? 1 : 0} 1 ${point(to)}`
}

/** How a tag's hands went: an arc split into won, even and lost, around the number won. */
function TagGauge({ tag }: { tag: HandTag }) {
  const parts = [
    { label: 'Won', count: tag.won, color: 'var(--heat-win-3)' },
    { label: 'Even', count: tag.hands - tag.won - tag.lost, color: 'var(--heat-even)' },
    { label: 'Lost', count: tag.lost, color: 'var(--heat-loss-3)' },
  ]
  const drawn = parts.filter((part) => part.count > 0)
  let angle = START
  const segments = drawn.map((part, i) => {
    const sweep = (SWEEP * part.count) / tag.hands
    const from = angle + (i > 0 ? GAP / 2 : 0)
    const to = angle + sweep - (i < drawn.length - 1 ? GAP / 2 : 0)
    angle += sweep
    return { ...part, from, to: Math.max(to, from + 0.5) }
  })

  return (
    <section className="card tag-gauge" aria-labelledby="tag-gauge-heading">
      <h2 id="tag-gauge-heading" className="card-header">
        {tagLabel(tag)}
      </h2>
      <div className="card-body">
        <div className="tag-gauge-figure">
          <dl className="tag-gauge-rows">
            {parts.map((part) => (
              <div key={part.label}>
                <dt>
                  <i style={{ background: part.color }} />
                  {part.label}
                </dt>
                <dd>{part.count.toLocaleString()}</dd>
              </div>
            ))}
          </dl>
          <svg
            className="tag-gauge-arc"
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-label={`${tag.won.toLocaleString()} of ${tag.hands.toLocaleString()} hands won`}
          >
            {segments.length ? (
              segments.map((segment) => (
                <path key={segment.label} d={arc(segment.from, segment.to)} stroke={segment.color} />
              ))
            ) : (
              <path d={arc(START, START + SWEEP)} stroke="var(--heat-empty)" />
            )}
            <text className="tag-gauge-won" x={SIZE / 2} y={SIZE / 2 + 4}>
              {tag.won.toLocaleString()}
            </text>
            <text className="tag-gauge-of" x={SIZE / 2} y={SIZE / 2 + 24}>
              /{tag.hands.toLocaleString()}
            </text>
            <text className="tag-gauge-caption" x={SIZE / 2} y={SIZE / 2 + 52}>
              won
            </text>
          </svg>
        </div>
        <p className="tag-gauge-net">
          Net {formatBb(tag.net_bb)}
          {tag.hands > 0 && ` · ${formatBb((tag.net_bb / tag.hands) * 100)}/100`}
        </p>
      </div>
    </section>
  )
}

export default TagGauge
