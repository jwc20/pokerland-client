import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { errorMessage, hands } from '../api/client.ts'
import type { HandSummary } from '../api/generated/data-contracts.ts'
import PlayingCard from '../components/PlayingCard.tsx'
import { formatAmount, formatDateTime, gameLabel, streetLabel } from '../handFormat.ts'
import './GameHistoryPage.css'

/** The cursor in a page's `next` link, which the generated client takes as a parameter. */
function cursorOf(url: string) {
  return new URL(url).searchParams.get('cursor') ?? undefined
}

function GameHistoryPage() {
  const [rows, setRows] = useState<HandSummary[]>()
  const [next, setNext] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    let active = true
    hands.handsList().then(
      ({ data }) => {
        if (!active) return
        setRows(data.results)
        setNext(data.next ?? null)
      },
      (err) => {
        if (active) setError(errorMessage(err))
      },
    )
    return () => {
      active = false
    }
  }, [])

  async function loadMore() {
    if (!next) return
    setLoadingMore(true)
    setError(null)
    try {
      const { data } = await hands.handsList({ cursor: cursorOf(next) })
      setRows((current) => [...(current ?? []), ...data.results])
      setNext(data.next ?? null)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <section className="game-history">
      <h1>Game History</h1>
      <p className="game-history-intro">
        This shows the most recent hands you've played across all tables on PokerStars. Hands appear here
        shortly after they finish, once your tracker has uploaded them; set it up on your{' '}
        <Link to="/settings">settings page</Link>.
      </p>

      {rows === undefined ? (
        !error && <p>Loading…</p>
      ) : rows.length === 0 ? (
        <p className="game-history-empty">No hands yet. Play a hand with the tracker running and it shows up here.</p>
      ) : (
        <div className="history-table-scroll">
          <table className="history-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Game</th>
                <th scope="col">Table</th>
                <th scope="col">Account</th>
                <th scope="col">Position</th>
                <th scope="col">Cards</th>
                <th scope="col">Result</th>
                <th scope="col">Replay</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((hand) => (
                <HistoryRow key={hand.id} hand={hand} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      {next && (
        <button type="button" className="button game-history-more" onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? 'Loading…' : 'Load more'}
        </button>
      )}
    </section>
  )
}

function HistoryRow({ hand }: { hand: HandSummary }) {
  const result = hand.hero_net > 0 ? 'win' : hand.hero_net < 0 ? 'loss' : 'even'
  const street = streetLabel(hand.final_street)
  return (
    <tr>
      <td className="nowrap">{formatDateTime(hand.played_at)}</td>
      <td>{gameLabel(hand)}</td>
      <td>{hand.table}</td>
      <td>{hand.hero || '—'}</td>
      <td>{hand.hero_position || '—'}</td>
      <td className="nowrap">
        {hand.hero_cards.length
          ? hand.hero_cards.map((card, i) => (
              <span key={i}>
                {i > 0 && ' '}
                <PlayingCard card={card} inline />
              </span>
            ))
          : '—'}
      </td>
      <td className={`nowrap history-result ${result}`}>
        {hand.hero ? formatAmount(hand.hero_net, hand.currency, true) : '—'}
      </td>
      <td>
        <Link to={`/games/${hand.id}`} aria-label={`Replay hand #${hand.hand_id}, to the ${street.toLowerCase()}`}>
          {street}
        </Link>
      </td>
    </tr>
  )
}

export default GameHistoryPage
