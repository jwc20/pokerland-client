import type { HandDetail, HandEvent } from './api/generated/data-contracts.ts'
import { cardsText, formatAmount } from './handFormat.ts'

export interface ReplaySeat {
  seat: number
  name: string
  position: string
  stack: number
  /** Chips in front of the player on this street. */
  bet: number
  /** The player's cards, once the hand has shown them. */
  cards: string[]
  folded: boolean
  allIn: boolean
  /** What the player last did on this street, e.g. "raises to 600". */
  action: string
  won: number
}

export interface ReplayStep {
  street: string
  /** What happened, e.g. "Bob raises 400 to 600". */
  text: string
  /** The event that led here; the first step has none. */
  event?: HandEvent
  seats: ReplaySeat[]
  /** Chips in the middle, without the bets still in front of the players. */
  pot: number
  /** The board so far. */
  board: string[]
}

/** What a replay needs of a hand: a stored hand, or a practice spot's hand up to its decision. */
export type ReplayHand = Pick<HandDetail, 'players' | 'events' | 'currency' | 'button_seat'>

/** The table before the hand's first event, and after each one; `money` writes the amounts in the steps' text. */
export function buildReplay(
  hand: ReplayHand,
  money: (amount?: number) => string = (amount = 0) => formatAmount(amount, hand.currency),
): ReplayStep[] {
  let seats: ReplaySeat[] = hand.players.map((player) => ({
    seat: player.seat,
    name: player.name,
    position: player.position,
    stack: player.stack,
    bet: 0,
    cards: [],
    folded: false,
    allIn: false,
    action: '',
    won: 0,
  }))
  let pot = 0
  let board: string[] = []
  const button = seats.find((seat) => seat.seat === hand.button_seat)
  const steps: ReplayStep[] = [
    {
      street: hand.events[0]?.street ?? 'preflop',
      text: `${seats.length} players${button ? `, ${button.name} on the button` : ''}`,
      seats,
      pot,
      board,
    },
  ]

  for (const event of hand.events) {
    seats = seats.map((seat) => ({ ...seat })) // this step's copy, changed below
    const seat = seats.find((s) => s.name === event.player)
    const name = event.player ?? ''
    const amount = event.amount ?? 0
    const cards = event.cards ?? []
    const sweepBets = () => {
      for (const s of seats) {
        pot += s.bet
        s.bet = 0
      }
    }
    const act = (action: string, change?: (s: ReplaySeat) => void) => {
      if (!seat) return
      seat.action = action
      change?.(seat)
    }
    const putIn = (s: ReplaySeat, dead = 0) => {
      s.stack -= amount
      s.bet += amount - dead
      pot += dead
      if (event.all_in) s.allIn = true
    }

    let text = ''
    switch (event.type) {
      case 'post':
        act(`posts ${event.blind}`, (s) => putIn(s, event.dead))
        text = `${name} posts ${event.blind} ${money(amount)}`
        break
      case 'deal':
        if (seat) seat.cards = cards
        text = `Dealt to ${name} [${cardsText(cards)}]`
        break
      case 'fold':
        act('folds', (s) => (s.folded = true))
        text = `${name} folds`
        break
      case 'check':
        act('checks')
        text = `${name} checks`
        break
      case 'call':
      case 'bet':
        act(`${event.type}s ${money(amount)}`, putIn)
        text = `${name} ${event.type}s ${money(amount)}${event.all_in ? ' and is all-in' : ''}`
        break
      case 'raise':
        act(`raises to ${money(event.to)}`, putIn)
        text = `${name} raises ${event.by === undefined ? '' : `${money(event.by)} `}to ${money(event.to)}`
        if (event.all_in) text += ' and is all-in'
        break
      case 'street':
        sweepBets()
        for (const s of seats) s.action = ''
        board = event.board ?? board
        text = event.street === 'showdown' ? 'Players show their hands' : cardsText(cards)
        break
      case 'return':
        act('', (s) => {
          const fromBet = Math.min(amount, s.bet)
          s.bet -= fromBet
          pot -= amount - fromBet
          s.stack += amount
        })
        text = `Uncalled bet (${money(amount)}) returned to ${name}`
        break
      case 'collect':
        sweepBets()
        if (seat) {
          // The action stays, e.g. the hand they showed; the seat shows what they won.
          seat.stack += amount
          seat.won += amount
        }
        text = `${name} collected ${money(amount)} from ${event.pot ?? 'pot'}`
        break
      case 'show':
        act(event.description ?? 'shows', (s) => (s.cards = cards))
        text = `${name} shows [${cardsText(cards)}]${event.description ? ` (${event.description})` : ''}`
        break
      case 'muck':
        act('mucks', (s) => (s.cards = cards.length ? cards : s.cards))
        text = `${name} mucks${cards.length ? ` [${cardsText(cards)}]` : ''}`
        break
    }
    steps.push({ street: event.street, text, event, seats, pot, board })
  }
  return steps
}

/** How many hole cards each player has, for drawing the ones not shown yet: 4 in Omaha, 2 in hold'em. */
export function holeCardCount(hand: Pick<HandDetail, 'game'>): number {
  return /Omaha/.test(hand.game) ? 4 : 2
}

/** The street the money went in on: that of the hand's last decision, after which the board only ran out. */
export function lastDecisionStreet(hand: Pick<HandDetail, 'events'>): string | undefined {
  const moves = new Set<HandEvent['type']>(['fold', 'check', 'call', 'bet', 'raise'])
  return hand.events.findLast((event) => moves.has(event.type))?.street
}
