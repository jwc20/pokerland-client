import type { ReactNode } from 'react'
import type { AttemptResult, Feedback, Move, PracticeActionEnum, Scenario } from '../api/generated/data-contracts.ts'
import { formatBb } from '../handFormat.ts'
import { ACTION_LABELS, evText, fillAmounts, GRADE_LABELS, GRADING_INFO, percent, specAmount } from '../practice.ts'
import { shareText } from '../rangePresets.ts'
import { parseRange } from '../ranges.ts'
import type { Unit } from '../table.ts'
import RangeGrid from './RangeGrid.tsx'
import './FeedbackCard.css'

// A grade wears its status colour beside an icon and its name, never the colour alone.
const GRADE_ICONS = { good: '✓', acceptable: '≈', poor: '✕', ungraded: '○' }

/**
 * What an answer got: the grade, your choice beside the reference answer and how that answer was worked out, the
 * numbers that decide it, and in your own hand, what you did at the time and how it went. That comes last, after
 * the grade, so the result doesn't sway the review.
 */
function FeedbackCard({
  scenario,
  attempt,
  unit,
  actions,
}: {
  scenario: Scenario
  attempt: AttemptResult
  unit: Unit
  actions?: ReactNode
}) {
  const answer = attempt.answer
  const spec = scenario.spec
  const amount = (chips: number) => specAmount(spec, unit, chips)
  const grading = GRADING_INFO[attempt.grading]
  return (
    <section className={`feedback-card ${attempt.grade}`} aria-labelledby="feedback-grade" aria-live="polite">
      <header className="feedback-card-header">
        <h2 id="feedback-grade">
          <span className="feedback-card-icon" aria-hidden="true">
            {GRADE_ICONS[attempt.grade]}
          </span>
          {GRADE_LABELS[attempt.grade]}
        </h2>
        <span className="feedback-card-kind" title={grading.hint}>
          {grading.label}
        </span>
      </header>

      <div className="feedback-card-body">
        {spec.question.kind === 'choice' ? (
          <ChoiceAnswer options={spec.question.options ?? []} chosen={attempt.choice} answer={answer} amount={amount} />
        ) : spec.question.kind === 'range' ? (
          <RangeAnswer attempt={attempt} answer={answer} />
        ) : (
          <ActionAnswer attempt={attempt} answer={answer} amount={amount} />
        )}

        {answer.assumptions && <p className="feedback-card-note">Assuming: {answer.assumptions}</p>}
        <p className="feedback-card-note">{grading.hint}</p>

        {spec.question.kind !== 'range' && <Numbers answer={answer} amount={amount} />}

        {answer.you_did && answer.result && (
          <div className="feedback-card-history">
            <h3>In the hand</h3>
            <p>
              You {moveText(answer.you_did, amount)}. The hand went {handResult(answer.result.net_bb)}.
            </p>
          </div>
        )}
        {answer.they_did && answer.player && answer.result && (
          <div className="feedback-card-history">
            <h3>In the hand</h3>
            <p>
              {answer.player} {moveText(answer.they_did, amount)}. The hand went{' '}
              {handResult(answer.result.net_bb, answer.player)}.
            </p>
          </div>
        )}
      </div>

      {actions && <footer className="feedback-card-actions">{actions}</footer>}
    </section>
  )
}

function ChoiceAnswer({
  options,
  chosen,
  answer,
  amount,
}: {
  options: string[]
  chosen: number | null
  answer: Feedback
  amount: (chips: number) => string
}) {
  const right = answer.correct ?? -1
  return (
    <>
      <dl className="feedback-card-compare">
        <div>
          <dt>Your answer</dt>
          <dd>{chosen === null ? '—' : options[chosen]}</dd>
        </div>
        <div>
          <dt>The answer</dt>
          <dd>{options[right]}</dd>
        </div>
      </dl>
      {answer.formula && (
        <p className="feedback-card-formula">
          <code>{answer.formula}</code>
        </p>
      )}
      {answer.explanation && <p>{fillAmounts(answer.explanation, answer.amounts, amount)}</p>}
    </>
  )
}

function ActionAnswer({
  attempt,
  answer,
  amount,
}: {
  attempt: AttemptResult
  answer: Feedback
  amount: (chips: number) => string
}) {
  const yours = attempt.action ? actionLabel(attempt.action, answer) : '—'
  const sized =
    attempt.amount && yours !== 'All-in' ? ` ${attempt.action === 'bet' ? '' : 'to '}${amount(attempt.amount)}` : ''
  const advice = answer.advice
  return (
    <>
      <dl className="feedback-card-compare">
        <div>
          <dt>Your answer</dt>
          <dd>
            {yours}
            {sized}
          </dd>
        </div>
        {answer.best && (
          <div>
            <dt>The answer</dt>
            <dd>{answer.best.map((action) => actionLabel(action, answer)).join(' or ')}</dd>
          </div>
        )}
        {advice && (
          <div>
            <dt>The playbook</dt>
            <dd>
              {ACTION_LABELS[advice.action]}
              {advice.size !== null && advice.action === 'bet' && ` ${percent(advice.size)} of the pot`}
              {advice.to_bb !== null && advice.action === 'raise' && ` to ${formatBb(advice.to_bb, false)}`}
            </dd>
          </div>
        )}
      </dl>

      {answer.ev_bb && (
        <ul className="feedback-card-ev" aria-label="What each option was worth">
          {Object.entries(answer.ev_bb).map(([action, value]) => (
            <li key={action}>
              <span>{actionLabel(action, answer)}</span>
              <span>{evText(value)}</span>
            </li>
          ))}
        </ul>
      )}
      {attempt.ev_lost_bb !== null && attempt.ev_lost_bb > 0 && (
        <p>Your choice gave up {formatBb(attempt.ev_lost_bb, false)} against the best one.</p>
      )}
      {answer.explanation && <p>{answer.explanation}</p>}

      {answer.rule && (
        <blockquote className="feedback-card-rule">
          <p>
            <strong>
              Rule {answer.rule.number}. {answer.rule.rule}.
            </strong>{' '}
            {answer.rule.why}
          </p>
          <footer>[{answer.rule.source.join('; ')}]</footer>
        </blockquote>
      )}
      {answer.chart && answer.hand && <ChartCell chart={answer.chart} hand={answer.hand} />}
      {attempt.grading === 'reflection' && (
        <p>
          No rule settles this spot, so there is nothing to grade it against: weigh the numbers below, and what
          you knew about the players.
        </p>
      )}
    </>
  )
}

/** A range answer beside the stated range: the shares, the combos they have in common, and both on the grid. */
function RangeAnswer({ attempt, answer }: { attempt: AttemptResult; answer: Feedback }) {
  const yours = parseRange(attempt.hand_range)
  const stated = parseRange(answer.range ?? '')
  const overlap = attempt.overlap
  return (
    <>
      <dl className="feedback-card-compare">
        <div>
          <dt>Your range</dt>
          <dd>{yours.size ? shareText(yours) : 'No hands'}</dd>
        </div>
        <div>
          <dt>The stated range</dt>
          <dd>{shareText(stated)}</dd>
        </div>
        {attempt.score !== null && (
          <div>
            <dt>Overlap</dt>
            <dd>{percent(attempt.score)}</dd>
          </div>
        )}
      </dl>
      {overlap && (
        <p>
          {overlap.both.toLocaleString()} combos in both, {overlap.extra.toLocaleString()} only in yours and{' '}
          {overlap.missed.toLocaleString()} only in the stated range: the overlap is the combos in both ÷ those in
          either.
        </p>
      )}
      <div className="feedback-card-grid">
        <RangeGrid
          mode="selection"
          selected={yours}
          reference={stated}
          label="Your range, filled, against the stated range, ringed"
          legend={
            <>
              <span>
                <span className="range-grid-swatch picked" aria-hidden="true" />
                Your range
              </span>
              <span>
                <span className="range-grid-swatch reference" aria-hidden="true" />
                The stated range
              </span>
            </>
          }
        />
      </div>
      <p className="feedback-card-formula">
        <code>{answer.range}</code>
      </p>
      {answer.explanation && <p>{answer.explanation}</p>}
      {answer.their_hand && answer.player && (
        <p>
          {yours.has(answer.their_hand)
            ? `${answer.player}’s ${answer.their_hand} was in your range too.`
            : `${answer.player}’s ${answer.their_hand} wasn’t in your range.`}
        </p>
      )}
    </>
  )
}

/** The chart a preflop spot is graded by: its tier's hands on the grid, with yours ringed. */
function ChartCell({ chart, hand }: { chart: NonNullable<Feedback['chart']>; hand: string }) {
  return (
    <div className="feedback-card-chart">
      <h3>
        {chart.label}: {chart.tier_label.toLowerCase()}
      </h3>
      <p>
        <code>{chart.range}</code>: {chart.claimed} in the lecture, {(chart.share * 100).toFixed(1)}% of hands
        exactly [{chart.tier_source}]. {chart.applies_to}.
      </p>
      <div className="feedback-card-grid">
        <RangeGrid
          mode="selection"
          selected={parseRange(chart.range)}
          reference={new Set([hand])}
          label={`The chart's hands, filled, with your hand, ${hand}, ringed`}
          legend={
            <>
              <span>
                <span className="range-grid-swatch picked" aria-hidden="true" />
                The chart plays it
              </span>
              <span>
                <span className="range-grid-swatch reference" aria-hidden="true" />
                Your hand: {hand}
              </span>
            </>
          }
        />
      </div>
    </div>
  )
}

/** The numbers that decide the spot, from the decision panel's arithmetic. */
function Numbers({ answer, amount }: { answer: Feedback; amount: (chips: number) => string }) {
  const numbers = answer.context
  if (!numbers) return null
  const facts: [string, string][] = []
  if (numbers.to_call > 0 && numbers.equity_needed !== null) {
    facts.push(['To call', amount(numbers.to_call)], ['Pot if you call', amount(numbers.pot_if_call)])
    facts.push(['Equity needed', percent(numbers.equity_needed)])
  }
  if (numbers.mdf !== null) facts.push(['Defend (MDF)', percent(numbers.mdf)])
  if (answer.equity !== undefined) facts.push(['Your equity', percent(answer.equity)])
  if (answer.advice && answer.advice.outs > 0) {
    facts.push(['Outs', `${answer.advice.outs}, ${percent(answer.advice.draw_equity)} to come`])
  }
  facts.push(['Effective stack', formatBb(numbers.effective_bb, false)])
  if (numbers.spr !== null) facts.push(['SPR', numbers.spr.toLocaleString(undefined, { maximumFractionDigits: 1 })])
  if (numbers.made) facts.push(['Your hand', numbers.made.replaceAll('_', ' ')])
  return (
    <dl className="feedback-card-numbers">
      {facts.map(([term, value]) => (
        <div key={term}>
          <dt>{term}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** An action's name; a push-or-fold spot's raise is all-in. */
function actionLabel(action: string, answer: Feedback) {
  if (action === 'raise' && answer.ev_bb?.raise !== undefined) return 'All-in'
  return ACTION_LABELS[action as PracticeActionEnum] ?? action
}

function moveText(move: Move, amount: (chips: number) => string) {
  const allIn = move.all_in ? ', all-in' : ''
  switch (move.action) {
    case 'fold':
      return 'folded'
    case 'check':
      return 'checked'
    case 'call':
      return `called ${amount(move.amount ?? 0)}${allIn}`
    case 'bet':
      return `bet ${amount(move.amount ?? 0)}${allIn}`
    case 'raise':
      return `raised to ${amount(move.to ?? 0)}${allIn}`
  }
}

/** How a hand went for you, or for the player whose seat a spot was in. */
function handResult(bb: number, player?: string) {
  const [way, against, who] = player ? ['their way', 'against them', player] : ['your way', 'against you', 'you']
  if (bb > 0) return `${way}: ${who} won ${formatBb(bb, false)}`
  if (bb < 0) return `${against}: ${who} lost ${formatBb(-bb, false)}`
  return `level: ${who} broke even`
}

export default FeedbackCard
