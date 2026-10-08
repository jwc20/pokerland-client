import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router'
import type { HandDay } from '../api/generated/data-contracts.ts'
import { formatDayKey, monthAbbreviations, yearGrid } from '../calendar.ts'
import { formatBb } from '../handFormat.ts'
import { historyUrl } from '../historyFilters.ts'
import { sessionTimes } from '../sessions.ts'
import './ResultsCalendar.css'

type Mode = 'result' | 'hands'

const CELL = 11
const STEP = CELL + 2 // a 2px gap of background between cells
const LEFT = 32 // room for the weekday labels
const TOP = 16 // and for the month labels
const YEARS_SHOWN = 3
const TIP_SESSIONS = 3 // a day's sessions the tip lists
const MONTHS = monthAbbreviations()
// Rows 1, 3 and 5, as the weekdays of the week of Sunday 2026-10-04.
const WEEKDAYS = [1, 3, 5].map(
  (row) => [row, new Date(Date.UTC(2026, 9, 4 + row)).toLocaleDateString(undefined, { weekday: 'short', timeZone: 'UTC' })] as const,
)

/** The smallest of 1, 2, 2.5 and 5 times a power of ten that is at least `value`: a round top for a scale. */
function niceCeil(value: number) {
  const power = 10 ** Math.floor(Math.log10(value))
  return [1, 2, 2.5, 5, 10].map((m) => m * power).find((n) => n >= value - 1e-9) ?? 10 * power
}

/** What 90% of `values` are at or below, so one huge day doesn't wash out the rest. */
function percentile90(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.9))] ?? 0
}

/** Which of a scale's four steps up to `max` `value` falls in; the last takes everything above. */
function scaleStep(value: number, max: number) {
  return Math.min(4, Math.max(1, Math.ceil((4 * value) / max)))
}

function describe(day: HandDay) {
  const hands = `${day.hands.toLocaleString()} ${day.hands === 1 ? 'hand' : 'hands'}`
  const sessions = `${day.sessions.length} ${day.sessions.length === 1 ? 'session' : 'sessions'}`
  return `${formatDayKey(day.date)}: ${hands}, ${formatBb(day.net_bb)}, ${sessions}`
}

/**
 * Each day's result in big blinds, a year to a row of weeks like a contribution
 * calendar: losses pink, wins green, darker for more. Or how many hands each
 * day had. A day opens its hands in the game history.
 */
function ResultsCalendar({ days, today }: { days: HandDay[]; today: string }) {
  const [mode, setMode] = useState<Mode>('result')
  const [allYears, setAllYears] = useState(false)
  const [tip, setTip] = useState<{ day: HandDay; x: number; y: number }>()
  const [focused, setFocused] = useState<string>()
  const frame = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const latest = days[days.length - 1]?.date

  // Where the weeks scroll sideways, start at the latest day rather than in January.
  useEffect(() => {
    const cell = scroller.current?.querySelector(`[data-date="${latest}"]`)
    if (!scroller.current || !cell) return
    const box = scroller.current.getBoundingClientRect()
    const right = cell.getBoundingClientRect().right - box.left + scroller.current.scrollLeft
    scroller.current.scrollLeft = Math.max(0, right + 16 - scroller.current.clientWidth)
  }, [latest])

  const byDate = useMemo(() => new Map(days.map((day) => [day.date, day])), [days])
  const years = useMemo(() => [...new Set(days.map((day) => Number(day.date.slice(0, 4))))].sort((a, b) => b - a), [days])
  const scale = useMemo(
    () => ({
      result: niceCeil(Math.max(1, percentile90(days.map((day) => Math.abs(day.net_bb))))),
      hands: niceCeil(Math.max(1, percentile90(days.map((day) => day.hands)))),
    }),
    [days],
  )
  const shownYears = allYears ? years : years.slice(0, YEARS_SHOWN)
  // The days the arrow keys step through, oldest first; one of them at a time is in the tab order.
  const shownDays = days.filter((day) => shownYears.includes(Number(day.date.slice(0, 4))))
  const tabStop = focused && byDate.has(focused) ? focused : shownDays[shownDays.length - 1]?.date
  const up = days.filter((day) => day.net_bb > 0).length
  const down = days.filter((day) => day.net_bb < 0).length

  function fill(day: HandDay | undefined) {
    if (!day) return 'var(--heat-empty)'
    if (mode === 'hands') return `var(--heat-hands-${scaleStep(day.hands, scale.hands)})`
    if (day.net_bb === 0) return 'var(--heat-even)'
    return `var(--heat-${day.net_bb > 0 ? 'win' : 'loss'}-${scaleStep(Math.abs(day.net_bb), scale.result)})`
  }

  function showTip(target: Element, day: HandDay) {
    if (!frame.current) return
    const cell = target.getBoundingClientRect()
    const box = frame.current.getBoundingClientRect()
    // Kept clear of the frame's edges, where it would be cut off.
    const x = Math.min(Math.max(cell.left + cell.width / 2 - box.left, 90), box.width - 90)
    setTip({ day, x, y: cell.top - box.top })
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = shownDays.findIndex((day) => day.date === tabStop)
    const target = {
      ArrowLeft: index - 1,
      ArrowRight: index + 1,
      Home: 0,
      End: shownDays.length - 1,
    }[event.key]
    if (target === undefined || !shownDays[target]) return
    event.preventDefault()
    const date = shownDays[target].date
    setFocused(date)
    frame.current?.querySelector<SVGElement>(`[data-date="${date}"]`)?.focus()
  }

  return (
    <section className="card results-calendar" aria-labelledby="results-calendar-heading">
      <h2 id="results-calendar-heading" className="card-header">
        Daily results
      </h2>
      <div className="card-body">
        <div className="results-calendar-top">
          <p className="results-calendar-summary">
            {days.length.toLocaleString()} {days.length === 1 ? 'day' : 'days'} played · {up.toLocaleString()} up ·{' '}
            {down.toLocaleString()} down
          </p>
          <div className="segmented" role="tablist" aria-label="Colour days by">
            <button type="button" role="tab" aria-selected={mode === 'result'} onClick={() => setMode('result')}>
              Result
            </button>
            <button type="button" role="tab" aria-selected={mode === 'hands'} onClick={() => setMode('hands')}>
              Hands
            </button>
          </div>
        </div>

        <div className="results-calendar-frame" ref={frame} onKeyDown={onKeyDown}>
          <div className="results-calendar-years" ref={scroller} onScroll={() => setTip(undefined)}>
            {shownYears.map((year) => (
              <YearGrid
                key={year}
                year={year}
                today={today}
                byDate={byDate}
                fill={fill}
                tabStop={tabStop}
                onShow={showTip}
                onHide={() => setTip(undefined)}
                onFocusDay={setFocused}
              />
            ))}
          </div>
          {tip && (
            <div className="results-calendar-tip" style={{ left: tip.x, top: tip.y }} aria-hidden="true">
              <strong>
                {mode === 'result'
                  ? formatBb(tip.day.net_bb)
                  : `${tip.day.hands.toLocaleString()} ${tip.day.hands === 1 ? 'hand' : 'hands'}`}
              </strong>
              <span>
                {formatDayKey(tip.day.date)} ·{' '}
                {mode === 'result'
                  ? `${tip.day.hands.toLocaleString()} ${tip.day.hands === 1 ? 'hand' : 'hands'}`
                  : formatBb(tip.day.net_bb)}
              </span>
              {tip.day.sessions.length > 0 && (
                <span className="results-calendar-tip-sessions">
                  {tip.day.sessions.slice(0, TIP_SESSIONS).map((session) => (
                    <span key={session.id}>
                      {sessionTimes(session.start, session.end)} · {session.hands.toLocaleString()}{' '}
                      {session.hands === 1 ? 'hand' : 'hands'} · {formatBb(session.net_bb)}
                    </span>
                  ))}
                  {tip.day.sessions.length > TIP_SESSIONS && (
                    <span>and {tip.day.sessions.length - TIP_SESSIONS} more</span>
                  )}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="results-calendar-bottom">
          {years.length > YEARS_SHOWN ? (
            <button type="button" className="link-button" onClick={() => setAllYears(!allYears)}>
              {allYears ? 'Show fewer years' : `Show ${years.length - YEARS_SHOWN} earlier ${years.length - YEARS_SHOWN === 1 ? 'year' : 'years'}`}
            </button>
          ) : (
            <span />
          )}
          <Legend mode={mode} scale={scale} />
        </div>
      </div>
    </section>
  )
}

interface YearGridProps {
  year: number
  today: string
  byDate: Map<string, HandDay>
  fill: (day: HandDay | undefined) => string
  tabStop: string | undefined
  onShow: (target: Element, day: HandDay) => void
  onHide: () => void
  onFocusDay: (date: string) => void
}

function YearGrid({ year, today, byDate, fill, tabStop, onShow, onHide, onFocusDay }: YearGridProps) {
  const { cells, weeks, monthWeeks } = useMemo(() => yearGrid(year), [year])
  const width = LEFT + weeks * STEP
  const height = TOP + 7 * STEP

  return (
    <svg className="results-calendar-year" width={width} height={height} role="group" aria-label={String(year)}>
      <text className="results-calendar-year-label" x={0} y={10}>
        {year}
      </text>
      {monthWeeks.map((week, month) =>
        `${year}-${String(month + 1).padStart(2, '0')}-01` > today ? null : (
          <text key={month} x={LEFT + week * STEP} y={10} aria-hidden="true">
            {MONTHS[month]}
          </text>
        ),
      )}
      {WEEKDAYS.map(([row, label]) => (
        <text key={row} x={LEFT - 6} y={TOP + row * STEP + 9} textAnchor="end" aria-hidden="true">
          {label}
        </text>
      ))}
      {cells.map((cell) => {
        // The calendar stops at today, as the hands do.
        if (cell.key > today) return null
        const day = byDate.get(cell.key)
        const rect = { x: LEFT + cell.week * STEP, y: TOP + cell.weekday * STEP, width: CELL, height: CELL, rx: 2 }
        if (!day) return <rect key={cell.key} {...rect} fill={fill(undefined)} />
        return (
          <Link
            key={cell.key}
            to={historyUrl({ since: cell.key, until: cell.key })}
            data-date={cell.key}
            tabIndex={cell.key === tabStop ? 0 : -1}
            aria-label={describe(day)}
            onPointerEnter={(event) => onShow(event.currentTarget, day)}
            onPointerLeave={onHide}
            onFocus={(event) => {
              onFocusDay(cell.key)
              onShow(event.currentTarget, day)
            }}
            onBlur={onHide}
          >
            <rect {...rect} fill={fill(day)} />
          </Link>
        )
      })}
    </svg>
  )
}

function Legend({ mode, scale }: { mode: Mode; scale: { result: number; hands: number } }) {
  const swatch = (color: string) => <i key={color} style={{ background: color }} />
  if (mode === 'hands') {
    return (
      <p className="results-calendar-legend">
        <span>1 hand</span>
        {[1, 2, 3, 4].map((k) => swatch(`var(--heat-hands-${k})`))}
        <span>{scale.hands.toLocaleString()}+ hands</span>
      </p>
    )
  }
  return (
    <p className="results-calendar-legend">
      <span>{formatBb(-scale.result)}</span>
      {[4, 3, 2, 1].map((k) => swatch(`var(--heat-loss-${k})`))}
      {swatch('var(--heat-even)')}
      {[1, 2, 3, 4].map((k) => swatch(`var(--heat-win-${k})`))}
      <span>{formatBb(scale.result)}</span>
    </p>
  )
}

export default ResultsCalendar
