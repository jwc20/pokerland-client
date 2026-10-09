import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import type { HandSummary } from '../api/generated/data-contracts.ts'
import { queries } from '../api/queries.ts'
import { formatAmount, formatBb, formatDateTime, formatShare, gameLabel, handNickname, streetLabel } from '../handFormat.ts'
import PlayingCard from './PlayingCard.tsx'

/** Hands as the game history lists them. `compact` leaves out the table and account columns. */
function HandTable({ hands, compact }: { hands: HandSummary[]; compact?: boolean }) {
  return (
    <div className="history-table-scroll">
      <table className="history-table">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Game</th>
            {!compact && <th scope="col">Table</th>}
            {!compact && <th scope="col">Account</th>}
            <th scope="col">Position</th>
            <th scope="col">Cards</th>
            <th scope="col">Result</th>
            <th scope="col">Replay</th>
          </tr>
        </thead>
        <tbody>
          {hands.map((hand) => (
            <HandRow key={hand.id} hand={hand} compact={compact} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** How long the pointer rests on a row before its replay is fetched: long enough to pass over rows while scrolling. */
const HOVER_MS = 150

/** Fetches a hand's replay ahead of a click: on resting the pointer on its row, or focusing its link. */
function usePrefetchReplay(id: number) {
  const client = useQueryClient()
  const timer = useRef<number>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const prefetch = () => void client.prefetchQuery(queries.hands.detail(id))
  return {
    onPointerEnter: () => {
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(prefetch, HOVER_MS)
    },
    onPointerLeave: () => window.clearTimeout(timer.current),
    onFocus: prefetch,
  }
}

function HandRow({ hand, compact }: { hand: HandSummary; compact?: boolean }) {
  const result = hand.hero_net > 0 ? 'win' : hand.hero_net < 0 ? 'loss' : 'even'
  const street = streetLabel(hand.final_street)
  const nickname = handNickname(hand.hero_cards)
  const { onPointerEnter, onPointerLeave, onFocus } = usePrefetchReplay(hand.id)
  return (
    <tr onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      <td className="nowrap">{formatDateTime(hand.played_at)}</td>
      <td>{gameLabel(hand)}</td>
      {!compact && <td>{hand.table}</td>}
      {!compact && <td>{hand.hero || '—'}</td>}
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
        {nickname && <span className="history-nickname"> · {nickname}</span>}
      </td>
      <td className={`nowrap history-result ${result}`}>
        {hand.hero ? formatAmount(hand.hero_net, hand.currency, true) : '—'}
        {hand.hero_allin_equity !== null && hand.hero_ev_net_bb !== null && (
          <span
            className="history-allin"
            title={`All-in before the river with ${formatShare(hand.hero_allin_equity)}: expected ${formatBb(hand.hero_ev_net_bb)}`}
          >
            all-in {formatShare(hand.hero_allin_equity)}
          </span>
        )}
      </td>
      <td>
        <Link
          to={`/games/${hand.id}`}
          aria-label={`Replay hand #${hand.hand_id}, to the ${street.toLowerCase()}`}
          onFocus={onFocus}
        >
          {street}
        </Link>
      </td>
    </tr>
  )
}

export default HandTable
