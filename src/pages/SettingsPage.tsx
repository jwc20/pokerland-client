import { useQuery } from '@tanstack/react-query'
import { errorMessage } from '../api/client.ts'
import { queries } from '../api/queries.ts'
import CoachPresets from '../components/CoachPresets.tsx'
import CopyButton from '../components/CopyButton.tsx'
import TrackerDownloads from '../components/TrackerDownloads.tsx'
import TrackerStatus from '../components/TrackerStatus.tsx'
import './SettingsPage.css'

function SettingsPage() {
  const query = useQuery(queries.clientToken())
  const clientToken = query.data?.client_token
  const error = query.error ? errorMessage(query.error) : null

  return (
    <div className="settings">
      <h1>Account Settings</h1>
      <section className="card" aria-labelledby="client-token-heading">
        <h2 id="client-token-heading" className="card-header">
          Client token
        </h2>
        <div className="card-body">
          <p className="card-hint">
            The tracker sends your hands to your account with this token. Keep it private: anyone who has
            it can upload hands as you.
          </p>
          {error ? (
            <p className="error-message" role="alert">
              {error}
            </p>
          ) : clientToken === undefined ? (
            <p>Loading…</p>
          ) : (
            <div className="client-token">
              <code>{clientToken}</code>
              <CopyButton text={clientToken} />
            </div>
          )}
        </div>
      </section>

      <section className="card" aria-labelledby="tracker-heading">
        <h2 id="tracker-heading" className="card-header">
          Tracker
        </h2>
        <div className="card-body">
          <TrackerStatus />
          <TrackerDownloads />
        </div>
      </section>

      <CoachPresets />
    </div>
  )
}

export default SettingsPage
