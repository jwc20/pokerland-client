import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { queryClient } from './api/queryClient.ts'
import AuthProvider from './auth/AuthProvider.tsx'
import UpdateBanner from './UpdateBanner.tsx'

// A chunk from a build that is no longer deployed: reload once to get the current build
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  const last = Number(sessionStorage.getItem('chunk-reload-at') ?? 0)
  if (Date.now() - last < 10_000) return // already tried: avoid a reload loop
  sessionStorage.setItem('chunk-reload-at', String(Date.now()))
  window.location.reload()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
    <UpdateBanner />
  </StrictMode>,
)
