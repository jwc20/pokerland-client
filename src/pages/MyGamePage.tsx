import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { errorMessage, hands, stats } from '../api/client.ts'
import type { HandTag, StatGroup, StatSet, StatsListParams } from '../api/generated/data-contracts.ts'
import { inViewerTimeZone } from '../calendar.ts'
import DisciplineCard from '../components/DisciplineCard.tsx'
import PositionBars from '../components/PositionBars.tsx'
import PurposeCard from '../components/PurposeCard.tsx'
import RakeCard from '../components/RakeCard.tsx'
import StatTile, { ShareBar } from '../components/StatTile.tsx'
import StyleQuadrant from '../components/StyleQuadrant.tsx'
import WinRateRange from '../components/WinRateRange.tsx'
import { formatBb, tagLabel } from '../handFormat.ts'
import { historyUrl, monthDays, within, type HistoryFilters } from '../historyFilters.ts'
import { enough, formatPct, STAT_INFO } from '../playerStats.ts'
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

// What the page can narrow the hands to. It groups them by position itself, so those tags are left out.
const FILTER_GROUPS = [
  ['format', 'Format'],
  ['game', 'Game'],
  ['stakes', 'Stakes'],
] as const

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

/** The hero's statistics, style and results by position, for all their hands or a format's, game's, stakes' or days'. */
function MyGamePage() {
  const [params, setParams] = useSearchParams()
  const [tags, setTags] = useState<HandTag[]>()
  // Remembers which filters it holds, so a change shows as loading.
  const [loaded, setLoaded] = useState<{ key: string; report?: Report; error?: string }>()
  const key = params.toString()

  useEffect(() => {
    let active = true
    hands.handsTagsList().then(
      ({ data }) => {
        if (active) setTags(data)
      },
      () => {}, // the filter offers all hands alone
    )
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const query = new URLSearchParams(key)
    let active = true
    const tag = query.get('tag')
    loadReport({
      tag: tag ? [tag] : undefined,
      since: query.get('since') || undefined,
      until: query.get('until') || undefined,
    }).then(
      (report) => {
        if (active) setLoaded({ key, report })
      },
      (err) => {
        if (active) setLoaded({ key, error: errorMessage(err) })
      },
    )
    return () => {
      active = false
    }
  }, [key])

  function setFilter(name: string, value: string) {
    // The URL as it is now: React Router renders a navigation later, so `params` may be a change behind.
    const next = new URLSearchParams(window.location.search)
    if (value) next.set(name, value)
    else next.delete(name)
    setParams(next, { replace: true })
  }

  const current = loaded?.key === key ? loaded : undefined
  // The page's hands as game history filters, which every link to the history starts from.
  const tag = params.get('tag')
  const base: HistoryFilters = {
    tags: tag ? [tag] : [],
    since: params.get('since') || undefined,
    until: params.get('until') || undefined,
  }
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

      <Filters tags={tags} params={params} onChange={setFilter} onClear={() => setParams({}, { replace: true })} />

      {current?.error ? (
        <p className="error-message" role="alert">
          {current.error}
        </p>
      ) : current?.report ? (
        <ReportView report={current.report} base={base} tags={tags} />
      ) : (
        <p>Loading…</p>
      )}
    </section>
  )
}

function Filters({
  tags,
  params,
  onChange,
  onClear,
}: {
  tags?: HandTag[]
  params: URLSearchParams
  onChange: (name: string, value: string) => void
  onClear: () => void
}) {
  const tag = params.get('tag') ?? ''
  const since = params.get('since') ?? ''
  const until = params.get('until') ?? ''
  return (
    <div className="filter-bar" role="group" aria-label="Which hands">
      <label>
        Hands
        <select value={tag} onChange={(event) => onChange('tag', event.target.value)}>
          <option value="">All hands</option>
          {FILTER_GROUPS.map(([group, label]) => {
            const options = tags?.filter((candidate) => candidate.group === group) ?? []
            return (
              options.length > 0 && (
                <optgroup key={group} label={label}>
                  {options.map((option) => (
                    <option key={option.key} value={option.key}>
                      {tagLabel(option)} ({option.hands.toLocaleString()})
                    </option>
                  ))}
                </optgroup>
              )
            )
          })}
          {/* A tag from the URL that the list doesn't have (yet) still shows as chosen. */}
          {tag && !tags?.some((candidate) => candidate.key === tag) && <option value={tag}>{tag}</option>}
        </select>
      </label>
      <label>
        From
        <input type="date" value={since} max={until || undefined} onChange={(event) => onChange('since', event.target.value)} />
      </label>
      <label>
        To
        <input type="date" value={until} min={since || undefined} onChange={(event) => onChange('until', event.target.value)} />
      </label>
      {(tag || since || until) && (
        <button type="button" className="link-button" onClick={onClear}>
          Show all hands
        </button>
      )}
    </div>
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
