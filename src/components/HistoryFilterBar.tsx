import type { HandTag } from '../api/generated/data-contracts.ts'
import { tagLabel } from '../handFormat.ts'
import {
  narrowed,
  RESULT_LABELS,
  SORT_LABELS,
  type HistoryFilters,
  type HistoryResult,
  type HistorySort,
  type HistoryStat,
} from '../historyFilters.ts'
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
  onChange,
}: {
  filters: HistoryFilters
  tags?: HandTag[]
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
