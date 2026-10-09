import { Link, NavLink } from 'react-router'
import { CLASSES_CLOSED, CLASSES_ENABLED } from '../features.ts'
import { useAuth } from '../auth/useAuth.ts'
import AccountMenu from './AccountMenu.tsx'
import './Navbar.css'

function Navbar() {
  const { user } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar-start">
        <Link className="navbar-brand" to="/">
          Pokerland
        </Link>
        {user && (
          <nav className="navbar-links" aria-label="Main">
            <NavLink to="/games">Game History</NavLink>
            <NavLink to="/stats">My game</NavLink>
            <NavLink to="/sessions">Sessions</NavLink>
            <NavLink to="/practice">Practice</NavLink>
            {CLASSES_ENABLED ? (
              <NavLink to="/classes">Classes</NavLink>
            ) : (
              <span className="link-disabled" aria-disabled="true" title={CLASSES_CLOSED}>
                Classes
              </span>
            )}
          </nav>
        )}
      </div>
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
