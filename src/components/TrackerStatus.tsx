import { formatAgo, useTrackerStatus } from '../useTrackerStatus.ts'

/** One line on what the trackers have sent, or that nothing has arrived yet. */
function TrackerStatus() {
  const { status, error } = useTrackerStatus()

  if (error) {
    return (
      <p className="error-message" role="alert">
        {error}
      </p>
    )
  }
  if (!status) return <p>Loading…</p>
  if (!status.last_upload_at) {
    return <p>No hands uploaded yet. Install a tracker below and play a hand: it shows up here.</p>
  }
  return (
    <dl className="tracker-status">
      <div>
        <dt>Last upload</dt>
        <dd>{formatAgo(status.last_upload_at)}</dd>
      </div>
      <div>
        <dt>Hands</dt>
        <dd>{status.hands_seen.toLocaleString()}</dd>
      </div>
      <div>
        <dt>Files</dt>
        <dd>{status.file_count.toLocaleString()}</dd>
      </div>
      <div>
        <dt>Tracker</dt>
        <dd>
          {status.platforms.join(', ')} · v{status.client_versions.join(', v')}
        </dd>
      </div>
    </dl>
  )
}

export default TrackerStatus
