import { Link } from 'react-router'
import type { HandSummary } from '../api/generated/data-contracts.ts'
import { formatAmount, formatDateTime, gameLabel, streetLabel } from '../handFormat.ts'
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

function HandRow({ hand, compact }: { hand: HandSummary; compact?: boolean }) {
  const result = hand.hero_net > 0 ? 'win' : hand.hero_net < 0 ? 'loss' : 'even'
  const street = streetLabel(hand.final_street)
  return (
    <tr>
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

export default HandTable
