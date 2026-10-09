import { Navigate, Route, Routes } from 'react-router'
import { SignedInOnly, SignedOutOnly } from './auth/guards.tsx'
import SignInForm from './auth/SignInForm.tsx'
import Navbar from './components/Navbar.tsx'
import AptitudePage from './pages/AptitudePage.tsx'
import AptitudeTestPage from './pages/AptitudeTestPage.tsx'
import ClassesPage from './pages/ClassesPage.tsx'
import ClassPage from './pages/ClassPage.tsx'
import GameHistoryPage from './pages/GameHistoryPage.tsx'
import GameReplayPage from './pages/GameReplayPage.tsx'
import HomePage from './pages/HomePage.tsx'
import MatchDebriefPage from './pages/MatchDebriefPage.tsx'
import MatchNewPage from './pages/MatchNewPage.tsx'
import MatchPage from './pages/MatchPage.tsx'
import MyGamePage from './pages/MyGamePage.tsx'
import PlaybookEditPage from './pages/PlaybookEditPage.tsx'
import PlaybookPage from './pages/PlaybookPage.tsx'
import PlayNewPage from './pages/PlayNewPage.tsx'
import PlayPage from './pages/PlayPage.tsx'
import PracticePage from './pages/PracticePage.tsx'
import PracticeSetPage from './pages/PracticeSetPage.tsx'
import SessionsPage from './pages/SessionsPage.tsx'
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
            path="/sessions"
            element={
              <SignedInOnly>
                <SessionsPage />
              </SignedInOnly>
            }
          />
          <Route
            path="/practice"
            element={
              <SignedInOnly>
                <PracticePage />
              </SignedInOnly>
            }
          />
          <Route
            path="/practice/playbook"
            element={
              <SignedInOnly>
                <PlaybookPage />
              </SignedInOnly>
            }
          />
          <Route
            path="/practice/playbook/:id"
            element={
              <SignedInOnly>
                <PlaybookPage />
              </SignedInOnly>
            }
          />
          <Route
            path="/practice/playbook/:id/edit"
            element={
              <SignedInOnly>
                <PlaybookEditPage />
              </SignedInOnly>
            }
          />
          <Route
            path="/practice/match/new"
            element={
              <SignedInOnly>
                <MatchNewPage />
              </SignedInOnly>
            }
          />
          <Route
            path="/practice/match/:id"
            element={
              <SignedInOnly>
                <MatchPage />
              </SignedInOnly>
            }
          />
          <Route
            path="/practice/match/:id/debrief"
            element={
              <SignedInOnly>
                <MatchDebriefPage />
              </SignedInOnly>
            }
          />
          <Route
            path="/practice/set/:id"
            element={
              <SignedInOnly>
                <PracticeSetPage />
              </SignedInOnly>
            }
          />
          <Route
            path="/practice/play/new"
            element={
              <SignedInOnly>
                <PlayNewPage />
              </SignedInOnly>
            }
          />
          <Route
            path="/practice/play/:id"
            element={
              <SignedInOnly>
                <PlayPage />
              </SignedInOnly>
            }
          />
          <Route
            path="/practice/test"
            element={
              <SignedInOnly>
                <AptitudePage />
              </SignedInOnly>
            }
          />
          <Route
            path="/practice/test/:id"
            element={
              <SignedInOnly>
                <AptitudeTestPage />
              </SignedInOnly>
            }
          />
          <Route
            path="/classes"
            element={
              <SignedInOnly>
                <ClassesPage />
              </SignedInOnly>
            }
          />
          <Route
            path="/classes/:id"
            element={
              <SignedInOnly>
                <ClassPage />
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
