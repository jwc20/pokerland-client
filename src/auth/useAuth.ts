import { createContext, useContext } from 'react'
import type {
  LoginRequest,
  RegisterRequest,
  UserDetails,
} from '../api/generated/data-contracts.ts'

export interface AuthContextValue {
  /** The signed-in user: null when signed out, undefined while still checking. */
  user: UserDetails | null | undefined
  login: (credentials: LoginRequest) => Promise<void>
  register: (details: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>')
  return value
}
