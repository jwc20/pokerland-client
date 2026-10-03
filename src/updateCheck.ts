declare const __BUILD_ID__: string

export function watchForUpdates(onUpdate: () => void, intervalMs = 5 * 60_000) {
  const check = async () => {
    try {
      const res = await fetch('/version.json', { cache: 'no-store' })
      if (!res.ok) return
      const { id } = await res.json()
      if (id !== __BUILD_ID__) onUpdate()
    } catch {
      // offline or mid-deploy: the next tick retries
    }
  }
  const onVisible = () => {
    if (!document.hidden) check()
  }
  const timer = setInterval(check, intervalMs)
  document.addEventListener('visibilitychange', onVisible)
  return () => {
    clearInterval(timer)
    document.removeEventListener('visibilitychange', onVisible)
  }
}
