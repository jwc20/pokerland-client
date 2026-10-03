import { useEffect, useState } from 'react'
import { watchForUpdates } from './updateCheck.ts'
import './UpdateBanner.css'

function UpdateBanner() {
  const [available, setAvailable] = useState(false)

  useEffect(() => watchForUpdates(() => setAvailable(true)), [])

  if (!available) return null

  return (
    <div className="update-banner" role="status">
      A new version is available.
      <button type="button" onClick={() => window.location.reload()}>
        Reload
      </button>
    </div>
  )
}

export default UpdateBanner
