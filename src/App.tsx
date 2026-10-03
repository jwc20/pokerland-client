import { useState } from 'react'
import SignInForm, { type AuthMode } from './auth/SignInForm.tsx'
import { useAuth } from './auth/useAuth.ts'
import Navbar from './components/Navbar.tsx'
import './App.css'

function App() {
  const { user } = useAuth()
  const [authMode, setAuthMode] = useState<AuthMode>('login')

  return (
    <>
      <Navbar onAuth={setAuthMode} />
      <main className="page">
        {user === undefined ? (
          <p>Loading…</p>
        ) : user ? (
          <section className="welcome">
            <h1>Welcome, {user.username}</h1>
            {user.email && <p>{user.email}</p>}
          </section>
        ) : (
          // Keyed by mode, so switching from the navbar also resets fields and errors.
          <SignInForm key={authMode} mode={authMode} onModeChange={setAuthMode} />
        )}
      </main>
    </>
  )
}

export default App
