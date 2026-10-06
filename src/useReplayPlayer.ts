import { useEffect, useState } from 'react'

const STEP_MS = 1000

/** Moves through `length` replay steps by hand, or plays them at `speed` steps a second. */
export function useReplayPlayer(length: number) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const last = length - 1

  useEffect(() => {
    if (!playing) return
    const timer = setTimeout(() => {
      if (index + 1 >= last) setPlaying(false)
      setIndex(Math.min(index + 1, last))
    }, STEP_MS / speed)
    return () => clearTimeout(timer)
  }, [playing, index, last, speed])

  /** Shows step `to` and pauses, as any move the viewer makes does. */
  function seek(to: number) {
    setPlaying(false)
    setIndex(Math.max(0, Math.min(last, to)))
  }

  function togglePlay() {
    if (playing) {
      setPlaying(false)
      return
    }
    if (index >= last) setIndex(0) // at the end: play it again
    setPlaying(true)
  }

  return { index, last, playing, speed, setSpeed, seek, togglePlay }
}
