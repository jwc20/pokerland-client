/**
 * Hold'em starting hands for the range grid (FND-5): the 169 hands in the grid's order, their combos, range
 * notation, and the top X% by a ranking. pokerland-api's hands/ranges.py does the same on the server, and the two
 * must agree.
 *
 * A hand is "AA", "AKs" or "AKo": a pair has 6 combos, a suited hand 4 and an offsuit hand 12, 1,326 in all
 * [JHU 3, which counts 1,225]. Notation lists hands with commas: "TT+", "A2s+", "KTo+", "T9s-T6s", "22-55", "AK"
 * (suited and offsuit) and "any".
 */

/** The ranks from aces down: the grid's rows and columns. */
export const GRID_RANKS = 'AKQJT98765432'
const LOW_FIRST = '23456789TJQKA'
export const TOTAL_COMBOS = 1326

/**
 * The hands by their all-in equity against one random hand, best first (from the API's hands/ranges.py, worked
 * out with 60,000 run-outs each). It sets "the top X%".
 */
export const RANKING = (
  'AA KK QQ JJ TT 99 88 AKs AQs 77 AJs AKo ATs AQo KQs 66 AJo A9s ATo KJs A8s KTs A7s KQo A9o 55 KJo QJs A6s A5s ' +
  'K9s A8o KTo QTs A4s A7o K8s A3s QJo A2s A6o QTo K7s K9o JTs Q9s A5o 44 A4o K6s K8o Q8s A3o J9s K5s K7o Q9o JTo ' +
  'A2o Q7s K4s K6o T9s J8s K3s Q6s Q8o 33 J9o K2s K5o Q5s T8s J7s Q4s T9o K4o Q7o Q3s J8o K3o Q6o 98s T7s J6s 22 ' +
  'K2o Q5o Q2s J5s T8o J7o Q4o 97s T6s J4s Q3o T7o 87s J3s 98o J6o 96s J2s T5s Q2o J5o T4s 97o 86s J4o T6o T3s J3o ' +
  '95s 76s T2s 87o 85s 96o 94s J2o T5o 75s T4o 86o 93s 95o 65s 84s 76o T3o 92s 74s T2o 85o 54s 64s 83s 94o 75o ' +
  '82s 73s 93o 65o 84o 53s 63s 92o 74o 43s 54o 72s 64o 62s 52s 83o 42s 82o 73o 53o 63o 32s 43o 72o 52o 62o 42o 32o'
).split(' ')

function rankOf(rank: string) {
  return LOW_FIRST.indexOf(rank)
}

/** The hand of two ranks, highest first: "AA", "AKs", "AKo". */
export function handName(first: string, second: string, kind: '' | 's' | 'o' = '') {
  const [high, low] = rankOf(first) >= rankOf(second) ? [first, second] : [second, first]
  return high === low ? high + low : high + low + kind
}

/** The hand in a grid cell: a pair on the diagonal, suited above it, offsuit below. */
export function handAt(row: number, column: number) {
  const a = GRID_RANKS[row]
  const b = GRID_RANKS[column]
  if (row === column) return a + a
  return row < column ? handName(a, b, 's') : handName(b, a, 'o')
}

/** The 169 hands, row by row from aces. */
export const HANDS: string[] = Array.from({ length: 169 }, (_, i) => handAt(Math.floor(i / 13), i % 13))

/** Where a hand sits on the grid: [row, column]. */
export function cellOf(hand: string): [number, number] {
  const high = GRID_RANKS.indexOf(hand[0])
  const low = GRID_RANKS.indexOf(hand[1])
  if (hand.length === 2) return [high, high]
  return hand[2] === 's' ? [high, low] : [low, high]
}

/** How many combos a hand has: 6 for a pair, 4 suited, 12 offsuit. */
export function comboCount(hand: string) {
  if (hand.length === 2) return 6
  return hand[2] === 's' ? 4 : 12
}

/** How many combos a set of hands holds. */
export function combosOf(hands: Iterable<string>) {
  let total = 0
  for (const hand of hands) total += comboCount(hand)
  return total
}

/** A set of hands as a share of all 1,326 combos, from 0 to 1. */
export function rangeShare(hands: Iterable<string>) {
  return combosOf(hands) / TOTAL_COMBOS
}

/** Two hole cards as their hand, "AKs"; undefined for anything but two cards. */
export function handOfCards(cards: string[]): string | undefined {
  if (cards.length !== 2) return undefined
  const [a, b] = cards
  return handName(a[0], b[0], a[1] === b[1] ? 's' : 'o')
}

const TOKEN = /^([2-9TJQKA])([2-9TJQKA])([so]?)(\+?)$/
const SPAN = /^([2-9TJQKA])([2-9TJQKA])([so]?)-([2-9TJQKA])([2-9TJQKA])([so]?)$/

/** A hand with no suitedness, "AK", as both of its hands. */
function both(high: string, low: string, kind: string) {
  return kind ? [handName(high, low, kind as 's' | 'o')] : [handName(high, low, 's'), handName(high, low, 'o')]
}

/** The hands a range in notation names; a RangeError names the part it can't read. */
export function parseRange(notation: string): Set<string> {
  const hands = new Set<string>()
  for (const raw of notation.replaceAll(';', ',').split(',')) {
    const token = raw.trim()
    if (!token) continue
    if (['any', 'random', '100%'].includes(token.toLowerCase())) return new Set(HANDS)
    for (const hand of readToken(token)) hands.add(hand)
  }
  return hands
}

function readToken(token: string): string[] {
  let match = TOKEN.exec(token)
  if (match) {
    let [, high, low] = match
    const [, , , kind, plus] = match
    if (rankOf(low) > rankOf(high)) [high, low] = [low, high]
    if (high === low) {
      if (kind) throw new RangeError(`A pair has no suitedness: ${token}`)
      const top = plus ? LOW_FIRST.length : rankOf(high) + 1
      return [...LOW_FIRST.slice(rankOf(high), top)].map((rank) => rank + rank)
    }
    const kickers = plus ? [...LOW_FIRST.slice(rankOf(low), rankOf(high))] : [low]
    return kickers.flatMap((kicker) => both(high, kicker, kind))
  }
  match = SPAN.exec(token)
  if (match) {
    const [, a, b, kind, c, d, other] = match
    if (kind !== other) throw new RangeError(`Both ends of a span need the same suitedness: ${token}`)
    if (a === b && c === d) {
      const [low, high] = [rankOf(a), rankOf(c)].sort((x, y) => x - y)
      return [...LOW_FIRST.slice(low, high + 1)].map((rank) => rank + rank)
    }
    if (a === c) {
      const [low, high] = [rankOf(b), rankOf(d)].sort((x, y) => x - y)
      return [...LOW_FIRST.slice(low, high + 1)].filter((kicker) => kicker !== a).flatMap((kicker) => both(a, kicker, kind))
    }
  }
  throw new RangeError(`Not a range: ${token}`)
}

/** Hands as short notation: runs of pairs and of kickers under one top card, "TT+, A2s+, KTo+, 76s". */
export function formatRange(hands: Iterable<string>): string {
  const chosen = new Set(hands)
  if (chosen.size === HANDS.length) return 'any'
  const parts: string[] = []
  // Pairs, from aces down, in runs.
  const pairs = [...GRID_RANKS].filter((rank) => chosen.has(rank + rank))
  for (const run of runs(pairs)) {
    const [top, bottom] = [run[0], run[run.length - 1]]
    if (run.length === 1) parts.push(top + top)
    else if (top === 'A') parts.push(`${bottom}${bottom}+`)
    else parts.push(`${top}${top}-${bottom}${bottom}`)
  }
  // Then each top card's suited and offsuit kickers, in runs.
  for (const high of GRID_RANKS) {
    for (const kind of ['s', 'o'] as const) {
      const kickers = [...GRID_RANKS.slice(GRID_RANKS.indexOf(high) + 1)].filter((low) =>
        chosen.has(handName(high, low, kind)),
      )
      for (const run of runs(kickers)) {
        const [top, bottom] = [run[0], run[run.length - 1]]
        const nextBelow = GRID_RANKS[GRID_RANKS.indexOf(high) + 1]
        if (run.length === 1) parts.push(`${high}${top}${kind}`)
        else if (top === nextBelow) parts.push(`${high}${bottom}${kind}+`)
        else parts.push(`${high}${top}${kind}-${high}${bottom}${kind}`)
      }
    }
  }
  return parts.join(', ')
}

/** Consecutive runs of ranks, given high first. */
function runs(ranks: string[]): string[][] {
  const found: string[][] = []
  for (const rank of ranks) {
    const last = found[found.length - 1]
    if (last && GRID_RANKS.indexOf(rank) === GRID_RANKS.indexOf(last[last.length - 1]) + 1) last.push(rank)
    else found.push([rank])
  }
  return found
}

/** The hands from the top of RANKING until their combos make `percent`% of all 1,326. */
export function topHands(percent: number): Set<string> {
  const hands = new Set<string>()
  let total = 0
  for (const hand of RANKING) {
    if (total >= (percent / 100) * TOTAL_COMBOS) break
    hands.add(hand)
    total += comboCount(hand)
  }
  return hands
}

/** Where a hand sits in RANKING by combos, from 0 (the best) to 1 (the worst). */
export function percentile(hand: string) {
  const before = combosOf(RANKING.slice(0, RANKING.indexOf(hand)))
  return before / (TOTAL_COMBOS - comboCount(hand))
}

/** The JHU starting-hand groups [JHU 3; JHU 4], as the API names them. */
export const HAND_GROUPS = [
  'premium',
  'big_pair',
  'medium_pair',
  'small_pair',
  'big_ace',
  'suited_connector',
  'trouble',
  'weak_ace',
  'junk',
] as const
export type HandGroup = (typeof HAND_GROUPS)[number]

export const HAND_GROUP_LABELS: Record<HandGroup, string> = {
  premium: 'Premium: QQ+ and AK',
  big_pair: 'Big pairs: JJ and TT',
  medium_pair: 'Medium pairs: 99 to 77',
  small_pair: 'Small pairs: 66 to 22',
  big_ace: 'Big ace: AQ',
  suited_connector: 'Suited connectors: 54s to JTs',
  trouble: 'Trouble hands: AJ, AT, KQ, KJ, KT, QJ, QT, JT',
  weak_ace: 'Weak aces',
  junk: 'Everything else',
}

const PREMIUM = new Set(['AA', 'KK', 'QQ', 'AK'])
const TROUBLE = new Set(['AJ', 'AT', 'KQ', 'KJ', 'KT', 'QJ', 'QT', 'JT'])

/** A hand's JHU group, first match wins, as tracker.parsing.facts.hand_group decides it. */
export function groupOf(hand: string): HandGroup {
  const ranks = hand.slice(0, 2)
  const high = rankOf(hand[0]) + 2
  const low = rankOf(hand[1]) + 2
  if (PREMIUM.has(ranks)) return 'premium'
  if (high === low) return high >= 10 ? 'big_pair' : high >= 7 ? 'medium_pair' : 'small_pair'
  if (ranks === 'AQ') return 'big_ace'
  if (hand.endsWith('s') && high - low === 1 && high >= 5 && high <= 11) return 'suited_connector'
  if (TROUBLE.has(ranks)) return 'trouble'
  return hand[0] === 'A' ? 'weak_ace' : 'junk'
}
