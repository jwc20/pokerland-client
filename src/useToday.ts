import { useEffect, useState } from 'react'
import { localDateKey, msToLocalMidnight } from './calendar.ts'

/** Today's "YYYY-MM-DD" key in the viewer's time zone, which turns over at midnight. */
export function useToday(): string {
  const [today, setToday] = useState(() => localDateKey(new Date()))

  useEffect(() => {
    // A second late, so the new day has surely begun.
    const timer = setTimeout(() => setToday(localDateKey(new Date())), msToLocalMidnight(new Date()) + 1000)
    return () => clearTimeout(timer)
  }, [today])

  return today
}
