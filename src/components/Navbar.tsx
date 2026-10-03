import { useState } from 'react'
import { errorMessage } from '../api/client.ts'
import type { AuthMode } from '../auth/SignInForm.tsx'
import { useAuth } from '../auth/useAuth.ts'
import './Navbar.css'

function Navbar({ onAuth }: { onAuth: (mode: AuthMode) => void }) {
  const { user, logout } = useAuth()
  const [error, setError] = useState<string | null>(null)

  async function handleLogout() {
    setError(null)
    try {
      await logout()
      onAuth('login')
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <header className="navbar">
      <a className="navbar-brand" href="/">
        Pokerland
      </a>
      {/* Empty until the API says who is signed in, so the wrong buttons never flash. */}
      {user !== undefined && (
        <nav className="navbar-account" aria-label="Account">
          {user ? (
            <>
              <span className="navbar-user" title={user.username}>
                {user.username}
              </span>
              <button type="button" className="button" onClick={handleLogout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <button type="button" className="link-button" onClick={() => onAuth('login')}>
                Sign in
              </button>
              <button type="button" className="button" onClick={() => onAuth('register')}>
                Create account
              </button>
            </>
          )}
          {error && (
            <p className="navbar-error error-message" role="alert">
              {error}
            </p>
          )}
        </nav>
      )}
    </header>
  )
}

export default Navbar
