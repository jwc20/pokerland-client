import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { errorMessage, leaks } from '../api/client.ts'
import type { Leak } from '../api/generated/data-contracts.ts'
import { inViewerTimeZone, monthsUpTo } from '../calendar.ts'
import { apiScope, historyParams, historyUrl, type HistoryFilters } from '../historyFilters.ts'
import { LEAK_INFO, leakCount, leakDetails, presetValues, SHORT_LIST, type Presets } from '../leaks.ts'
import { enough, formatPct } from '../playerStats.ts'
import { useScrollToHash } from '../useScrollToHash.ts'
import Sparkline, { type SparkPoint } from './Sparkline.tsx'
import './DisciplineCard.css'

const TREND_MONTHS = 12

/**
 * The preflop discipline checks (B3): rules of thumb from the courses, such as
 * never open-limping, and how often the user broke each one, with a trend and
 * the hands behind it. `base` narrows the hands, as My game's filters do.
 * `short` keeps to the plain rules, a line each, for the home page.
 */
function DisciplineCard({ base = { tags: [] }, short = false }: { base?: HistoryFilters; short?: boolean }) {
  const key = historyParams(base).toString()
  const [loaded, setLoaded] = useState<{ key: string; checks?: Leak[]; presets?: Presets; error?: string }>()

  useEffect(() => {
    const query = new URLSearchParams(key)
    const filters = apiScope(query)
    let active = true
    Promise.all([
      inViewerTimeZone((tz) => leaks.leaksList({ ...filters, group: 'preflop', tz })),
      leaks.leaksPresetsList(),
    ]).then(
      ([{ data: checks }, { data: presets }]) => {
        if (active) setLoaded({ key, checks, presets: presetValues(presets) })
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
  // Home's short card links here, to the full one on My game.
  useScrollToHash('discipline', !short && current?.checks !== undefined)
  return (
    <section className="card discipline" id="discipline" aria-labelledby="discipline-heading">
      <h2 id="discipline-heading" className="card-header">
        Preflop discipline
      </h2>
      <div className="card-body">
        {!short && (
          <p className="card-hint">
            In tournaments, most of the value lost is lost before the flop [MIT 1; MIT 4]. These are the courses'
            rules of thumb for play before it, and how often you broke them. They are presets, not laws: change them
            in{' '}
            <Link to="/settings#coach-presets">Settings</Link>.
          </p>
        )}
        {current?.error ? (
          <p className="error-message" role="alert">
            {current.error}
          </p>
        ) : current?.checks && current.presets ? (
          <Checks checks={current.checks} presets={current.presets} base={base} short={short} />
        ) : (
          <p>Loading…</p>
        )}
        {short && (
          <Link className="discipline-more" to="/stats#discipline">
            Sizes, trends and more on My game →
          </Link>
        )}
      </div>
    </section>
  )
}

function Checks({ checks, presets, base, short }: { checks: Leak[]; presets: Presets; base: HistoryFilters; short: boolean }) {
  const shown = short ? checks.filter((check) => SHORT_LIST.includes(check.key)) : checks
  const months = trendMonths(checks)
  return (
    <>
      <ul className={short ? 'discipline-lines short' : 'discipline-lines'}>
        {shown.map((check) => (
          <CheckLine key={check.key} check={check} presets={presets} base={base} short={short} months={months} />
        ))}
      </ul>
      {!short && <MonthTable checks={checks} months={months} />}
    </>
  )
}

function CheckLine({
  check,
  presets,
  base,
  short,
  months,
}: {
  check: Leak
  presets: Presets
  base: HistoryFilters
  short: boolean
  months: string[]
}) {
  const info = LEAK_INFO[check.key]
  const points = trend(check, months)
  const share = check.share
  const link =
    check.key === 'hands_per_orbit'
      ? check.rate !== null && { to: historyUrl({ ...base, stat: 'vpip', did: true }), text: 'The hands you played' }
      : share &&
        share.did > 0 && {
          to: historyUrl({ ...base, leak: check.key }),
          text: `See ${share.did === 1 ? 'the hand' : `the ${share.did.toLocaleString()} hands`}`,
        }
  const count = leakCount(check)
  const target = check.key === 'hands_per_orbit' ? `aim for ${presets.orbit_min}–${presets.orbit_max}` : undefined
  return (
    <li className="discipline-line">
      <div className="discipline-head">
        <h3>{info.label}</h3>
        <span className="discipline-count">
          {count}
          {share && enough(share) && (
            <span
              className="discipline-share"
              title={`95% range ${formatPct(share.ci_low)}–${formatPct(share.ci_high)}`}
            >
              {' '}
              · {formatPct(share.pct)}
            </span>
          )}
          {target && <span className="discipline-share"> · {target}</span>}
        </span>
        {!short && <Sparkline points={points} label={`${info.label} by month: ${trendText(points)}`} />}
        {link && (
          <Link className="discipline-link" to={link.to}>
            {link.text} →
          </Link>
        )}
      </div>
      {!short && (
        <>
          <p className="discipline-rule">
            {info.rule(presets)} <span className="discipline-source">[{info.source}]</span>
          </p>
          {leakDetails(check).map((line) => (
            <p key={line} className="discipline-detail">
              {line}
            </p>
          ))}
        </>
      )}
    </li>
  )
}

function monthLabel(month: string) {
  const [year, number] = month.split('-').map(Number)
  return new Date(Date.UTC(year, number - 1, 1)).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/**
 * The months a trend covers: every calendar month up to the latest with chances, so the line's spacing is
 * time's, the last twelve at most, from the first of those with chances.
 */
function trendMonths(checks: Leak[]): string[] {
  const seen = checks.flatMap((check) => check.months.map((month) => month.month)).sort()
  if (!seen.length) return []
  const window = monthsUpTo(seen[seen.length - 1], TREND_MONTHS)
  return window.slice(window.findIndex((month) => seen.includes(month)))
}

/** A check's months as the sparkline's points: the share broken, or hands an orbit; a gap without chances. */
function trend(check: Leak, months: string[]): SparkPoint[] {
  return months.map((key) => {
    const month = check.months.find((candidate) => candidate.month === key)
    const label = monthLabel(key)
    if (check.key === 'hands_per_orbit') {
      return month?.rate == null
        ? { key, value: null, text: `${label}: no hands` }
        : { key, value: month.rate, text: `${label}: ${month.rate}` }
    }
    return month?.could
      ? { key, value: month.did / month.could, text: `${label}: ${month.did} of ${month.could}` }
      : { key, value: null, text: `${label}: no chances` }
  })
}

function trendText(points: SparkPoint[]) {
  const known = points.filter((point) => point.value !== null)
  return known.length ? known.map((point) => point.text).join('; ') : 'no months yet'
}

/** Every check's months in a table, so no value is only in a sparkline's readout. */
function MonthTable({ checks, months }: { checks: Leak[]; months: string[] }) {
  if (!months.length) return null
  return (
    <details className="discipline-months">
      <summary>Show by month</summary>
      <div className="history-table-scroll">
        <table className="history-table discipline-table">
          <thead>
            <tr>
              <th scope="col">Check</th>
              {months.map((month) => (
                <th key={month} scope="col">
                  {monthLabel(month)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {checks.map((check) => (
              <tr key={check.key}>
                <th scope="row">{LEAK_INFO[check.key].label}</th>
                {months.map((month) => {
                  const row = check.months.find((candidate) => candidate.month === month)
                  const text = !row
                    ? '—'
                    : check.key === 'hands_per_orbit'
                      ? String(row.rate ?? '—')
                      : `${row.did} of ${row.could}`
                  return <td key={month}>{text}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

export default DisciplineCard
