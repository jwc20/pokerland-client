import type { CSSProperties } from 'react'
import type { HandDetail } from '../api/generated/data-contracts.ts'
import { handNickname } from '../handFormat.ts'
import type { ReplaySeat, ReplayStep } from '../replay.ts'
import { betPoint, dealerPoint, formatUnit, heroMarks, seatLayout, type Point, type Unit } from '../table.ts'
import ChipStack from './ChipStack.tsx'
import PlayingCard from './PlayingCard.tsx'
import './PokerTable.css'

export type PokerTableHand = Pick<HandDetail, 'button_seat' | 'hero' | 'currency' | 'big_blind' | 'game'>

/** The CSS variables that place an element at a point, on the wide table and on the upright one. */
function place(wide: Point, tall: Point): CSSProperties {
  return { '--x': `${wide.x}%`, '--y': `${wide.y}%`, '--tx': `${tall.x}%`, '--ty': `${tall.y}%` } as CSSProperties
}

/**
 * A practice table, drawn like the app's charts: the felt as an SVG oval, the seats on its rail with their stacks
 * and cards, each bet in front of its player as chips with the amount beside them, the board and the pot in the
 * middle, and the dealer button. Seats show names in the user's own hands and positions otherwise, with the hero
 * at the bottom. On phones the oval stands upright.
 */
function PokerTable({
  step,
  hand,
  labels,
  unit,
  revealed = {},
  actor,
  fourColour = false,
}: {
  step: ReplayStep
  hand: PokerTableHand
  labels: 'names' | 'positions'
  unit: Unit
  /** Cards shown with the spot, by player, as a generated spot's all-in shows them. */
  revealed?: Record<string, string[]>
  /** Whose turn it is. */
  actor?: string
  fourColour?: boolean
}) {
  const seats = [...step.seats].sort((a, b) => a.seat - b.seat)
  const heroIndex = Math.max(0, seats.findIndex((seat) => seat.name === hand.hero))
  const wide = seatLayout(seats.length, heroIndex)
  const tall = seatLayout(seats.length, heroIndex, true)
  const amount = (chips: number) => formatUnit(chips, hand.currency, hand.big_blind, unit)
  const holeCards = /Omaha/.test(hand.game) ? 4 : 2
  const button = seats.findIndex((seat) => seat.seat === hand.button_seat)
  const heroWide = heroMarks(wide[heroIndex])
  const heroTall = heroMarks(tall[heroIndex], true)
  const betAt = (i: number) =>
    i === heroIndex ? place(heroWide.bet, heroTall.bet) : place(betPoint(wide[i]), betPoint(tall[i]))
  const dealerAt = (i: number) =>
    i === heroIndex ? place(heroWide.dealer, heroTall.dealer) : place(dealerPoint(wide[i]), dealerPoint(tall[i]))
  const classes = ['poker-table', fourColour && 'four-colour'].filter(Boolean).join(' ')

  return (
    <div className={classes} role="group" aria-label="The table">
      <svg className="poker-table-felt" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <ellipse className="wide" cx="50" cy="50" rx="44" ry="39" vectorEffect="non-scaling-stroke" />
        <ellipse className="tall" cx="50" cy="50" rx="38" ry="42" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="poker-table-middle">
        <div className="poker-table-board" aria-label="Board">
          {Array.from({ length: 5 }, (_, i) =>
            step.board[i] ? (
              <PlayingCard key={`${i}-${step.board[i]}`} card={step.board[i]} />
            ) : (
              <PlayingCard key={i} empty />
            ),
          )}
        </div>
        {step.pot > 0 && <p className="poker-table-pot">Pot {amount(step.pot)}</p>}
      </div>

      {seats.map((seat, i) => (
        <Seat
          key={seat.seat}
          seat={seat}
          style={place(wide[i], tall[i])}
          label={labels === 'names' ? seat.name : seat.position}
          position={labels === 'names' ? seat.position : undefined}
          hero={i === heroIndex}
          active={seat.name === actor}
          shown={revealed[seat.name] ?? seat.cards}
          holeCards={holeCards}
          amount={amount}
        />
      ))}

      {seats.map(
        (seat, i) =>
          seat.bet > 0 && (
            <div
              key={`${step.street}-${seat.seat}`}
              className="poker-table-bet"
              style={betAt(i)}
            >
              <ChipStack amount={seat.bet} bigBlind={hand.big_blind} />
              <span>{amount(seat.bet)}</span>
            </div>
          ),
      )}

      {button >= 0 && (
        <span
          className="poker-table-dealer"
          style={dealerAt(button)}
          role="img"
          aria-label={`Dealer button: ${seats[button].name}`}
        >
          D
        </span>
      )}
    </div>
  )
}

function Seat({
  seat,
  style,
  label,
  position,
  hero,
  active,
  shown,
  holeCards,
  amount,
}: {
  seat: ReplaySeat
  style: CSSProperties
  label: string
  position?: string
  hero: boolean
  active: boolean
  shown: string[]
  holeCards: number
  amount: (chips: number) => string
}) {
  // A folded opponent's cards are gone; the hero still knows theirs.
  const cards = hero || !seat.folded ? shown : []
  const hidden = hero || seat.folded ? 0 : Math.max(0, holeCards - cards.length)
  const nickname = hero ? handNickname(seat.cards) : undefined
  const classes = ['poker-table-seat', hero && 'hero', active && 'active', seat.folded && 'folded']
    .filter(Boolean)
    .join(' ')
  // The verb alone: the amount is in front of the seat.
  const action = seat.action.replace(/ (to )?[^ ]*\d[^ ]*( bb)?$/, '')
  return (
    <div className={classes} style={style}>
      <div className="poker-table-cards">
        {cards.map((card) => (
          <PlayingCard key={card} card={card} small={!hero} />
        ))}
        {Array.from({ length: hidden }, (_, i) => (
          <PlayingCard key={i} small />
        ))}
      </div>
      <div className="poker-table-box">
        <div className="poker-table-name">
          <span>{label}</span>
          {position && <span className="poker-table-position">{position}</span>}
        </div>
        <div className="poker-table-stack">
          {seat.allIn && !seat.stack ? 'All-in' : amount(seat.stack)}
        </div>
        {seat.won > 0 ? (
          <div className="poker-table-won">Won {amount(seat.won)}</div>
        ) : (
          action && <div className="poker-table-action">{action}</div>
        )}
      </div>
      {nickname && <div className="poker-table-nickname">{nickname}</div>}
    </div>
  )
}

export default PokerTable
