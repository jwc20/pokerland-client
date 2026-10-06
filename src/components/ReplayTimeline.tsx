import type { PointerEvent } from 'react'
import type { HandEventTypeEnum } from '../api/generated/data-contracts.ts'
import { streetLabel } from '../handFormat.ts'
import type { ReplayStep } from '../replay.ts'
import './ReplayTimeline.css'

// A letter under the bar for each of the hero's moves.
const HERO_MARKS: Partial<Record<HandEventTypeEnum, string>> = {
  post: 'P',
  fold: 'F',
  check: 'X',
  call: 'C',
  bet: 'B',
  raise: 'R',
  show: 'S',
  muck: 'M',
  collect: 'W',
}

interface Segment {
  street: string
  start: number
  length: number
}

function streetSegments(steps: ReplayStep[]) {
  const segments: Segment[] = []
  steps.forEach((step, i) => {
    const last = segments.at(-1)
    if (last?.street === step.street) last.length += 1
    else segments.push({ street: step.street, start: i, length: 1 })
  })
  return segments
}

/**
 * The hand as a bar, one stretch per street, with the current step marked in
 * red. Click or drag along it to move through the hand.
 */
function ReplayTimeline({
  steps,
  index,
  hero,
  onSeek,
}: {
  steps: ReplayStep[]
  index: number
  hero: string
  onSeek: (index: number) => void
}) {
  const segments = streetSegments(steps)
  const count = steps.length

  function seek(event: PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect()
    onSeek(Math.floor(((event.clientX - box.left) / box.width) * count))
  }

  return (
    <div className="timeline">
      <div className="timeline-streets" aria-hidden="true">
        {segments.map((segment) => (
          <span key={segment.start} style={{ flexGrow: segment.length }}>
            {streetLabel(segment.street)}
          </span>
        ))}
      </div>
      <div
        className="timeline-bar"
        role="slider"
        tabIndex={0}
        aria-label="Replay position"
        aria-valuemin={1}
        aria-valuemax={count}
        aria-valuenow={index + 1}
        aria-valuetext={`Step ${index + 1} of ${count}: ${steps[index].text}`}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          seek(event)
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) seek(event)
        }}
      >
        {segments.map((segment, i) => (
          <span
            key={segment.start}
            className={i % 2 ? 'timeline-segment alt' : 'timeline-segment'}
            style={{ flexGrow: segment.length }}
          />
        ))}
        <span className="timeline-marker" style={{ left: `${(index / count) * 100}%` }} />
      </div>
      <div className="timeline-marks">
        {steps.map((step, i) => {
          const mark = step.event?.player === hero ? HERO_MARKS[step.event.type] : undefined
          if (!mark) return null
          return (
            <button
              key={i}
              type="button"
              className={i === index ? 'timeline-mark current' : 'timeline-mark'}
              style={{ left: `${((i + 0.5) / count) * 100}%` }}
              title={step.text}
              aria-label={`Go to: ${step.text}`}
              onClick={() => onSeek(i)}
            >
              {mark}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ReplayTimeline
