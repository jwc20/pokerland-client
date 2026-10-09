import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { auth } from '../api/client.ts'
import type { UserDetails } from '../api/generated/data-contracts.ts'
import { AuthContext, type AuthContextValue } from './useAuth.ts'

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDetails | null>()
  const client = useQueryClient()

  // The auth cookies are httpOnly, so ask the API who is signed in. Through the query cache, so StrictMode's second
  // effect in development joins the first request instead of sending its own; the answer lives here, not there.
  useEffect(() => {
    let active = true
    const whoami = () => auth.authUserRetrieve().then(({ data }) => data)
    client.fetchQuery({ queryKey: ['auth', 'user'], queryFn: whoami, retry: false }).then(
      (data) => {
        if (active) setUser(data)
      },
      () => {
        if (active) setUser(null)
      },
    )
    return () => {
      active = false
    }
  }, [client])

  // Whoever signs in or out, the cache holds nothing of the account before: one user never sees another's data.
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: async (credentials) => {
        const { data } = await auth.authLoginCreate(credentials)
        client.clear()
        setUser(data.user)
      },
      register: async (details) => {
        const { data } = await auth.authRegistrationCreate(details)
        client.clear()
        setUser(data.user)
      },
      logout: async () => {
        await auth.authLogoutCreate()
        client.clear()
        setUser(null)
      },
    }),
    [user, client],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

export default AuthProvider
