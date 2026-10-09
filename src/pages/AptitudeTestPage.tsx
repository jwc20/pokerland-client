import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { errorMessage, practice } from '../api/client.ts'
import type { TestReport, TestReportSpot, TestState } from '../api/generated/data-contracts.ts'
import { browserTimeZone } from '../calendar.ts'
import FeedbackCard from '../components/FeedbackCard.tsx'
import SkillBars from '../components/SkillBars.tsx'
import SpotQuestion, { type SpotAnswer } from '../components/SpotQuestion.tsx'
import { formatDateTime } from '../handFormat.ts'
import { fillAmounts, GRADE_LABELS, GRADING_INFO, specAmount } from '../practice.ts'
import type { Unit } from '../table.ts'
import { useFourColour, useUnit } from '../useUnit.ts'
import './AptitudeTestPage.css'

type Loaded = { id: string; state?: TestState; report?: TestReport; error?: string }

/** A test and its report, by its id: the state as it stands, and the report once it is over. */
async function loadTest(id: number): Promise<Pick<Loaded, 'state' | 'report'>> {
  const { data: state } = await practice.practiceTestsNextRetrieve({ id })
  if (!state.finished) return { state }
  const { data: report } = await practice.practiceTestsRetrieve({ id })
  return { state, report }
}

/** An aptitude test: one spot at a time, nothing graded until the end, then the report. */
function AptitudeTestPage() {
  const { id = '' } = useParams()
  const [loaded, setLoaded] = useState<Loaded>()

  useEffect(() => {
    if (!/^\d+$/.test(id)) return
    let active = true
    loadTest(Number(id)).then(
      (data) => {
        if (active) setLoaded({ id, ...data })
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
    <section className="aptitude-test">
      <Link className="back-link" to="/practice/test">
        ← Aptitude tests
      </Link>
      {current?.report ? (
        <Report report={current.report} />
      ) : current?.state ? (
        <Runner
          key={current.state.id}
          initial={current.state}
          onFinished={(report, state) => setLoaded({ id, state, report })}
        />
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

/** The test as it runs: its progress, and the spot it asks now. No grade comes back until the end. */
function Runner({
  initial,
  onFinished,
}: {
  initial: TestState
  onFinished: (report: TestReport, state: TestState) => void
}) {
  const [state, setState] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()
  const { unit, toggle: toggleUnit } = useUnit()
  const { fourColour, toggle: toggleDeck } = useFourColour()

  function after(next: TestState) {
    if (!next.finished) {
      setState(next)
      setBusy(false)
      return
    }
    practice.practiceTestsRetrieve({ id: next.id }).then(
      ({ data }) => onFinished(data, next),
      (err) => {
        setBusy(false)
        setError(errorMessage(err))
      },
    )
  }

  function send(request: () => ReturnType<typeof practice.practiceTestsNextRetrieve>) {
    setBusy(true)
    setError(undefined)
    request().then(
      ({ data }) => after(data),
      (err) => {
        setBusy(false)
        setError(errorMessage(err))
      },
    )
  }

  function answer(given: SpotAnswer) {
    if (!state.spot) return
    const body = { scenario: state.spot.scenario.id, ...given, tz: browserTimeZone() }
    send(() => practice.practiceTestsAnswerCreate({ id: state.id }, body))
  }

  const number = state.answered + 1
  return (
    <div className="aptitude-runner">
      <header className="aptitude-runner-header">
        <h1>Aptitude test</h1>
        <div className="aptitude-progress">
          <progress max={state.planned} value={state.answered} aria-label="Spots answered" />
          <span>
            {state.answered} of {state.planned} answered
          </span>
        </div>
        <div className="practice-toggles">
          <button type="button" onClick={toggleUnit} aria-pressed={unit === 'bb'} title="Big blinds or chips (B)">
            Units: {unit === 'bb' ? 'bb' : 'chips'}
          </button>
          <button type="button" onClick={toggleDeck} aria-pressed={fourColour}>
            Four-colour deck
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => send(() => practice.practiceTestsEndCreate({ id: state.id }))}
          >
            End the test
          </button>
        </div>
      </header>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      {state.spot ? (
        <SpotQuestion
          key={state.spot.scenario.id}
          scenario={state.spot.scenario}
          heading={`Spot ${number} of ${state.planned}`}
          unit={unit}
          fourColour={fourColour}
          study={false}
          answered={false}
          busy={busy}
          onAnswer={answer}
        />
      ) : (
        <p>{busy ? 'Working out your report…' : 'No spot to ask right now.'}</p>
      )}
    </div>
  )
}

/** The report: accuracy and rating by skill, the result in words, what to practise next, and every spot. */
function Report({ report }: { report: TestReport }) {
  const navigate = useNavigate()
  const { unit } = useUnit()
  const [error, setError] = useState<string>()
  const skills = report.skills.map((skill) => ({
    ...skill,
    attempts: skill.spots,
    rating: skill.rating_shown ? skill.rating : null,
  }))
  const next = report.next

  function practise() {
    if (!next) return
    practice.practiceSetsCreate({ kind: 'generated', skill: next.skill, tz: browserTimeZone() }).then(
      ({ data }) => navigate(`/practice/set/${data.id}`),
      (err) => setError(errorMessage(err)),
    )
  }

  return (
    <div className="aptitude-report">
      <header>
        <h1>Your aptitude</h1>
        <p>
          {report.answered} of {report.planned} spots
          {report.minutes !== null && ` in ${report.minutes.toLocaleString()} minutes`}, finished{' '}
          {formatDateTime(report.finished)}. How well you decided in these spots, skill by skill; whether it predicts
          results at the table isn’t known yet.
        </p>
      </header>

      <section className="card" aria-labelledby="aptitude-skills">
        <h2 id="aptitude-skills" className="card-header">
          By skill
        </h2>
        <div className="card-body">
          <p className="card-hint">
            The share of the test’s answers that were good in each skill, with its 95% range: a rule of thumb counts
            half. The rating, against the spots’ difficulty, shows once its range is narrow enough.
          </p>
          <SkillBars skills={skills} />
        </div>
      </section>

      <section className="card" aria-labelledby="aptitude-words">
        <h2 id="aptitude-words" className="card-header">
          Strengths and gaps
        </h2>
        <ul className="card-body aptitude-words">
          {report.skills.map((skill) => (
            <li key={skill.skill}>{skill.words}</li>
          ))}
        </ul>
      </section>

      {next && (
        <section className="card" aria-labelledby="aptitude-next">
          <h2 id="aptitude-next" className="card-header">
            What to practise next
          </h2>
          <div className="card-body">
            <p>
              {next.label}:{' '}
              {next.trusted
                ? 'your weakest skill among those whose range is narrow enough to trust.'
                : 'your weakest skill so far, though every range is still wide.'}
            </p>
            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}
            {next.generated ? (
              <button type="button" className="button aptitude-next-button" onClick={practise}>
                Practise {next.label.toLowerCase()}: 8 spots
              </button>
            ) : (
              <Link className="button aptitude-next-button" to="/practice">
                Go to practice
              </Link>
            )}
          </div>
        </section>
      )}

      <section className="card" aria-labelledby="aptitude-spots">
        <h2 id="aptitude-spots" className="card-header">
          The test’s spots
        </h2>
        <ol className="card-body aptitude-spots">
          {report.spots.map((spot) => (
            <ReportSpot key={spot.position} spot={spot} unit={unit} />
          ))}
        </ol>
      </section>
    </div>
  )
}

/** One of the test's spots: its question, your grade and the answer's basis, and the feedback card on demand. */
function ReportSpot({ spot, unit }: { spot: TestReportSpot; unit: Unit }) {
  const [open, setOpen] = useState(false)
  const { scenario, attempt } = spot
  const prompt = fillAmounts(scenario.spec.question.prompt, scenario.spec.question.amounts, (chips) =>
    specAmount(scenario.spec, unit, chips),
  )
  return (
    <li>
      <div className="aptitude-spot-row">
        <span className="aptitude-spot-prompt">{prompt}</span>
        <span className={`aptitude-spot-grade ${attempt.grade}`}>{GRADE_LABELS[attempt.grade]}</span>
        <span className="aptitude-spot-basis">{GRADING_INFO[attempt.grading].label}</span>
        <button type="button" className="link-button" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? 'Hide' : 'Show the answer'}
        </button>
      </div>
      {open && <FeedbackCard scenario={scenario} attempt={attempt} unit={unit} />}
    </li>
  )
}

export default AptitudeTestPage
