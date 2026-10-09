import { useState, type FormEvent } from 'react'
import type { HandNote, HandNoteWriteRequest, NotePurposeEnum } from '../api/generated/data-contracts.ts'
import { streetLabel } from '../handFormat.ts'
import {
  NOTE_STREETS,
  noteOn,
  normalTag,
  PURPOSE_LABELS,
  purposeOf,
  reviewOf,
  tagsOf,
  type HeroBet,
} from '../notes.ts'
import './NotesPanel.css'

const TAG_CHOICES_SHOWN = 6

/**
 * What the user wrote on a hand (E1): whether it is waiting to be reviewed,
 * its tags, why they made each bet, and notes on the whole hand and on each
 * street it reached. `onSave` and `onDelete` resolve to whether they worked.
 */
function NotesPanel({
  notes,
  streets,
  bets,
  tagChoices,
  money,
  error,
  onSave,
  onDelete,
  onSeek,
}: {
  notes?: HandNote[]
  streets: Set<string>
  bets: HeroBet[]
  tagChoices: string[]
  money: (amount?: number) => string
  error?: string
  onSave: (write: HandNoteWriteRequest) => Promise<boolean>
  onDelete: (note: HandNote) => Promise<boolean>
  onSeek: (step: number) => void
}) {
  return (
    <section className="card notes-panel" aria-labelledby="notes-heading">
      <h2 id="notes-heading" className="card-header">
        Your notes
      </h2>
      <div className="card-body">
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        {notes === undefined ? (
          !error && <p>Loading…</p>
        ) : (
          <>
            <ReviewState note={reviewOf(notes)} onSave={onSave} onDelete={onDelete} />
            <Tags tags={tagsOf(notes)} choices={tagChoices} onSave={onSave} onDelete={onDelete} />
            <Bets bets={bets} notes={notes} money={money} onSeek={onSeek} />
            <div className="notes-notes">
              <h3>Notes</h3>
              {NOTE_STREETS.filter(([street]) => !street || streets.has(street)).map(([street, label]) => (
                <NoteEditor
                  // Keyed by the saved text too, so a save from elsewhere starts the editor afresh.
                  key={`${street}:${noteOn(notes, street)?.updated ?? ''}`}
                  label={label}
                  note={noteOn(notes, street)}
                  onSave={(text) => onSave({ kind: 'note', street, text })}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

/** Flagged to review, reviewed, or neither, and the way from one to the next. */
function ReviewState({
  note,
  onSave,
  onDelete,
}: {
  note?: HandNote
  onSave: (write: HandNoteWriteRequest) => Promise<boolean>
  onDelete: (note: HandNote) => Promise<boolean>
}) {
  const [busy, setBusy] = useState(false)
  const run = async (action: () => Promise<boolean>) => {
    setBusy(true)
    await action()
    setBusy(false)
  }
  const flag = () => run(() => onSave({ kind: 'review', review: 'to_review' }))
  return (
    <div className="notes-review">
      {!note ? (
        <>
          <button type="button" className="button" disabled={busy} onClick={flag}>
            Flag to review
          </button>
          <p className="card-hint">
            The hand that nags you is the one to study. Flagged hands wait on the home page, and practice deals
            their decisions first.
          </p>
        </>
      ) : note.value === 'to_review' ? (
        <>
          <span className="notes-review-state">Flagged to review</span>
          <button
            type="button"
            className="button"
            disabled={busy}
            onClick={() => run(() => onSave({ kind: 'review', review: 'reviewed' }))}
          >
            Mark reviewed
          </button>
          <button type="button" className="link-button" disabled={busy} onClick={() => run(() => onDelete(note))}>
            Unflag
          </button>
        </>
      ) : (
        <>
          <span className="notes-review-state done">Reviewed</span>
          <button type="button" className="link-button" disabled={busy} onClick={flag}>
            Flag again
          </button>
        </>
      )}
    </div>
  )
}

/** The hand's tags, each removable, and a way to add one: typed, or picked from the choices. */
function Tags({
  tags,
  choices,
  onSave,
  onDelete,
}: {
  tags: HandNote[]
  choices: string[]
  onSave: (write: HandNoteWriteRequest) => Promise<boolean>
  onDelete: (note: HandNote) => Promise<boolean>
}) {
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const unused = choices.filter((choice) => !tags.some((tag) => tag.value === choice))

  async function add(tag: string) {
    if (!normalTag(tag)) return
    setBusy(true)
    if (await onSave({ kind: 'tag', tag })) setDraft('')
    setBusy(false)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    void add(draft)
  }

  return (
    <div className="notes-tags">
      <h3>Tags</h3>
      {tags.length > 0 && (
        <ul className="notes-tag-list">
          {tags.map((tag) => (
            <li key={tag.id} className="notes-tag">
              {tag.value}
              <button type="button" aria-label={`Remove the tag ${tag.value}`} onClick={() => void onDelete(tag)}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <form className="notes-tag-form" onSubmit={submit}>
        <input
          value={draft}
          maxLength={32}
          placeholder="Add a tag"
          aria-label="New tag"
          list="notes-tag-choices"
          onChange={(event) => setDraft(event.target.value)}
        />
        <datalist id="notes-tag-choices">
          {unused.map((choice) => (
            <option key={choice} value={choice} />
          ))}
        </datalist>
        <button type="submit" className="button" disabled={busy || !normalTag(draft)}>
          Add
        </button>
      </form>
      {unused.length > 0 && (
        <div className="notes-tag-choices">
          {unused.slice(0, TAG_CHOICES_SHOWN).map((choice) => (
            <button key={choice} type="button" disabled={busy} onClick={() => void add(choice)}>
              + {choice}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** The hero's bets and raises and the purpose given to each; picking one steps the replay to it. */
function Bets({
  bets,
  notes,
  money,
  onSeek,
}: {
  bets: HeroBet[]
  notes: HandNote[]
  money: (amount?: number) => string
  onSeek: (step: number) => void
}) {
  return (
    <div className="notes-bets">
      <h3>Why you bet</h3>
      {bets.length === 0 ? (
        <p className="card-hint">You made no bets or raises in this hand.</p>
      ) : (
        <>
          <ul>
            {bets.map((bet) => {
              const purpose = purposeOf(notes, bet.bet)?.value as NotePurposeEnum | undefined
              const move = bet.event.type === 'raise' ? `raise to ${money(bet.event.to)}` : `bet ${money(bet.event.amount)}`
              return (
                <li key={bet.bet}>
                  <button type="button" className="link-button" onClick={() => onSeek(bet.step - 1)}>
                    {streetLabel(bet.street)}: {move}
                  </button>
                  <span className={purpose ? 'notes-purpose' : 'notes-purpose unsaid'}>
                    {purpose ? PURPOSE_LABELS[purpose] : 'Not said'}
                  </span>
                </li>
              )
            })}
          </ul>
          <p className="card-hint">Step to a bet and say why you made it in the decision panel.</p>
        </>
      )}
    </div>
  )
}

/** A note to write, change, or clear by saving it empty. */
function NoteEditor({
  label,
  note,
  onSave,
  onDelete,
}: {
  label: string
  note?: HandNote
  onSave: (text: string) => Promise<boolean>
  onDelete: (note: HandNote) => Promise<boolean>
}) {
  const saved = note?.text ?? ''
  const [draft, setDraft] = useState(saved)
  const [busy, setBusy] = useState(false)
  const changed = draft.trim() !== saved

  async function save() {
    setBusy(true)
    // A save or a delete gives the editor a new key, so it starts again from what is saved.
    if (draft.trim()) await onSave(draft)
    else if (note) await onDelete(note)
    setBusy(false)
  }

  return (
    <div className="notes-note">
      <label>
        {label}
        <textarea value={draft} rows={2} maxLength={2000} onChange={(event) => setDraft(event.target.value)} />
      </label>
      {changed && (
        <div className="notes-note-actions">
          <button type="button" className="button" disabled={busy} onClick={save}>
            {draft.trim() ? 'Save' : 'Delete note'}
          </button>
          <button type="button" className="link-button" disabled={busy} onClick={() => setDraft(saved)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

export default NotesPanel
