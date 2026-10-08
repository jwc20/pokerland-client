import { parseCard } from '../handFormat.ts'
import './PlayingCard.css'

/**
 * A card as text, until there are card graphics: "K♥" in a card-shaped box,
 * or inline when `inline`. Without `card` it is face down; with `empty` it
 * marks where a card has yet to come. `small` draws it smaller, as at the
 * practice table's other seats. Its suit is a class too (`suit-h`), so a
 * four-colour deck can recolour diamonds and clubs; the symbol always shows.
 */
function PlayingCard({
  card,
  inline,
  empty,
  small,
}: {
  card?: string
  inline?: boolean
  empty?: boolean
  small?: boolean
}) {
  const size = small && 'small'
  if (empty) return <span className={['playing-card empty', size].filter(Boolean).join(' ')} aria-hidden="true" />
  if (!card) {
    const classes = ['playing-card face-down', size].filter(Boolean).join(' ')
    return <span className={classes} role="img" aria-label="Face-down card" />
  }
  const parsed = parseCard(card)
  const classes = ['playing-card', inline && 'inline', size, parsed?.red && 'red', parsed && `suit-${card.slice(-1)}`]
    .filter(Boolean)
    .join(' ')
  if (!parsed) return <span className={classes}>{card}</span>
  return (
    <span className={classes} role="img" aria-label={parsed.name}>
      {parsed.rank}
      {parsed.suit}
    </span>
  )
}

export default PlayingCard
