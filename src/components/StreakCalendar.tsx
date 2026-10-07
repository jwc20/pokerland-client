import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import type { HandCalendar } from '../api/generated/data-contracts.ts'
import { formatDayKey, formatMonth, keyParts, monthGrid, msToLocalMidnight, weekdayInitials } from '../calendar.ts'
import { formatBb, historyUrl } from '../handFormat.ts'
import './StreakCalendar.css'

const WEEKDAYS = weekdayInitials()

function daysText(count: number) {
  return `${count.toLocaleString()} ${count === 1 ? 'day' : 'days'}`
}

/**
 * A month of the days the user played on, tinted by how each went, with their
 * current and best runs of consecutive days.
 */
function StreakCalendar({ calendar, today }: { calendar: HandCalendar; today: string }) {
  const now = keyParts(today)
  const first = calendar.days.length ? keyParts(calendar.days[0].date) : now
  // Months as a count since year 0, to step through and keep between the first month with hands and this one.
  const [chosen, setChosen] = useState(now.year * 12 + now.month)
  const earliest = first.year * 12 + first.month
  const latest = now.year * 12 + now.month
  const shown = Math.min(Math.max(chosen, earliest), latest)
  const year = Math.floor(shown / 12)
  const month = shown % 12
  const byDate = useMemo(() => new Map(calendar.days.map((day) => [day.date, day])), [calendar.days])

  return (
    <section className="card streak-calendar" aria-labelledby="streak-calendar-heading">
      <div className="card-header streak-calendar-header">
        <button type="button" aria-label="Previous month" disabled={shown <= earliest} onClick={() => setChosen(shown - 1)}>
          ‹
        </button>
        <h2 id="streak-calendar-heading">{formatMonth(year, month)}</h2>
        <button type="button" aria-label="Next month" disabled={shown >= latest} onClick={() => setChosen(shown + 1)}>
          ›
        </button>
      </div>
      <div className="card-body">
        <p className="streak-calendar-today">
          <strong>Day {now.day}</strong>
          <Countdown />
        </p>

        <div className="streak-calendar-grid">
          {WEEKDAYS.map((initial, i) => (
            <span key={`weekday-${i}`} className="streak-calendar-weekday" aria-hidden="true">
              {initial}
            </span>
          ))}
          {monthGrid(year, month).map((key, i) => {
            if (!key) return <span key={`blank-${i}`} />
            const day = byDate.get(key)
            const result = day && (day.net_bb > 0 ? 'win' : day.net_bb < 0 ? 'loss' : 'even')
            const className = ['streak-day', result, key === today && 'today', key > today && 'future']
              .filter(Boolean)
              .join(' ')
            const number = keyParts(key).day
            if (!day) {
              return (
                <span key={key} className={className} aria-current={key === today ? 'date' : undefined}>
                  {number}
                </span>
              )
            }
            const hands = `${day.hands.toLocaleString()} ${day.hands === 1 ? 'hand' : 'hands'}`
            return (
              <Link
                key={key}
                to={historyUrl({ date: key })}
                className={className}
                aria-current={key === today ? 'date' : undefined}
                aria-label={`${formatDayKey(key)}: ${hands}, ${formatBb(day.net_bb)}`}
              >
                {number}
              </Link>
            )
          })}
        </div>

        <dl className="tracker-status streak-calendar-tiles">
          <div>
            <dt>Current streak</dt>
            <dd>{daysText(calendar.current_streak)}</dd>
          </div>
          <div>
            <dt>Best streak</dt>
            <dd>{daysText(calendar.best_streak)}</dd>
          </div>
        </dl>
        <p className="card-hint">A streak is the days in a row you've played on.</p>
      </div>
    </section>
  )
}

/** "13:48:09 left today", ticking each second. */
function Countdown() {
  const [left, setLeft] = useState(() => msToLocalMidnight(new Date()))

  useEffect(() => {
    const timer = setInterval(() => setLeft(msToLocalMidnight(new Date())), 1000)
    return () => clearInterval(timer)
  }, [])

  const seconds = Math.floor(left / 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <span className="streak-calendar-countdown" role="timer">
      {pad(Math.floor(seconds / 3600))}:{pad(Math.floor(seconds / 60) % 60)}:{pad(seconds % 60)} left today
    </span>
  )
}

export default StreakCalendar
