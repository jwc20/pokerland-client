import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { errorMessage, hands, stats } from '../api/client.ts'
import type { HandTag, StatGroup, StatSet, StatsListParams } from '../api/generated/data-contracts.ts'
import { browserTimeZone } from '../calendar.ts'
import PositionBars from '../components/PositionBars.tsx'
import StatTile, { ShareBar } from '../components/StatTile.tsx'
import StyleQuadrant from '../components/StyleQuadrant.tsx'
import WinRateRange from '../components/WinRateRange.tsx'
import { formatBb, tagLabel } from '../handFormat.ts'
import { enough, formatPct } from '../playerStats.ts'
import './MyGamePage.css'

interface Tile {
  stat: keyof StatSet
  label: string
  hint: string
}

const PREFLOP: Tile[] = [
  { stat: 'vpip', label: 'VPIP', hint: 'Put money in by choice before the flop: called or raised.' },
  { stat: 'pfr', label: 'PFR', hint: 'Raised before the flop.' },
  { stat: 'three_bet', label: '3-bet', hint: 'Re-raised a raise.' },
  { stat: 'fold_to_three_bet', label: 'Fold to 3-bet', hint: 'Opened, then folded to a re-raise.' },
  { stat: 'steal', label: 'Steal', hint: 'Raised first in from the cutoff, the button or the small blind.' },
  { stat: 'fold_to_steal', label: 'Fold to steal', hint: 'In a blind, folded to a steal.' },
  { stat: 'bb_defend', label: 'Big blind defense', hint: 'In the big blind, called or re-raised a steal.' },
]

const POSTFLOP: Tile[] = [
  { stat: 'cbet_flop', label: 'C-bet flop', hint: 'Raised last before the flop, then bet it when checked to.' },
  { stat: 'cbet_turn', label: 'C-bet turn', hint: 'Bet the turn too, after a flop c-bet nobody raised.' },
  { stat: 'fold_to_cbet_flop', label: 'Fold to flop c-bet', hint: 'Folded to a c-bet on the flop.' },
  { stat: 'fold_to_cbet_turn', label: 'Fold to turn c-bet', hint: 'Folded to a c-bet on the turn.' },
  { stat: 'check_raise', label: 'Check-raise', hint: 'Checked, then raised a bet on the same street.' },
  {
    stat: 'aggression',
    label: 'Aggression',
    hint: 'Bets and raises out of your bets, raises, calls and folds after the flop.',
  },
]

const SHOWDOWN: Tile[] = [
  { stat: 'saw_flop', label: 'Saw the flop', hint: 'Of the hands you were dealt.' },
  { stat: 'went_to_showdown', label: 'Went to showdown', hint: 'Of the flops you saw.' },
  { stat: 'won_at_showdown', label: 'Won at showdown', hint: 'Of the showdowns you went to.' },
]

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
  const load = (tz: string) =>
    Promise.all((['none', 'position', 'month'] as const).map((group_by) => stats.statsList({ ...filters, group_by, tz })))
  let responses
  try {
    responses = await load(browserTimeZone())
  } catch (err) {
    if (!(err instanceof Response && err.status === 400)) throw err
    responses = await load('UTC')
  }
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
    loadReport({
      tag: query.get('tag') || undefined,
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
    const next = new URLSearchParams(params)
    if (value) next.set(name, value)
    else next.delete(name)
    setParams(next, { replace: true })
  }

  const current = loaded?.key === key ? loaded : undefined
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
        <ReportView report={current.report} />
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
    <div className="my-game-filters" role="group" aria-label="Which hands">
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

function ReportView({ report }: { report: Report }) {
  const { all, positions, months } = report
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
        </div>
      </section>

      <div className="my-game-charts">
        <section className="card" aria-labelledby="my-game-style">
          <h2 id="my-game-style" className="card-header">
            Your style
          </h2>
          <div className="card-body">
            <StyleQuadrant overall={all} months={months} />
          </div>
        </section>
        <section className="card" aria-labelledby="my-game-positions">
          <h2 id="my-game-positions" className="card-header">
            bb/100 by position
          </h2>
          <div className="card-body">
            <PositionBars groups={positions} />
          </div>
        </section>
      </div>

      <TileCard id="my-game-preflop" title="Before the flop" tiles={PREFLOP} stats={all.stats} />
      <section className="card" aria-labelledby="my-game-rfi">
        <h2 id="my-game-rfi" className="card-header">
          Raise first in by position
        </h2>
        <div className="card-body">
          <p className="card-hint">How often you raised when the pot was folded to you. Expect more the nearer you sit to the button.</p>
          <RaiseFirstIn positions={positions} />
        </div>
      </section>
      <TileCard id="my-game-postflop" title="After the flop" tiles={POSTFLOP} stats={all.stats} />
      <TileCard id="my-game-showdown" title="Showdowns" tiles={SHOWDOWN} stats={all.stats} />
    </>
  )
}

function TileCard({ id, title, tiles, stats }: { id: string; title: string; tiles: Tile[]; stats: StatSet }) {
  return (
    <section className="card" aria-labelledby={id}>
      <h2 id={id} className="card-header">
        {title}
      </h2>
      <div className="card-body">
        <div className="my-game-tiles">
          {tiles.map((tile) => (
            <StatTile key={tile.stat} label={tile.label} hint={tile.hint} stat={stats[tile.stat]} />
          ))}
        </div>
      </div>
    </section>
  )
}

function RaiseFirstIn({ positions }: { positions: StatGroup[] }) {
  const rows = positions.filter((group) => group.stats.rfi.could > 0)
  if (!rows.length) return <p className="card-hint">No pots folded to you yet.</p>
  return (
    <div className="my-game-rfi">
      {rows.map((group) => {
        const stat = group.stats.rfi
        return (
          <div key={group.key} className="my-game-rfi-row">
            <span className="my-game-rfi-position">{group.key}</span>
            {enough(stat) ? <ShareBar stat={stat} /> : <span className="my-game-rfi-few">Too few chances</span>}
            <span className="my-game-rfi-value">{enough(stat) ? formatPct(stat.pct) : '—'}</span>
            <span className="my-game-rfi-sample">
              {stat.did.toLocaleString()} of {stat.could.toLocaleString()}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default MyGamePage
