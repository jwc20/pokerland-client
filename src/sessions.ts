import type { SessionPatterns } from './api/generated/data-contracts.ts'

/** The groupings the sessions page sets results against, with their headings, as the API keys them. */
export const PATTERNS: { name: keyof SessionPatterns; title: string; heading: string; hint: string }[] = [
  {
    name: 'hours_in',
    title: 'By hour into the session',
    heading: 'Hour',
    hint: 'Do you play worse as a session wears on? Tough games are tiring [JHU 9].',
  },
  { name: 'time_of_day', title: 'By time of day', heading: 'Time', hint: 'In your time zone.' },
  { name: 'weekday', title: 'By day of the week', heading: 'Day', hint: 'In your time zone.' },
  {
    name: 'tables',
    title: 'By tables at once',
    heading: 'Tables',
    hint: 'How many tables you were playing when the hand was dealt.',
  },
]

const HOURS_IN: Record<string, string> = { '0': 'First hour', '1': 'Second', '2': 'Third', '3+': 'Fourth on' }
const TIMES_OF_DAY: Record<string, string> = {
  night: 'Night',
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
}
const TABLES: Record<string, string> = { '1': 'One', '2': 'Two', '3': 'Three', '4+': 'Four or more' }

/** A group's name, e.g. "Second" for the second hour, "Mon" for "1". */
export function patternLabel(name: keyof SessionPatterns, key: string): string {
  switch (name) {
    case 'hours_in':
      return HOURS_IN[key] ?? key
    case 'time_of_day':
      return TIMES_OF_DAY[key] ?? key
    case 'tables':
      return TABLES[key] ?? key
    case 'weekday':
      // 2026-10-05 is a Monday, which the API calls "1".
      return new Date(Date.UTC(2026, 9, 4 + Number(key))).toLocaleDateString(undefined, {
        weekday: 'short',
        timeZone: 'UTC',
      })
  }
}

/** "2 h 15 min", "45 min", or "under a minute" for a session of one hand. */
export function formatMinutes(minutes: number): string {
  if (minutes < 1) return 'under a minute'
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (!hours) return `${rest} min`
  return rest ? `${hours} h ${rest} min` : `${hours} h`
}

/** "18:54–21:30" in the viewer's time zone, with the day before each time when the session crossed midnight. */
export function sessionTimes(start: string, end: string): string {
  const from = new Date(start)
  const to = new Date(end)
  const time = (date: Date) => date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  if (from.toDateString() === to.toDateString()) return `${time(from)}–${time(to)}`
  const day = (date: Date) => date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  return `${day(from)} ${time(from)} – ${day(to)} ${time(to)}`
}
