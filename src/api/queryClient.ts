import { QueryClient } from '@tanstack/react-query'

declare module '@tanstack/react-query' {
  interface Register {
    // The generated client rejects with the failed Response, or with a TypeError when offline: not an Error.
    defaultError: unknown
  }
}

/** Whether a failed request is worth trying again: the network or the server failed, not the request itself. */
function retryable(error: unknown) {
  if (error instanceof Response) return error.status >= 500
  return error instanceof TypeError // fetch's "Failed to fetch": offline, or the API unreachable
}

/**
 * The app's one query cache (TanStack Query). Each query sets how long its data stays fresh (src/api/queries.ts);
 * a 4xx is the answer, not a hiccup, so only network and server failures are tried again, twice.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failures, error) => failures < 2 && retryable(error),
    },
    mutations: {
      // A save, a move or a new set is never sent twice on its own: the user sees the error and decides.
      retry: false,
    },
  },
})
