import type { HandTag } from '../api/generated/data-contracts.ts'
import { tagLabel } from '../handFormat.ts'
import type { useScope } from '../useScope.ts'
import SpotFilter from './SpotFilter.tsx'
import './ScopeFilters.css'

// The tag groups the pages narrow by; position is each page's own business.
const GROUPS = [
  ['format', 'Format'],
  ['game', 'Game'],
  ['stakes', 'Stakes'],
] as const

/**
 * The one row of filters above a My game page, scoping everything on it: a format, game or stakes tag, a stretch
 * of days, and a spot, saved or being built (B7). `keep` names the page's own parameters, which clearing leaves.
 */
function ScopeFilters({
  scope,
  tags,
  keep = [],
}: {
  scope: ReturnType<typeof useScope>
  tags?: HandTag[]
  keep?: string[]
}) {
  const { tag, since, until, params, setFilters } = scope
  return (
    <div className="filter-bar scope-filters" role="group" aria-label="Which hands">
      <label>
        Hands
        <select value={tag} onChange={(event) => setFilters({ tag: event.target.value })}>
          <option value="">All hands</option>
          {GROUPS.map(([group, label]) => {
            const options = tags?.filter((candidate) => candidate.group === group) ?? []
            return (
              options.length > 0 && (
                <optgroup key={group} label={label}>
                  {options.map((option) => (
                    <option key={option.key} value={option.key}>
                      {tagLabel(option)} ({option.hands.toLocaleString()})
                    </option>
                  ))}
                </optgroup>
              )
            )
          })}
          {/* A tag from the URL that the list doesn't have (yet) still shows as chosen. */}
          {tag && !tags?.some((candidate) => candidate.key === tag) && <option value={tag}>{tag}</option>}
        </select>
      </label>
      <label>
        From
        <input type="date" value={since} max={until || undefined} onChange={(event) => setFilters({ since: event.target.value })} />
      </label>
      <label>
        To
        <input type="date" value={until} min={since || undefined} onChange={(event) => setFilters({ until: event.target.value })} />
      </label>
      <SpotFilter
        value={{
          spot: Number(params.get('spot')) || undefined,
          spec: params.get('spec') || undefined,
          spotEdit: Number(params.get('spot_edit')) || undefined,
        }}
        onChange={(changes) =>
          setFilters({
            ...('spot' in changes ? { spot: changes.spot ? String(changes.spot) : undefined } : {}),
            ...('spec' in changes ? { spec: changes.spec } : {}),
            ...('spotEdit' in changes ? { spot_edit: changes.spotEdit ? String(changes.spotEdit) : undefined } : {}),
          })
        }
      />
      {scope.narrowed && (
        <button type="button" className="link-button" onClick={() => scope.clear(keep)}>
          Show all hands
        </button>
      )}
    </div>
  )
}

export default ScopeFilters
