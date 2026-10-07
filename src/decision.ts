import type { HandDetail, HandEvent } from './api/generated/data-contracts.ts'
import type { ReplaySeat, ReplayStep } from './replay.ts'

/** The hero's moves that are decisions; posting a blind or showing cards is not one. */
const MOVES = new Set<HandEvent['type']>(['fold', 'check', 'call', 'bet', 'raise'])

/** What calling costs a player, and the pot they play for if they do. */
export interface Price {
  /** The bet to match, or the player's whole stack when that is less. */
  toCall: number
  /**
   * The pot after the call that the player can win: what each player has put
   * in, up to the caller's own total. A short stack cannot win the rest.
   */
  pot: number
  /** Calling puts the player all-in. */
  allIn: boolean
}

/** A bet or raise, with everything that was in the middle before it. */
export interface Aggression {
  event: HandEvent
  potBefore: number
}

/** The hero's bet or raise, and what it asks of the bluff and of the next player. */
export interface Sizing {
  /** Chips the hero puts in with it. */
  amount: number
  /** Everything in the middle before it. */
  potBefore: number
  /** How often a pure bluff of this size must work: amount ÷ (pot + amount). */
  breakEven: number
  /** The next opponent to act, and the price the bet gives them. */
  next?: { player: string; price: Price }
}

/** The numbers behind one of the hero's decisions. Amounts are chips, or cents when the hand has a currency. */
export interface Decision {
  /** The step before the hero acts; the step after shows what they did. */
  step: number
  street: string
  /** What the hero did: a fold, check, call, bet or raise. */
  move: HandEvent
  /** The hero's chips behind. */
  stack: number
  /** The most the hero can still lose: their stack, or less when no opponent still in can match it. */
  effectiveStack: number
  /** Players still in the hand, the hero included. */
  players: number
  /** Whether the hero acts last after the flop; undefined when no opponent still in has chips to act with. */
  inPosition?: boolean
  /** Effective stack ÷ pot when the flop came; on the flop and later streets. */
  spr?: number
  /** The last bet or raise on this street, which the hero faces. */
  facing?: Aggression
  /** Calls since `facing`, or since the street began: before the flop, with no raise, these are limpers. */
  callers: number
  /** Checks on this street before the hero acts. */
  checks: number
  /** What calling costs; `toCall` is 0 when the hero can check. */
  price: Price
  /**
   * From the flop on, the minimum defense frequency against `facing`: how often
   * the players facing it must continue so a pure bluff cannot profit,
   * pot ÷ (pot + bet).
   */
  mdf?: number
  /** Set when the hero bets or raises. */
  sizing?: Sizing
}

/** Chips in the middle: the pot and the bets in front of the players. */
function middle(step: ReplayStep): number {
  return step.seats.reduce((sum, seat) => sum + seat.bet, step.pot)
}

/** What calling costs `caller` at `step`. `starts` holds each player's stack at the start of the hand. */
function priceToCall(step: ReplayStep, caller: ReplaySeat, starts: Map<string, number>): Price {
  const top = Math.max(...step.seats.map((seat) => seat.bet))
  const toCall = Math.max(0, Math.min(top - caller.bet, caller.stack))
  const allIn = toCall > 0 && toCall === caller.stack
  if (!allIn) return { toCall, pot: middle(step) + toCall, allIn }
  // All-in, the caller wins at most their own total from each player. Nothing goes back to a
  // player while there is betting left to do, so a stack's drop is what its player has put in.
  const putIn = (seat: ReplaySeat) => (starts.get(seat.name) ?? seat.stack) - seat.stack
  const total = putIn(caller) + toCall
  const pot = step.seats.reduce((sum, seat) => sum + Math.min(seat === caller ? total : putIn(seat), total), 0)
  return { toCall, pot, allIn }
}

/** The most `hero` can still lose at `step`: their stack, or what the biggest stack still in can match. */
function effectiveStack(step: ReplayStep, hero: ReplaySeat): number {
  const others = step.seats.filter((seat) => seat !== hero && !seat.folded)
  return Math.min(hero.stack, Math.max(0, ...others.map((seat) => seat.stack + seat.bet - hero.bet)))
}

/** Seats in the order they act after the flop: the first seat after the button first, the button last. */
function postflopOrder(hand: HandDetail): number[] {
  const seats = hand.players.map((player) => player.seat).sort((a, b) => a - b)
  const button = seats.indexOf(hand.button_seat)
  return [...seats.slice(button + 1), ...seats.slice(0, button + 1)]
}

/** The hero's decisions in the order they came, from the hand and the steps `buildReplay` made of it. */
export function heroDecisions(hand: HandDetail, steps: ReplayStep[]): Decision[] {
  const starts = new Map(hand.players.map((player) => [player.name, player.stack]))
  const order = postflopOrder(hand)
  const seatOf = (step: ReplayStep, name?: string) => step.seats.find((seat) => seat.name === name)

  const flop = steps.find((step) => step.event?.type === 'street' && step.event.street === 'flop')
  const heroAtFlop = flop && seatOf(flop, hand.hero)
  const spr = flop && heroAtFlop && !heroAtFlop.folded && flop.pot ? effectiveStack(flop, heroAtFlop) / flop.pot : undefined

  const decisions: Decision[] = []
  let facing: Aggression | undefined
  let callers = 0
  let checks = 0
  hand.events.forEach((event, i) => {
    // steps[i] is the table before this event, steps[i + 1] after it.
    const step = steps[i]
    const hero = seatOf(step, hand.hero)
    if (event.player === hand.hero && MOVES.has(event.type) && hero) {
      const able = step.seats.filter((seat) => seat !== hero && !seat.folded && !seat.allIn)
      const decision: Decision = {
        step: i,
        street: event.street,
        move: event,
        stack: hero.stack,
        effectiveStack: effectiveStack(step, hero),
        players: step.seats.filter((seat) => !seat.folded).length,
        inPosition: able.length
          ? able.every((seat) => order.indexOf(seat.seat) < order.indexOf(hero.seat))
          : undefined,
        spr: event.street === 'preflop' ? undefined : spr,
        facing,
        callers,
        checks,
        price: priceToCall(step, hero, starts),
      }
      if (facing && event.street !== 'preflop') {
        decision.mdf = facing.potBefore / (facing.potBefore + (facing.event.amount ?? 0))
      }
      if ((event.type === 'bet' || event.type === 'raise') && event.amount) {
        const potBefore = middle(step)
        decision.sizing = { amount: event.amount, potBefore, breakEven: event.amount / (potBefore + event.amount) }
        // The next opponent to act on this street, at the table as they decide.
        const j = hand.events.findIndex((later, k) => k > i && later.player !== hand.hero && MOVES.has(later.type))
        const answer = hand.events[j]
        const caller = answer?.street === event.street ? seatOf(steps[j], answer.player) : undefined
        if (caller) decision.sizing.next = { player: caller.name, price: priceToCall(steps[j], caller, starts) }
      }
      decisions.push(decision)
    }

    // What the next decision on this street faces.
    if (event.type === 'street') {
      facing = undefined
      callers = 0
      checks = 0
    } else if (event.type === 'bet' || event.type === 'raise') {
      facing = { event, potBefore: middle(step) }
      callers = 0
      checks = 0
    } else if (event.player !== hand.hero && event.type === 'call') {
      callers += 1
    } else if (event.player !== hand.hero && event.type === 'check') {
      checks += 1
    }
  })
  return decisions
}

/** Harrington's M in a tournament: the hero's stack at the start of the hand ÷ (small blind + big blind + antes). */
export function heroM(hand: HandDetail): number | undefined {
  const hero = hand.players.find((player) => player.name === hand.hero)
  if (!hand.tournament_id || !hero) return undefined
  const antes = hand.events.reduce(
    (sum, event) => sum + (event.type === 'post' && event.blind === 'ante' ? (event.amount ?? 0) : 0),
    0,
  )
  return hero.stack / (hand.small_blind + hand.big_blind + antes)
}

/** The MIT 15.S50 zone an M falls in. */
export function mZone(m: number): string {
  if (m < 2) return 'dead'
  if (m < 8) return 'stealing: push or fold'
  if (m < 12) return 'steal and re-steal'
  if (m <= 30) return 'value-betting'
  return 'set-mining'
}
