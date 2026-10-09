import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { changes } from '../api/changes.ts'
import { errorMessage, practice } from '../api/client.ts'
import { queries } from '../api/queries.ts'
import type {
  AttemptRequestRequest,
  AttemptResult,
  PracticeSet,
  PracticeSetKindEnum,
  Spot,
} from '../api/generated/data-contracts.ts'
import { browserTimeZone } from '../calendar.ts'
import FeedbackCard from '../components/FeedbackCard.tsx'
import SpotQuestion, { type SpotAnswer } from '../components/SpotQuestion.tsx'
import { fillAmounts, GRADE_LABELS, specAmount } from '../practice.ts'
import type { Unit } from '../table.ts'
import { useFourColour, useUnit } from '../useUnit.ts'
import './PracticeSetPage.css'

const KIND_LABELS: Record<PracticeSetKindEnum, string> = {
  daily: 'Today’s set',
  my_hands: 'My hands',
  generated: 'Generated',
  match: 'From a match',
  library: 'The library',
  their_seat: 'Their seat',
  shared: 'From your classes',
  test: 'Aptitude test',
}

/** A practice set, one spot at a time: the table as it stood, the question, then the feedback. */
function PracticeSetPage() {
  const { id = '' } = useParams()
  const valid = /^\d+$/.test(id)
  // The set as the server has it on each visit: the player below takes it from there.
  const query = useQuery({ ...queries.practice.set(Number(id)), enabled: valid })
  const current: { set?: PracticeSet; error?: string } | undefined = !valid
    ? { error: 'Not found.' }
    : query.error
      ? { error: errorMessage(query.error) }
      : query.data && { set: query.data }
  return (
    <section className="practice-set">
      <Link className="back-link" to="/practice">
        ← Practice
      </Link>
      {current?.set ? (
        <SetPlayer key={current.set.id} initial={current.set} />
      ) : current?.error ? (
        <p className="error-message" role="alert">
          {current.error}
        </p>
      ) : (
        <p>Loading…</p>
      )}
    </section>
  )
}

/** Plays a set: the spot in the URL, or the first one not answered yet, and a summary once all are. */
function SetPlayer({ initial }: { initial: PracticeSet }) {
  const [practiceSet, setPracticeSet] = useState(initial)
  const [params, setParams] = useSearchParams()
  const { unit, toggle: toggleUnit } = useUnit()
  const { fourColour, toggle: toggleDeck } = useFourColour()
  const spots = practiceSet.spots
  const asked = Number(params.get('spot'))
  const open = spots.findIndex((spot) => !spot.attempt)
  const position = params.has('spot') && spots[asked] ? asked : open
  const spot = position >= 0 ? spots[position] : undefined

  function show(next: number | undefined) {
    // The URL as it is now: React Router renders a navigation later, so `params` may be a change behind.
    const query = new URLSearchParams(window.location.search)
    if (next === undefined) query.delete('spot')
    else query.set('spot', String(next))
    setParams(query)
  }

  function answered(attempt: AttemptResult) {
    setPracticeSet((previous) => ({
      ...previous,
      spots: previous.spots.map((other) => (other.scenario.id === attempt.scenario ? { ...other, attempt } : other)),
    }))
    show(position) // stays on the spot, for its feedback, rather than moving on to the next one not answered
  }

  const nextOpen = spots.findIndex((other, i) => i > position && !other.attempt)
  const after = nextOpen >= 0 ? nextOpen : spots.findIndex((other) => !other.attempt && other !== spot)

  return (
    <div className="practice-player">
      <header className="practice-player-header">
        <h1>{KIND_LABELS[practiceSet.kind]}</h1>
        <ol className="practice-dots" aria-label="Spots">
          {spots.map((other, i) => (
            <li
              key={other.position}
              className={[other.attempt?.grade ?? 'open', i === position && 'current'].filter(Boolean).join(' ')}
            >
              <button
                type="button"
                onClick={() => show(i)}
                aria-label={`Spot ${i + 1}: ${other.attempt ? GRADE_LABELS[other.attempt.grade] : 'not answered'}`}
                aria-current={i === position ? 'step' : undefined}
              />
            </li>
          ))}
        </ol>
        <div className="practice-toggles">
          <button type="button" onClick={toggleUnit} aria-pressed={unit === 'bb'} title="Big blinds or chips (B)">
            Units: {unit === 'bb' ? 'bb' : 'chips'}
          </button>
          <button type="button" onClick={toggleDeck} aria-pressed={fourColour}>
            Four-colour deck
          </button>
        </div>
      </header>

      {spot ? (
        <SpotView
          key={spot.scenario.id}
          spot={spot}
          number={position + 1}
          total={spots.length}
          setId={practiceSet.id}
          unit={unit}
          fourColour={fourColour}
          onAnswered={answered}
          onNext={after >= 0 ? () => show(after) : () => show(undefined)}
          last={after < 0}
        />
      ) : (
        <Summary practiceSet={practiceSet} unit={unit} onOpen={show} />
      )}
    </div>
  )
}

function SpotView({
  spot,
  number,
  total,
  setId,
  unit,
  fourColour,
  onAnswered,
  onNext,
  last,
}: {
  spot: Spot
  number: number
  total: number
  setId: number
  unit: Unit
  fourColour: boolean
  onAnswered: (attempt: AttemptResult) => void
  onNext: () => void
  last: boolean
}) {
  const { scenario, attempt } = spot
  const navigate = useNavigate()
  const client = useQueryClient()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string>()
  const [again, setAgain] = useState(false)
  // A spot from one of your own hold'em hands can be played on from its decision, against bots modelled on the others.
  const playable = scenario.source === 'own_hand' && scenario.spec.hand?.game === "Hold'em No Limit"

  function playOut() {
    practice.practiceTablesCreate({ scenario: scenario.id }).then(
      ({ data }) => {
        void changes.practiceList(client, 'tables')
        navigate(`/practice/play/${data.id}`)
      },
      (err) => setError(errorMessage(err)),
    )
  }

  function send(answer: SpotAnswer) {
    if (sending || attempt) return
    setSending(true)
    const request: AttemptRequestRequest = { scenario: scenario.id, set: setId, ...answer, tz: browserTimeZone() }
    practice.practiceAttemptsCreate(request).then(
      ({ data }) => {
        void changes.answer(client)
        onAnswered(data)
      },
      (err) => {
        setSending(false)
        setError(errorMessage(err))
      },
    )
  }

  function againLater() {
    practice.practiceReviewsCreate({ scenario: scenario.id, tz: browserTimeZone() }).then(
      () => {
        void changes.answer(client) // the profile counts the reviews due
        setAgain(true)
      },
      (err) => setError(errorMessage(err)),
    )
  }

  const result = attempt?.answer.result
  return (
    <SpotQuestion
      scenario={scenario}
      heading={`Spot ${number} of ${total}${spot.review ? ' · coming back for another look' : ''}`}
      unit={unit}
      fourColour={fourColour}
      study
      answered={Boolean(attempt)}
      outcome={attempt?.outcome}
      busy={sending}
      onAnswer={send}
    >
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      {attempt && (
        <FeedbackCard
          scenario={scenario}
          attempt={attempt}
          unit={unit}
          actions={
            <>
              <button type="button" className="button" onClick={onNext}>
                {last ? 'See the set' : 'Next spot →'}
              </button>
              <button type="button" className="link-button" disabled={again} onClick={againLater}>
                {again ? 'It will come back tomorrow' : 'Again later'}
              </button>
              {result?.hand && (
                <Link className="link-button" to={`/games/${result.hand}?step=${result.step}`}>
                  Open the replay
                </Link>
              )}
              {playable && (
                <button type="button" className="link-button" onClick={playOut}>
                  Play it out
                </button>
              )}
            </>
          }
        />
      )}
    </SpotQuestion>
  )
}

/** A spot's question with its amounts in the unit chosen. */
function promptText(spot: Spot, unit: Unit) {
  const { spec } = spot.scenario
  return fillAmounts(spec.question.prompt, spec.question.amounts, (chips) => specAmount(spec, unit, chips))
}

/** The set once every spot is answered: each spot's grade, and where to go next. */
function Summary({
  practiceSet,
  unit,
  onOpen,
}: {
  practiceSet: PracticeSet
  unit: Unit
  onOpen: (position: number) => void
}) {
  const graded = practiceSet.spots.filter((spot) => spot.attempt && spot.attempt.grade !== 'ungraded')
  const good = graded.filter((spot) => spot.attempt?.grade === 'good').length
  return (
    <section className="card practice-summary" aria-labelledby="practice-summary">
      <h2 id="practice-summary" className="card-header">
        Set done
      </h2>
      <div className="card-body">
        <p>
          {graded.length
            ? `${good} of ${graded.length} graded spots good.`
            : 'None of these spots had an answer to grade against.'}{' '}
          Misses come back in a later set.
        </p>
        <ol className="practice-summary-list">
          {practiceSet.spots.map((spot, i) => (
            <li key={spot.position}>
              <button type="button" className="link-button" onClick={() => onOpen(i)}>
                Spot {i + 1}: {promptText(spot, unit)}
              </button>
              <span className={`practice-summary-grade ${spot.attempt?.grade ?? 'open'}`}>
                {spot.attempt ? GRADE_LABELS[spot.attempt.grade] : 'Not answered'}
              </span>
            </li>
          ))}
        </ol>
        <Link className="button" to="/practice">
          Back to practice
        </Link>
      </div>
    </section>
  )
}

export default PracticeSetPage
