import type { HandTag, StatGroup, TagStakes } from './api/generated/data-contracts.ts'

/**
 * The cash games the house rakes: for real money or for play money. The two
 * stay apart, as everywhere in the app. Tournaments charge a fee with the
 * buy-in instead.
 */
export type RakeKind = 'cash' | 'play_money'

export const RAKE_KINDS: { kind: RakeKind; label: string }[] = [
  { kind: 'cash', label: 'Real money' },
  { kind: 'play_money', label: 'Play money' },
]

/**
 * The kinds of cash game the user has hands in, by their format tags, the most played first; while the tags are
 * unknown, both, real money first.
 */
export function rakeKinds(tags?: HandTag[]): RakeKind[] {
  const kinds = RAKE_KINDS.map(({ kind }) => kind)
  if (!tags) return kinds
  const hands = (kind: RakeKind) => tags.find((tag) => tag.key === `format:${kind}`)?.hands ?? 0
  return kinds.filter((kind) => hands(kind) > 0).sort((a, b) => hands(b) - hands(a))
}

type RakeTotals = Pick<StatGroup, 'hands' | 'net_bb' | 'rake_bb' | 'net_before_rake_bb'>

/** A group's rake and results, per 100 hands. */
export interface RakeRates {
  hands: number
  /** Big blinds of rake paid: the hero's share of each pot's rake, split by what the players put in. */
  paid: number
  /** bb/100 with the rake that came out of the pots they won added back. */
  before: number
  /** bb/100 as it happened. */
  after: number
}

/** Undefined for no hands. */
export function rakeRates(group: RakeTotals): RakeRates | undefined {
  if (group.hands === 0) return undefined
  const per100 = (bb: number) => (bb / group.hands) * 100
  return {
    hands: group.hands,
    paid: per100(group.rake_bb),
    before: per100(group.net_before_rake_bb),
    after: per100(group.net_bb),
  }
}

/** Groups summed into one, such as every stakes of a kind. */
export function totalOf(groups: RakeTotals[]): RakeTotals {
  return groups.reduce(
    (sum, group) => ({
      hands: sum.hands + group.hands,
      net_bb: sum.net_bb + group.net_bb,
      rake_bb: sum.rake_bb + group.rake_bb,
      net_before_rake_bb: sum.net_before_rake_bb + group.net_before_rake_bb,
    }),
    { hands: 0, net_bb: 0, rake_bb: 0, net_before_rake_bb: 0 },
  )
}

/** A stakes group's key, "USD:5:10" or ":100:200" in chips, as the blinds it stands for. */
export function stakesOf(key: string): TagStakes {
  const [currency, small, big] = key.split(':')
  return { currency, small_blind: Number(small), big_blind: Number(big) }
}

/** Rake per 100 hands, which has no sign: "5.1", or "0.35" below one. */
export function formatPaid(bb: number): string {
  return bb.toLocaleString(undefined, { maximumFractionDigits: Math.abs(bb) < 1 ? 2 : 1 })
}
