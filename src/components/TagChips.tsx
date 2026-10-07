import { useState } from 'react'
import type { HandTag } from '../api/generated/data-contracts.ts'
import { tagLabel } from '../handFormat.ts'
import './TagChips.css'

const PAGE_SIZE = 15

/** The user's tags as chips with their hand counts, to search, page through and pick one from. */
function TagChips({ tags, selected, onSelect }: { tags: HandTag[]; selected: string; onSelect: (key: string) => void }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)

  const needle = query.trim().toLowerCase()
  const matches = needle ? tags.filter((tag) => tagLabel(tag).toLowerCase().includes(needle)) : tags
  const pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE))
  // Fewer pages after the tags change keep the last one in view.
  const current = Math.min(page, pages - 1)
  const shown = matches.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE)

  return (
    <section className="card tag-chips" aria-labelledby="tag-chips-heading">
      <h2 id="tag-chips-heading" className="card-header">
        Tags
      </h2>
      <div className="card-body">
        <input
          type="search"
          className="tag-chips-search"
          placeholder="Search tags"
          aria-label="Search tags"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setPage(0)
          }}
        />
        {pages > 1 && (
          <div className="tag-chips-pages">
            <span>
              {current + 1} / {pages}
            </span>
            <button type="button" aria-label="Previous tags" disabled={current === 0} onClick={() => setPage(current - 1)}>
              ←
            </button>
            <button type="button" aria-label="Next tags" disabled={current === pages - 1} onClick={() => setPage(current + 1)}>
              →
            </button>
          </div>
        )}
        {shown.length ? (
          <div className="tag-chips-list" role="group" aria-label="Tags">
            {shown.map((tag) => (
              <button
                key={tag.key}
                type="button"
                className="tag-chip"
                aria-pressed={tag.key === selected}
                aria-label={`${tagLabel(tag)}, ${tag.hands.toLocaleString()} ${tag.hands === 1 ? 'hand' : 'hands'}`}
                onClick={() => onSelect(tag.key)}
              >
                {tagLabel(tag)}
                <span className="tag-chip-count">{tag.hands.toLocaleString()}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="card-hint">No tags match “{query.trim()}”.</p>
        )}
        <p className="tag-chips-note">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <circle cx="8" cy="8" r="7" />
            <path d="M8 7v4.5M8 4.5v.01" />
          </svg>
          Tags are sorted by how many hands you've played in them.
        </p>
      </div>
    </section>
  )
}

export default TagChips
