import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { errorMessage, stats } from '../api/client.ts'
import type { Barrel, LinesReport, LineSpot, Stat, StatGroup } from '../api/generated/data-contracts.ts'
import { inViewerTimeZone } from '../calendar.ts'
import MyGameTabs from '../components/MyGameTabs.tsx'
import PositionBars from '../components/PositionBars.tsx'
import ScopeFilters from '../components/ScopeFilters.tsx'
import { ShareBar } from '../components/StatTile.tsx'
import { apiScope, historyUrl, type HistoryFilters } from '../historyFilters.ts'
import { enough, formatPct } from '../playerStats.ts'
import { choiceLabel, withConditions, type SpotCondition } from '../spots.ts'
import { useHandTags, useScope } from '../useScope.ts'
import { formatRate } from '../winRate.ts'
import './ReportsPage.css'

const SITUATION_LABELS: Record<string, string> = {
  unopened: 'Unopened',
  limped: 'After limpers',
  raised: 'Facing a raise',
  '3bet': 'Facing a 3-bet',
  '4bet+': 'Facing a 4-bet or more',
  none: 'No decision (a walk)',
}
const DEPTH_LABELS: Record<string, string> = {
  '0-10': '10 BB or less',
  '10-20': '10 to 20 BB',
  '20-40': '20 to 40 BB',
  '40-100': '40 to 100 BB',
  '100+': '100 BB or more',
}
const DEPTH_RANGES: Record<string, [number | undefined, number | undefined]> = {
  '0-10': [undefined, 10],
  '10-20': [10, 20],
  '20-40': [20, 40],
  '40-100': [40, 100],
  '100+': [100, undefined],
}
const ZONE_LABELS: Record<string, string> = {
  dead: 'Dead, M below 2',
  push_fold: 'Push or fold, M 2 to 8',
  restealing: 'Steal and re-steal, M 8 to 12',
  value: 'Value-betting, M 12 to 30',
  set_mining: 'Set-mining, M above 30',
}
const ZONE_RANGES: Record<string, [number | undefined, number | undefined]> = {
  dead: [undefined, 2],
  push_fold: [2, 8],
  restealing: [8, 12],
  value: [12, 30],
  set_mining: [30, undefined],
}
const ROLE_LABELS: Record<string, string> = {
  raised: 'You raised before the flop',
  called: 'You called before the flop',
  limped: 'Limped pot, no raise',
}

interface Report {
  situations: StatGroup[]
  depths: StatGroup[]
  zones: StatGroup[]
  lines: LinesReport
}

/** A share as a percentage with its bar, or a dash with too few chances. */
function Share({ stat }: { stat: Stat }) {
  if (!enough(stat)) {
    return (
      <span className="reports-few" title={`${stat.did} of ${stat.could}`}>
        {stat.could ? `${stat.did} of ${stat.could}` : '—'}
      </span>
    )
  }
  return (
    <span className="reports-share">
      <span className="reports-share-value">{formatPct(stat.pct)}</span>
      <ShareBar stat={stat} />
    </span>
  )
}

/**
 * Situation reports (B6): your first decision by what you faced before the flop [MIT 2: the "facing preflop action"
 * report], your play by stack depth or M zone [MIT 2; MIT 5], the flop matrix of who raised and who has position
 * [JHU 5], and the turn and river after a called c-bet [JHU 8]. Every row opens its hands.
 */
function ReportsPage() {
  const scope = useScope()
  const tags = useHandTags()
  const [loaded, setLoaded] = useState<{ key: string; report?: Report; error?: string }>()
  const { key } = scope

  useEffect(() => {
    const filters = apiScope(new URLSearchParams(key))
    let active = true
    inViewerTimeZone((tz) =>
      Promise.all([
        stats.statsList({ ...filters, group_by: 'situation', tz }),
        stats.statsList({ ...filters, group_by: 'stack_depth', tz }),
        stats.statsList({ ...filters, group_by: 'm_zone', tz }),
        stats.statsLinesRetrieve({ ...filters, tz }),
      ]),
    ).then(
      ([situations, depths, zones, lines]) => {
        if (active) {
          setLoaded({ key, report: { situations: situations.data, depths: depths.data, zones: zones.data, lines: lines.data } })
        }
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
    <section className="reports">
      <header className="reports-header">
        <h1>Situations</h1>
        <p>
          How you play by what you face: the action before you, the stacks, who raised before the flop and who has
          position. A share needs ten chances before it shows; until then you see the count.
        </p>
      </header>
      <MyGameTabs />
      <ScopeFilters scope={scope} tags={tags} />
      {current?.error ? (
        <p className="error-message" role="alert">
          {current.error}
        </p>
      ) : current?.report ? (
        <ReportView report={current.report} base={scope.base} />
      ) : (
        <p>Loading…</p>
      )}
    </section>
  )
}

function ReportView({ report, base }: { report: Report; base: HistoryFilters }) {
  const url = (conditions: SpotCondition[]) => historyUrl(withConditions(base, conditions))
  return (
    <>
      <Card id="reports-facing" title="Facing preflop action">
        <p className="card-hint">Your first decision, by what came before it [MIT 2].</p>
        <GroupTable
          groups={report.situations}
          labelOf={(key) => SITUATION_LABELS[key] ?? key}
          heading="Before you"
          urlOf={(key) => (key === 'none' ? undefined : url([{ field: 'situation', value: [key] }]))}
          columns={[
            ['Fold', (group) => <Share stat={group.first_actions.fold} />],
            ['Call', (group) => <Share stat={group.first_actions.call} />],
            ['Raise', (group) => <Share stat={group.first_actions.raise} />],
          ]}
        />
        <PositionBars groups={report.situations} labelOf={(key) => SITUATION_LABELS[key] ?? key} heading="Before you" labelWidth={150} />
      </Card>

      <Card id="reports-depth" title="Stack depth">
        <p className="card-hint">
          By the effective stack, the most you could lose [MIT 1]. With 10 BB or less, move in or fold [JHU 6].
        </p>
        <GroupTable
          groups={report.depths}
          labelOf={(key) => DEPTH_LABELS[key] ?? key}
          heading="Effective stack"
          urlOf={(key) => url([{ field: 'effective_bb', min: DEPTH_RANGES[key]?.[0], max: DEPTH_RANGES[key]?.[1] }])}
          columns={[
            ['Raise first in', (group) => <Share stat={group.stats.rfi} />],
            ['3-bet', (group) => <Share stat={group.stats.three_bet} />],
            ['Moved in', (group) => <Share stat={group.shove} />],
          ]}
        />
        {report.zones.length > 0 && (
          <>
            <h3 className="reports-subhead">Tournaments, by M zone [MIT 5]</h3>
            <GroupTable
              groups={report.zones}
              labelOf={(key) => ZONE_LABELS[key] ?? key}
              heading="M zone"
              urlOf={(key) => url([{ field: 'm', min: ZONE_RANGES[key]?.[0], max: ZONE_RANGES[key]?.[1] }])}
              columns={[
                ['Raise first in', (group) => <Share stat={group.stats.rfi} />],
                ['Steal', (group) => <Share stat={group.stats.steal} />],
                ['Moved in', (group) => <Share stat={group.shove} />],
              ]}
            />
          </>
        )}
      </Card>

      <Card id="reports-matrix" title="After the flop: who raised, and who has position">
        <p className="card-hint">
          Each street by your part before the flop and whether you acted last [JHU 5]: how often you bet when you
          could bet first, and how you answered a bet. Open a row for the board's texture.
        </p>
        {report.lines.streets.length === 0 ? (
          <p className="card-hint">No flops seen yet.</p>
        ) : (
          report.lines.streets.map((street) => (
            <section key={street.street} className="reports-street" aria-label={choiceLabel(street.street)}>
              <h3 className="reports-subhead">{choiceLabel(street.street)}</h3>
              <MatrixTable spots={street.spots} street={street.street} url={url} />
            </section>
          ))
        )}
      </Card>

      <Card id="reports-barrels" title="After a called c-bet">
        <p className="card-hint">
          The turn after your flop c-bet was called, and the river after your turn barrel was [JHU 8: the second
          barrel, giving up, and leverage].
        </p>
        <Barrels barrels={report.lines.barrels} url={url} />
      </Card>
    </>
  )
}

function Card({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="card" aria-labelledby={id}>
      <h2 id={id} className="card-header">
        {title}
      </h2>
      <div className="card-body">{children}</div>
    </section>
  )
}

function GroupTable({
  groups,
  labelOf,
  heading,
  urlOf,
  columns,
}: {
  groups: StatGroup[]
  labelOf: (key: string) => string
  heading: string
  urlOf: (key: string) => string | undefined
  columns: [string, (group: StatGroup) => ReactNode][]
}) {
  if (!groups.length) return <p className="card-hint">No hands yet.</p>
  return (
    <div className="history-table-scroll">
      <table className="history-table reports-table">
        <thead>
          <tr>
            <th scope="col">{heading}</th>
            <th scope="col">Hands</th>
            {columns.map(([title]) => (
              <th key={title} scope="col">
                {title}
              </th>
            ))}
            <th scope="col">bb/100</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => {
            const to = urlOf(group.key)
            return (
              <tr key={group.key}>
                <th scope="row">{to ? <Link to={to}>{labelOf(group.key)}</Link> : labelOf(group.key)}</th>
                <td>{group.hands.toLocaleString()}</td>
                {columns.map(([title, cell]) => (
                  <td key={title}>{cell(group)}</td>
                ))}
                <td>{formatRate((group.net_bb / group.hands) * 100)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function lineCondition(street: string, spot: Pick<LineSpot, 'role' | 'ip'>, extra: Partial<SpotCondition> = {}): SpotCondition {
  return { field: 'line', street, role: spot.role, ...(spot.ip === null ? {} : { ip: spot.ip }), ...extra }
}

function MatrixTable({ spots, street, url }: { spots: LineSpot[]; street: string; url: (c: SpotCondition[]) => string }) {
  return (
    <div className="history-table-scroll">
      <table className="history-table reports-table">
        <thead>
          <tr>
            <th scope="col">Spot</th>
            <th scope="col">Hands</th>
            <th scope="col">Bet first</th>
            <th scope="col">Fold to a bet</th>
            <th scope="col">Call a bet</th>
            <th scope="col">Raise a bet</th>
          </tr>
        </thead>
        <tbody>
          {spots.map((spot) => {
            const position = spot.ip === null ? 'nobody else could act' : spot.ip ? 'in position' : 'out of position'
            const label = `${ROLE_LABELS[spot.role] ?? spot.role}, ${position}`
            return [
              <MovesRow key={label} label={label} moves={spot} to={url([lineCondition(street, spot)])} />,
              ...spot.textures.map((texture) => (
                <MovesRow
                  key={`${label}:${texture.texture}`}
                  label={`… on a ${choiceLabel(texture.texture).toLowerCase()} board`}
                  moves={texture}
                  to={url([lineCondition(street, spot), { field: 'texture', street, value: [texture.texture] }])}
                  inner
                />
              )),
            ]
          })}
        </tbody>
      </table>
    </div>
  )
}

/** A street's moves: bet when able to bet first, and the answers to a bet. */
type LineMoves = Pick<LineSpot, 'hands' | 'bet' | 'fold' | 'call' | 'raise'>

function MovesRow({ label, moves, to, inner = false }: { label: string; moves: LineMoves; to: string; inner?: boolean }) {
  return (
    <tr className={inner ? 'reports-inner' : undefined}>
      <th scope="row">
        <Link to={to}>{label}</Link>
      </th>
      <td>{moves.hands.toLocaleString()}</td>
      <td>
        <Share stat={moves.bet} />
      </td>
      <td>
        <Share stat={moves.fold} />
      </td>
      <td>
        <Share stat={moves.call} />
      </td>
      <td>
        <Share stat={moves.raise} />
      </td>
    </tr>
  )
}

const SIZE_LABELS: Record<string, string> = {
  under_third: 'under ⅓ pot',
  third_half: '⅓ to ½',
  half_three_quarters: '½ to ¾',
  three_quarters_pot: '¾ to pot',
  pot_plus: 'pot or more',
}

function Barrels({ barrels, url }: { barrels: Barrel[]; url: (c: SpotCondition[]) => string }) {
  if (!barrels.length) return <p className="card-hint">No called c-bets yet.</p>
  return (
    <div className="history-table-scroll">
      <table className="history-table reports-table">
        <thead>
          <tr>
            <th scope="col">Street</th>
            <th scope="col">Hands</th>
            <th scope="col">Barrel</th>
            <th scope="col">Check behind</th>
            <th scope="col">Check, then fold</th>
            <th scope="col">Check, then call</th>
            <th scope="col">Check-raise</th>
          </tr>
        </thead>
        <tbody>
          {barrels.map((row) => {
            const previous = row.street === 'turn' ? 'flop' : 'turn'
            const to = url([
              { field: 'line', street: previous, role: 'raised', first: 'bet' },
              { field: 'line', street: row.street },
            ])
            return (
              <tr key={row.street}>
                <th scope="row">
                  <Link to={to}>{choiceLabel(row.street)}</Link>
                </th>
                <td>{row.hands.toLocaleString()}</td>
                <td>
                  <Share stat={row.barrel} />
                </td>
                <td>
                  <Share stat={row.checked_behind} />
                </td>
                <td>
                  <Share stat={row.gave_up} />
                </td>
                <td>
                  <Share stat={row.check_call} />
                </td>
                <td>
                  <Share stat={row.check_raise} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {barrels.some((row) => row.sizes.length > 0) && (
        <p className="card-hint">
          Third barrels on the river:{' '}
          {barrels
            .flatMap((row) => row.sizes)
            .map((size) => `${size.bets} ${SIZE_LABELS[size.key] ?? size.key}`)
            .join(', ')}
          .
        </p>
      )}
    </div>
  )
}

export default ReportsPage
