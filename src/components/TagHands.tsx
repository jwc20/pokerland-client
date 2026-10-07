import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { errorMessage, hands } from '../api/client.ts'
import type { HandSummary, HandTag } from '../api/generated/data-contracts.ts'
import { tagLabel } from '../handFormat.ts'
import { historyUrl } from '../historyFilters.ts'
import HandTable from './HandTable.tsx'
import './TagHands.css'

const RECENT = 10

/** The most recent of a tag's hands, and the way to the rest. */
function TagHands({ tag }: { tag: HandTag }) {
  // Remembers which tag the rows are of, so the last tag's stay on screen, faded, until the next one's arrive.
  const [loaded, setLoaded] = useState<{ key: string; rows?: HandSummary[]; error?: string }>()

  useEffect(() => {
    let active = true
    // "all" too: with any tag the list leaves out hands sat out, as the counts do.
    hands.handsList({ tag: [tag.key], page_size: RECENT }).then(
      ({ data }) => {
        if (active) setLoaded({ key: tag.key, rows: data.results })
      },
      (err) => {
        if (active) setLoaded({ key: tag.key, error: errorMessage(err) })
      },
    )
    return () => {
      active = false
    }
    // A new count means new hands, so the list is fetched again.
  }, [tag.key, tag.hands])

  const stale = loaded !== undefined && loaded.key !== tag.key
  return (
    <section className="card tag-hands" aria-labelledby="tag-hands-heading" aria-busy={!loaded || stale}>
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
