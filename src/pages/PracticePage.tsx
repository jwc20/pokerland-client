import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { errorMessage, practice } from '../api/client.ts'
import type { PracticeProfile, PracticeSet, PracticeSkillEnum } from '../api/generated/data-contracts.ts'
import { queries } from '../api/queries.ts'
import { browserTimeZone } from '../calendar.ts'
import SkillBars from '../components/SkillBars.tsx'
import { GENERATED_HINTS, GRADE_LABELS } from '../practice.ts'
import './PracticePage.css'

/**
 * Practice: today's short set, the modes to drill one kind of spot, and accuracy by skill with its range. Your
 * own hands come in once they are a day old, so practice never runs alongside a session.
 */
function PracticePage() {
  const navigate = useNavigate()
  // The profile and today's set, by days in the viewer's time zone: fetched afresh on every visit, as answers move
  // them on. Today's set is made by the server the first time it is asked for.
  const profileQuery = useQuery(queries.practice.profile())
  const todayQuery = useQuery(queries.practice.today())
  const loaded: { profile: PracticeProfile; today: PracticeSet } | undefined =
    profileQuery.data && todayQuery.data ? { profile: profileQuery.data, today: todayQuery.data } : undefined
  const [startError, setStartError] = useState<string>()
  const failed = profileQuery.error ?? todayQuery.error
  const error = startError ?? (failed ? errorMessage(failed) : undefined)
  const [skill, setSkill] = useState<PracticeSkillEnum>('arithmetic')
  const [starting, setStarting] = useState(false)
  const [notice, setNotice] = useState<string>()

  /** A new set of one mode: a POST that makes one, so it is sent each time, never shared with another request. */
  function start(kind: 'my_hands' | 'generated' | 'library' | 'their_seat' | 'shared') {
    setStarting(true)
    setNotice(undefined)
    setStartError(undefined)
    practice.practiceSetsCreate({ kind, skill: kind === 'generated' ? skill : undefined, tz: browserTimeZone() }).then(
      ({ data }) => {
        if (kind === 'shared' && data.spots.length === 0) {
          setStarting(false)
          setNotice(
            'No hands to practise from your classes yet: a hand comes in a day after it was played, once someone ' +
              'in one of your classes shares it from its replay.',
          )
          return
        }
        navigate(`/practice/set/${data.id}`)
      },
      (err) => {
        setStarting(false)
        setStartError(errorMessage(err))
      },
    )
  }

  return (
    <section className="practice">
      <header className="practice-header">
        <h1>Practice</h1>
        <p>
          Choose before you see the answer. Short sets of spots from your own hands and generated ones, each graded
          by how its answer is worked out, never by the card that came.
        </p>
      </header>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      {!loaded ? (
        !error && <p>Loading…</p>
      ) : (
        <>
          <div className="practice-grid">
            <TodayCard today={loaded.today} profile={loaded.profile} />

            <section className="card" aria-labelledby="practice-modes">
              <h2 id="practice-modes" className="card-header">
                Modes
              </h2>
              <div className="card-body practice-modes">
                <div className="practice-mode">
                  <div>
                    <h3>My hands</h3>
                    <p>Your own decisions, from the moment before each one: the ones worth studying first.</p>
                  </div>
                  <button type="button" className="button" disabled={starting} onClick={() => start('my_hands')}>
                    Play 8
                  </button>
                </div>
                <div className="practice-mode">
                  <div>
                    <h3>Their seat</h3>
                    <p>
                      Your opponents’ decisions in your hands, when their cards were shown: play them from their
                      chair, and read their range from their line before their cards turn over.
                    </p>
                  </div>
                  <button type="button" className="button" disabled={starting} onClick={() => start('their_seat')}>
                    Play 8
                  </button>
                </div>
                <div className="practice-mode">
                  <div>
                    <h3>From your classes</h3>
                    <p>
                      Hands shared with <Link to="/classes">your classes</Link>, anonymized: play the sharer’s
                      decisions from their seat, then see what the playbook says and what they did.
                    </p>
                    {notice && (
                      <p className="practice-notice" role="status">
                        {notice}
                      </p>
                    )}
                  </div>
                  <button type="button" className="button" disabled={starting} onClick={() => start('shared')}>
                    Play 8
                  </button>
                </div>
                <div className="practice-mode">
                  <div>
                    <h3>Generated</h3>
                    <p>{GENERATED_HINTS[skill]}</p>
                    <select
                      value={skill}
                      onChange={(event) => setSkill(event.target.value as PracticeSkillEnum)}
                      aria-label="Skill"
                    >
                      {loaded.profile.generated.map((option) => (
                        <option key={option.skill} value={option.skill}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="button" className="button" disabled={starting} onClick={() => start('generated')}>
                    Play 8
                  </button>
                </div>
                <div className="practice-mode">
                  <div>
                    <h3>Aptitude test</h3>
                    <p>
                      24 graded spots across every skill, at about your level, and a report at the end: accuracy and
                      rating by skill, with their ranges.
                    </p>
                  </div>
                  <Link className="button" to="/practice/test">
                    Open
                  </Link>
                </div>
                <div className="practice-mode">
                  <div>
                    <h3>Library</h3>
                    <p>
                      Worked examples from the lectures: pot odds, M, the AKQ game, push-or-fold and the bubble, each
                      credited to its lecture.
                    </p>
                  </div>
                  <button type="button" className="button" disabled={starting} onClick={() => start('library')}>
                    Play 8
                  </button>
                </div>
                <div className="practice-mode">
                  <div>
                    <h3>Play it out</h3>
                    <p>
                      Whole hands against bots at a table of two to nine: styles, or bots modelled on your own
                      opponents. Practice in rhythm, outside every score.
                    </p>
                  </div>
                  <Link className="button" to="/practice/play/new">
                    Sit down
                  </Link>
                </div>
                <div className="practice-mode">
                  <div>
                    <h3>Coached match</h3>
                    <p>
                      A short heads-up match against a bot with a leak, and a coach in your corner who talks less every
                      match.
                    </p>
                  </div>
                  <Link className="button" to="/practice/match/new">
                    Start
                  </Link>
                </div>
                <div className="practice-mode">
                  <div>
                    <h3>Playbook</h3>
                    <p>The rules the coach teaches, and how often your own hands kept each one.</p>
                  </div>
                  <Link className="button" to="/practice/playbook">
                    Open
                  </Link>
                </div>
              </div>
            </section>
          </div>

          <section className="card" aria-labelledby="practice-skills">
            <h2 id="practice-skills" className="card-header">
              Your skills
            </h2>
            <div className="card-body">
              <p className="card-hint">
                The share of your graded answers that were good, with its 95% range. A rule of thumb counts half; a
                spot with no answer to check against isn't graded.
              </p>
              <SkillBars skills={loaded.profile.skills} />
            </div>
          </section>
        </>
      )}
    </section>
  )
}

function TodayCard({ today, profile }: { today: PracticeSet; profile: PracticeProfile }) {
  const answered = today.spots.filter((spot) => spot.attempt).length
  const total = today.spots.length
  const done = answered === total && total > 0
  const streak = profile.current_streak
  return (
    <section className="card" aria-labelledby="practice-today">
      <h2 id="practice-today" className="card-header">
        Today’s set: {total} {total === 1 ? 'spot' : 'spots'}
      </h2>
      <div className="card-body">
        <ol className="practice-dots" aria-label={`${answered} of ${total} answered`}>
          {today.spots.map((spot) => (
            <li
              key={spot.position}
              className={spot.attempt?.grade ?? 'open'}
              title={spot.attempt ? GRADE_LABELS[spot.attempt.grade] : 'Not answered yet'}
            />
          ))}
        </ol>
        <p>
          {done
            ? 'Done for today. Misses come back in a later set.'
            : answered
              ? `${answered} of ${total} answered.`
              : 'A mix of your own decisions, the arithmetic behind them, and generated spots.'}
          {today.spots.some((spot) => spot.review) && ' Some are coming back for another look.'}
        </p>
        <p className="practice-streak">
          {streak ? `Practice streak: ${streak} ${streak === 1 ? 'day' : 'days'}` : 'No practice streak yet'}
          {profile.best_streak > streak && ` · best ${profile.best_streak}`}
        </p>
        <Link className="button practice-start" to={`/practice/set/${today.id}`}>
          {done ? 'Review the set' : answered ? 'Continue' : 'Start'}
        </Link>
      </div>
    </section>
  )
}

export default PracticePage
