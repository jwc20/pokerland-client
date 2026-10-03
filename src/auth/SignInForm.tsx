import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { errorMessage } from '../api/client.ts'
import { useAuth } from './useAuth.ts'

function SignInForm({ mode }: { mode: 'login' | 'register' }) {
  const { login, register } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const registering = mode === 'register'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const field = (name: string) => String(form.get(name) ?? '')
    setPending(true)
    setError(null)
    try {
      if (registering) {
        await register({
          username: field('username'),
          email: field('email') || undefined, // the API rejects a blank email
          password1: field('password'),
          password2: field('password2'),
        })
      } else {
        await login({ username: field('username'), password: field('password') })
      }
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{registering ? 'Create an account' : 'Sign in'}</h2>
      <label>
        Username
        <input name="username" autoComplete="username" required />
      </label>
      {registering && (
        <label>
          Email (optional)
          <input name="email" type="email" autoComplete="email" />
        </label>
      )}
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete={registering ? 'new-password' : 'current-password'}
          required
        />
      </label>
      {registering && (
        <label>
          Confirm password
          <input name="password2" type="password" autoComplete="new-password" required />
        </label>
      )}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="button" disabled={pending}>
        {registering ? 'Create account' : 'Sign in'}
      </button>
      <Link className="link-button" to={registering ? '/login' : '/register'}>
        {registering ? 'Have an account? Sign in' : 'No account? Create one'}
      </Link>
    </form>
  )
}

export default SignInForm
