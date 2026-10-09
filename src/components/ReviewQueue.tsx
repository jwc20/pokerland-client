import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { errorMessage, review } from '../api/client.ts'
import type { ReviewQueue as Queue } from '../api/generated/data-contracts.ts'
import { historyUrl } from '../historyFilters.ts'
import HandTable from './HandTable.tsx'
import './ReviewQueue.css'

/**
 * The hands the user flagged to look at again from their replays (E1): the
 * hand that nags you after a session is the one to study [JHU 4]. Nothing
 * shows while none wait.
 */
function ReviewQueue() {
  const [loaded, setLoaded] = useState<{ queue?: Queue; error?: string }>()

  useEffect(() => {
    let active = true
    review.reviewRetrieve().then(
      ({ data }) => {
        if (active) setLoaded({ queue: data })
      },
      (err) => {
        if (active) setLoaded({ error: errorMessage(err) })
      },
    )
    return () => {
      active = false
    }
  }, [])

  if (loaded?.error) {
    return (
      <p className="error-message" role="alert">
        {loaded.error}
      </p>
    )
  }
  const queue = loaded?.queue
  if (!queue || queue.to_review === 0) return null
  const count = `${queue.to_review.toLocaleString()} ${queue.to_review === 1 ? 'hand' : 'hands'} to review`
  return (
    <section className="card review-queue" aria-labelledby="review-queue-heading">
      <h2 id="review-queue-heading" className="card-header">
        Review queue
      </h2>
      <div className="card-body">
        <p className="review-queue-count">
          {count}
          {queue.reviewed > 0 && <span> · {queue.reviewed.toLocaleString()} reviewed</span>}
        </p>
        <HandTable hands={queue.queue} compact />
        <p className="review-queue-more">
          {queue.to_review > queue.queue.length && `The ${queue.queue.length} flagged last. `}
          <Link to={historyUrl({ tags: [], review: 'to_review' })}>See all in Game History →</Link>
        </p>
      </div>
    </section>
  )
}

export default ReviewQueue
