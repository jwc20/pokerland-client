import { Link } from 'react-router'
import { useAuth } from '../auth/useAuth.ts'
import AccountMenu from './AccountMenu.tsx'
import './Navbar.css'

function Navbar() {
  const { user } = useAuth()

  return (
    <header className="navbar">
      <Link className="navbar-brand" to="/">
        Pokerland
      </Link>
      {/* Empty until the API says who is signed in, so the wrong links never flash. */}
      {user !== undefined && (
        <nav className="navbar-account" aria-label="Account">
          {user ? (
            <AccountMenu username={user.username} />
          ) : (
            <>
              <Link className="link-button" to="/login">
                Sign in
              </Link>
              <Link className="button" to="/register">
                Create account
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  )
}

export default Navbar
