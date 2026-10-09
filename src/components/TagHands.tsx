import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { errorMessage } from '../api/client.ts'
import type { HandTag } from '../api/generated/data-contracts.ts'
import { queries } from '../api/queries.ts'
import { tagLabel } from '../handFormat.ts'
import { historyUrl } from '../historyFilters.ts'
import HandTable from './HandTable.tsx'
import './TagHands.css'

const RECENT = 10

/** The most recent of a tag's hands, and the way to the rest. */
function TagHands({ tag }: { tag: HandTag }) {
  // "all" too: with any tag the list leaves out hands sat out, as the counts do. The last tag's rows stay on
  // screen, faded, until the next one's arrive; an upload refreshes them (UploadWatcher).
  const query = useQuery(queries.hands.recent({ tag: [tag.key], page_size: RECENT }))
  const stale = query.isPlaceholderData
  const loaded = query.error ? { error: errorMessage(query.error) } : query.data && { rows: query.data.results }
  return (
    <section className="card tag-hands" aria-labelledby="tag-hands-heading" aria-busy={!query.data || stale}>
      <h2 id="tag-hands-heading" className="card-header">
        {tag.group === 'all' ? 'Recent hands' : `${tagLabel(tag)} hands`}
      </h2>
      <div className="card-body">
        {loaded?.error ? (
          <p className="error-message" role="alert">
            {loaded.error}
          </p>
        ) : loaded?.rows ? (
          <div className={stale ? 'tag-hands-rows stale' : 'tag-hands-rows'}>
            <HandTable hands={loaded.rows} compact />
          </div>
        ) : (
          <p>Loading…</p>
        )}
        <p className="tag-hands-more">
          {tag.hands > RECENT && `The ${RECENT} most recent of ${tag.hands.toLocaleString()}. `}
          <Link to={historyUrl({ tags: [tag.key] })}>See all in Game History →</Link>
        </p>
      </div>
    </section>
  )
}

export default TagHands
