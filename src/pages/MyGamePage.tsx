import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { errorMessage, stats } from '../api/client.ts'
import type { HandTag, StatGroup, StatSet, StatsListParams } from '../api/generated/data-contracts.ts'
import { queries } from '../api/queries.ts'
import { inViewerTimeZone } from '../calendar.ts'
import DisciplineCard from '../components/DisciplineCard.tsx'
import MyGameTabs from '../components/MyGameTabs.tsx'
import PositionBars from '../components/PositionBars.tsx'
import PurposeCard from '../components/PurposeCard.tsx'
import RakeCard from '../components/RakeCard.tsx'
import ScopeFilters from '../components/ScopeFilters.tsx'
import StatTile, { ShareBar } from '../components/StatTile.tsx'
import StyleQuadrant from '../components/StyleQuadrant.tsx'
import WinRateRange from '../components/WinRateRange.tsx'
import { formatBb } from '../handFormat.ts'
import { apiScope, historyUrl, monthDays, within, type HistoryFilters } from '../historyFilters.ts'
import { enough, formatPct, STAT_INFO } from '../playerStats.ts'
import { useHandTags, useScope } from '../useScope.ts'
import { formatRate } from '../winRate.ts'
import './MyGamePage.css'

const PREFLOP: (keyof StatSet)[] = ['vpip', 'pfr', 'three_bet', 'fold_to_three_bet', 'steal', 'fold_to_steal', 'bb_defend']
const POSTFLOP: (keyof StatSet)[] = [
  'cbet_flop',
  'cbet_turn',
  'fold_to_cbet_flop',
  'fold_to_cbet_turn',
  'check_raise',
  'aggression',
]
const SHOWDOWN: (keyof StatSet)[] = ['saw_flop', 'went_to_showdown', 'won_at_showdown']

interface Report {
  all: StatGroup
  positions: StatGroup[]
  months: StatGroup[]
}

/** The hero's statistics in each grouping, with months counted in the viewer's time zone, or UTC if the API doesn't know it. */
async function loadReport(filters: StatsListParams): Promise<Report> {
  const responses = await inViewerTimeZone((tz) =>
    Promise.all((['none', 'position', 'month'] as const).map((group_by) => stats.statsList({ ...filters, group_by, tz }))),
  )
  const [all, positions, months] = responses.map(({ data }) => data)
  return { all: all[0], positions, months }
}

/**
 * The hero's statistics, style and results by position, for all their hands or a format's, game's, stakes', days'
 * or spot's.
 */
function MyGamePage() {
  const scope = useScope()
  const tags = useHandTags()
  const { key } = scope
  // The last filters' report stays on screen, faded, until the next one arrives; an upload refreshes it.
  const filters = apiScope(new URLSearchParams(key))
  const query = useQuery(queries.stats.report('my-game', filters, () => loadReport(filters)))
  const current = query.error ? { error: errorMessage(query.error) } : query.data && { report: query.data }
  return (
    <section className="my-game">
      <header className="my-game-header">
        <h1>My game</h1>
        <p>
          Your statistics as a tracker counts them: how often you did something, out of how often you could have.
          Each comes with its sample and a 95% range, the span the true figure likely lies in; a wide one means
          the hands so far can't say much yet.
        </p>
      </header>
      <MyGameTabs />

      <ScopeFilters scope={scope} tags={tags} />

      {current?.error ? (
        <p className="error-message" role="alert">
          {current.error}
        </p>
      ) : current?.report ? (
        <div className={query.isPlaceholderData ? 'my-game-report is-updating' : 'my-game-report'}>
          <ReportView report={current.report} base={scope.base} tags={tags} />
        </div>
      ) : (
        <p>Loading…</p>
      )}
    </section>
  )
}

/**
 * The report. Each figure links to the game history, narrowed to the hands it counts: a tile to its
 * chances, a position to its hands, a month to its days.
 */
function ReportView({ report, base, tags }: { report: Report; base: HistoryFilters; tags?: HandTag[] }) {
  const { all, positions, months } = report
  const atPosition = (position: string) => [...base.tags, `position:${position}`]
  if (all.hands === 0) {
    return (
      <p className="card-hint">
        No hands to count. Your tracker uploads them as you play; see the <Link to="/games">game history</Link>.
      </p>
    )
  }
  return (
    <>
      <section className="card" aria-labelledby="my-game-results">
        <h2 id="my-game-results" className="card-header">
          Results
        </h2>
        <div className="card-body">
          <p className="my-game-net">
            {all.hands.toLocaleString()} {all.hands === 1 ? 'hand' : 'hands'} · Net {formatBb(all.net_bb)} ·{' '}
            {formatBb((all.net_bb / all.hands) * 100)}/100
          </p>
          <WinRateRange stats={all} />
          {all.all_ins > 0 && (
            <p className="card-hint">
              Adjusted for all-in equity: {formatRate((all.ev_net_bb / all.hands) * 100)} bb/100. In{' '}
              {all.all_ins.toLocaleString()} {all.all_ins === 1 ? 'hand' : 'hands'} the money went in before the
              river with every hand shown; counting what you could expect then instead of what came,{' '}
              {all.net_bb >= all.ev_net_bb
                ? `you ran ${formatBb(all.net_bb - all.ev_net_bb, false)} above it.`
                : `you ran ${formatBb(all.ev_net_bb - all.net_bb, false)} below it.`}
            </p>
          )}
          <Link className="my-game-more" to={historyUrl(base)}>
            See these hands in Game History →
          </Link>
        </div>
      </section>

      <div className="my-game-charts">
        <section className="card" aria-labelledby="my-game-style">
          <h2 id="my-game-style" className="card-header">
            Your style
          </h2>
          <div className="card-body">
            <StyleQuadrant
              overall={all}
              months={months}
              allUrl={historyUrl(base)}
              monthUrl={(month) => historyUrl({ ...base, ...within(monthDays(month), base) })}
            />
          </div>
        </section>
        <section className="card" aria-labelledby="my-game-positions">
          <h2 id="my-game-positions" className="card-header">
            bb/100 by position
          </h2>
          <div className="card-body">
            <PositionBars
              groups={positions}
              positionUrl={(position) => historyUrl({ ...base, tags: atPosition(position) })}
            />
          </div>
        </section>
      </div>

      <TileCard id="my-game-preflop" title="Before the flop" tiles={PREFLOP} stats={all.stats} base={base} />
      <section className="card" aria-labelledby="my-game-rfi">
        <h2 id="my-game-rfi" className="card-header">
          Raise first in by position
        </h2>
        <div className="card-body">
          <p className="card-hint">How often you raised when the pot was folded to you. Expect more the nearer you sit to the button.</p>
          <RaiseFirstIn
            positions={positions}
            positionUrl={(position) => historyUrl({ ...base, tags: atPosition(position), stat: 'rfi' })}
          />
        </div>
      </section>
      <DisciplineCard base={base} />
      <TileCard id="my-game-postflop" title="After the flop" tiles={POSTFLOP} stats={all.stats} base={base} />
      <TileCard id="my-game-showdown" title="Showdowns" tiles={SHOWDOWN} stats={all.stats} base={base} />
      <PurposeCard base={base} />
      <RakeCard base={base} tags={tags} />
    </>
  )
}

function TileCard({
  id,
  title,
  tiles,
  stats,
  base,
}: {
  id: string
  title: string
  tiles: (keyof StatSet)[]
  stats: StatSet
  base: HistoryFilters
}) {
  return (
    <section className="card" aria-labelledby={id}>
      <h2 id={id} className="card-header">
        {title}
      </h2>
      <div className="card-body">
        <div className="my-game-tiles">
          {tiles.map((stat) => (
            <StatTile
              key={stat}
              label={STAT_INFO[stat].label}
              hint={STAT_INFO[stat].hint}
              stat={stats[stat]}
              to={stats[stat].could > 0 ? historyUrl({ ...base, stat }) : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function RaiseFirstIn({
  positions,
  positionUrl,
}: {
  positions: StatGroup[]
  positionUrl: (position: string) => string
}) {
  const rows = positions.filter((group) => group.stats.rfi.could > 0)
  if (!rows.length) return <p className="card-hint">No pots folded to you yet.</p>
  return (
    <div className="my-game-rfi">
      {rows.map((group) => {
        const stat = group.stats.rfi
        return (
          <Link
            key={group.key}
            className="my-game-rfi-row"
            to={positionUrl(group.key)}
            aria-label={`${group.key}: raised first in ${stat.did} of ${stat.could} times; see these hands`}
          >
            <span className="my-game-rfi-position">{group.key}</span>
            {enough(stat) ? <ShareBar stat={stat} /> : <span className="my-game-rfi-few">Too few chances</span>}
            <span className="my-game-rfi-value">{enough(stat) ? formatPct(stat.pct) : '—'}</span>
            <span className="my-game-rfi-sample">
              {stat.did.toLocaleString()} of {stat.could.toLocaleString()}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

export default MyGamePage
