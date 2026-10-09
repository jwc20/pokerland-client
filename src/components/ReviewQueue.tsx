import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { errorMessage } from '../api/client.ts'
import { queries } from '../api/queries.ts'
import { historyUrl } from '../historyFilters.ts'
import HandTable from './HandTable.tsx'
import './ReviewQueue.css'

/**
 * The hands the user flagged to look at again from their replays (E1): the
 * hand that nags you after a session is the one to study [JHU 4]. Nothing
 * shows while none wait.
 */
function ReviewQueue() {
  const query = useQuery(queries.review())
  if (query.error) {
    return (
      <p className="error-message" role="alert">
        {errorMessage(query.error)}
      </p>
    )
  }
  const queue = query.data
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
