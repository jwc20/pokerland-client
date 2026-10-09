import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { changes } from '../api/changes.ts'
import { errorMessage, leagues } from '../api/client.ts'
import { queries } from '../api/queries.ts'
import './ClassesPage.css'

/**
 * Classes (feature ideas, G4): a coach and the players they teach. Start one and you coach it; join one with the
 * invite code its coach gives you. In a class, the coach assigns playbooks, anyone can share a hand to study, and
 * members can choose to show the coach their practice progress.
 */
function ClassesPage() {
  const navigate = useNavigate()
  const client = useQueryClient()
  const query = useQuery(queries.leagues.list())
  const classes = query.data
  const error = query.error ? errorMessage(query.error) : undefined
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState<{ form: 'create' | 'join'; message: string }>()

  async function submit(event: FormEvent, form: 'create' | 'join') {
    event.preventDefault()
    setBusy(true)
    setFormError(undefined)
    try {
      const { data } =
        form === 'create'
          ? await leagues.leaguesCreate({ name: name.trim() })
          : await leagues.leaguesJoinCreate({ code: code.trim() })
      void changes.league(client) // the classes, and the playbooks a joined class assigns
      navigate(`/classes/${data.id}`)
    } catch (err) {
      setFormError({ form, message: errorMessage(err) })
      setBusy(false)
    }
  }

  return (
    <section className="classes">
      <header>
        <h1>Classes</h1>
        <p>
          Study with a coach, or coach your own players. The coach sees only what each member chooses to share: their
          practice totals, never their hands.
        </p>
      </header>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      {!classes ? (
        !error && <p>Loading…</p>
      ) : classes.length === 0 ? (
        <p className="classes-empty">You aren’t in a class yet.</p>
      ) : (
        <ul className="classes-list">
          {classes.map((league) => (
            <li key={league.id}>
              <Link to={`/classes/${league.id}`} className="classes-name">
                {league.name}
              </Link>
              <span className={`classes-role classes-role-${league.role}`}>
                {league.role === 'coach' ? 'Coach' : 'Member'}
              </span>
              <span className="classes-meta">
                {league.member_count} {league.member_count === 1 ? 'person' : 'people'} ·{' '}
                {league.assignment_count} {league.assignment_count === 1 ? 'assignment' : 'assignments'} · started by{' '}
                {league.owner_name}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="classes-forms">
        <form className="card" onSubmit={(event) => submit(event, 'join')}>
          <h2 className="card-header">Join a class</h2>
          <div className="card-body">
            <div className="fields">
              <label className="fields-wide">
                Invite code
                <input
                  value={code}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  placeholder="ABCD 2345"
                  required
                  onChange={(event) => setCode(event.target.value)}
                />
              </label>
            </div>
            {formError?.form === 'join' && (
              <p className="error-message" role="alert">
                {formError.message}
              </p>
            )}
            <button type="submit" className="button" disabled={busy || !code.trim()}>
              Join
            </button>
          </div>
        </form>

        <form className="card" onSubmit={(event) => submit(event, 'create')}>
          <h2 className="card-header">Start a class</h2>
          <div className="card-body">
            <div className="fields">
              <label className="fields-wide">
                Name
                <input
                  value={name}
                  maxLength={80}
                  placeholder="Tuesday study group"
                  required
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
            </div>
            <p className="card-hint">You’ll coach it, and get an invite code to give your players.</p>
            {formError?.form === 'create' && (
              <p className="error-message" role="alert">
                {formError.message}
              </p>
            )}
            <button type="submit" className="button" disabled={busy || !name.trim()}>
              Start
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default ClassesPage
