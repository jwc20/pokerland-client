import { useQuery } from '@tanstack/react-query'
import { errorMessage } from './api/client.ts'
import { queries } from './api/queries.ts'

/** How often the tracker status is asked for while a page is open and visible. */
export const TRACKER_POLL_MS = 30_000

/** What the user's trackers have uploaded, refreshed while the page is open: one query, shared with UploadWatcher. */
export function useTrackerStatus() {
  const query = useQuery({ ...queries.tracker.status(), refetchInterval: TRACKER_POLL_MS })
  return { status: query.data, error: query.error ? errorMessage(query.error) : null }
}

export function formatAgo(iso: string) {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86_400) return `${Math.floor(seconds / 3600)} h ago`
  return `${Math.floor(seconds / 86_400)} d ago`
}
