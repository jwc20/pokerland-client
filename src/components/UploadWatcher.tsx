import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { changes } from '../api/changes.ts'
import { queries } from '../api/queries.ts'
import { TRACKER_POLL_MS } from '../useTrackerStatus.ts'

/**
 * Refreshes everything worked out from the user's hands when the tracker status shows a new upload: a later upload
 * time, or more hands seen. It polls only while the tab is visible, and looks again when the tab comes back. Mounted
 * once per signed-in user (App keys it by them), so one user's last upload never counts as another's new one.
 */
function UploadWatcher() {
  const client = useQueryClient()
  const { data: status } = useQuery({ ...queries.tracker.status(), refetchInterval: TRACKER_POLL_MS })
  const seen = useRef<string>(undefined)

  useEffect(() => {
    if (!status) return
    const upload = `${status.last_upload_at ?? ''}:${status.hands_seen}`
    if (seen.current !== undefined && seen.current !== upload) void changes.upload(client)
    seen.current = upload
  }, [status, client])

  return null
}

export default UploadWatcher
