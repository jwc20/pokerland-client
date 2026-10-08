import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { errorMessage, practice } from '../api/client.ts'
import type {
  AttemptRequestRequest,
  AttemptResult,
  PracticeSet,
  ReasonEnum,
  Spot,
} from '../api/generated/data-contracts.ts'
import { browserTimeZone } from '../calendar.ts'
import ActionBar from '../components/ActionBar.tsx'
import { SpotPanel } from '../components/DecisionPanel.tsx'
import FeedbackCard from '../components/FeedbackCard.tsx'
import PokerTable from '../components/PokerTable.tsx'
import ReasonPicker from '../components/ReasonPicker.tsx'
import { heroM, pendingDecision } from '../decision.ts'
import { streetLabel } from '../handFormat.ts'
import { fillAmounts, GRADE_LABELS } from '../practice.ts'
import { buildReplay } from '../replay.ts'
import { formatUnit, type Unit } from '../table.ts'
import { useFourColour, useUnit } from '../useUnit.ts'
import './PracticeSetPage.css'

const KIND_LABELS = { daily: 'Today’s set', my_hands: 'My hands', generated: 'Generated', match: 'From a match' }

/** A practice set, one spot at a time: the table as it stood, the question, then the feedback. */
function PracticeSetPage() {
  const { id = '' } = useParams()
  // Remembers which id it holds, so a different set in the URL shows as loading.
  const [loaded, setLoaded] = useState<{ id: string; set?: PracticeSet; error?: string }>()

  useEffect(() => {
    if (!/^\d+$/.test(id)) return
    let active = true
    practice.practiceSetsRetrieve({ id: Number(id) }).then(
      ({ data }) => {
        if (active) setLoaded({ id, set: data })
      },
      (err) => {
        if (active) setLoaded({ id, error: errorMessage(err) })
      },
    )
    return () => {
      active = false
    }
  }, [id])

  const current = /^\d+$/.test(id) ? (loaded?.id === id ? loaded : undefined) : { id, error: 'Not found.' }
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
  const spec = scenario.spec
  const amount = (chips = 0) => formatUnit(chips, spec.hand.currency, spec.hand.big_blind, unit)
  const steps = useMemo(
    () => buildReplay(spec.hand, (chips = 0) => formatUnit(chips, spec.hand.currency, spec.hand.big_blind, unit)),
    [spec.hand, unit],
  )
  const step = steps[steps.length - 1]
  const decision = useMemo(() => pendingDecision(spec.hand, steps), [spec.hand, steps])
  const [panel, setPanel] = useState(true)
  const [reason, setReason] = useState<ReasonEnum>()
  const [confidence, setConfidence] = useState<number>()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string>()
  const [again, setAgain] = useState(false)
  const shownAt = useRef(0)

  useEffect(() => {
    shownAt.current = performance.now()
  }, [])

  function send(answer: Pick<AttemptRequestRequest, 'action' | 'amount' | 'choice'>) {
    if (sending || attempt) return
    setSending(true)
    const request: AttemptRequestRequest = {
      scenario: scenario.id,
      set: setId,
      ...answer,
      reason,
      confidence,
      time_taken: Math.round((performance.now() - shownAt.current) / 100) / 10,
      tz: browserTimeZone(),
    }
    practice.practiceAttemptsCreate(request).then(
      ({ data }) => onAnswered(data),
      (err) => {
        setSending(false)
        setError(errorMessage(err))
      },
    )
  }

  function againLater() {
    practice.practiceReviewsCreate({ scenario: scenario.id, tz: browserTimeZone() }).then(
      () => setAgain(true),
      (err) => setError(errorMessage(err)),
    )
  }

  // 1 to 4 answer a choice.
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    if (attempt || spec.question.kind !== 'choice' || target.closest('input, select, textarea')) return
    const index = Number(event.key) - 1
    if (index >= 0 && index < (spec.question.options?.length ?? 0)) {
      event.preventDefault()
      send({ choice: index })
    }
  })
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const result = attempt?.answer.result
  return (
    <div className="practice-spot">
      <div className="practice-spot-heading">
        <p className="practice-spot-count">
          Spot {number} of {total} · {streetLabel(step.street)}
          {spot.review && ' · coming back for another look'}
        </p>
        <h2 className="practice-prompt">{fillAmounts(spec.question.prompt, spec.question.amounts, amount)}</h2>
      </div>

      <div className={spec.panel && panel && decision ? 'practice-spot-main with-panel' : 'practice-spot-main'}>
        <div className="practice-spot-table">
          <PokerTable
            step={step}
            hand={spec.hand}
            labels={spec.labels}
            unit={unit}
            revealed={spec.revealed}
            actor={attempt ? undefined : spec.hand.hero}
            fourColour={fourColour}
          />
          <p className="practice-spot-log" aria-live="polite">
            {streetLabel(step.street)} – {step.text}
          </p>
          <details className="practice-spot-history">
            <summary>Hand log</summary>
            <ol>
              {steps.slice(1).map((past, i) => (
                <li key={i}>
                  {streetLabel(past.street)} – {past.text}
                </li>
              ))}
            </ol>
          </details>
        </div>
        {spec.panel && decision && panel && <SpotPanel decision={decision} hand={spec.hand} m={heroM(spec.hand)} />}
      </div>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {attempt ? (
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
              {result && (
                <Link className="link-button" to={`/games/${result.hand}?step=${result.step}`}>
                  Open the replay
                </Link>
              )}
            </>
          }
        />
      ) : spec.question.kind === 'choice' ? (
        <div className="practice-choices" role="group" aria-label="Answers">
          {(spec.question.options ?? []).map((option, i) => (
            <button key={option} type="button" disabled={sending} onClick={() => send({ choice: i })}>
              <span className="practice-choice-key">{i + 1}</span>
              {option}
            </button>
          ))}
        </div>
      ) : (
        spec.legal && (
          <div className="practice-answer">
            <ReasonPicker value={reason} onChange={setReason} />
            <Confidence value={confidence} onChange={setConfidence} />
            <ActionBar
              legal={spec.legal}
              pot={step.seats.reduce((sum, seat) => sum + seat.bet, step.pot)}
              currency={spec.hand.currency}
              bigBlind={spec.hand.big_blind}
              unit={unit}
              allInOnly={spec.question.all_in_only}
              disabled={sending}
              onAct={(action, amount) => send({ action, amount })}
            />
          </div>
        )
      )}

      {spec.panel && decision && (
        <button type="button" className="link-button practice-panel-toggle" onClick={() => setPanel(!panel)}>
          {panel ? 'Hide the numbers' : 'Show the numbers'}
        </button>
      )}
    </div>
  )
}

/** How sure you are, 1 to 5: kept with the answer, for the spots no answer can check. */
function Confidence({ value, onChange }: { value?: number; onChange: (value?: number) => void }) {
  return (
    <fieldset className="practice-confidence">
      <legend>
        How sure? <span>(optional)</span>
      </legend>
      {[1, 2, 3, 4, 5].map((level) => (
        <label key={level}>
          <input
            type="radio"
            name="confidence"
            checked={value === level}
            onChange={() => onChange(level)}
            onClick={() => value === level && onChange(undefined)}
          />
          {level}
        </label>
      ))}
    </fieldset>
  )
}

/** A spot's question with its amounts in the unit chosen. */
function promptText(spot: Spot, unit: Unit) {
  const { hand, question } = spot.scenario.spec
  return fillAmounts(question.prompt, question.amounts, (chips) =>
    formatUnit(chips, hand.currency, hand.big_blind, unit),
  )
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
