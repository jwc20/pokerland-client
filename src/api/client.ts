import { Auth } from './generated/Auth.ts'
import type { ApiConfig, HttpResponse } from './generated/http-client.ts'
import { Users } from './generated/Users.ts'

const baseUrl = import.meta.env.VITE_API_BASE_URL
if (!baseUrl) throw new Error('VITE_API_BASE_URL is not set: see .env.example')

// The API keeps its JWTs in httpOnly cookies, so every request must send them.
const config: ApiConfig = { baseUrl, baseApiParams: { credentials: 'include' } }

// A separate instance, so a 401 from the refresh endpoint is not itself retried.
const refreshClient = new Auth(config)
let refreshing: Promise<boolean> | undefined

// Concurrent 401s share one refresh: the API rotates the refresh token on use,
// so a second refresh sending the old one would fail.
function refreshAccessToken() {
  refreshing ??= refreshClient
    .authTokenRefreshCreate({})
    .then(
      () => true,
      () => false,
    )
    .finally(() => {
      refreshing = undefined
    })
  return refreshing
}

// The access-token cookie expires after 15 minutes: on a 401, renew it from the
// refresh-token cookie and retry the request once.
const fetchWithRefresh: typeof fetch = async (input, init) => {
  const response = await fetch(input, init)
  if (response.status !== 401 || !(await refreshAccessToken())) return response
  return fetch(input, init)
}

const apiConfig: ApiConfig = { ...config, customFetch: fetchWithRefresh }

export const auth = new Auth(apiConfig)
export const users = new Users(apiConfig)

// Generated methods reject with the failed response, whose `error` holds DRF's
// error body ({"field": ["message"]}), or with a TypeError when offline.
export function errorMessage(err: unknown): string {
  if (!(err instanceof Response)) return 'Could not reach the server.'
  const body = (err as HttpResponse<unknown, unknown>).error
  const messages =
    body && typeof body === 'object' && !(body instanceof Error)
      ? Object.entries(body).map(([field, value]) => {
          const text = [value].flat().join(' ')
          return field === 'detail' || field === 'non_field_errors' ? text : `${field}: ${text}`
        })
      : []
  return messages.join('\n') || `Request failed (${err.status}).`
}
