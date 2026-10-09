import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { changes } from '../api/changes.ts'
import { errorMessage, leagues, practice } from '../api/client.ts'
import type {
  Assignment,
  LeagueDetail,
  Member,
  MemberProgress,
  RuleCard,
} from '../api/generated/data-contracts.ts'
import { queries } from '../api/queries.ts'
import { browserTimeZone } from '../calendar.ts'
import CopyButton from '../components/CopyButton.tsx'
import SkillBars from '../components/SkillBars.tsx'
import { STAGES } from '../coach.ts'
import { formatDateTime } from '../handFormat.ts'
import { formatPct } from '../playerStats.ts'
import './ClassPage.css'

/** An invite code in two groups of four, easier to read out. */
function spaced(code: string) {
  return code.length === 8 ? `${code.slice(0, 4)} ${code.slice(4)}` : code
}

/**
 * A class: the playbooks its coaches assign and the hands its people share, each anonymized; whether you show the
 * coaches your progress; and, for a coach, the invite code, the members, and the progress of those who share it.
 */
function ClassPage() {
  const id = Number(useParams().id)
  const navigate = useNavigate()
  const client = useQueryClient()
  // Fetched afresh on every visit and when the tab comes back: coaches and members change a class between visits.
  const detailQuery = queries.leagues.detail(id)
  const query = useQuery(detailQuery)
  const league = query.data
  const error = query.error ? errorMessage(query.error) : undefined
  const [actionError, setActionError] = useState<string>()
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string>()

  /** A change answered with the class as it now stands: kept, and the list of classes refreshed for its name. */
  function setLeague(data: LeagueDetail) {
    client.setQueryData(detailQuery.queryKey, data)
    void client.invalidateQueries({ queryKey: queries.leagues.list().queryKey })
  }

  /** A change to who is in the class or what is before it: the class, its progress, the list and the playbooks. */
  const load = async () => {
    await changes.league(client)
  }

  async function run(action: () => Promise<unknown>) {
    setBusy(true)
    setActionError(undefined)
    try {
      await action()
    } catch (err) {
      setActionError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (error) {
    return (
      <section className="class-page">
        <Link className="back-link" to="/classes">
          ← Classes
        </Link>
        <p className="error-message" role="alert">
          {error}
        </p>
      </section>
    )
  }
  if (!league || league.id !== id) return <p>Loading…</p>

  const coach = league.role === 'coach'
  const me = league.members.find((member) => member.you)
  const playbooks = league.assignments.filter((row) => row.kind === 'playbook')
  const sharedHands = league.assignments.filter((row) => row.kind === 'hand')
  const withdraw = (assignment: Assignment) =>
    run(async () => {
      await leagues.leaguesAssignmentsDestroy({ id: league.id, assignmentPk: assignment.id })
      await load()
    })

  function leave() {
    if (!window.confirm(`Leave ${league?.name}? What you shared with it is withdrawn.`)) return
    void run(async () => {
      await leagues.leaguesMeDestroy({ id })
      navigate('/classes')
      // Not theirs to see any more: dropped rather than refreshed, which would only be refused.
      client.removeQueries({ queryKey: detailQuery.queryKey })
      void changes.league(client)
    })
  }

  function practise() {
    setNotice(undefined)
    void run(async () => {
      const { data } = await practice.practiceSetsCreate({ kind: 'shared', tz: browserTimeZone() })
      if (data.spots.length) navigate(`/practice/set/${data.id}`)
      else setNotice('Nothing to practise yet: these hands are your own, or were played in the last day.')
    })
  }

  return (
    <section className="class-page">
      <Link className="back-link" to="/classes">
        ← Classes
      </Link>
      <header className="class-header">
        <h1>{league.name}</h1>
        <p>
          Started by {league.owner_name} · {league.member_count} {league.member_count === 1 ? 'person' : 'people'} ·
          you’re {coach ? 'a coach' : 'a member'}
        </p>
      </header>

      {actionError && (
        <p className="error-message" role="alert">
          {actionError}
        </p>
      )}

      {coach && <InviteCard league={league} busy={busy} run={run} onChange={setLeague} />}

      <section className="card" aria-labelledby="class-you">
        <h2 id="class-you" className="card-header">
          You in this class
        </h2>
        <div className="card-body">
          {!coach && (
            <label className="fields-check class-share-toggle">
              <input
                type="checkbox"
                checked={league.shares_progress}
                disabled={busy}
                onChange={(event) =>
                  run(async () => {
                    const { data } = await leagues.leaguesMePartialUpdate(
                      { id },
                      { shares_progress: event.target.checked },
                    )
                    setLeague(data)
                  })
                }
              />
              <span>
                Show the coaches my progress: practice accuracy by skill, my stage in each assigned playbook’s
                families, and how often my hands kept its rules. Never the hands themselves.
              </span>
            </label>
          )}
          {coach && (
            <p className="card-hint">
              You see the progress of the members who choose to share it, below. Assign a playbook of your own from{' '}
              <Link to="/practice/playbook">its page</Link>.
            </p>
          )}
          {me && !me.owner && (
            <button type="button" className="link-button class-danger" disabled={busy} onClick={leave}>
              Leave the class
            </button>
          )}
        </div>
      </section>

      <section className="card" aria-labelledby="class-playbooks">
        <h2 id="class-playbooks" className="card-header">
          Playbooks
        </h2>
        <div className="card-body">
          {playbooks.length === 0 ? (
            <p className="card-hint">
              {coach
                ? 'None yet. Copy a playbook, make it yours, and assign it here from its page.'
                : 'None assigned yet.'}
            </p>
          ) : (
            <ul className="class-list">
              {playbooks.map((row) => (
                <li key={row.id}>
                  <div>
                    <Link to={`/practice/playbook/${row.playbook?.id}`} className="class-item-title">
                      {row.playbook?.name}
                    </Link>{' '}
                    <span className="class-item-meta">
                      v{row.playbook?.version} · assigned by {row.by_name}
                    </span>
                    {row.note && <p className="class-note">{row.note}</p>}
                    {row.playbook?.description && <p className="class-item-meta">{row.playbook.description}</p>}
                  </div>
                  <div className="class-item-actions">
                    <Link className="link-button" to={`/practice/match/new?playbook=${row.playbook?.id}`}>
                      Play a coached match
                    </Link>
                    {row.can_withdraw && (
                      <button type="button" className="link-button class-danger" disabled={busy} onClick={() => withdraw(row)}>
                        Withdraw
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="card" aria-labelledby="class-hands">
        <h2 id="class-hands" className="card-header">
          Shared hands
        </h2>
        <div className="card-body">
          <p className="card-hint">
            Share one of your hands from its replay. The class sees it anonymized, and practises its decisions from
            your seat a day after it was played.
          </p>
          {sharedHands.length > 0 && (
            <>
              <ul className="class-list">
                {sharedHands.map((row) => (
                  <li key={row.id}>
                    <div>
                      <span className="class-item-title">
                        {row.hand?.game} {row.hand?.stakes}
                      </span>{' '}
                      <span className="class-item-meta">
                        shared by {row.by_name} · played {row.hand && formatDateTime(row.hand.played_at)}
                      </span>
                      {row.note && <p className="class-note">{row.note}</p>}
                      {row.hand?.write_up && <p className="class-item-meta">{row.hand.write_up}</p>}
                    </div>
                    <div className="class-item-actions">
                      {row.hand?.own_hand && (
                        <Link className="link-button" to={`/games/${row.hand.own_hand}`}>
                          Your replay
                        </Link>
                      )}
                      {row.can_withdraw && (
                        <button type="button" className="link-button class-danger" disabled={busy} onClick={() => withdraw(row)}>
                          Withdraw
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <PractiseShared busy={busy} onStart={practise} />
              {notice && (
                <p className="card-hint" role="status">
                  {notice}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {coach && <MembersCard league={league} busy={busy} run={run} reload={load} />}
      {coach && <ProgressCard league={league} />}
    </section>
  )
}

function PractiseShared({ busy, onStart }: { busy: boolean; onStart: () => void }) {
  return (
    <div className="class-practise">
      <button type="button" className="button" disabled={busy} onClick={onStart}>
        Practise your classes’ hands
      </button>
      <span className="class-item-meta">Hands you shared yourself, and any played in the last day, are left out.</span>
    </div>
  )
}

function InviteCard({
  league,
  busy,
  run,
  onChange,
}: {
  league: LeagueDetail
  busy: boolean
  run: (action: () => Promise<unknown>) => Promise<void>
  onChange: (league: LeagueDetail) => void
}) {
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState(league.name)

  function rename(event: FormEvent) {
    event.preventDefault()
    void run(async () => {
      const { data } = await leagues.leaguesPartialUpdate({ id: league.id }, { name: name.trim() })
      onChange(data)
      setRenaming(false)
    })
  }

  function renew() {
    if (!window.confirm('Make a new invite code? The old one stops working; nobody already in the class is affected.'))
      return
    void run(async () => {
      const { data } = await leagues.leaguesPartialUpdate({ id: league.id }, { new_invite: true })
      onChange(data)
    })
  }

  return (
    <section className="card" aria-labelledby="class-invite">
      <h2 id="class-invite" className="card-header">
        Invite
      </h2>
      <div className="card-body">
        <p className="card-hint">Give your players this code: they join from the Classes page.</p>
        <div className="class-code-row">
          <code className="class-code">{spaced(league.invite_code ?? '')}</code>
          <CopyButton text={league.invite_code ?? ''} />
          <button type="button" className="link-button" disabled={busy} onClick={renew}>
            New code
          </button>
        </div>
        {renaming ? (
          <form className="class-code-row" onSubmit={rename}>
            <label className="class-inline-field">
              <span>Name</span>
              <input value={name} maxLength={80} required onChange={(event) => setName(event.target.value)} />
            </label>
            <button type="submit" className="button" disabled={busy || !name.trim()}>
              Save
            </button>
            <button type="button" className="link-button" onClick={() => setRenaming(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <button type="button" className="link-button class-start" onClick={() => setRenaming(true)}>
            Rename the class
          </button>
        )}
      </div>
    </section>
  )
}

function MembersCard({
  league,
  busy,
  run,
  reload,
}: {
  league: LeagueDetail
  busy: boolean
  run: (action: () => Promise<unknown>) => Promise<void>
  reload: () => Promise<void>
}) {
  const setRole = (member: Member, role: 'coach' | 'member') =>
    run(async () => {
      await leagues.leaguesMembersPartialUpdate({ id: league.id, memberPk: member.id }, { role })
      await reload()
    })
  const remove = (member: Member) => {
    if (!window.confirm(`Take ${member.name} out of the class? What they shared with it is withdrawn.`)) return
    void run(async () => {
      await leagues.leaguesMembersDestroy({ id: league.id, memberPk: member.id })
      await reload()
    })
  }

  return (
    <section className="card" aria-labelledby="class-members">
      <h2 id="class-members" className="card-header">
        People
      </h2>
      <div className="card-body">
        <div className="history-table-scroll">
          <table className="class-members">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Role</th>
                <th scope="col">Shares progress</th>
                <th scope="col">Joined</th>
                {/* Labelled for screen readers without a hidden span, which would escape the scroll box. */}
                <th scope="col" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {league.members.map((member) => (
                <tr key={member.id}>
                  <td>
                    {member.name}
                    {member.you && ' (you)'}
                  </td>
                  <td>{member.owner ? 'Coach, started it' : member.role === 'coach' ? 'Coach' : 'Member'}</td>
                  <td>{member.role === 'coach' ? '—' : member.shares_progress ? 'Yes' : 'No'}</td>
                  <td>{formatDateTime(member.joined)}</td>
                  <td>
                    {!member.owner && !member.you && (
                      <span className="class-member-actions">
                        <button
                          type="button"
                          className="link-button"
                          disabled={busy}
                          onClick={() => setRole(member, member.role === 'coach' ? 'member' : 'coach')}
                        >
                          {member.role === 'coach' ? 'Make a member' : 'Make a coach'}
                        </button>
                        <button type="button" className="link-button class-danger" disabled={busy} onClick={() => remove(member)}>
                          Remove
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

/** The progress of the members who share it: totals only. By the book reads their hands, so it loads on request. */
function ProgressCard({ league }: { league: LeagueDetail }) {
  // A change to the class's members or playbooks refreshes this with it (src/api/changes.ts).
  const query = useQuery(queries.leagues.progress(league.id))
  const rows = query.data
  const error = query.error ? errorMessage(query.error) : undefined

  return (
    <section className="card" aria-labelledby="class-progress">
      <h2 id="class-progress" className="card-header">
        Progress
      </h2>
      <div className="card-body">
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        {!rows ? (
          !error && <p>Loading…</p>
        ) : rows.length === 0 ? (
          <p className="card-hint">No member shares their progress yet. Each chooses to, from this page.</p>
        ) : (
          rows.map((row) => <MemberProgressView key={row.member} league={league.id} row={row} />)
        )}
      </div>
    </section>
  )
}

function MemberProgressView({ league, row }: { league: number; row: MemberProgress }) {
  const client = useQueryClient()
  const [book, setBook] = useState<{ progress: MemberProgress; cards: Map<string, RuleCard> }>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const practised = row.skills.some((skill) => skill.attempts > 0)

  async function loadBook() {
    setLoading(true)
    setError(undefined)
    try {
      const progress = await client.fetchQuery(queries.leagues.memberProgress(league, row.member))
      const details = await Promise.all(
        progress.playbooks.map((playbook) => client.fetchQuery(queries.practice.playbook(playbook.playbook))),
      )
      const cards = new Map(details.flatMap((data) => data.rules.map((rule) => [`${data.id}:${rule.id}`, rule])))
      setBook({ progress, cards })
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className="class-progress-member" aria-labelledby={`member-${row.member}`}>
      <h3 id={`member-${row.member}`}>{row.name}</h3>
      {practised ? <SkillBars skills={row.skills} /> : <p className="card-hint">No practice answers yet.</p>}
      {row.playbooks.map((playbook) => (
        <div key={playbook.playbook} className="class-progress-playbook">
          <h4>{playbook.name}</h4>
          <ul className="class-stages">
            {playbook.families.map((family) => (
              <li key={family.family} title={STAGES[family.stage]?.coach}>
                {family.label}: stage {family.stage}, {STAGES[family.stage]?.name.toLowerCase()}
              </li>
            ))}
          </ul>
          {book && (
            <table className="class-book">
              <caption className="visually-hidden">By the book in {row.name}’s hands</caption>
              <thead>
                <tr>
                  <th scope="col">Rule</th>
                  <th scope="col">Kept</th>
                </tr>
              </thead>
              <tbody>
                {(book.progress.playbooks.find((found) => found.playbook === playbook.playbook)?.book ?? []).map(
                  (rule) => (
                    <tr key={rule.rule}>
                      <td>{book.cards.get(`${playbook.playbook}:${rule.rule}`)?.rule ?? rule.rule}</td>
                      <td>
                        {rule.could === 0
                          ? 'Didn’t come up'
                          : `${rule.did} of ${rule.could}${rule.pct === null ? '' : ` (${formatPct(rule.pct)})`}`}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          )}
        </div>
      ))}
      {row.playbooks.length > 0 && !book && (
        <button type="button" className="link-button class-start" disabled={loading} onClick={loadBook}>
          {loading ? 'Reading their hands…' : 'By the book: how their hands kept the rules'}
        </button>
      )}
      {row.playbooks.length === 0 && <p className="card-hint">Assign a playbook to see their stages and rules.</p>}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
    </article>
  )
}

export default ClassPage
