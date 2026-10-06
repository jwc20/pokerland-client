import { parseCard } from '../handFormat.ts'
import './PlayingCard.css'

/**
 * A card as text, until there are card graphics: "K♥" in a card-shaped box,
 * or inline when `inline`. Without `card` it is face down; with `empty` it
 * marks where a card has yet to come.
 */
function PlayingCard({ card, inline, empty }: { card?: string; inline?: boolean; empty?: boolean }) {
  if (empty) return <span className="playing-card empty" aria-hidden="true" />
  if (!card) return <span className="playing-card face-down" role="img" aria-label="Face-down card" />
  const parsed = parseCard(card)
  const classes = ['playing-card', inline && 'inline', parsed?.red && 'red'].filter(Boolean).join(' ')
  if (!parsed) return <span className={classes}>{card}</span>
  return (
    <span className={classes} role="img" aria-label={parsed.name}>
      {parsed.rank}
      {parsed.suit}
    </span>
  )
}

export default PlayingCard
