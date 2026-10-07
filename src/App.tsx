import { Navigate, Route, Routes } from 'react-router'
import { SignedInOnly, SignedOutOnly } from './auth/guards.tsx'
import SignInForm from './auth/SignInForm.tsx'
import Navbar from './components/Navbar.tsx'
import GameHistoryPage from './pages/GameHistoryPage.tsx'
import GameReplayPage from './pages/GameReplayPage.tsx'
import HomePage from './pages/HomePage.tsx'
import MyGamePage from './pages/MyGamePage.tsx'
import SettingsPage from './pages/SettingsPage.tsx'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route
            path="/"
            element={
              <SignedInOnly>
                <HomePage />
              </SignedInOnly>
            }
          />
          <Route
            path="/games"
            element={
              <SignedInOnly>
                <GameHistoryPage />
              </SignedInOnly>
            }
          />
          <Route
            path="/games/:id"
            element={
              <SignedInOnly>
                <GameReplayPage />
              </SignedInOnly>
            }
          />
          <Route
            path="/stats"
            element={
              <SignedInOnly>
                <MyGamePage />
              </SignedInOnly>
            }
          />
          <Route
            path="/settings"
            element={
              <SignedInOnly>
                <SettingsPage />
              </SignedInOnly>
            }
          />
          {/* Keyed, so switching between the two forms resets fields and errors. */}
          <Route
            path="/login"
            element={
              <SignedOutOnly>
                <SignInForm key="login" mode="login" />
              </SignedOutOnly>
            }
          />
          <Route
            path="/register"
            element={
              <SignedOutOnly>
                <SignInForm key="register" mode="register" />
              </SignedOutOnly>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default App
