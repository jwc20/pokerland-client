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
  /** The board so far, or one per run when the hand is run twice. */
  boards: string[][]
}

/** The table before the hand's first event, and after each one. */
export function buildReplay(hand: HandDetail): ReplayStep[] {
  const money = (amount = 0) => formatAmount(amount, hand.currency)
  let seats: ReplaySeat[] = hand.players
    .filter((player) => !player.sitting_out)
    .map((player) => ({
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
  let boards: string[][] = []
  const button = seats.find((seat) => seat.seat === hand.button_seat)
  const steps: ReplayStep[] = [
    {
      street: hand.events[0]?.street ?? 'preflop',
      text: `${seats.length} players${button ? `, ${button.name} on the button` : ''}`,
      seats,
      pot,
      boards,
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
      case 'bring_in':
        act(`brings in for ${money(amount)}`, putIn)
        text = `${name} brings in for ${money(amount)}`
        break
      case 'raise':
        act(`raises to ${money(event.to)}`, putIn)
        text = `${name} raises ${event.by === undefined ? '' : `${money(event.by)} `}to ${money(event.to)}`
        if (event.all_in) text += ' and is all-in'
        break
      case 'street':
        sweepBets()
        for (const s of seats) s.action = ''
        if (event.board) {
          boards = [...boards]
          boards[(event.run ?? 1) - 1] = event.board
        }
        if (event.street === 'showdown') text = 'Players show their hands'
        else text = `${event.run && event.run > 1 ? 'Second board: ' : ''}${cardsText(cards)}`
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
      case 'no_show':
        act("doesn't show")
        text = `${name} doesn't show their hand`
        break
      case 'discard':
        act(`discards ${event.count}`)
        text = `${name} discards ${event.count} card${event.count === 1 ? '' : 's'}`
        break
      case 'stand_pat':
        act('stands pat')
        text = `${name} stands pat`
        break
    }
    steps.push({ street: event.street, text, event, seats, pot, boards })
  }
  return steps
}

/** How many hole cards each player has, for drawing the ones not shown yet. */
export function holeCardCount(hand: HandDetail): number {
  const shown = Math.max(0, ...hand.players.map((player) => player.cards.length))
  if (shown) return shown
  if (/^6 Card Omaha/.test(hand.game)) return 6
  if (/^5 Card Omaha|Courchevel/.test(hand.game)) return 5
  if (/Omaha/.test(hand.game)) return 4
  return 2
}

/** Whether the game deals a board: Hold'em, Omaha and friends, but not stud or draw. */
export function hasBoard(hand: HandDetail): boolean {
  return hand.boards.length > 0 || /Hold'em|Omaha|Courchevel/.test(hand.game)
}
