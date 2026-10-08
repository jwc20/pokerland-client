import { useEffect, useState } from 'react'
import { errorMessage, users } from '../api/client.ts'
import CoachPresets from '../components/CoachPresets.tsx'
import CopyButton from '../components/CopyButton.tsx'
import TrackerDownloads from '../components/TrackerDownloads.tsx'
import TrackerStatus from '../components/TrackerStatus.tsx'
import './SettingsPage.css'

function SettingsPage() {
  const [clientToken, setClientToken] = useState<string>()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    users.usersMeClientTokenRetrieve().then(
      ({ data }) => {
        if (active) setClientToken(data.client_token)
      },
      (err) => {
        if (active) setError(errorMessage(err))
      },
    )
    return () => {
      active = false
    }
  }, [])

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
