import { useMemo } from 'react'
import type { Outcome } from '../api/generated/data-contracts.ts'
import { streetLabel } from '../handFormat.ts'
import { buildReplay } from '../replay.ts'
import { formatUnit, type Unit } from '../table.ts'
import { useReplayPlayer } from '../useReplayPlayer.ts'
import PokerTable from './PokerTable.tsx'
import ReplayControls from './ReplayControls.tsx'
import './HandOutcome.css'

/**
 * What happened at the table, once a spot from one of your hands is answered (My hands, their seat): the hand plays
 * on from the decision, a step at a time, from the move made then to the showdown, and who won and lost what. It
 * opens on that move; the steps before it are the spot's own.
 */
function HandOutcome({
  outcome,
  labels,
  unit,
  fourColour,
}: {
  outcome: Outcome
  labels: 'names' | 'positions'
  unit: Unit
  fourColour: boolean
}) {
  const { hand, decision } = outcome
  const money = (chips = 0) => formatUnit(chips, hand.currency, hand.big_blind, unit)
  const steps = useMemo(
    () => buildReplay(hand, (chips = 0) => formatUnit(chips, hand.currency, hand.big_blind, unit)),
    [hand, unit],
  )
  const player = useReplayPlayer(steps.length, decision + 1)
  const step = steps[player.index]
  const results = hand.players.filter((row) => row.net !== 0).sort((a, b) => b.net - a.net)

  return (
    <section className="hand-outcome" aria-labelledby="hand-outcome-heading">
      <h3 id="hand-outcome-heading">What happened at the table</h3>
      <PokerTable step={step} hand={hand} labels={labels} unit={unit} fourColour={fourColour} />
      <p className="practice-spot-log" aria-live="polite">
        {player.index <= decision ? 'The decision, as it stood' : `${streetLabel(step.street)} – ${step.text}`}
      </p>
      <ReplayControls player={player} />
      <ol className="hand-outcome-log" aria-label="Every move from the decision on">
        {steps.slice(decision + 1).map((after, i) => {
          const at = decision + 1 + i
          return (
            <li key={at}>
              <button
                type="button"
                className="link-button"
                aria-current={at === player.index ? 'step' : undefined}
                onClick={() => player.seek(at)}
              >
                {streetLabel(after.street)} – {after.text}
              </button>
              {i === 0 && <span className="hand-outcome-then"> (what was played then)</span>}
            </li>
          )
        })}
      </ol>
      {results.length > 0 && (
        <p className="hand-outcome-result">
          <strong>Result:</strong>{' '}
          {results.map((row, i) => (
            <span key={row.name} className={row.net > 0 ? 'win' : 'loss'}>
              {i > 0 && ', '}
              {row.name === hand.hero ? `${row.name} (this seat)` : row.name} {row.net > 0 ? 'won' : 'lost'}{' '}
              {money(Math.abs(row.net))}
            </span>
          ))}
          .
        </p>
      )}
    </section>
  )
}

export default HandOutcome
