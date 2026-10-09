import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router'
import { errorMessage, stats } from '../api/client.ts'
import type { HandTag, StatGroup, StatsListParams } from '../api/generated/data-contracts.ts'
import { queries } from '../api/queries.ts'
import { formatMonth, inViewerTimeZone } from '../calendar.ts'
import { formatBb, stakesLabel } from '../handFormat.ts'
import { apiScope, historyParams, historyUrl, monthDays, within, type HistoryFilters } from '../historyFilters.ts'
import { formatPaid, RAKE_KINDS, rakeKinds, rakeRates, stakesOf, totalOf, type RakeKind } from '../rake.ts'
import { formatRate, RANGE_MIN_HANDS } from '../winRate.ts'
import './RakeCard.css'

interface RakeReport {
  stakes: StatGroup[]
  months: StatGroup[]
}

type RakeView = 'stakes' | 'months'

/**
 * What the house took (F6): the rake you paid in cash games, and your win rate
 * before and after it, by stakes and by month. `base` is the page's hands. When
 * it holds every format, the card keeps to one kind of cash game, real or play
 * money, with a switch when you have both.
 */
function RakeCard({ base, tags }: { base: HistoryFilters; tags?: HandTag[] }) {
  const [chosen, setChosen] = useState<RakeKind>()
  const [view, setView] = useState<RakeView>('stakes')

  // A format or stakes tag already decides the kind; a game tag or none doesn't.
  const decided = base.tags.some((tag) => tag.startsWith('format:') || tag.startsWith('stakes:'))
  const kinds = decided ? [] : rakeKinds(tags)
  const kind = chosen && kinds.includes(chosen) ? chosen : kinds[0]
  const scope: HistoryFilters = { ...base, tags: kind ? [...base.tags, `format:${kind}`] : base.tags }
  const tournaments = base.tags.includes('format:tournament')
  const noCash = !decided && kinds.length === 0
  const key = tournaments || noCash ? '' : historyParams(scope).toString()
  // The last filters' report stays on screen, faded, until the next one arrives.
  const filters = apiScope(new URLSearchParams(key))
  const query = useQuery({ ...queries.stats.report('rake', filters, () => loadRake(filters)), enabled: Boolean(key) })
  const current = query.error ? { error: errorMessage(query.error) } : query.data && { report: query.data }
  return (
    <section className="card" aria-labelledby="my-game-rake">
      <h2 id="my-game-rake" className="card-header">
        Rake
      </h2>
      <div className={query.isPlaceholderData ? 'card-body is-updating' : 'card-body'}>
        {tournaments ? (
          <p className="card-hint">
            Tournaments charge a fee with the buy-in instead of raking each pot. Pokerland doesn't log buy-ins yet, so
            there is nothing to count here.
          </p>
        ) : noCash ? (
          <p className="card-hint">The house rakes the pots of cash games, and you have no cash-game hands yet.</p>
        ) : (
          <>
            {kinds.length > 1 && (
              <div className="segmented" role="tablist" aria-label="Which cash games">
                {RAKE_KINDS.map((option) => (
                  <button
                    key={option.kind}
                    type="button"
                    role="tab"
                    aria-selected={kind === option.kind}
                    onClick={() => setChosen(option.kind)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
            {current?.error ? (
              <p className="error-message" role="alert">
                {current.error}
              </p>
            ) : current?.report ? (
              <RakeReportView report={current.report} scope={scope} view={view} onView={setView} />
            ) : (
              <p>Loading…</p>
            )}
          </>
        )}
      </div>
    </section>
  )
}

/** Rake by stakes and by month, months counted in the viewer's time zone (or UTC if the API doesn't know it). */
async function loadRake(filters: StatsListParams): Promise<RakeReport> {
  const [stakes, months] = await inViewerTimeZone((tz) =>
    Promise.all((['stakes', 'month'] as const).map((group_by) => stats.statsList({ ...filters, group_by, tz }))),
  )
  return { stakes: stakes.data, months: months.data }
}

function RakeReportView({
  report,
  scope,
  view,
  onView,
}: {
  report: RakeReport
  scope: HistoryFilters
  view: RakeView
  onView: (view: RakeView) => void
}) {
  const sums = totalOf(report.stakes)
  const total = rakeRates(sums)
  if (!total) return <p className="card-hint">No cash-game hands among these.</p>

  const rows =
    view === 'stakes'
      ? report.stakes.map((group) => ({
          group,
          label: stakesLabel(stakesOf(group.key)),
          to: historyUrl({ ...scope, tags: [...scope.tags, `stakes:${group.key}`] }),
        }))
      : report.months.map((group) => {
          const [year, month] = group.key.split('-').map(Number)
          return {
            group,
            label: formatMonth(year, month - 1),
            to: historyUrl({ ...scope, ...within(monthDays(group.key), scope) }),
          }
        })
  return (
    <>
      <dl className="rake-summary">
        <div>
          <dt>Rake paid</dt>
          <dd>{formatPaid(total.paid)} bb/100</dd>
          <dd className="rake-summary-note">
            {formatBb(sums.rake_bb, false)} over {sums.hands.toLocaleString()} {sums.hands === 1 ? 'hand' : 'hands'}
          </dd>
        </div>
        <div>
          <dt>Before rake</dt>
          <dd>{formatRate(total.before)} bb/100</dd>
          <dd className="rake-summary-note">With no rake taken</dd>
        </div>
        <div>
          <dt>After rake</dt>
          <dd>{formatRate(total.after)} bb/100</dd>
          <dd className="rake-summary-note">What you won</dd>
        </div>
      </dl>
      {sums.hands < RANGE_MIN_HANDS && (
        <p className="card-hint">
          Only {sums.hands.toLocaleString()} {sums.hands === 1 ? 'hand' : 'hands'}: too few for these rates to say much
          yet.
        </p>
      )}
      <p className="card-hint">
        The rake you paid is your share of each pot's rake, split by what everyone put in, so you pay some even in
        pots you lose. Before rake adds back the rake that came out of the pots you won.
      </p>

      <div className="segmented" role="tablist" aria-label="Rake by">
        <button type="button" role="tab" aria-selected={view === 'stakes'} onClick={() => onView('stakes')}>
          By stakes
        </button>
        <button type="button" role="tab" aria-selected={view === 'months'} onClick={() => onView('months')}>
          By month
        </button>
      </div>
      <div className="history-table-scroll">
        <table className="history-table rake-table">
          <caption className="rake-table-caption">Rake and win rate in bb/100, {view === 'stakes' ? 'by stakes' : 'by month'}</caption>
          <thead>
            <tr>
              <th scope="col">{view === 'stakes' ? 'Stakes' : 'Month'}</th>
              <th scope="col">Hands</th>
              <th scope="col">Rake paid</th>
              <th scope="col">Before rake</th>
              <th scope="col">After rake</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ group, label, to }) => {
              const rates = rakeRates(group)
              return (
                rates && (
                  <tr key={group.key}>
                    <th scope="row">
                      <Link to={to} title="See these hands in Game History">
                        {label}
                      </Link>
                    </th>
                    <td>{rates.hands.toLocaleString()}</td>
                    <td>{formatPaid(rates.paid)}</td>
                    <td>{formatRate(rates.before)}</td>
                    <td>{formatRate(rates.after)}</td>
                  </tr>
                )
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default RakeCard
