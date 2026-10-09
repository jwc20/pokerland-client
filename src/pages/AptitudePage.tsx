import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { errorMessage, practice } from '../api/client.ts'
import type { TestSummary } from '../api/generated/data-contracts.ts'
import { browserTimeZone } from '../calendar.ts'
import { formatDateTime } from '../handFormat.ts'
import './AptitudePage.css'

/**
 * The aptitude test, before it starts: what it is, the tests taken so far, and a start button. 24 graded spots that
 * probe every skill and then go where the score is least certain, with nothing graded until the end.
 */
function AptitudePage() {
  const navigate = useNavigate()
  const [tests, setTests] = useState<TestSummary[]>()
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    let active = true
    practice.practiceTestsList().then(
      ({ data }) => {
        if (active) setTests(data)
      },
      () => {}, // the page works without them
    )
    return () => {
      active = false
    }
  }, [])

  function start() {
    setStarting(true)
    practice.practiceTestsCreate({ tz: browserTimeZone() }).then(
      ({ data }) => navigate(`/practice/test/${data.id}`),
      (err) => {
        setStarting(false)
        setError(errorMessage(err))
      },
    )
  }

  return (
    <section className="aptitude">
      <Link className="back-link" to="/practice">
        ← Practice
      </Link>
      <header>
        <h1>Aptitude test</h1>
        <p>
          24 spots, about twelve minutes: arithmetic, preflop, postflop, push-or-fold and hand reading. The first spots
          probe every skill; after that each one goes where your score is least certain, at about your level.
        </p>
        <ul className="aptitude-rules">
          <li>Only spots with an answer to check come up: exact ones, reference ranges and rules of thumb.</li>
          <li>Nothing is graded until the end, and the decision panel stays off.</li>
          <li>Spots you have answered before don’t come back while there are others.</li>
          <li>
            The score says how well you decided in these spots. Whether it predicts results at the table isn’t known
            yet.
          </li>
        </ul>
      </header>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <button type="button" className="button aptitude-start" disabled={starting} onClick={start}>
        {starting ? 'Choosing the first spot…' : 'Start the test'}
      </button>

      {tests && tests.length > 0 && (
        <section className="card" aria-labelledby="aptitude-past">
          <h2 id="aptitude-past" className="card-header">
            Your tests
          </h2>
          <ol className="aptitude-past">
            {tests.map((test) => (
              <li key={test.id}>
                <span>
                  {formatDateTime(test.started)} · {test.answered} of {test.planned} spots
                </span>
                <Link to={`/practice/test/${test.id}`}>{test.finished ? 'Report' : 'Continue'}</Link>
              </li>
            ))}
          </ol>
        </section>
      )}
    </section>
  )
}

export default AptitudePage
