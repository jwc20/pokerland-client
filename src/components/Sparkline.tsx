import { useState, type PointerEvent } from 'react'
import './Sparkline.css'

export interface SparkPoint {
  key: string
  /** Null for a gap: a month without data, say. */
  value: number | null
  /** What the readout says for the point, e.g. "Oct 2026: 2 of 5". */
  text: string
}

const WIDTH = 96
const HEIGHT = 28
const PAD = 6 // room for a dot and its ring

/**
 * A small trend over evenly spaced points: a line from zero up to its highest
 * point, in the muted ink, broken where a point has no value, the latest
 * value dotted in the accent. Hovering anywhere along it picks the nearest
 * value, and the readout beside it names that one or, otherwise, the latest.
 * `label` describes the whole for screen readers; the page keeps every value
 * in a table too.
 */
function Sparkline({ points, label }: { points: SparkPoint[]; label: string }) {
  const [active, setActive] = useState<number>()
  const known = points.flatMap((point, i) => (point.value === null ? [] : [i]))
  if (!known.length) return null

  const value = (i: number) => points[i].value ?? 0
  const top = Math.max(0, ...known.map(value)) || 1
  const x = (i: number) => (points.length === 1 ? WIDTH / 2 : PAD + (i * (WIDTH - 2 * PAD)) / (points.length - 1))
  const y = (v: number) => HEIGHT - PAD - (v / top) * (HEIGHT - 2 * PAD)
  // A run of values is a line; a value alone between gaps is a dot.
  const runs: number[][] = []
  points.forEach((point, i) => {
    if (point.value === null) return
    if (i > 0 && points[i - 1].value !== null) runs[runs.length - 1].push(i)
    else runs.push([i])
  })
  const latest = known[known.length - 1]
  const shown = active ?? latest

  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    const box = event.currentTarget.getBoundingClientRect()
    const at = ((event.clientX - box.left) / box.width) * WIDTH
    setActive(known.reduce((nearest, i) => (Math.abs(x(i) - at) < Math.abs(x(nearest) - at) ? i : nearest)))
  }

  return (
    <span className="sparkline">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={WIDTH}
        height={HEIGHT}
        role="img"
        aria-label={label}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setActive(undefined)}
      >
        <line className="sparkline-zero" x1={0} x2={WIDTH} y1={y(0)} y2={y(0)} />
        {runs.map((run) =>
          run.length > 1 ? (
            <path
              key={run[0]}
              className="sparkline-line"
              d={run.map((i, n) => `${n ? 'L' : 'M'}${x(i)} ${y(value(i))}`).join(' ')}
            />
          ) : (
            run[0] !== latest && <circle key={run[0]} className="sparkline-dot" cx={x(run[0])} cy={y(value(run[0]))} r={4} />
          ),
        )}
        {active !== undefined && active !== latest && (
          <circle className="sparkline-dot" cx={x(active)} cy={y(value(active))} r={4} />
        )}
        <circle className="sparkline-dot latest" cx={x(latest)} cy={y(value(latest))} r={4} />
      </svg>
      <span className="sparkline-readout" aria-hidden="true">
        {points[shown].text}
      </span>
    </span>
  )
}

export default Sparkline
