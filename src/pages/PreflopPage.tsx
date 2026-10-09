import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { changes } from '../api/changes.ts'
import { errorMessage, ranges as rangesApi } from '../api/client.ts'
import type { SavedRange, StatGroup } from '../api/generated/data-contracts.ts'
import { queries } from '../api/queries.ts'
import MyGameTabs from '../components/MyGameTabs.tsx'
import RangeGrid, { RangeTable, type GridCell, type GridMode } from '../components/RangeGrid.tsx'
import ScopeFilters from '../components/ScopeFilters.tsx'
import { apiScope, historyUrl } from '../historyFilters.ts'
import { COURSE_PRESETS, GROUP_PRESETS, shareText, topPreset, type RangePreset } from '../rangePresets.ts'
import { combosOf, formatRange, parseRange } from '../ranges.ts'
import { rangeError, withConditions, type SpotCondition } from '../spots.ts'
import { useHandTags, useScope, type ScopeQuery } from '../useScope.ts'
import { formatRate } from '../winRate.ts'
import './PreflopPage.css'

const SITUATIONS = [
  ['unopened', 'Unopened', 'Folded to you: raise first in, limp, or fold.'],
  ['limped', 'After limpers', 'One or more players called the big blind before you.'],
  ['raised', 'Facing a raise', 'One raise before you: re-raise, call or fold.'],
  ['3bet', 'Facing a 3-bet', 'A raise and a re-raise before you.'],
  ['steal', 'Blinds against a steal', 'In a blind, the cutoff, button or small blind raised first in.'],
] as const
type Situation = (typeof SITUATIONS)[number][0]

const POSITIONS = ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']

const MODES: [GridMode, string][] = [
  ['actions', 'How you played'],
  ['frequency', 'How often you played'],
  ['composition', 'Share of your range'],
  ['results', 'Results'],
]

/** Below this many hands a cell's results are drawn faded: too few to say much. */
const FEW_HANDS = 10

/** A situation as conditions of a spot (FND-3). */
function conditionsOf(situation: Situation): SpotCondition[] {
  if (situation === 'steal') return [{ field: 'stat', value: 'fold_to_steal' }]
  return [{ field: 'situation', value: [situation] }]
}

/** How a hand went from a group: how often raised, called, played (either), its share of the range, its result. */
function cellsOf(groups: StatGroup[], mode: GridMode): Map<string, GridCell> {
  const played = groups.reduce((sum, group) => sum + group.first_actions.raise.did + group.first_actions.call.did, 0)
  const cells = new Map<string, GridCell>()
  for (const group of groups) {
    const raise = group.first_actions.raise.did
    const call = group.first_actions.call.did
    const hands = group.hands
    const share = (raise + call) / hands
    const counts = `${hands.toLocaleString()} ${hands === 1 ? 'hand' : 'hands'}`
    const bb100 = (group.net_bb / hands) * 100
    let cell: GridCell
    if (mode === 'results') {
      cell = {
        hands,
        value: bb100,
        figure: formatRate(bb100),
        text: `${group.key}: ${formatRate(bb100)} bb/100 over ${counts}`,
        unsure: hands < FEW_HANDS,
      }
    } else if (mode === 'composition') {
      const part = played ? (raise + call) / played : 0
      cell = {
        hands,
        value: part,
        figure: part ? `${(part * 100).toFixed(1)}` : '',
        text: `${group.key}: ${(part * 100).toFixed(1)}% of the hands you played here, ${raise + call} of ${played}`,
      }
    } else {
      cell = {
        hands,
        value: share,
        raise: raise / hands,
        call: call / hands,
        figure: `${Math.round(share * 100)}%`,
        text: `${group.key}: played ${Math.round(share * 100)}%, raised ${raise} and called ${call} of ${counts}`,
      }
    }
    cells.set(group.key, cell)
  }
  return cells
}

/**
 * Starting hands by position and situation (B2): what you played from each seat, on a 13×13 grid, against a
 * reference range [MIT 2: PokerTracker's range visualizer; MIT 5; JHU 3; JHU 4]. A cell opens its hands.
 */
function PreflopPage() {
  const scope = useScope()
  const tags = useHandTags()
  const { params, setFilters } = scope
  const situation = (SITUATIONS.find(([key]) => key === params.get('situation'))?.[0] ?? 'unopened') as Situation
  const position = POSITIONS.includes(params.get('position') ?? '') ? (params.get('position') as string) : ''
  const mode = (MODES.find(([key]) => key === params.get('mode'))?.[0] ?? 'actions') as GridMode
  const [reference, setReference] = useState<string>('')
  const savedRanges = useSavedRanges()

  const query = withConditions(apiScope(new URLSearchParams(scope.key)), conditionsOf(situation))
  const tagsWithPosition = [...(query.tag ?? []), ...(position ? [`position:${position}`] : [])]
  const asked: ScopeQuery = { ...query, tag: tagsWithPosition }
  // The last filters' grid stays on screen, faded, until the next one arrives; an upload refreshes it.
  const statsQuery = useQuery(queries.stats.groups({ ...asked, group_by: 'combo' }))
  const current: { error?: string; groups?: StatGroup[] } = statsQuery.error
    ? { error: errorMessage(statsQuery.error) }
    : { groups: statsQuery.data }
  const groups = current.groups
  const cells = useMemo(() => (groups ? cellsOf(groups, mode) : undefined), [groups, mode])
  const played = useMemo(
    () => new Set(groups?.filter((group) => group.first_actions.raise.did + group.first_actions.call.did > 0).map((g) => g.key)),
    [groups],
  )
  const presets: RangePreset[] = [
    ...COURSE_PRESETS,
    ...GROUP_PRESETS,
    ...[5, 10, 15, 20, 30, 40].map(topPreset),
    ...(savedRanges.ranges ?? []).map((saved) => ({
      key: `saved_${saved.id}`,
      label: saved.name,
      hands: parseRange(saved.hands),
      source: 'yours',
    })),
  ]
  const chosen = presets.find((preset) => preset.key === reference)
  const outside = chosen ? new Set([...played].filter((hand) => !chosen.hands.has(hand))) : undefined
  const situationText = SITUATIONS.find(([key]) => key === situation)?.[2]

  function cellUrl(hand: string) {
    if (!cells?.get(hand)) return undefined
    const filters = { tags: tagsWithPosition, since: query.since, until: query.until, spot: query.spot, spec: query.spec }
    return historyUrl(withConditions(filters, [{ field: 'hands', value: [hand] }]))
  }

  return (
    <section className="preflop">
      <header className="preflop-header">
        <h1>Starting hands</h1>
        <p>
          What you play from each seat and situation, hand by hand. Position, stack depth and the action before you
          come before your cards [JHU 3]; set a reference range beside your own to see where they part.
        </p>
      </header>
      <MyGameTabs />
      <ScopeFilters scope={scope} tags={tags} keep={['situation', 'position', 'mode']} />

      <div className="segmented preflop-situations" role="tablist" aria-label="Situation before you act">
        {SITUATIONS.map(([key, label]) => (
          <button key={key} type="button" role="tab" aria-selected={situation === key} onClick={() => setFilters({ situation: key })}>
            {label}
          </button>
        ))}
      </div>

      <div className="filter-bar" role="group" aria-label="The grid">
        <label>
          Position
          <select value={position} onChange={(event) => setFilters({ position: event.target.value })}>
            <option value="">Every position</option>
            {POSITIONS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Show
          <select value={mode} onChange={(event) => setFilters({ mode: event.target.value })}>
            {MODES.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Against
          <select value={reference} onChange={(event) => setReference(event.target.value)}>
            <option value="">No reference</option>
            <optgroup label="The courses' ranges">
              {COURSE_PRESETS.map((preset) => (
                <option key={preset.key} value={preset.key}>
                  {preset.label} [{preset.source}]
                </option>
              ))}
            </optgroup>
            <optgroup label="By equity against a random hand">
              {[5, 10, 15, 20, 30, 40].map((percent) => (
                <option key={percent} value={`top_${percent}_ranked`}>
                  Top {percent}%
                </option>
              ))}
            </optgroup>
            <optgroup label="Starting-hand groups [JHU 3; JHU 4]">
              {GROUP_PRESETS.map((preset) => (
                <option key={preset.key} value={preset.key}>
                  {preset.label}
                </option>
              ))}
            </optgroup>
            {savedRanges.ranges && savedRanges.ranges.length > 0 && (
              <optgroup label="Your ranges">
                {savedRanges.ranges.map((saved) => (
                  <option key={saved.id} value={`saved_${saved.id}`}>
                    {saved.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </label>
      </div>

      <section className="card" aria-labelledby="preflop-grid">
        <h2 id="preflop-grid" className="card-header">
          {SITUATIONS.find(([key]) => key === situation)?.[1]}
          {position ? `, ${position}` : ''}
        </h2>
        <div className={statsQuery.isPlaceholderData ? 'card-body is-updating' : 'card-body'}>
          <p className="card-hint">{situationText}</p>
          {current.error ? (
            <p className="error-message" role="alert">
              {current.error}
            </p>
          ) : cells && groups ? (
            groups.length === 0 ? (
              <p className="card-hint">No hold'em hands in this spot yet.</p>
            ) : (
              <div className="preflop-layout">
                <RangeGrid
                  mode={mode}
                  cells={cells}
                  reference={chosen?.hands}
                  outside={outside}
                  cellUrl={cellUrl}
                  label={`Your starting hands, ${MODES.find(([key]) => key === mode)?.[1].toLowerCase()}`}
                  legend={<Legend mode={mode} reference={chosen} />}
                />
                <Summary groups={groups} played={played} reference={chosen} outside={outside} />
              </div>
            )
          ) : (
            <p>Loading…</p>
          )}
          {cells && <RangeTable cells={cells} heading={mode === 'results' ? 'bb/100' : 'How it went'} />}
        </div>
      </section>

      <RangeBuilder played={played} saved={savedRanges} />
    </section>
  )
}

function Legend({ mode, reference }: { mode: GridMode; reference?: RangePreset }) {
  return (
    <>
      {mode === 'actions' && (
        <>
          <span>
            <span className="range-grid-swatch raise" aria-hidden="true" />
            Raised
          </span>
          <span>
            <span className="range-grid-swatch call" aria-hidden="true" />
            Called
          </span>
          <span>Empty: folded, or checked in the big blind. The figure is the share played.</span>
        </>
      )}
      {mode === 'frequency' && <span>Darker for hands you played more often; the figure is the share.</span>}
      {mode === 'composition' && <span>Darker for a bigger share of the hands you played here; figures in percent.</span>}
      {mode === 'results' && (
        <span>bb/100 by hand: green won, pink lost, darker for more. Faded with fewer than {FEW_HANDS} hands.</span>
      )}
      {reference && (
        <>
          <span>
            <span className="range-grid-swatch reference" aria-hidden="true" />
            In the reference
          </span>
          <span>
            <span className="range-grid-swatch outside" aria-hidden="true" />
            Played outside it
          </span>
        </>
      )}
    </>
  )
}

function Summary({
  groups,
  played,
  reference,
  outside,
}: {
  groups: StatGroup[]
  played: Set<string>
  reference?: RangePreset
  outside?: Set<string>
}) {
  const hands = groups.reduce((sum, group) => sum + group.hands, 0)
  const playedHands = groups.reduce((sum, group) => sum + group.first_actions.raise.did + group.first_actions.call.did, 0)
  const raised = groups.reduce((sum, group) => sum + group.first_actions.raise.did, 0)
  const pct = (part: number) => `${Math.round((part / (hands || 1)) * 100)}%`
  return (
    <div className="preflop-summary">
      <dl className="preflop-facts">
        <div>
          <dt>Hands</dt>
          <dd>{hands.toLocaleString()}</dd>
        </div>
        <div>
          <dt>Played</dt>
          <dd>
            {pct(playedHands)} <span>({playedHands.toLocaleString()})</span>
          </dd>
        </div>
        <div>
          <dt>Raised</dt>
          <dd>
            {pct(raised)} <span>({raised.toLocaleString()})</span>
          </dd>
        </div>
      </dl>
      {played.size > 0 && (
        <p className="card-hint">
          You played <code>{formatRange(played)}</code>: {shareText(played)}.
        </p>
      )}
      {reference && (
        <p className="card-hint">
          <strong>{reference.label}</strong>
          {reference.source && reference.source !== 'yours' ? ` [${reference.source}]` : ''}:{' '}
          {reference.claimed ? `the course says ${reference.claimed}; it is ` : ''}
          {shareText(reference.hands)}.{' '}
          {outside && outside.size > 0
            ? `You played ${outside.size} ${outside.size === 1 ? 'hand' : 'hands'} outside it: ${formatRange(outside)}.`
            : 'You played nothing outside it.'}
        </p>
      )}
    </div>
  )
}

/** The user's saved ranges (none to offer until they load, or if they don't), and telling the app one changed. */
function useSavedRanges() {
  const client = useQueryClient()
  const ranges = useQuery(queries.ranges()).data
  return { ranges, reload: () => changes.ranges(client) }
}

/** Building a range on the grid, or as notation, and saving it to set beside your own (FND-5). */
function RangeBuilder({ played, saved }: { played: Set<string>; saved: ReturnType<typeof useSavedRanges> }) {
  const [hands, setHands] = useState<Set<string>>(new Set())
  const [typed, setTyped] = useState<string>()
  const [name, setName] = useState('')
  const [error, setError] = useState<string>()
  const text = typed ?? formatRange(hands)
  const typedError = typed ? rangeError(typed) : undefined

  async function save() {
    setError(undefined)
    try {
      await rangesApi.rangesCreate({ name: name.trim(), hands: formatRange(hands) })
      setName('')
      saved.reload()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  async function remove(range: SavedRange) {
    try {
      await rangesApi.rangesDestroy({ id: range.id })
      saved.reload()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <section className="card" aria-labelledby="preflop-ranges">
      <h2 id="preflop-ranges" className="card-header">
        Your ranges
      </h2>
      <div className="card-body">
        <p className="card-hint">
          Pick hands by clicking or dragging across the grid, or type them, then save the range to set it beside
          what you play. {shareText(hands)}: {combosOf(hands).toLocaleString()} combos of 1,326.
        </p>
        <div className="preflop-layout">
          <RangeGrid
            mode="selection"
            selected={hands}
            onSelect={(next) => {
              setTyped(undefined)
              setHands(next)
            }}
            label="Build a range: click or drag across cells, or use the arrow keys and the space bar"
          />
          <div className="preflop-builder">
            <label>
              As notation
              <input
                type="text"
                value={text}
                aria-invalid={Boolean(typedError)}
                placeholder="TT+, AQs+, AKo"
                onChange={(event) => {
                  setTyped(event.target.value)
                  if (!rangeError(event.target.value)) setHands(parseRange(event.target.value))
                }}
                onBlur={() => setTyped(undefined)}
              />
              {typedError && <span className="error-message">{typedError}</span>}
            </label>
            <div className="preflop-builder-actions">
              <button type="button" className="link-button" onClick={() => setHands(new Set(played))} disabled={!played.size}>
                Start from what you played above
              </button>
              <button type="button" className="link-button" onClick={() => setHands(new Set())} disabled={!hands.size}>
                Clear
              </button>
            </div>
            <label>
              Name
              <input type="text" value={name} maxLength={80} placeholder="My cutoff opens" onChange={(e) => setName(e.target.value)} />
            </label>
            <button type="button" className="button" onClick={save} disabled={!hands.size || !name.trim()}>
              Save the range
            </button>
            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}
            {saved.ranges && saved.ranges.length > 0 && (
              <ul className="preflop-saved">
                {saved.ranges.map((range) => (
                  <li key={range.id}>
                    <button type="button" className="link-button" onClick={() => setHands(parseRange(range.hands))}>
                      {range.name}
                    </button>{' '}
                    <code>{range.hands}</code>{' '}
                    <button type="button" className="link-button" onClick={() => remove(range)} aria-label={`Delete ${range.name}`}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PreflopPage
