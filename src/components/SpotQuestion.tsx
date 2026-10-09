import { useEffect, useEffectEvent, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Outcome, PracticeActionEnum, ReasonEnum, Scenario } from '../api/generated/data-contracts.ts'
import { heroM, pendingDecision } from '../decision.ts'
import { streetLabel } from '../handFormat.ts'
import { fillAmounts, specAmount } from '../practice.ts'
import { buildReplay } from '../replay.ts'
import { formatUnit, type Unit } from '../table.ts'
import ActionBar from './ActionBar.tsx'
import HandOutcome from './HandOutcome.tsx'
import { SpotPanel } from './DecisionPanel.tsx'
import PokerTable from './PokerTable.tsx'
import RangePicker from './RangePicker.tsx'
import ReasonPicker from './ReasonPicker.tsx'
import './SpotQuestion.css'

/** An answer to a spot, as the attempts and the test's answers take it. */
export interface SpotAnswer {
  action?: PracticeActionEnum
  amount?: number
  choice?: number
  hand_range?: string
  reason?: ReasonEnum
  confidence?: number
  /** Seconds since the spot was shown, to a tenth. */
  time_taken: number
}

/**
 * A practice spot as it is asked: the prompt, the table as it stood (or a toy game's setup in words), the decision
 * panel beside it in study mode, and a way to answer: a move, a choice of up to four (or keys 1 to 4), or a range on
 * the grid. Once answered, `children` (the feedback, in a set) stand where the answer was; and with an `outcome`, a
 * spot from one of your hands plays on at the table from the decision to the end.
 */
function SpotQuestion({
  scenario,
  heading,
  unit,
  fourColour,
  study,
  answered,
  outcome,
  busy,
  onAnswer,
  children,
}: {
  scenario: Scenario
  /** Above the prompt: "Spot 3 of 8", and anything else to say. */
  heading: string
  unit: Unit
  fourColour: boolean
  /** Study mode: the decision panel may show. A test keeps it off. */
  study: boolean
  answered: boolean
  /** Once answered, a spot from one of your hands: what was played at the table, and how it ended. */
  outcome?: Outcome | null
  busy: boolean
  onAnswer: (answer: SpotAnswer) => void
  children?: ReactNode
}) {
  const spec = scenario.spec
  // A spot with no table, such as a toy game, has its setup in words instead.
  const hand = spec.hand
  const amount = (chips = 0) => specAmount(spec, unit, chips)
  const steps = useMemo(
    () => (hand ? buildReplay(hand, (chips = 0) => formatUnit(chips, hand.currency, hand.big_blind, unit)) : []),
    [hand, unit],
  )
  const step = steps.at(-1)
  const decision = useMemo(() => (hand ? pendingDecision(hand, steps) : undefined), [hand, steps])
  const [panel, setPanel] = useState(true)
  const [reason, setReason] = useState<ReasonEnum>()
  const [confidence, setConfidence] = useState<number>()
  const shownAt = useRef(0)
  const showPanel = study && spec.panel && Boolean(decision)

  useEffect(() => {
    shownAt.current = performance.now()
  }, [])

  function send(answer: Omit<SpotAnswer, 'time_taken'>) {
    if (busy || answered) return
    onAnswer({ ...answer, time_taken: Math.round((performance.now() - shownAt.current) / 100) / 10 })
  }

  // 1 to 4 answer a choice.
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    if (answered || spec.question.kind !== 'choice' || target.closest('input, select, textarea')) return
    const index = Number(event.key) - 1
    if (index >= 0 && index < (spec.question.options?.length ?? 0)) {
      event.preventDefault()
      send({ choice: index })
    }
  })
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="practice-spot">
      <div className="practice-spot-heading">
        <p className="practice-spot-count">
          {heading}
          {step && ` · ${streetLabel(step.street)}`}
          {spec.title && ` · ${spec.title}`}
          {spec.credit && ` [${spec.credit}]`}
        </p>
        {!hand && spec.setup && <p className="practice-spot-setup">{spec.setup}</p>}
        <h2 className="practice-prompt">{fillAmounts(spec.question.prompt, spec.question.amounts, amount)}</h2>
      </div>

      {hand && step && (
        <div className={showPanel && panel ? 'practice-spot-main with-panel' : 'practice-spot-main'}>
          <div className="practice-spot-table">
            {answered && outcome ? (
              <HandOutcome outcome={outcome} labels={spec.labels} unit={unit} fourColour={fourColour} />
            ) : (
              <>
                <PokerTable
                  step={step}
                  hand={hand}
                  labels={spec.labels}
                  unit={unit}
                  revealed={spec.revealed}
                  actor={answered || spec.question.kind !== 'action' ? undefined : hand.hero}
                  fourColour={fourColour}
                />
                <p className="practice-spot-log" aria-live="polite">
                  {streetLabel(step.street)} – {step.text}
                </p>
                <details className="practice-spot-history">
                  <summary>Hand log</summary>
                  <ol>
                    {steps.slice(1).map((past, i) => (
                      <li key={i}>
                        {streetLabel(past.street)} – {past.text}
                      </li>
                    ))}
                  </ol>
                </details>
              </>
            )}
          </div>
          {showPanel && panel && decision && <SpotPanel decision={decision} hand={hand} m={heroM(hand)} />}
        </div>
      )}

      {children}

      {!answered &&
        (spec.question.kind === 'choice' ? (
          <div className="practice-choices" role="group" aria-label="Answers">
            {(spec.question.options ?? []).map((option, i) => (
              <button key={option} type="button" disabled={busy} onClick={() => send({ choice: i })}>
                <span className="practice-choice-key">{i + 1}</span>
                {option}
              </button>
            ))}
          </div>
        ) : spec.question.kind === 'range' ? (
          <RangePicker disabled={busy} onSubmit={(notation) => send({ hand_range: notation })} />
        ) : (
          spec.legal &&
          hand &&
          step && (
            <div className="practice-answer">
              <ReasonPicker value={reason} onChange={setReason} />
              <Confidence value={confidence} onChange={setConfidence} />
              <ActionBar
                legal={spec.legal}
                pot={step.seats.reduce((sum, seat) => sum + seat.bet, step.pot)}
                currency={hand.currency}
                bigBlind={hand.big_blind}
                unit={unit}
                allInOnly={spec.question.all_in_only}
                disabled={busy}
                onAct={(action, chips) => send({ action, amount: chips, reason, confidence })}
              />
            </div>
          )
        ))}

      {showPanel && (
        <button type="button" className="link-button practice-panel-toggle" onClick={() => setPanel(!panel)}>
          {panel ? 'Hide the numbers' : 'Show the numbers'}
        </button>
      )}
    </div>
  )
}

/** How sure you are, 1 to 5: kept with the answer, for the spots no answer can check. */
function Confidence({ value, onChange }: { value?: number; onChange: (value?: number) => void }) {
  return (
    <fieldset className="practice-confidence">
      <legend>
        How sure? <span>(optional)</span>
      </legend>
      {[1, 2, 3, 4, 5].map((level) => (
        <label key={level}>
          <input
            type="radio"
            name="confidence"
            checked={value === level}
            onChange={() => onChange(level)}
            onClick={() => value === level && onChange(undefined)}
          />
          {level}
        </label>
      ))}
    </fieldset>
  )
}

export default SpotQuestion
