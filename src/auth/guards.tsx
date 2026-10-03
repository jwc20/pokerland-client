import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from './useAuth.ts'

/** Renders its children for a signed-in user, or sends them to sign in. */
export function SignedInOnly({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (user === undefined) return <p>Loading…</p>
  return user ? children : <Navigate to="/login" replace />
}

/** Renders its children when signed out, or sends a signed-in user home. */
export function SignedOutOnly({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (user === undefined) return <p>Loading…</p>
  return user ? <Navigate to="/" replace /> : children
}
