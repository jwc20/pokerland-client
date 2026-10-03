import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import { errorMessage } from '../api/client.ts'
import { useAuth } from '../auth/useAuth.ts'
import './AccountMenu.css'

function AccountMenu({ username }: { username: string }) {
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const panelId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close on a click outside, or on Escape (returning focus to the button).
  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  async function handleLogout() {
    setError(null)
    try {
      await logout()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <div className="account-menu" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        className="account-menu-button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
      >
        <span className="account-menu-name">{username}</span>
        <span aria-hidden="true">▾</span>
      </button>
      {open && (
        <div id={panelId} className="account-menu-panel">
          <Link className="account-menu-item" to="/settings" onClick={() => setOpen(false)}>
            Settings
          </Link>
          <button type="button" className="account-menu-item" onClick={handleLogout}>
            Sign out
          </button>
          {error && (
            <p className="account-menu-error error-message" role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default AccountMenu
