import { useEffect, useState } from 'react'
import { errorMessage, tracker } from './api/client.ts'
import type { TrackerStatus } from './api/generated/data-contracts.ts'

/** Fetches what the user's trackers have uploaded; refreshes while the page is open. */
export function useTrackerStatus(refreshMs = 30_000) {
  const [status, setStatus] = useState<TrackerStatus>()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    function load() {
      tracker.trackerStatusRetrieve().then(
        ({ data }) => {
          if (!active) return
          setStatus(data)
          setError(null)
        },
        (err) => {
          if (active) setError(errorMessage(err))
        },
      )
    }
    load()
    const timer = setInterval(load, refreshMs)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [refreshMs])

  return { status, error }
}

export function formatAgo(iso: string) {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86_400) return `${Math.floor(seconds / 3600)} h ago`
  return `${Math.floor(seconds / 86_400)} d ago`
}

