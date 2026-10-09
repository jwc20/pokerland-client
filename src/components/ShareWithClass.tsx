import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { errorMessage, leagues } from '../api/client.ts'
import type { League } from '../api/generated/data-contracts.ts'
import './ShareWithClass.css'

/**
 * Shares one of your hands with a class you're in (feature ideas, G3 and G4). The class sees it anonymized, players
 * by their position, and practises its decisions from your seat a day after it was played. You can withdraw it from
 * the class's page.
 */
function ShareWithClass({ hand }: { hand: number }) {
  const [classes, setClasses] = useState<League[]>()
  const [open, setOpen] = useState(false)
  const [chosen, setChosen] = useState<number | ''>('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()
  const [shared, setShared] = useState<League>()

  function toggle() {
    setOpen(!open)
    setShared(undefined)
    if (!classes) {
      leagues.leaguesList().then(
        ({ data }) => {
          setClasses(data)
          if (data.length === 1) setChosen(data[0].id)
        },
        (err) => setError(errorMessage(err)),
      )
    }
  }

  async function share(event: FormEvent) {
    event.preventDefault()
    if (chosen === '') return
    setBusy(true)
    setError(undefined)
    try {
      await leagues.leaguesAssignmentsCreate({ id: chosen }, { kind: 'hand', hand, note: note.trim() })
      setShared(classes?.find((league) => league.id === chosen))
      setNote('')
      setOpen(false)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="share-class" aria-label="Share with a class">
      <button type="button" className="link-button" aria-expanded={open} onClick={toggle}>
        Share with a class
      </button>
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
                onChange={(event) => setChosen(event.target.value ? Number(event.target.value) : '')}
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
