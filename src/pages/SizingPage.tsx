import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { errorMessage, stats } from '../api/client.ts'
import type { BetSizeEnum, SizeBucket, SizingReport, SizingStreet } from '../api/generated/data-contracts.ts'
import { inViewerTimeZone } from '../calendar.ts'
import MyGameTabs from '../components/MyGameTabs.tsx'
import ScopeFilters from '../components/ScopeFilters.tsx'
import { apiScope, historyUrl, type HistoryFilters } from '../historyFilters.ts'
import { formatPct } from '../playerStats.ts'
import { FLAG_INFO, SIZE_KEYS, SIZE_LABELS, STRENGTH_LABELS, STRENGTHS, tellText, type Strength } from '../sizing.ts'
import { choiceLabel, withConditions, type SpotCondition } from '../spots.ts'
import { useHandTags, useScope } from '../useScope.ts'
import './SizingPage.css'

/**
 * Bet sizing and sizing tells (B4): your bets and raises after the flop by size, split by how strong your hand
 * was. Value bets should be the biggest a worse hand calls and bluffs the smallest that works, but sizing by
 * strength gives your hand away [JHU 5; MIT 8], and sizing tells are more reliable than physical ones [JHU 8].
 */
function SizingPage() {
  const scope = useScope()
  const tags = useHandTags()
  const [loaded, setLoaded] = useState<{ key: string; report?: SizingReport; error?: string }>()
  const { key } = scope

  useEffect(() => {
    let active = true
    inViewerTimeZone((tz) => stats.statsSizingRetrieve({ ...apiScope(new URLSearchParams(key)), tz })).then(
      ({ data }) => {
        if (active) setLoaded({ key, report: data })
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
    <section className="sizing">
      <header className="sizing-header">
        <h1>Bet sizing</h1>
        <p>
          Your bets and raises after the flop by their size, a share of the pot, and what you held when you made
          them. Bet at least a third of the pot to deny a draw; half to two-thirds is the default [MIT 3; JHU 2].
          If your sizes sort your hands, a watchful opponent reads them.
        </p>
      </header>
      <MyGameTabs />
      <ScopeFilters scope={scope} tags={tags} />
      {current?.error ? (
        <p className="error-message" role="alert">
          {current.error}
        </p>
      ) : current?.report ? (
        <Report report={current.report} base={scope.base} />
      ) : (
        <p>Loading…</p>
      )}
    </section>
  )
}

function Report({ report, base }: { report: SizingReport; base: HistoryFilters }) {
  const url = (conditions: SpotCondition[]) => historyUrl(withConditions(base, conditions))
  if (!report.streets.length) {
    return <p className="card-hint">No bets or raises after the flop among these hands yet.</p>
  }
  return (
    <>
      <section className="card" aria-labelledby="sizing-streets">
        <h2 id="sizing-streets" className="card-header">
          Sizes and strength, street by street
        </h2>
        <div className="card-body">
          <Legend />
          <div className="sizing-streets">
            {report.streets.map((street) => (
              <StreetChart key={street.street} street={street} url={url} />
            ))}
          </div>
          <SizingTable streets={report.streets} />
        </div>
      </section>

      <section className="card" aria-labelledby="sizing-flags">
        <h2 id="sizing-flags" className="card-header">
          Flags
        </h2>
        <div className="card-body">
          <ul className="sizing-flags">
            {report.flags.map((flag) => {
              const info = FLAG_INFO[flag.flag]
              return (
                <li key={flag.flag}>
                  <div className="sizing-flag-head">
                    <h3>{info.label}</h3>
                    <span className="sizing-flag-count">
                      {flag.hands.toLocaleString()} of {flag.of.toLocaleString()} {flag.of === 1 ? 'hand' : 'hands'} with a
                      bet after the flop
                    </span>
                    {flag.hands > 0 && (
                      <Link to={url([{ field: 'sizing_flag', value: [flag.flag] }])}>
                        See {flag.hands === 1 ? 'the hand' : 'them'} →
                      </Link>
                    )}
                  </div>
                  <p className="card-hint">
                    {info.why} <span className="sizing-source">[{info.source}]</span>
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}

function Legend() {
  return (
    <div className="sizing-legend" aria-label="Hand strength, weakest first">
      {STRENGTHS.map((strength) => (
        <span key={strength} title={STRENGTH_LABELS[strength].hint}>
          <span className={`sizing-swatch sizing-strength-${STRENGTHS.indexOf(strength) + 1}`} aria-hidden="true" />
          {STRENGTH_LABELS[strength].label}
        </span>
      ))}
    </div>
  )
}

const WIDTH = 320
const HEIGHT = 190
const LEFT = 30
const RIGHT = 8
const TOP = 18
const BOTTOM = 28
const BAR = 24
const GAP = 2 // the surface between stacked segments

/** A round top for a scale: the smallest of 1, 2, 2.5 and 5 times a power of ten at least `value`. */
function niceCeil(value: number) {
  const power = 10 ** Math.floor(Math.log10(Math.max(1, value)))
  return [1, 2, 2.5, 5, 10].map((m) => m * power).find((n) => n >= value) ?? 10 * power
}

/** One street's bets as columns by size, each stacked weakest at the base, with its tell beneath. */
function StreetChart({ street, url }: { street: SizingStreet; url: (c: SpotCondition[]) => string }) {
  const [active, setActive] = useState<{ bucket: BetSizeEnum; strength?: Strength }>()
  const byKey = new Map(street.buckets.map((bucket) => [bucket.key, bucket]))
  const top = niceCeil(Math.max(1, ...street.buckets.map((bucket) => bucket.bets)))
  const plotWidth = WIDTH - LEFT - RIGHT
  const slot = plotWidth / SIZE_KEYS.length
  const y = (bets: number) => TOP + (HEIGHT - TOP - BOTTOM) * (1 - bets / top)
  const tell = tellText(street)
  const shown = active && byKey.get(active.bucket)

  return (
    <figure className="sizing-street">
      <figcaption>
        <strong>{choiceLabel(street.street)}</strong> · {street.bets.toLocaleString()} {street.bets === 1 ? 'bet' : 'bets'}
      </figcaption>
      <div className="sizing-chart">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`${choiceLabel(street.street)} bets by size and strength`}>
          {[0, top / 2, top].map((tick) => (
            <g key={tick} className="sizing-grid">
              <line x1={LEFT} x2={WIDTH - RIGHT} y1={y(tick)} y2={y(tick)} />
              <text x={LEFT - 6} y={y(tick)} dy="0.32em" textAnchor="end">
                {tick.toLocaleString()}
              </text>
            </g>
          ))}
          {SIZE_KEYS.map((key, i) => {
            const bucket = byKey.get(key)
            const x = LEFT + slot * i + (slot - BAR) / 2
            let base = 0
            return (
              <g
                key={key}
                className={active?.bucket === key ? 'sizing-column active' : 'sizing-column'}
                tabIndex={bucket ? 0 : -1}
                aria-label={bucket ? columnText(bucket) : `${SIZE_LABELS[key].long}: no bets`}
                onFocus={() => setActive({ bucket: key })}
                onBlur={() => setActive(undefined)}
                onPointerLeave={() => setActive(undefined)}
              >
                {/* The column's hit area: the whole slot, bigger than the bars. */}
                <rect className="sizing-hit" x={LEFT + slot * i} y={TOP} width={slot} height={HEIGHT - TOP - BOTTOM} onPointerEnter={() => setActive({ bucket: key })} />
                {bucket &&
                  STRENGTHS.map((strength, n) => {
                    const count = bucket.strengths[strength]
                    if (!count) return null
                    const from = base
                    base += count
                    const last = !STRENGTHS.slice(n + 1).some((later) => bucket.strengths[later])
                    const yTop = y(base)
                    const height = Math.max(1, y(from) - yTop - (from ? GAP : 0))
                    return (
                      <path
                        key={strength}
                        className={`sizing-strength-${n + 1}`}
                        d={segment(x, yTop, BAR, height, last)}
                        onPointerEnter={() => setActive({ bucket: key, strength })}
                      />
                    )
                  })}
                {bucket && (
                  <text className="sizing-total" x={x + BAR / 2} y={y(bucket.bets) - 5} textAnchor="middle">
                    {bucket.bets}
                  </text>
                )}
                <text className="sizing-axis" x={x + BAR / 2} y={HEIGHT - BOTTOM + 16} textAnchor="middle">
                  {SIZE_LABELS[key].short}
                </text>
              </g>
            )
          })}
          <line className="sizing-baseline" x1={LEFT} x2={WIDTH - RIGHT} y1={y(0)} y2={y(0)} />
        </svg>
        {shown && (
          <div className="sizing-tip" role="presentation">
            <strong>{SIZE_LABELS[shown.key].long}</strong>
            {STRENGTHS.filter((strength) => shown.strengths[strength]).map((strength) => (
              <span key={strength} className={active?.strength === strength ? 'current' : undefined}>
                <span className={`sizing-key sizing-strength-${STRENGTHS.indexOf(strength) + 1}`} aria-hidden="true" />
                <strong>{shown.strengths[strength]}</strong> {STRENGTH_LABELS[strength].label.toLowerCase()}
              </span>
            ))}
            <span>{shown.bets} in all</span>
          </div>
        )}
      </div>
      <p className="sizing-tell">
        {tell ? (
          <>
            {tell}{' '}
            <Link to={url(bucketConditions(street))}>See these bets →</Link>
          </>
        ) : (
          'Too few bets for a tell: no two sizes have ten bets yet.'
        )}
      </p>
      <p className="card-hint">
        Top pair or better in {street.strong.pct === null ? '—' : formatPct(street.strong.pct)} of the{' '}
        {street.street}'s bets.
      </p>
    </figure>
  )
}

function bucketConditions(street: SizingStreet): SpotCondition[] {
  if (!street.tell) return []
  const size = SIZE_LABELS[street.tell.bucket]
  return [{ field: 'bet_size', street: street.street, min: size.min, max: size.max }]
}

function columnText(bucket: SizeBucket) {
  const parts = STRENGTHS.filter((strength) => bucket.strengths[strength]).map(
    (strength) => `${bucket.strengths[strength]} ${STRENGTH_LABELS[strength].label.toLowerCase()}`,
  )
  return `${SIZE_LABELS[bucket.key].long}: ${bucket.bets} bets, ${parts.join(', ')}`
}

/** A stacked segment: square at its base, its top rounded 4px when it is the column's last. */
function segment(x: number, y: number, width: number, height: number, rounded: boolean) {
  const r = rounded ? Math.min(4, height, width / 2) : 0
  return [
    `M${x} ${y + height}`,
    `V${y + r}`,
    r ? `Q${x} ${y} ${x + r} ${y}` : '',
    `H${x + width - r}`,
    r ? `Q${x + width} ${y} ${x + width} ${y + r}` : '',
    `V${y + height}`,
    'Z',
  ].join(' ')
}

/** Every street's counts in a table, so no figure lives only in a chart. */
function SizingTable({ streets }: { streets: SizingStreet[] }) {
  return (
    <details className="sizing-table">
      <summary>Show as a table</summary>
      <div className="history-table-scroll">
        <table className="history-table">
          <thead>
            <tr>
              <th scope="col">Street</th>
              <th scope="col">Size</th>
              {STRENGTHS.map((strength) => (
                <th key={strength} scope="col">
                  {STRENGTH_LABELS[strength].label}
                </th>
              ))}
              <th scope="col">Top pair or better</th>
            </tr>
          </thead>
          <tbody>
            {streets.flatMap((street) =>
              street.buckets.map((bucket) => (
                <tr key={`${street.street}:${bucket.key}`}>
                  <th scope="row">{choiceLabel(street.street)}</th>
                  <td>{SIZE_LABELS[bucket.key].long}</td>
                  {STRENGTHS.map((strength) => (
                    <td key={strength}>{bucket.strengths[strength]}</td>
                  ))}
                  <td>
                    {bucket.strong.did} of {bucket.strong.could}
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </details>
  )
}

export default SizingPage
