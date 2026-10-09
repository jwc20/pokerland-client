import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { errorMessage, practice } from '../api/client.ts'
import type { PlayTableSummary, TableOpponentsEnum } from '../api/generated/data-contracts.ts'
import { formatDateTime } from '../handFormat.ts'
import { STYLE_LABELS } from '../practice.ts'
import './MatchNewPage.css'
import './PlayNewPage.css'

const OPPONENTS: { value: TableOpponentsEnum; label: string; hint: string }[] = [
  { value: 'mixed', label: 'A mix', hint: 'Each bot one of the four styles, drawn at random.' },
  { value: 'tag', label: STYLE_LABELS.tag, hint: 'Few hands, played hard.' },
  { value: 'lag', label: STYLE_LABELS.lag, hint: 'Many hands, bet and raised.' },
  { value: 'station', label: STYLE_LABELS.station, hint: 'They call too much and bet too little.' },
  { value: 'rock', label: STYLE_LABELS.rock, hint: 'They fold too much; a bet means a hand.' },
  {
    value: 'mine',
    label: 'Your own opponents',
    hint: 'Bots modelled on the players you have most hands with, from their statistics in your hands.',
  },
]
const STACKS = [20, 50, 100, 150, 250]

/**
 * A new Play it out table: you and up to eight bots, hand after hand. Practice in rhythm and arithmetic, not a measure
 * of skill: the bots are weak on purpose, and nothing here counts toward your scores.
 */
function PlayNewPage() {
  const navigate = useNavigate()
  const [seats, setSeats] = useState(6)
  const [opponents, setOpponents] = useState<TableOpponentsEnum>('mixed')
  const [stack, setStack] = useState(100)
  const [recent, setRecent] = useState<PlayTableSummary[]>()
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    let active = true
    practice.practiceTablesList().then(
      ({ data }) => {
        if (active) setRecent(data)
      },
      () => {}, // the page works without them
    )
    return () => {
      active = false
    }
  }, [])

  function start() {
    setStarting(true)
    practice.practiceTablesCreate({ seats, opponents, stack_bb: stack }).then(
      ({ data }) => navigate(`/practice/play/${data.id}`),
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
        <h1>Play it out</h1>
        <p>
          Whole hands against bots, at blinds of 50 and 100, a hand at a time. The bots are weak on purpose: this is
          practice in rhythm and arithmetic, and nothing here counts toward your scores. You can also play one of your
          own hands on from a spot: look for “Play it out” after answering it.
        </p>
      </header>

      <fieldset className="match-new-choices">
        <legend>Opponents</legend>
        {OPPONENTS.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name="opponents"
              checked={opponents === option.value}
              onChange={() => setOpponents(option.value)}
            />
            <span>
              <strong>{option.label}</strong>
              <span>{option.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="play-new-sizes">
        <label>
          Seats
          <select value={seats} onChange={(event) => setSeats(Number(event.target.value))}>
            {[2, 3, 4, 5, 6, 7, 8, 9].map((count) => (
              <option key={count} value={count}>
                {count === 2 ? '2: heads-up' : count}
              </option>
            ))}
          </select>
        </label>
        <label>
          Stacks
          <select value={stack} onChange={(event) => setStack(Number(event.target.value))}>
            {STACKS.map((depth) => (
              <option key={depth} value={depth}>
                {depth} bb
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <button type="button" className="button match-new-start" disabled={starting} onClick={start}>
        {starting ? 'Dealing…' : 'Sit down'}
      </button>

      {recent && recent.length > 0 && (
        <section className="card" aria-labelledby="play-recent">
          <h2 id="play-recent" className="card-header">
            Your tables
          </h2>
          <ol className="match-new-recent">
            {recent.map((table) => (
              <li key={table.id}>
                <span>
                  {formatDateTime(table.updated)} · {table.players} seats · {table.hands}{' '}
                  {table.hands === 1 ? 'hand' : 'hands'}
                  {table.from_spot && ' · from a spot'}
                </span>
                <Link to={`/practice/play/${table.id}`}>Back to the table</Link>
              </li>
            ))}
          </ol>
        </section>
      )}
    </section>
  )
}

export default PlayNewPage
