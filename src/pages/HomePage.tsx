import { Link } from 'react-router'
import { useAuth } from '../auth/useAuth.ts'
import { formatAgo, useTrackerStatus } from '../useTrackerStatus.ts'

function HomePage() {
  const { user } = useAuth()
  const { status } = useTrackerStatus()

  return (
    <section className="welcome">
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
    </section>
  )
}

export default HomePage
