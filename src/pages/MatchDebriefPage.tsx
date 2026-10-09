import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router'
import { errorMessage } from '../api/client.ts'
import type { Debrief, DebriefDecision, PlaybookDetail } from '../api/generated/data-contracts.ts'
import { queries } from '../api/queries.ts'
import PokerTable from '../components/PokerTable.tsx'
import { ShareBar } from '../components/StatTile.tsx'
import { STAGES } from '../coach.ts'
import { cardsText, formatBb, streetLabel } from '../handFormat.ts'
import { formatPct } from '../playerStats.ts'
import { ACTION_LABELS, DID, STYLE_LABELS } from '../practice.ts'
import { buildReplay } from '../replay.ts'
import { useUnit } from '../useUnit.ts'
import './MatchDebriefPage.css'

const DEPARTURES: Record<string, string> = {
  read: 'a read on them',
  price: 'the price',
  stack: 'the stack depth',
  felt: 'it felt right',
}

const PICKED = {
  departure: 'Your biggest departure from the playbook',
  best: 'Your best decision',
  closest: 'Your closest one',
}

/**
 * The debrief after a coached match, the result last: one thing to fix, three hands to look at, by the book, your
 * read against the truth, luck and play apart, what moved, and what goes back to practice.
 */
function MatchDebriefPage() {
  const { id = '' } = useParams()
  const valid = /^\d+$/.test(id)
  // A finished match's debrief and its playbook never change: one fetch serves every visit.
  const query = useQuery({ ...queries.practice.debrief(Number(id)), enabled: valid })
  const current: { debrief?: Debrief; playbook?: PlaybookDetail; error?: string } | undefined = !valid
    ? { error: 'Not found.' }
    : query.error
      ? { error: errorMessage(query.error) }
      : query.data
  return (
    <section className="debrief">
      <Link className="back-link" to="/practice/match/new">
        ← Coached matches
      </Link>
      <h1>Debrief</h1>
      {current?.debrief && current.playbook ? (
        <DebriefView debrief={current.debrief} playbook={current.playbook} />
      ) : current?.error ? (
        <p className="error-message" role="alert">
          {current.error}
        </p>
      ) : (
        <p>Loading…</p>
      )}
    </section>
  )
}

function DebriefView({ debrief, playbook }: { debrief: Debrief; playbook: PlaybookDetail }) {
  const rules = new Map(playbook.rules.map((rule) => [rule.id, rule]))
  const { read, luck } = debrief
  return (
    <>
      <section className="card" aria-labelledby="debrief-fix">
        <h2 id="debrief-fix" className="card-header">
          1. One thing to fix
        </h2>
        <div className="card-body">
          {debrief.fix ? (
            <>
              <p>
                <strong>{debrief.fix.label}</strong>: you left the playbook {debrief.fix.misses}{' '}
                {debrief.fix.misses === 1 ? 'time' : 'times'}.
                {debrief.fix.rule &&
                  ` Rule ${debrief.fix.rule.number}: ${debrief.fix.rule.rule}. ${debrief.fix.rule.why}`}
              </p>
              <Picked decision={debrief.fix.decision} title="The hand that shows it best" />
            </>
          ) : (
            <p>Nothing: every decision a rule settled, you played by the book.</p>
          )}
        </div>
      </section>

      <section className="card" aria-labelledby="debrief-hands">
        <h2 id="debrief-hands" className="card-header">
          2. Three hands to look at
        </h2>
        <div className="card-body debrief-picked">
          {debrief.hands.length ? (
            debrief.hands.map((hand) => <Picked key={hand.kind} decision={hand} title={PICKED[hand.kind]} />)
          ) : (
            <p>No decisions to look at.</p>
          )}
        </div>
      </section>

      <section className="card" aria-labelledby="debrief-book">
        <h2 id="debrief-book" className="card-header">
          3. By the book
        </h2>
        <div className="card-body">
          <div className="debrief-book">
            {debrief.book.map((row) => {
              const rule = rules.get(row.rule)
              const shown =
                row.pct !== null && row.ci_low !== null && row.ci_high !== null
                  ? { did: row.did, could: row.could, pct: row.pct, ci_low: row.ci_low, ci_high: row.ci_high }
                  : undefined
              return (
                <div key={row.rule} className="debrief-book-row">
                  <span className="debrief-book-rule">
                    {rule ? `${rule.number}. ${rule.rule}` : row.rule}
                  </span>
                  {shown ? <ShareBar stat={shown} /> : <span />}
                  <span className="debrief-book-sample">
                    kept {row.did} of {row.could}
                    {shown && ` · ${formatPct(shown.ci_low)}–${formatPct(shown.ci_high)}`}
                  </span>
                </div>
              )
            })}
          </div>
          {!debrief.book.length && <p>No rule came up.</p>}
        </div>
      </section>

      <section className="card" aria-labelledby="debrief-read">
        <h2 id="debrief-read" className="card-header">
          4. Your read against the truth
        </h2>
        <div className="card-body">
          <p>
            The bot was a <strong>{STYLE_LABELS[read.style].toLowerCase()}</strong> whose leak was:{' '}
            <strong>{read.leak_label.toLowerCase()}</strong>.
          </p>
          <ul className="debrief-truth">
            <li className={read.found ? 'right' : 'wrong'}>
              <span aria-hidden="true">{read.found ? '✓' : '✕'}</span>{' '}
              {read.found
                ? `${read.found_by === 'coach' ? 'The coach' : 'You'} found the leak after hand ${read.found_hand}.`
                : 'The leak wasn’t found.'}
            </li>
            <li className={read.label_right ? 'right' : 'wrong'}>
              <span aria-hidden="true">{read.label_right ? '✓' : '✕'}</span>{' '}
              {read.label ? labelText(read.label, read.label_right, read.label_hand) : 'No label on the card.'}
            </li>
            {read.wrong.length > 0 && (
              <li className="wrong">
                <span aria-hidden="true">✕</span> Reads it didn’t have: {read.wrong.join('; ').toLowerCase()}.
              </li>
            )}
          </ul>
        </div>
      </section>

      <section className="card" aria-labelledby="debrief-luck">
        <h2 id="debrief-luck" className="card-header">
          5. Luck and play, apart
        </h2>
        <div className="card-body">
          <p>
            You won {formatBb(luck.actual_bb)}. When the money went in you could expect {formatBb(luck.expected_bb)}:{' '}
            {luck.luck_bb === 0
              ? 'no all-in ran either way.'
              : `you ran ${formatBb(Math.abs(luck.luck_bb), false)} ${luck.luck_bb > 0 ? 'above' : 'below'} expectation.`}
          </p>
          {luck.all_ins.length > 0 && (
            <ul className="debrief-list">
              {luck.all_ins.map((all) => (
                <li key={all.hand}>
                  Hand {all.hand}: all-in with {formatPct(all.equity * 100)}, worth {formatBb(all.expected_bb)}; it went{' '}
                  {formatBb(all.net_bb)}.
                </li>
              ))}
            </ul>
          )}
          {luck.coolers.map((hand) => (
            <p key={hand}>Hand {hand} was a cooler: every decision was by the book, and you still lost a stack.</p>
          ))}
        </div>
      </section>

      <section className="card" aria-labelledby="debrief-moved">
        <h2 id="debrief-moved" className="card-header">
          6. What moved
        </h2>
        <div className="card-body">
          {debrief.pinned && <p>The coach was pinned to a stage, so no rule family moved.</p>}
          <ul className="debrief-list">
            {debrief.moved.map((family) => (
              <li key={family.family}>
                {family.label}:{' '}
                {family.end === family.start
                  ? `stage ${family.start}, ${STAGES[family.start].name.toLowerCase()}`
                  : `stage ${family.start} to ${family.end}, ${STAGES[family.end].name.toLowerCase()}`}
                {family.end > family.start && ' ↑'}
                {family.end < family.start && ' ↓'}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card" aria-labelledby="debrief-sent">
        <h2 id="debrief-sent" className="card-header">
          7. Back to practice
        </h2>
        <div className="card-body">
          <p>{sentText(debrief.sent.count, debrief.sent.due)}</p>
        </div>
      </section>

      <section className="card debrief-result" aria-labelledby="debrief-result">
        <h2 id="debrief-result" className="card-header">
          The result
        </h2>
        <div className="card-body">
          <p>
            {debrief.hands_played} hands: {formatBb(debrief.result_bb ?? 0)} in starting big blinds.
          </p>
          <div className="debrief-actions">
            <Link className="button" to="/practice/match/new">
              Another match
            </Link>
            <Link className="link-button" to="/practice">
              Today’s set
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

/** What goes back to practice: "The 2 decisions that left a rule come back as spots in your daily sets, ..." */
function sentText(count: number, due: string) {
  if (!count) return 'No decision left a rule, so nothing goes back to practice.'
  const which = count === 1 ? 'The decision that left a rule comes' : `The ${count} decisions that left a rule come`
  return `${which} back as ${count === 1 ? 'a spot' : 'spots'} in your daily sets, from ${due}.`
}

/** "Your label: rock, right, from hand 12." */
function labelText(style: string, right: boolean, hand: number | null) {
  return `Your label: ${STYLE_LABELS[style].toLowerCase()}${right ? ', right' : ''}${hand ? `, from hand ${hand}` : ''}.`
}

/** A decision the debrief points to: the table as it stood, what the coach would have said, and what you did. */
function Picked({ decision, title }: { decision: DebriefDecision; title: string }) {
  const { unit } = useUnit()
  const steps = useMemo(() => buildReplay(decision.table), [decision.table])
  const step = steps[steps.length - 1]
  const did = decision.move ? DID[decision.move.action] : 'didn’t act'
  return (
    <article className="debrief-hand">
      <h3>
        {title}: hand {decision.hand}, {streetLabel(decision.street).toLowerCase()}
      </h3>
      <PokerTable step={step} hand={decision.table} labels="names" unit={unit} actor={decision.table.hero} />
      <p>
        With {cardsText(decision.cards)}
        {decision.holding && `, ${decision.holding}`}, you {did}. The playbook: {ACTION_LABELS[decision.advice.action]}.
        {decision.departure && ` You said why: ${DEPARTURES[decision.departure] ?? decision.departure}.`}
      </p>
      <p className="debrief-line">{decision.line}</p>
    </article>
  )
}

export default MatchDebriefPage
