import { useState } from 'react'
import { Link } from 'react-router'
import type { BookChance, BookRule, RuleCard } from '../api/generated/data-contracts.ts'
import { scopeLabel } from '../coach.ts'
import { formatDateTime, streetLabel } from '../handFormat.ts'
import { formatPct } from '../playerStats.ts'
import { DID } from '../practice.ts'
import { ShareBar } from './StatTile.tsx'
import './PlaybookCard.css'

const MIN_CHANCES = 5

/**
 * A playbook's rule card: the rule, why, who it is for, its exceptions and its source, and how often your own
 * hands kept it when it applied. "Show the hands" lists them, each opening its replay at the decision.
 */
function PlaybookCard({
  rule,
  book,
  loadChances,
}: {
  rule: RuleCard
  book?: BookRule
  loadChances: () => Promise<BookChance[]>
}) {
  const [chances, setChances] = useState<BookChance[]>()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()

  function toggle() {
    setOpen(!open)
    if (!chances) loadChances().then(setChances, () => setError('Could not load the hands.'))
  }

  const shown =
    book && book.could >= MIN_CHANCES && book.pct !== null && book.ci_low !== null && book.ci_high !== null
      ? { did: book.did, could: book.could, pct: book.pct, ci_low: book.ci_low, ci_high: book.ci_high }
      : undefined
  return (
    <article className="playbook-card" aria-labelledby={`rule-${rule.id}`}>
      <header className="playbook-card-header">
        <span className="playbook-card-number">{rule.number}</span>
        <h3 id={`rule-${rule.id}`}>{rule.rule}</h3>
      </header>
      <p className="playbook-card-why">{rule.why}</p>
      <dl className="playbook-card-facts">
        <div>
          <dt>For</dt>
          <dd>
            {scopeLabel(rule)}
            {rule.simplification && <span className="playbook-card-badge">A simplification</span>}
          </dd>
        </div>
        {rule.exceptions && (
          <div>
            <dt>Except</dt>
            <dd>{rule.exceptions}</dd>
          </div>
        )}
        <div>
          <dt>Source</dt>
          <dd>{rule.source.join('; ')}</dd>
        </div>
      </dl>

      {rule.adjustment ? (
        <p className="playbook-card-book">Unlocked in a coached match, by a read on the opponent.</p>
      ) : book ? (
        <div className="playbook-card-book">
          <p>
            In your hands: kept {book.did.toLocaleString()} of {book.could.toLocaleString()} times it applied
            {shown && `, ${formatPct(shown.pct)} (95% range ${formatPct(shown.ci_low)}–${formatPct(shown.ci_high)})`}
            {!book.could && ': it hasn’t come up yet'}
            {book.could > 0 && !shown && ': too few to say'}.
          </p>
          {shown && <ShareBar stat={shown} />}
          {book.could > 0 && (
            <button type="button" className="link-button" aria-expanded={open} onClick={toggle}>
              {open ? 'Hide the hands' : 'Show the hands'}
            </button>
          )}
          {open && <Chances chances={chances} error={error} />}
        </div>
      ) : null}
    </article>
  )
}

function Chances({ chances, error }: { chances?: BookChance[]; error?: string }) {
  if (error) return <p className="error-message">{error}</p>
  if (!chances) return <p>Loading…</p>
  return (
    <ol className="playbook-card-chances">
      {chances.map((chance) => (
        <li key={`${chance.hand}-${chance.step}`}>
          <span className={chance.followed ? 'kept' : 'broken'}>
            <span aria-hidden="true">{chance.followed ? '✓' : '✕'}</span> {chance.followed ? 'Kept' : 'Broken'}
          </span>
          <span>
            {formatDateTime(chance.played_at)} · {streetLabel(chance.street)} · you {DID[chance.move.action]}
          </span>
          <Link to={`/games/${chance.hand}?step=${chance.step}`}>Replay</Link>
        </li>
      ))}
    </ol>
  )
}

export default PlaybookCard
