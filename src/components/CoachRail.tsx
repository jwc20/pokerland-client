import type { MatchState, WhyEnum } from '../api/generated/data-contracts.ts'
import { STAGES } from '../coach.ts'
import { formatBb } from '../handFormat.ts'
import './CoachRail.css'

const DEPARTURES: { why: WhyEnum; label: string }[] = [
  { why: 'read', label: 'A read on them' },
  { why: 'price', label: 'The price' },
  { why: 'stack', label: 'The stack depth' },
  { why: 'felt', label: 'Felt like it' },
]

/**
 * The coach's rail beside the table: the stage of the decision's rule family, the coach's line, the rule in play
 * once the stage allows it, and at stage 3 and up a button to ask, which is counted. After a hand it carries the
 * coach's one comment, and asks once why you left a rule.
 */
function CoachRail({
  state,
  busy,
  onAsk,
  onDeparture,
  compact = false,
}: {
  state: MatchState
  busy: boolean
  onAsk: () => void
  onDeparture: (why: WhyEnum) => void
  /** The phone layout's: just above the moves, in place of the rail. */
  compact?: boolean
}) {
  const { decision } = state
  const stage = decision?.stage
  const heading = compact ? 'coach-line-heading' : 'coach-rail-heading'
  return (
    <section className={compact ? 'coach-rail compact' : 'coach-rail'} aria-labelledby={heading} aria-live="polite">
      <header>
        <h2 id={heading}>Coach</h2>
        {decision && (
          <span className="coach-rail-stage" title={`${STAGES[decision.stage].coach} ${STAGES[decision.stage].you}`}>
            {decision.family_label} · stage {decision.stage}: {decision.stage_name}
          </span>
        )}
      </header>

      {decision ? (
        <div className="coach-rail-body">
          <p className="coach-rail-situation">{decision.situation}</p>
          {/* Once you have said what you would do: the coach's verdict first, then why. */}
          {decision.intent && (
            <div className={decision.intent.kept ? 'coach-rail-intent kept' : 'coach-rail-intent'}>
              <p>{decision.intent.line}</p>
              {decision.intent.reason_note && <p className="coach-rail-reason">{decision.intent.reason_note}</p>}
            </div>
          )}
          {decision.prompt && <p className="coach-rail-line">{decision.prompt}</p>}
          {decision.rule && (
            <p className="coach-rail-rule">
              Rule in play ▸ <strong>{decision.rule.rule}</strong>
              <span>Rule {decision.rule.number}</span>
            </p>
          )}
          {decision.advice && !decision.rule && decision.advice.verdict !== 'clear' && (
            <p className="coach-rail-rule">No rule settles this one: it doesn’t count either way.</p>
          )}
          {stage !== undefined && stage >= 3 && !decision.advice && (
            <button type="button" className="link-button" disabled={busy} onClick={onAsk}>
              Ask the coach
            </button>
          )}
        </div>
      ) : (
        <div className="coach-rail-body">
          {state.hand_over && state.hand_net_bb !== null && (
            <p className="coach-rail-situation">
              Hand {state.hand_number}:{' '}
              {state.hand_net_bb === 0
                ? 'level.'
                : `you ${state.hand_net_bb > 0 ? 'won' : 'lost'} ${formatBb(Math.abs(state.hand_net_bb), false)}.`}
            </p>
          )}
          {state.after_hand && <p className="coach-rail-line">{state.after_hand.line}</p>}
          {!state.after_hand && state.hand_over && !state.finished && (
            <p className="coach-rail-quiet">The coach has nothing to add.</p>
          )}
        </div>
      )}

      {state.departure && (
        <div className="coach-rail-departure" role="group" aria-label="Why you left the rule">
          <p>
            You left the playbook {state.departure.street === 'preflop' ? 'before the flop' : `on the ${state.departure.street}`}{' '}
            there. Why?
          </p>
          <div>
            {DEPARTURES.map((option) => (
              <button key={option.why} type="button" disabled={busy} onClick={() => onDeparture(option.why)}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default CoachRail
