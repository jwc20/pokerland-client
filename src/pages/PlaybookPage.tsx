import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { changes } from '../api/changes.ts'
import { errorMessage, leagues, practice } from '../api/client.ts'
import type { League, Playbook, PlaybookDetail } from '../api/generated/data-contracts.ts'
import { queries } from '../api/queries.ts'
import ClassesLink from '../components/ClassesLink.tsx'
import PlaybookCard from '../components/PlaybookCard.tsx'
import { FAMILY_ORDER, STAGES } from '../coach.ts'
import { CLASSES_ENABLED } from '../features.ts'
import { LIMITS } from '../playbooks.ts'
import './PlaybookPage.css'

function playbookLabel(playbook: Playbook) {
  if (playbook.house) return `${playbook.name} (house)`
  if (playbook.mine) return `${playbook.name} (yours, v${playbook.version})`
  return `${playbook.name} (from ${playbook.author}, v${playbook.version})`
}

/**
 * The playbook: a short list of defaults the coach teaches, each saying who it is for, and adjustments a read
 * unlocks. Beside each, how often your own hands kept it: the rule as a leak detector.
 *
 * Any playbook can be copied into one of your own; your own can be edited, a version at a time, put away, and
 * assigned to the classes you coach.
 */
function PlaybookPage() {
  const params = useParams()
  const id = params.id ? Number(params.id) : undefined
  const navigate = useNavigate()
  const client = useQueryClient()
  // The playbooks to switch to, and the classes the user coaches; then the chosen playbook (the house one unless an
  // id is given) with the user's stage in each family, and how their own hands kept each rule.
  const playbooksQuery = useQuery(queries.practice.playbooks())
  // Classes aren't open yet (src/features.ts): until they are, there are none to ask the API for.
  const classesQuery = useQuery({ ...queries.leagues.list(), enabled: CLASSES_ENABLED })
  const playbooks = playbooksQuery.data
  const chosen = id ?? (playbooks?.find((playbook) => playbook.house) ?? playbooks?.[0])?.id
  const playbookQuery = useQuery({ ...queries.practice.playbook(chosen ?? 0), enabled: chosen !== undefined })
  const bookQuery = useQuery({ ...queries.practice.book(chosen ?? 0), enabled: chosen !== undefined })

  const failed = playbooksQuery.error ?? classesQuery.error ?? playbookQuery.error ?? bookQuery.error
  if (failed) {
    return (
      <p className="error-message" role="alert">
        {errorMessage(failed)}
      </p>
    )
  }
  const playbook = playbookQuery.data
  const book = bookQuery.data
  if (!playbooks || (CLASSES_ENABLED && !classesQuery.data) || !playbook || !book) return <p>Loading…</p>
  const classes = (classesQuery.data ?? []).filter((league) => league.role === 'coach')
  const byRule = new Map(book.rules.map((row) => [row.rule, row]))
  const families = [...playbook.families].sort(
    (a, b) => FAMILY_ORDER.indexOf(a.family) - FAMILY_ORDER.indexOf(b.family),
  )
  // A rule's hands, kept with the rest of by the book: opening a card again needn't ask again.
  const chancesOf = (rule: string) => () =>
    client.fetchQuery(queries.practice.book(playbook.id, rule)).then((data) => data.chances ?? [])
  const listed = playbooks.some((row) => row.id === playbook.id) ? playbooks : [playbook, ...playbooks]

  return (
    <section className="playbook">
      <Link className="back-link" to="/practice">
        ← Practice
      </Link>
      <header className="playbook-header">
        <label className="playbook-chooser">
          <span>Playbook</span>
          <select value={playbook.id} onChange={(event) => navigate(`/practice/playbook/${event.target.value}`)}>
            {listed.map((row) => (
              <option key={row.id} value={row.id}>
                {playbookLabel(row)}
              </option>
            ))}
          </select>
        </label>
        <h1>{playbook.name}</h1>
        <p>{playbook.description}</p>
        <p className="playbook-meta">
          Version {playbook.version}
          {playbook.author ? ` · by ${playbook.author}` : ' · house playbook'} · {playbook.game} · Your own hands: the{' '}
          {book.hands.toLocaleString()} most recent at least a day old.
        </p>
        {!playbook.latest && (
          <p className="playbook-note">
            This is an earlier version.{' '}
            {(() => {
              const newest = playbooks.find((row) => row.key === playbook.key && row.author === playbook.author)
              return newest ? <Link to={`/practice/playbook/${newest.id}`}>See the latest</Link> : null
            })()}
          </p>
        )}
      </header>

      <PlaybookActions
        playbook={playbook}
        classes={classes}
        onCopied={(copy) => {
          void changes.playbook(client)
          navigate(`/practice/playbook/${copy.id}/edit`)
        }}
        onArchived={() => {
          void changes.playbook(client)
          navigate('/practice/playbook')
        }}
        onAssigned={() => void changes.playbook(client)}
      />

      {families.map((family) => {
        const rules = playbook.rules.filter((rule) => rule.family === family.family)
        const stage = STAGES[family.stage]
        return (
          <section key={family.family} className="playbook-family" aria-labelledby={`family-${family.family}`}>
            <header>
              <h2 id={`family-${family.family}`}>{family.label}</h2>
              <span className="playbook-stage" title={`${stage.coach} ${stage.you}`}>
                Stage {family.stage}: {stage.name}
              </span>
            </header>
            <div className="playbook-cards">
              {rules.map((rule) => (
                <PlaybookCard key={rule.id} rule={rule} book={byRule.get(rule.id)} loadChances={chancesOf(rule.id)} />
              ))}
            </div>
          </section>
        )
      })}
    </section>
  )
}

/** What the user can do with a playbook: copy it; and with one of their own, edit, assign or put it away. */
function PlaybookActions({
  playbook,
  classes,
  onCopied,
  onArchived,
  onAssigned,
}: {
  playbook: PlaybookDetail
  classes: League[]
  onCopied: (copy: PlaybookDetail) => void
  onArchived: () => void
  onAssigned: () => void
}) {
  const [copying, setCopying] = useState(false)
  const [name, setName] = useState(`${playbook.name} (my copy)`.slice(0, LIMITS.name))
  const [assignTo, setAssignTo] = useState<number | ''>('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()
  const [notice, setNotice] = useState<string>()

  async function run(action: () => Promise<void>) {
    setBusy(true)
    setError(undefined)
    setNotice(undefined)
    try {
      await action()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  function copy(event: FormEvent) {
    event.preventDefault()
    run(async () => {
      const { data } = await practice.practicePlaybooksCreate({ copy_of: playbook.id, name: name.trim() })
      onCopied(data)
    })
  }

  function archive() {
    if (!window.confirm(`Put away “${playbook.name}”? Every version goes, and it leaves the classes it’s assigned to.`))
      return
    run(async () => {
      await practice.practicePlaybooksDestroy({ id: playbook.id })
      onArchived()
    })
  }

  function assign(event: FormEvent) {
    event.preventDefault()
    if (assignTo === '') return
    run(async () => {
      await leagues.leaguesAssignmentsCreate({ id: assignTo }, { kind: 'playbook', playbook: playbook.id })
      setAssignTo('')
      onAssigned()
    })
  }

  const unassigned = classes.filter((league) => !playbook.classes.includes(league.name))
  return (
    <section className="playbook-actions card" aria-label="Your playbooks">
      <div className="card-body">
        {playbook.mine ? (
          <>
            <div className="playbook-actions-row">
              {playbook.latest && (
                <Link className="button" to={`/practice/playbook/${playbook.id}/edit`}>
                  Edit the cards
                </Link>
              )}
              <button type="button" className="link-button" disabled={busy} onClick={() => setCopying(!copying)}>
                Make a copy
              </button>
              <button type="button" className="link-button playbook-danger" disabled={busy} onClick={archive}>
                Put it away
              </button>
            </div>
            <p className="playbook-note">
              {playbook.classes.length
                ? `Assigned to ${playbook.classes.join(', ')}. Saving a new version moves the classes to it.`
                : 'Not assigned to a class yet.'}
            </p>
            {unassigned.length > 0 && (
              <form className="playbook-actions-row" onSubmit={assign}>
                <label className="playbook-inline-field">
                  <span>Assign to</span>
                  <select
                    value={assignTo}
                    onChange={(event) => setAssignTo(event.target.value ? Number(event.target.value) : '')}
                  >
                    <option value="">A class you coach…</option>
                    {unassigned.map((league) => (
                      <option key={league.id} value={league.id}>
                        {league.name}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="submit" className="button" disabled={busy || assignTo === ''}>
                  Assign
                </button>
              </form>
            )}
            {classes.length === 0 && (
              <p className="playbook-note">
                To give it to students, <ClassesLink>start a class</ClassesLink>.
              </p>
            )}
          </>
        ) : (
          <div className="playbook-actions-row">
            <p className="playbook-note">
              Want different rules? Make a copy of your own: edit its cards, play by it, and assign it to a class.
            </p>
            {!copying && (
              <button type="button" className="button" onClick={() => setCopying(true)}>
                Make a copy
              </button>
            )}
          </div>
        )}
        {copying && (
          <form className="playbook-actions-row" onSubmit={copy}>
            <label className="playbook-inline-field">
              <span>Name of the copy</span>
              <input value={name} maxLength={LIMITS.name} required onChange={(event) => setName(event.target.value)} />
            </label>
            <button type="submit" className="button" disabled={busy || !name.trim()}>
              Copy and edit
            </button>
            <button type="button" className="link-button" onClick={() => setCopying(false)}>
              Cancel
            </button>
          </form>
        )}
        {notice && (
          <p className="playbook-note" role="status">
            {notice}
          </p>
        )}
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
      </div>
    </section>
  )
}

export default PlaybookPage
