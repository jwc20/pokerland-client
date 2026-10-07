import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { errorMessage, hands } from '../api/client.ts'
import type { HandCalendar, HandTag } from '../api/generated/data-contracts.ts'
import { useAuth } from '../auth/useAuth.ts'
import { browserTimeZone } from '../calendar.ts'
import ResultsCalendar from '../components/ResultsCalendar.tsx'
import StreakCalendar from '../components/StreakCalendar.tsx'
import TagChips from '../components/TagChips.tsx'
import TagGauge from '../components/TagGauge.tsx'
import TagHands from '../components/TagHands.tsx'
import { useToday } from '../useToday.ts'
import { formatAgo, useTrackerStatus } from '../useTrackerStatus.ts'
import './HomePage.css'

/** The days the user played on, counted in their time zone, or in UTC if the API doesn't know it. */
async function loadCalendar() {
  try {
    return (await hands.handsDaysRetrieve({ tz: browserTimeZone() })).data
  } catch (err) {
    if (err instanceof Response && err.status === 400) return (await hands.handsDaysRetrieve({ tz: 'UTC' })).data
    throw err
  }
}

function HomePage() {
  const { user } = useAuth()
  const { status, error: statusError } = useTrackerStatus()
  const today = useToday()
  const [searchParams, setSearchParams] = useSearchParams()
  const [dashboard, setDashboard] = useState<{ calendar: HandCalendar; tags: HandTag[] }>()
  const [error, setError] = useState<string | null>(null)

  // Loads once the tracker status is in, then again when it counts new hands,
  // and at midnight, when a streak can end without any.
  const statusKnown = status !== undefined || statusError !== null
  const handsSeen = status?.hands_seen
  useEffect(() => {
    if (!statusKnown) return
    let active = true
    Promise.all([loadCalendar(), hands.handsTagsList()]).then(
      ([calendar, { data: tags }]) => {
        if (!active) return
        setDashboard({ calendar, tags })
        setError(null)
      },
      (err) => {
        if (active) setError(errorMessage(err))
      },
    )
    return () => {
      active = false
    }
  }, [statusKnown, handsSeen, today])

  // The chosen tag is in the URL, so it survives a reload; one without hands any more falls back to all.
  const selected = searchParams.get('tag') ?? 'all'
  const tag = dashboard?.tags.find((candidate) => candidate.key === selected) ?? dashboard?.tags[0]

  function selectTag(key: string) {
    setSearchParams(key === 'all' ? {} : { tag: key }, { replace: true })
  }

  return (
    <section className="home">
      <header className="home-header">
        <h1>Welcome, {user?.username}</h1>
        {status?.last_upload_at ? (
          <p>
            Your tracker last uploaded {formatAgo(status.last_upload_at)}: {status.hands_seen.toLocaleString()}{' '}
            hands from {status.file_count.toLocaleString()} files so far. Replay them from your{' '}
            <Link to="/games">game history</Link>.
          </p>
        ) : (
          <p>
            To start collecting hands, install the tracker from <Link to="/settings">Settings</Link>.
          </p>
        )}
      </header>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      {dashboard === undefined
        ? !error && <p>Loading…</p>
        : tag &&
          dashboard.calendar.days.length > 0 && (
            <>
              <ResultsCalendar days={dashboard.calendar.days} today={today} />
              <div className="home-grid">
                <div className="home-column">
                  <TagChips tags={dashboard.tags} selected={tag.key} onSelect={selectTag} />
                  <TagHands tag={tag} />
                </div>
                <div className="home-column home-rail">
                  <TagGauge tag={tag} />
                  <StreakCalendar calendar={dashboard.calendar} today={today} />
                </div>
              </div>
            </>
          )}
    </section>
  )
}

export default HomePage
