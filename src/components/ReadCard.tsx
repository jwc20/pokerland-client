import { useState } from 'react'
import type { ReadCard as Card, Read } from '../api/generated/data-contracts.ts'
import { cardsText } from '../handFormat.ts'
import { STYLE_LABELS } from '../practice.ts'
import './ReadCard.css'

const ONE_OFF: Record<string, string> = { just_once: 'Just this once', not_sure: 'Not sure' }

/** A note to add to the card: a showdown's lesson, a read (or taking one off), or a label. */
export interface CardNote {
  kind: 'showdown' | 'read' | 'label'
  tag: string
  hand?: number
  withdraw?: boolean
}

/**
 * The read card: a notebook on the opponent, from what the table showed. Counts kept from the action, each with
 * its chances; the hands that showed their cards, read backwards, each asking what it told you; your reads, with
 * the evidence behind each; and a label once the counts allow one.
 */
function ReadCard({ card, busy, onNote }: { card: Card; busy: boolean; onNote: (note: CardNote) => void }) {
  const tagLabel = (tag: string) => card.tags.find((option) => option.tag === tag)?.label ?? ONE_OFF[tag] ?? tag
  const [adding, setAdding] = useState('')
  const held = new Set(card.reads.map((read) => read.tag))
  return (
    <section className="read-card" aria-labelledby="read-card-heading">
      <header>
        <h2 id="read-card-heading">Read: Villain</h2>
        <span>
          {card.hands} {card.hands === 1 ? 'hand' : 'hands'}
        </span>
      </header>

      <dl className="read-card-counts">
        {card.counts.map((count) => (
          <div key={count.key}>
            <dt>{count.label}</dt>
            <dd>{count.could ? `${count.did} of ${count.could}` : 'no chance yet'}</dd>
          </div>
        ))}
      </dl>

      {card.showdowns.length > 0 && (
        <div className="read-card-section">
          <h3>Showdowns</h3>
          <ol className="read-card-showdowns">
            {card.showdowns.map((showdown) => (
              <li key={showdown.number}>
                <p>
                  Hand {showdown.number}: {cardsText(showdown.cards)}. {showdown.line}.
                </p>
                {showdown.note ? (
                  <p className="read-card-note">
                    {tagLabel(showdown.note.tag)}
                    {showdown.note.by === 'coach' && <span> · the coach</span>}
                  </p>
                ) : (
                  <div className="read-card-offer" role="group" aria-label="What did that tell you?">
                    <span>What did that tell you?</span>
                    {showdown.offer.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        disabled={busy}
                        onClick={() => onNote({ kind: 'showdown', tag, hand: showdown.number })}
                      >
                        {tagLabel(tag)}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="read-card-section">
        <h3>Reads</h3>
        {card.reads.length ? (
          <ul className="read-card-reads">
            {card.reads.map((read) => (
              <ReadLine
                key={read.tag}
                read={read}
                busy={busy}
                onWithdraw={() => onNote({ kind: 'read', tag: read.tag, withdraw: true })}
              />
            ))}
          </ul>
        ) : (
          <p className="read-card-empty">None yet. However sure you feel, the evidence is what counts.</p>
        )}
        <div className="read-card-add">
          <select value={adding} onChange={(event) => setAdding(event.target.value)} aria-label="Add a read">
            <option value="">Add a read…</option>
            {card.tags
              .filter((option) => !held.has(option.tag))
              .map((option) => (
                <option key={option.tag} value={option.tag}>
                  {option.label}
                </option>
              ))}
          </select>
          <button
            type="button"
            className="link-button"
            disabled={busy || !adding}
            onClick={() => {
              onNote({ kind: 'read', tag: adding })
              setAdding('')
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div className="read-card-section">
        <h3>Label</h3>
        {card.accepted ? (
          <p>
            {STYLE_LABELS[card.accepted.style]}
            {card.accepted.by === 'coach' && <span className="read-card-by"> · the coach</span>}
          </p>
        ) : card.label ? (
          <p>
            The counts say {STYLE_LABELS[card.label.style].toLowerCase()}: VPIP {card.label.vpip}%, aggression{' '}
            {card.label.aggression}% over {card.label.hands} hands.{' '}
            <button
              type="button"
              className="link-button"
              disabled={busy}
              onClick={() => card.label && onNote({ kind: 'label', tag: card.label.style })}
            >
              Accept
            </button>
          </p>
        ) : (
          <p className="read-card-empty">Too few hands to say yet.</p>
        )}
      </div>
    </section>
  )
}

function ReadLine({ read, busy, onWithdraw }: { read: Read; busy: boolean; onWithdraw: () => void }) {
  const evidence = read.evidence ? `${read.evidence} evidence` : 'no evidence yet'
  return (
    <li>
      <span>
        <strong>{read.label}</strong>
        <span className={`read-card-evidence ${read.evidence ?? 'none'}`}>{evidence}</span>
        {read.by === 'coach' && <span className="read-card-by"> · the coach</span>}
      </span>
      <button
        type="button"
        className="link-button"
        disabled={busy}
        onClick={onWithdraw}
        aria-label={`Take off: ${read.label}`}
      >
        ✕
      </button>
    </li>
  )
}

export default ReadCard
