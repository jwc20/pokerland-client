import type { HandSummary, HandTag, TagStakes } from './api/generated/data-contracts.ts'

type Stakes = Pick<HandSummary, 'game' | 'small_blind' | 'big_blind' | 'currency'>

/**
 * Chips as "2,646", or money as "$7.85": a hand's amounts are cents when it
 * has a currency. Whole amounts drop the cents, as PokerStars writes them
 * ("$2"). `signed` adds a + to gains.
 */
export function formatAmount(amount: number, currency: string, signed = false): string {
  const signDisplay: Intl.NumberFormatOptions['signDisplay'] = signed ? 'exceptZero' : 'auto'
  if (!currency) return amount.toLocaleString(undefined, { signDisplay })
  const minimumFractionDigits = amount % 100 === 0 ? 0 : 2
  try {
    return (amount / 100).toLocaleString(undefined, { style: 'currency', currency, signDisplay, minimumFractionDigits })
  } catch {
    // Not an ISO currency code: show the number alone.
    return (amount / 100).toLocaleString(undefined, { signDisplay, minimumFractionDigits })
  }
}

/** The blinds, as "$0.05/$0.10" or "100/200" in chips. */
export function stakesLabel(stakes: TagStakes): string {
  return `${formatAmount(stakes.small_blind, stakes.currency)}/${formatAmount(stakes.big_blind, stakes.currency)}`
}

/** "Hold'em No Limit (100/200)", the way PokerStars names a game. */
export function gameLabel(hand: Stakes): string {
  return `${hand.game} (${stakesLabel(hand)})`
}

/** A result in big blinds to a tenth: "+12.5 bb", "-3 bb". */
export function formatBb(bb: number, signed = true): string {
  return `${bb.toLocaleString(undefined, { maximumFractionDigits: 1, signDisplay: signed ? 'exceptZero' : 'auto' })} bb`
}

const FORMAT_LABELS: Record<string, string> = { cash: 'Cash', tournament: 'Tournament', play_money: 'Play money' }

/** What a tag's chip says: "All hands", "BTN", "Hold'em No Limit", "$0.05/$0.10", "Play money". */
export function tagLabel(tag: Pick<HandTag, 'group' | 'value' | 'stakes'>): string {
  switch (tag.group) {
    case 'all':
      return 'All hands'
    case 'stakes':
      return tag.stakes ? stakesLabel(tag.stakes) : tag.value
    case 'format':
      return FORMAT_LABELS[tag.value] ?? tag.value
    case 'position':
    case 'game':
      return tag.value
  }
}

/**
 * The game history narrowed to a tag's hands or a day's, e.g. "/games?tag=position%3AUTG%2B1".
 * The keys go through URLSearchParams: a bare "+" in "UTG+1" would arrive as a space.
 */
export function historyUrl({ tag, date }: { tag?: string; date?: string }): string {
  const params = new URLSearchParams()
  if (tag && tag !== 'all') params.set('tag', tag)
  if (date) params.set('date', date)
  const query = params.toString()
  return query ? `/games?${query}` : '/games'
}

/** "2026-10-04 10:53", in the viewer's time zone. */
export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}

/** "preflop" to "Preflop". */
export function streetLabel(street: string): string {
  return street.charAt(0).toUpperCase() + street.slice(1)
}

const SUITS: Record<string, { symbol: string; name: string }> = {
  c: { symbol: '♣', name: 'clubs' },
  d: { symbol: '♦', name: 'diamonds' },
  h: { symbol: '♥', name: 'hearts' },
  s: { symbol: '♠', name: 'spades' },
}
const RANK_NAMES: Record<string, string> = { T: 'Ten', J: 'Jack', Q: 'Queen', K: 'King', A: 'Ace' }

/** A card such as "Th" as its rank and suit ("10", "♥"), or null if it is not one. */
export function parseCard(card: string) {
  const suit = SUITS[card.slice(-1)]
  const rank = card.slice(0, -1)
  if (!suit || !rank) return null
  return {
    rank: rank === 'T' ? '10' : rank,
    suit: suit.symbol,
    red: suit.symbol === '♦' || suit.symbol === '♥',
    name: `${RANK_NAMES[rank] ?? rank} of ${suit.name}`,
  }
}

/** Cards as text: ["Kh", "Td"] to "K♥ 10♦". */
export function cardsText(cards: string[]): string {
  return cards
    .map((card) => {
      const parsed = parseCard(card)
      return parsed ? parsed.rank + parsed.suit : card
    })
    .join(' ')
}
