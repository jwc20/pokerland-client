import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { HANDS, cellOf, handAt } from '../ranges.ts'
import './RangeGrid.css'

/**
 * What the grid shows (FND-5): how often you took an action when you could, what share of a range each hand
 * makes up [MIT 2: PokerTracker's Value and Range modes], your results by hand, how you played each hand (raise,
 * call, the rest folded), or a range being picked.
 */
export type GridMode = 'frequency' | 'composition' | 'results' | 'actions' | 'selection'

export interface GridCell {
  /** The hands behind it. */
  hands: number
  /** frequency and composition: a share from 0 to 1; results: bb/100. */
  value?: number
  /** actions: the shares raised and called, from 0 to 1; the rest is folded or checked. */
  raise?: number
  call?: number
  /** A short figure in the cell, like "75%". */
  figure?: string
  /** The whole readout, for the tooltip and screen readers, values first: "75% raised, 3 of 4 hands". */
  text: string
  /** Too few hands to trust: drawn faded. */
  unsure?: boolean
}

/** The steps of the fill: a share's quarter, or a result's side and size. */
function step(value: number, top: number) {
  return Math.min(4, Math.max(1, Math.ceil((4 * Math.abs(value)) / (top || 1))))
}

function fillClass(mode: GridMode, cell: GridCell | undefined, top: number) {
  if (!cell || cell.value === undefined) return ''
  if (mode === 'results') {
    if (cell.value === 0) return 'even'
    return `${cell.value > 0 ? 'win' : 'loss'}-${step(cell.value, top)}`
  }
  if (mode === 'frequency' || mode === 'composition') return cell.value > 0 ? `share-${step(cell.value, top)}` : 'none'
  return ''
}

/**
 * The 13×13 starting-hand grid: pairs on the diagonal, suited hands above it, offsuit below. Each cell carries a
 * figure and a readout; arrow keys move between cells. With `cellUrl`, a cell opens its hands. In `selection` mode a
 * click, a drag or the space bar picks hands. `reference` outlines a preset's hands, and `outside` marks the
 * hands played outside it (B2).
 */
function RangeGrid({
  mode,
  cells,
  selected,
  onSelect,
  reference,
  outside,
  cellUrl,
  label,
  legend,
}: {
  mode: GridMode
  cells?: Map<string, GridCell>
  selected?: Set<string>
  onSelect?: (hands: Set<string>) => void
  reference?: Set<string>
  outside?: Set<string>
  cellUrl?: (hand: string) => string | undefined
  label: string
  legend?: ReactNode
}) {
  const navigate = useNavigate()
  const [focus, setFocus] = useState('AA')
  const [tip, setTip] = useState<{ hand: string; x: number; y: number }>()
  const painting = useRef<{ add: boolean; next: Set<string> }>(undefined)
  const frame = useRef<HTMLDivElement>(null)
  const values = [...(cells?.values() ?? [])].flatMap((cell) => (cell.value === undefined ? [] : [Math.abs(cell.value)]))
  const top = Math.max(0, ...values)
  const selecting = mode === 'selection' && onSelect

  function show(hand: string, element: HTMLElement) {
    const box = element.getBoundingClientRect()
    const outer = frame.current?.getBoundingClientRect()
    if (!outer) return
    setTip({ hand, x: box.left - outer.left + box.width / 2, y: box.top - outer.top })
  }

  function paint(hand: string) {
    const state = painting.current
    if (!state || !onSelect) return
    if (state.add) state.next.add(hand)
    else state.next.delete(hand)
    onSelect(new Set(state.next))
  }

  function onPointerDown(event: PointerEvent<HTMLElement>, hand: string) {
    if (!selecting || !selected) return
    event.preventDefault()
    painting.current = { add: !selected.has(hand), next: new Set(selected) }
    paint(hand)
    window.addEventListener('pointerup', () => (painting.current = undefined), { once: true })
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>, hand: string) {
    const [row, column] = cellOf(hand)
    const moves: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    }
    const move = moves[event.key]
    if (move) {
      event.preventDefault()
      const next = handAt(Math.min(12, Math.max(0, row + move[0])), Math.min(12, Math.max(0, column + move[1])))
      setFocus(next)
      const element = frame.current?.querySelector<HTMLElement>(`[data-hand="${next}"]`)
      element?.focus()
      return
    }
    if ((event.key === ' ' || event.key === 'Enter') && selecting && selected) {
      event.preventDefault()
      const next = new Set(selected)
      if (next.has(hand)) next.delete(hand)
      else next.add(hand)
      onSelect(next)
      return
    }
    const to = cellUrl?.(hand)
    if (event.key === 'Enter' && to) navigate(to)
  }

  const tipCell = tip && cells?.get(tip.hand)
  return (
    <figure className={`range-grid ${mode}`} aria-label={label}>
      <div className="range-grid-frame" ref={frame} onPointerLeave={() => setTip(undefined)}>
        <div className="range-grid-cells" role="grid" aria-label={label}>
          {Array.from({ length: 13 }, (_, row) => (
            <div key={row} role="row" className="range-grid-row">
              {Array.from({ length: 13 }, (_, column) => {
                const hand = handAt(row, column)
                const cell = cells?.get(hand)
                const picked = selected?.has(hand)
                const classes = [
                  'range-grid-cell',
                  row === column ? 'pair' : row < column ? 'suited' : 'offsuit',
                  fillClass(mode, cell, top),
                  picked && 'picked',
                  cell?.unsure && 'unsure',
                  reference?.has(hand) && 'reference',
                  outside?.has(hand) && 'outside',
                  cellUrl?.(hand) && 'linked',
                ]
                const readout = mode === 'selection' ? `${hand}: ${picked ? 'in the range' : 'not in it'}` : (cell?.text ?? `${hand}: no hands`)
                return (
                  <div
                    key={hand}
                    role="gridcell"
                    data-hand={hand}
                    className={classes.filter(Boolean).join(' ')}
                    tabIndex={hand === focus ? 0 : -1}
                    aria-label={readout}
                    aria-selected={mode === 'selection' ? Boolean(picked) : undefined}
                    onFocus={(event) => {
                      setFocus(hand)
                      show(hand, event.currentTarget)
                    }}
                    onBlur={() => setTip(undefined)}
                    onPointerEnter={(event) => {
                      show(hand, event.currentTarget)
                      if (painting.current) paint(hand)
                    }}
                    onPointerDown={(event) => onPointerDown(event, hand)}
                    onClick={() => {
                      const to = !selecting && cellUrl?.(hand)
                      if (to) navigate(to)
                    }}
                    onKeyDown={(event) => onKeyDown(event, hand)}
                  >
                    {mode === 'actions' && cell && (
                      <span className="range-grid-actions" aria-hidden="true">
                        <span className="call" style={{ height: `${(cell.call ?? 0) * 100}%` }} />
                        <span className="raise" style={{ height: `${(cell.raise ?? 0) * 100}%` }} />
                      </span>
                    )}
                    <span className="range-grid-hand" aria-hidden="true">
                      {hand}
                    </span>
                    {cell?.figure && mode !== 'selection' && (
                      <span className="range-grid-figure" aria-hidden="true">
                        {cell.figure}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        {tip && (
          <div className="range-grid-tip" style={{ left: tip.x, top: tip.y }} aria-hidden="true">
            {mode === 'selection' ? (
              <>
                <strong>{tip.hand}</strong> {selected?.has(tip.hand) ? 'in the range' : 'not in it'}
              </>
            ) : tipCell ? (
              tipCell.text
            ) : (
              `${tip.hand}: no hands`
            )}
          </div>
        )}
      </div>
      {legend && <figcaption className="range-grid-legend">{legend}</figcaption>}
    </figure>
  )
}

/** The cells with hands in a table, so no value lives only in a colour or a tooltip. */
export function RangeTable({ cells, heading }: { cells: Map<string, GridCell>; heading: string }) {
  const rows = HANDS.filter((hand) => cells.get(hand)?.hands)
  if (!rows.length) return null
  return (
    <details className="range-grid-table">
      <summary>Show as a table</summary>
      <div className="history-table-scroll">
        <table className="history-table">
          <thead>
            <tr>
              <th scope="col">Hand</th>
              <th scope="col">Hands</th>
              <th scope="col">{heading}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((hand) => {
              const cell = cells.get(hand)!
              return (
                <tr key={hand}>
                  <th scope="row">{hand}</th>
                  <td>{cell.hands.toLocaleString()}</td>
                  <td>{cell.text.slice(cell.text.indexOf(':') + 1).trim()}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </details>
  )
}

export default RangeGrid
