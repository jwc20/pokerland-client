/**
 * Days as "YYYY-MM-DD" keys, the way the API sends them. Arithmetic on keys
 * runs in UTC, where every day has 24 hours, so a change of the clocks never
 * skips or repeats one.
 */

const DAY_MS = 86_400_000

function utcDate(key: string) {
  return new Date(`${key}T00:00:00Z`)
}

function keyOf(date: Date) {
  return date.toISOString().slice(0, 10)
}

/** The viewer's IANA time zone, e.g. "Europe/London", which the API counts days in. */
export function browserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
}

/** `load` in the viewer's time zone, or in UTC when the API answers 400 because it doesn't know that zone. */
export async function inViewerTimeZone<T>(load: (tz: string) => Promise<T>): Promise<T> {
  try {
    return await load(browserTimeZone())
  } catch (err) {
    if (!(err instanceof Response && err.status === 400)) throw err
    return load('UTC')
  }
}

/** The day `date` falls on in the viewer's time zone. */
export function localDateKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Milliseconds from `now` to the viewer's next midnight: 23 or 25 hours' worth on the days the clocks change. */
export function msToLocalMidnight(now: Date): number {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
}

/** The year, month (0-11) and day of the month of a key. */
export function keyParts(key: string): { year: number; month: number; day: number } {
  const [year, month, day] = key.split('-').map(Number)
  return { year, month: month - 1, day }
}

/** "Sat, Oct 4, 2026", in the viewer's language. */
export function formatDayKey(key: string, options: Intl.DateTimeFormatOptions = {}): string {
  return utcDate(key).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
    timeZone: 'UTC',
  })
}

/** "October 2026". */
export function formatMonth(year: number, month: number): string {
  return new Date(Date.UTC(year, month, 1)).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** "Jan", "Feb", ... */
export function monthAbbreviations(): string[] {
  return Array.from({ length: 12 }, (_, month) =>
    new Date(Date.UTC(2000, month, 1)).toLocaleDateString(undefined, { month: 'short', timeZone: 'UTC' }),
  )
}

export interface YearCell {
  key: string
  /** The column: weeks start on Sunday, and week 0 holds January 1st. */
  week: number
  /** The row: 0 is Sunday. */
  weekday: number
}

/**
 * Every day of `year` placed in a grid of weeks, as a contribution calendar
 * draws them, with the column each month's label goes over: its first full week.
 * A year has 53 columns, or 54 when a leap year starts on a Saturday.
 */
export function yearGrid(year: number): { cells: YearCell[]; weeks: number; monthWeeks: number[] } {
  const first = Date.UTC(year, 0, 1)
  const offset = new Date(first).getUTCDay()
  const length = Math.round((Date.UTC(year + 1, 0, 1) - first) / DAY_MS)
  const cells = Array.from({ length }, (_, i) => {
    const date = new Date(first + i * DAY_MS)
    return { key: keyOf(date), week: Math.floor((i + offset) / 7), weekday: date.getUTCDay() }
  })
  const monthWeeks = Array.from({ length: 12 }, (_, month) => {
    const i = Math.round((Date.UTC(year, month, 1) - first) / DAY_MS)
    return Math.ceil((i + offset) / 7)
  })
  return { cells, weeks: cells[cells.length - 1].week + 1, monthWeeks }
}

/** The days of a month as keys, after a `null` for each weekday before the 1st (Sunday first). */
export function monthGrid(year: number, month: number): (string | null)[] {
  const first = Date.UTC(year, month, 1)
  const length = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  return [
    ...Array<null>(new Date(first).getUTCDay()).fill(null),
    ...Array.from({ length }, (_, i) => keyOf(new Date(first + i * DAY_MS))),
  ]
}

/** The weekdays' initials, Sunday first: "S", "M", "T", ... */
export function weekdayInitials(): string[] {
  // 2026-10-04 is a Sunday.
  return Array.from({ length: 7 }, (_, i) =>
    new Date(Date.UTC(2026, 9, 4 + i)).toLocaleDateString(undefined, { weekday: 'narrow', timeZone: 'UTC' }),
  )
}

/** The months up to `last` ("2026-10"), oldest first: `count` of them, every month whether it has data or not. */
export function monthsUpTo(last: string, count: number): string[] {
  const [year, month] = last.split('-').map(Number)
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(Date.UTC(year, month - count + i, 1))
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
  })
}
