import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { changes } from '../api/changes.ts'
import { errorMessage, leagues } from '../api/client.ts'
import type { League } from '../api/generated/data-contracts.ts'
import { queries } from '../api/queries.ts'
import { CLASSES_CLOSED, CLASSES_ENABLED } from '../features.ts'
import './ShareWithClass.css'

/**
 * Shares one of your hands with a class you're in (feature ideas, G3 and G4). The class sees it anonymized, players
 * by their position, and practises its decisions from your seat a day after it was played. You can withdraw it from
 * the class's page.
 */
function ShareWithClass({ hand }: { hand: number }) {
  const client = useQueryClient()
  const [open, setOpen] = useState(false)
  // The user's classes, asked for once the form opens; with one, it is chosen already.
  const classesQuery = useQuery({ ...queries.leagues.list(), enabled: open })
  const classes = classesQuery.data
  const [picked, setPicked] = useState<number | ''>('')
  const chosen = picked !== '' ? picked : classes?.length === 1 ? classes[0].id : ''
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [shareError, setShareError] = useState<string>()
  const error = shareError ?? (classesQuery.error ? errorMessage(classesQuery.error) : undefined)
  const [shared, setShared] = useState<League>()

  function toggle() {
    setOpen(!open)
    setShared(undefined)
  }

  async function share(event: FormEvent) {
    event.preventDefault()
    if (chosen === '') return
    setBusy(true)
    setShareError(undefined)
    try {
      await leagues.leaguesAssignmentsCreate({ id: chosen }, { kind: 'hand', hand, note: note.trim() })
      void changes.league(client) // the class's hands and count
      setShared(classes?.find((league) => league.id === chosen))
      setNote('')
      setOpen(false)
    } catch (err) {
      setShareError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="share-class" aria-label="Share with a class">
      {CLASSES_ENABLED ? (
        <button type="button" className="link-button" aria-expanded={open} onClick={toggle}>
          Share with a class
        </button>
      ) : (
        <button type="button" className="link-button link-disabled" disabled title={CLASSES_CLOSED}>
          Share with a class
        </button>
      )}
      {shared && (
        <p role="status">
          Shared with <Link to={`/classes/${shared.id}`}>{shared.name}</Link>, anonymized.
        </p>
      )}
      {open &&
        (!classes ? (
          error ? null : <p>Loading…</p>
        ) : classes.length === 0 ? (
          <p>
            You aren’t in a class yet. <Link to="/classes">Start one, or join with an invite code.</Link>
          </p>
        ) : (
          <form className="fields" onSubmit={share}>
            <label>
              Class
              <select
                value={chosen}
                required
                onChange={(event) => setPicked(event.target.value ? Number(event.target.value) : '')}
              >
                <option value="">Choose a class…</option>
                {classes.map((league) => (
                  <option key={league.id} value={league.id}>
                    {league.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="fields-wide">
              A note for the class (optional)
              <input
                value={note}
                maxLength={500}
                placeholder="Should I have called the river?"
                onChange={(event) => setNote(event.target.value)}
              />
            </label>
            <p className="share-class-hint fields-wide">
              The class sees the hand with every player named by position and you as “Hero”, without the table or the
              hand’s number. They practise your decisions in it from the day after it was played.
            </p>
            <div className="fields-wide share-class-buttons">
              <button type="submit" className="button" disabled={busy || chosen === ''}>
                Share
              </button>
              <button type="button" className="link-button" onClick={() => setOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        ))}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
    </section>
  )
}

export default ShareWithClass
