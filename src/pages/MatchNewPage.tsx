import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { changes } from '../api/changes.ts'
import { errorMessage, practice } from '../api/client.ts'
import type { MatchCoachEnum, MatchOpponentEnum } from '../api/generated/data-contracts.ts'
import { queries } from '../api/queries.ts'
import { STAGES } from '../coach.ts'
import { formatDateTime } from '../handFormat.ts'
import { STYLE_LABELS } from '../practice.ts'
import './MatchNewPage.css'

const OPPONENTS: { value: MatchOpponentEnum; label: string; hint: string }[] = [
  { value: 'mystery', label: 'Mystery', hint: 'A style and a leak, drawn at random: find them.' },
  { value: 'tag', label: STYLE_LABELS.tag, hint: 'Plays few hands, and those hard.' },
  { value: 'lag', label: STYLE_LABELS.lag, hint: 'Plays many hands, and bets them.' },
  { value: 'station', label: STYLE_LABELS.station, hint: 'Calls too much, bets too little.' },
  { value: 'rock', label: STYLE_LABELS.rock, hint: 'Folds too much; a bet means a hand.' },
]

/**
 * A new coached match: a short heads-up match against a bot with a leak, and a coach in your corner who hands the
 * decisions over to you, one rule family at a time.
 */
function MatchNewPage() {
  const navigate = useNavigate()
  // ?playbook=N, as a class's page links to its playbook; the house one otherwise.
  const [params] = useSearchParams()
  const [playbook, setPlaybook] = useState<number | undefined>(Number(params.get('playbook')) || undefined)
  // Without the playbooks, the match is played by the house playbook; the page works without the recent matches.
  const playbooks = useQuery(queries.practice.playbooks()).data
  const recent = useQuery(queries.practice.matches()).data
  const client = useQueryClient()
  const [opponent, setOpponent] = useState<MatchOpponentEnum>('mystery')
  const [coach, setCoach] = useState<MatchCoachEnum>('progress')
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string>()

  /** A new match: a POST that makes one, so it is sent each time, never shared with another request. */
  function start() {
    setStarting(true)
    practice.practiceMatchesCreate({ opponent, coach, playbook }).then(
      ({ data }) => {
        void changes.practiceList(client, 'matches')
        navigate(`/practice/match/${data.id}`)
      },
      (err) => {
        setStarting(false)
        setError(errorMessage(err))
      },
    )
  }

  return (
    <section className="match-new">
      <Link className="back-link" to="/practice">
        ← Practice
      </Link>
      <header>
        <h1>Coached match</h1>
        <p>
          Heads-up hold’em against a bot, from 40 big blinds, the blinds going up every six hands: 30 hands, ten to
          fifteen minutes. The bot has a leak. Find it, and adjust by the right amount. The coach starts by calling
          every move and saying why, then asks what you would do, then goes quiet.
        </p>
      </header>

      <fieldset className="match-new-choices">
        <legend>Opponent</legend>
        {OPPONENTS.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name="opponent"
              checked={opponent === option.value}
              onChange={() => setOpponent(option.value)}
            />
            <span>
              <strong>{option.label}</strong>
              <span>{option.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {playbooks && playbooks.length > 1 && (
        <label className="match-new-playbook">
          <span>Playbook the coach teaches</span>
          <select
            value={playbook ?? playbooks.find((row) => row.house)?.id ?? ''}
            onChange={(event) => setPlaybook(Number(event.target.value))}
          >
            {playbooks.map((row) => (
              <option key={row.id} value={row.id}>
                {row.name}
                {row.house ? ' (house)' : row.mine ? ' (yours)' : ` (from ${row.author})`}
              </option>
            ))}
          </select>
        </label>
      )}

      <fieldset className="match-new-choices">
        <legend>Coach</legend>
        <label>
          <input type="radio" name="coach" checked={coach === 'progress'} onChange={() => setCoach('progress')} />
          <span>
            <strong>Follow my progress</strong>
            <span>Each rule family at the stage you have reached in it.</span>
          </span>
        </label>
        {([1, 2, 3, 4] as const).map((stage) => (
          <label key={stage}>
            <input
              type="radio"
              name="coach"
              checked={coach === String(stage)}
              onChange={() => setCoach(String(stage) as MatchCoachEnum)}
            />
            <span>
              <strong>
                Stage {stage}: {STAGES[stage].name}
              </strong>
              <span>
                {STAGES[stage].coach} {STAGES[stage].you}
              </span>
            </span>
          </label>
        ))}
      </fieldset>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <button type="button" className="button match-new-start" disabled={starting} onClick={start}>
        {starting ? 'Dealing…' : 'Start the match'}
      </button>

      {recent && recent.length > 0 && (
        <section className="card" aria-labelledby="match-recent">
          <h2 id="match-recent" className="card-header">
            Your matches
          </h2>
          <ol className="match-new-recent">
            {recent.map((match) => (
              <li key={match.id}>
                <span>
                  {formatDateTime(match.started)} · {OPPONENTS.find((option) => option.value === match.opponent)?.label}{' '}
                  · {match.hands_played} of {match.hands_planned} hands
                  {match.result_bb !== null &&
                    ` · ${match.result_bb > 0 ? '+' : ''}${match.result_bb.toLocaleString()} bb`}
                </span>
                <Link to={match.finished ? `/practice/match/${match.id}/debrief` : `/practice/match/${match.id}`}>
                  {match.finished ? 'Debrief' : 'Continue'}
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}
    </section>
  )
}

export default MatchNewPage
