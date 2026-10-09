import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router'
import { errorMessage } from '../api/client.ts'
import { queries } from '../api/queries.ts'
import { useAuth } from '../auth/useAuth.ts'
import DisciplineCard from '../components/DisciplineCard.tsx'
import ResultsCalendar from '../components/ResultsCalendar.tsx'
import ReviewQueue from '../components/ReviewQueue.tsx'
import StreakCalendar from '../components/StreakCalendar.tsx'
import TagChips from '../components/TagChips.tsx'
import TagGauge from '../components/TagGauge.tsx'
import TagHands from '../components/TagHands.tsx'
import { useToday } from '../useToday.ts'
import { formatAgo, useTrackerStatus } from '../useTrackerStatus.ts'
import './HomePage.css'

function HomePage() {
  const { user } = useAuth()
  const { status } = useTrackerStatus()
  const today = useToday()
  const [searchParams, setSearchParams] = useSearchParams()
  // The days played, kept by today's date so a streak can end at midnight without new hands; an upload refreshes
  // both (UploadWatcher).
  const calendarQuery = useQuery(queries.hands.days(today))
  const tagsQuery = useQuery(queries.hands.tags())
  const dashboard =
    calendarQuery.data && tagsQuery.data ? { calendar: calendarQuery.data, tags: tagsQuery.data } : undefined
  const failed = calendarQuery.error ?? tagsQuery.error
  const error = failed ? errorMessage(failed) : null

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
                <div className="home-column home-main">
                  <ReviewQueue />
                  <TagChips tags={dashboard.tags} selected={tag.key} onSelect={selectTag} />
                  <TagHands tag={tag} />
                </div>
                <div className="home-column home-rail">
                  <TagGauge tag={tag} />
                  <StreakCalendar calendar={dashboard.calendar} today={today} />
                </div>
                <div className="home-column home-rail-left">
                  <DisciplineCard short />
                </div>
              </div>
            </>
          )}
    </section>
  )
}

export default HomePage
