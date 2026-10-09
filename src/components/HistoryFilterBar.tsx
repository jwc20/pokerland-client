import { useEffect, useState } from 'react'
import { sessions } from '../api/client.ts'
import type { HandTag, NoteTag, ReviewStateEnum, Session } from '../api/generated/data-contracts.ts'
import { formatBb, tagLabel } from '../handFormat.ts'
import {
  narrowed,
  RESULT_LABELS,
  SORT_LABELS,
  type HistoryFilters,
  type HistoryResult,
  type HistorySort,
  type HistoryStat,
} from '../historyFilters.ts'
import { LEAK_INFO } from '../leaks.ts'
import { REVIEW_LABELS } from '../notes.ts'
import { formatMinutes, sessionTimes } from '../sessions.ts'
import { STAT_INFO } from '../playerStats.ts'

const TAG_GROUPS = [
  ['position', 'Position'],
  ['format', 'Format'],
  ['game', 'Game'],
  ['stakes', 'Stakes'],
] as const
const POSITIONS = ['UTG', 'UTG+1', 'UTG+2', 'UTG+3', 'UTG+4', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']
const STREETS = [
  ['preflop', 'Before the flop'],
  ['postflop', 'After the flop'],
  ['showdown', 'Showdowns'],
] as const

/**
 * The game history's filters and sort, one control each. `onChange` applies a change to the filters
 * as they stand when it runs, so two changes in quick succession both count.
 */
function HistoryFilterBar({
  filters,
  tags,
  noteTags,
  onChange,
}: {
  filters: HistoryFilters
  tags?: HandTag[]
  /** The user's own tags from their notes, such as "cooler". */
  noteTags?: NoteTag[]
  onChange: (update: (filters: HistoryFilters) => HistoryFilters) => void
}) {
  const set = (changes: Partial<HistoryFilters>) => onChange((latest) => ({ ...latest, ...changes }))
  const stat = filters.stat ? STAT_INFO[filters.stat] : undefined

  return (
    <div className="history-filters">
      <div className="filter-bar" role="group" aria-label="Which hands">
        {TAG_GROUPS.map(([group, label]) => (
          <TagSelect
            key={group}
            group={group}
            label={label}
            tags={tags}
            value={filters.tags.find((key) => key.startsWith(`${group}:`)) ?? ''}
            onChange={(key) =>
              onChange((latest) => ({
                ...latest,
                tags: [...latest.tags.filter((other) => !other.startsWith(`${group}:`)), ...(key ? [key] : [])],
              }))
            }
          />
        ))}
        <label>
          From
          <input
            type="date"
            value={filters.since ?? ''}
            max={filters.until}
            onChange={(event) => set({ since: event.target.value || undefined })}
          />
        </label>
        <label>
          To
          <input
            type="date"
            value={filters.until ?? ''}
            min={filters.since}
            onChange={(event) => set({ until: event.target.value || undefined })}
          />
        </label>
        <label>
          Result
          <select
            value={filters.result ?? ''}
            onChange={(event) => set({ result: (event.target.value || undefined) as HistoryResult | undefined })}
          >
            <option value="">Any result</option>
            {Object.entries(RESULT_LABELS).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </label>
        <label>
          Statistic
          <select
            value={filters.stat ?? ''}
            onChange={(event) => set({ stat: (event.target.value || undefined) as HistoryStat | undefined, did: undefined })}
          >
            <option value="">Any hand</option>
            {STREETS.map(([street, text]) => (
              <optgroup key={street} label={text}>
                {Object.entries(STAT_INFO)
                  .filter(([, info]) => info.street === street)
                  .map(([value, info]) => (
                    <option key={value} value={value}>
                      {info.label}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>
        {filters.stat && (
          <label>
            Decision
            <select
              value={filters.did === undefined ? '' : String(filters.did)}
              onChange={(event) =>
                set({ did: event.target.value === '' ? undefined : event.target.value === 'true' })
              }
            >
              <option value="">Every chance</option>
              <option value="true">Did it</option>
              <option value="false">Didn't</option>
            </select>
          </label>
        )}
        <label>
          Review
          <select
            value={filters.review ?? ''}
            onChange={(event) => set({ review: (event.target.value || undefined) as ReviewStateEnum | undefined })}
          >
            <option value="">Any hand</option>
            {Object.entries(REVIEW_LABELS).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </label>
        {noteTags?.length || filters.noteTag ? (
          <label>
            Your tag
            <select value={filters.noteTag ?? ''} onChange={(event) => set({ noteTag: event.target.value || undefined })}>
              <option value="">Any</option>
              {noteTags?.map((row) => (
                <option key={row.tag} value={row.tag}>
                  {row.tag} ({row.hands.toLocaleString()})
                </option>
              ))}
              {/* A tag from the URL that the list doesn't have still shows as chosen. */}
              {filters.noteTag && !noteTags?.some((row) => row.tag === filters.noteTag) && (
                <option value={filters.noteTag}>{filters.noteTag}</option>
              )}
            </select>
          </label>
        ) : null}
        <label>
          Sort
          <select
            value={filters.sort ?? 'newest'}
            onChange={(event) => set({ sort: event.target.value as HistorySort })}
          >
            {Object.entries(SORT_LABELS).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </label>
        {(narrowed(filters) || (filters.sort && filters.sort !== 'newest')) && (
          <button type="button" className="link-button" onClick={() => onChange(() => ({ tags: [] }))}>
            Clear filters
          </button>
        )}
      </div>
      {filters.session && (
        <SessionHint id={filters.session} onClear={() => set({ session: undefined })} />
      )}
      {filters.leak && (
        <p className="card-hint">
          <strong>{LEAK_INFO[filters.leak].label}</strong>: showing the hands where you broke the rule.{' '}
          <button type="button" className="link-button" onClick={() => set({ leak: undefined })}>
            Show every hand
          </button>
        </p>
      )}
      {stat && (
        <p className="card-hint">
          <strong>{stat.label}</strong>: {stat.hint}{' '}
          {filters.did === undefined
            ? 'Showing every hand where you had the chance.'
            : filters.did
              ? 'Showing the hands where you did.'
              : "Showing the hands where you didn't."}
        </p>
      )}
    </div>
  )
}

/** Which session the history shows: its day, times and result, once they load. */
function SessionHint({ id, onClear }: { id: number; onClear: () => void }) {
  const [session, setSession] = useState<{ id: number; row?: Session }>()
  useEffect(() => {
    let active = true
    sessions.sessionsRetrieve({ id }).then(
      ({ data }) => {
        if (active) setSession({ id, row: data })
      },
      () => {
        if (active) setSession({ id }) // the hands still show; the hint names the session by number
      },
    )
    return () => {
      active = false
    }
  }, [id])
  const row = session?.id === id ? session.row : undefined
  return (
    <p className="card-hint">
      <strong>A session</strong>:{' '}
      {row
        ? `${new Date(row.start).toLocaleDateString(undefined, { dateStyle: 'medium' })}, ${sessionTimes(row.start, row.end)} ` +
          `(${formatMinutes(row.minutes)}): ${row.hands.toLocaleString()} hands, ${formatBb(row.net_bb)}.`
        : `number ${id}.`}{' '}
      <button type="button" className="link-button" onClick={onClear}>
        Show every hand
      </button>
    </p>
  )
}

/** One tag group's choice: any, or one of the user's tags in it, with its hand count. */
function TagSelect({
  group,
  label,
  tags,
  value,
  onChange,
}: {
  group: string
  label: string
  tags?: HandTag[]
  value: string
  onChange: (key: string) => void
}) {
  const options = (tags ?? []).filter((tag) => tag.group === group)
  if (group === 'position') {
    options.sort((a, b) => POSITIONS.indexOf(a.value) - POSITIONS.indexOf(b.value))
  }
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Any</option>
        {options.map((tag) => (
          <option key={tag.key} value={tag.key}>
            {tagLabel(tag)} ({tag.hands.toLocaleString()})
          </option>
        ))}
        {/* A tag from the URL that the list doesn't have (yet) still shows as chosen. */}
        {value && !options.some((tag) => tag.key === value) && (
          <option value={value}>{value.slice(value.indexOf(':') + 1)}</option>
        )}
      </select>
    </label>
  )
}

export default HistoryFilterBar
