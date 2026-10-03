import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { auth } from '../api/client.ts'
import type { UserDetails } from '../api/generated/data-contracts.ts'
import { AuthContext, type AuthContextValue } from './useAuth.ts'

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDetails | null>()

  // The auth cookies are httpOnly, so ask the API who is signed in.
  useEffect(() => {
    let active = true
    auth.authUserRetrieve().then(
      ({ data }) => {
        if (active) setUser(data)
      },
      () => {
        if (active) setUser(null)
      },
    )
    return () => {
      active = false
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: async (credentials) => {
        const { data } = await auth.authLoginCreate(credentials)
        setUser(data.user)
      },
      register: async (details) => {
        const { data } = await auth.authRegistrationCreate(details)
        setUser(data.user)
      },
      logout: async () => {
        await auth.authLogoutCreate()
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

export default AuthProvider
