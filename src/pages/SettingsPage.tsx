import { useEffect, useState } from 'react'
import { errorMessage, users } from '../api/client.ts'
import CopyButton from '../components/CopyButton.tsx'
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
            The tracker client sends your games to your account with this token. Keep it private:
            anyone who has it can submit data as you.
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
    </div>
  )
}

export default SettingsPage
