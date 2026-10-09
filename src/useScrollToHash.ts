import { useEffect } from 'react'

/**
 * Scrolls to the element with `id` once `ready`, when the URL's hash names it: a link such as
 * "/settings#coach-presets" lands on its section after the page has loaded what goes above it.
 */
export function useScrollToHash(id: string, ready: boolean) {
  useEffect(() => {
    if (ready && window.location.hash === `#${id}`) document.getElementById(id)?.scrollIntoView()
  }, [id, ready])
}
