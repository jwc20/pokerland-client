/**
 * Bet sizing and its tells (B4): the size buckets and hand strengths the API counts (hands/reports.py), in words,
 * and what a tell says.
 */
import type { BetSizeEnum, SizingStreet, SizingFlag } from './api/generated/data-contracts.ts'
import { formatPct } from './playerStats.ts'

/** The size buckets, smallest first: a bet or raise as a share of what was in the middle before it. */
export const SIZE_LABELS: Record<BetSizeEnum, { short: string; long: string; min?: number; max?: number }> = {
  under_third: { short: '<⅓', long: 'under a third of the pot', max: 0.33 },
  third_half: { short: '⅓–½', long: 'a third to half the pot', min: 0.33, max: 0.5 },
  half_three_quarters: { short: '½–¾', long: 'half to three quarters of the pot', min: 0.5, max: 0.75 },
  three_quarters_pot: { short: '¾–1', long: 'three quarters of the pot to the pot', min: 0.75, max: 0.99 },
  pot_plus: { short: '1+', long: 'the pot or more', min: 0.99 },
}
export const SIZE_KEYS = Object.keys(SIZE_LABELS) as BetSizeEnum[]

/** The hand strengths, weakest first: the ordinal ramp's steps. */
export const STRENGTHS = ['nothing', 'draw', 'weak', 'strong', 'nuts'] as const
export type Strength = (typeof STRENGTHS)[number]

export const STRENGTH_LABELS: Record<Strength, { label: string; hint: string }> = {
  nothing: { label: 'Nothing', hint: 'No pair and no real draw' },
  draw: { label: 'A draw', hint: 'Eight outs or more: a flush draw, an open-ended or double gutshot' },
  weak: { label: 'A weak pair', hint: 'A pair below top pair' },
  strong: { label: 'Strong', hint: 'Top pair or better' },
  nuts: { label: 'The nuts', hint: 'Nothing could beat it then' },
}

/**
 * What a street's tell says, in words: "When you bet the pot or more on the river, you had a strong hand 94% of
 * the time (31 of 33), against 60% of all your river bets." Undefined until a size has the bets to say.
 */
export function tellText(street: SizingStreet): string | undefined {
  const { tell, strong } = street
  if (!tell || tell.strong.pct === null || strong.pct === null) return undefined
  const size = SIZE_LABELS[tell.bucket].long
  return (
    `When you bet ${size} on the ${street.street}, you had top pair or better ${formatPct(tell.strong.pct)} of the ` +
    `time (${tell.strong.did} of ${tell.strong.could}), against ${formatPct(strong.pct)} of all your ${street.street} bets.`
  )
}

export const FLAG_INFO: Record<SizingFlag['flag'], { label: string; why: string; source: string }> = {
  overbet_bluff: {
    label: 'Overbet bluffs',
    why: 'A bet bigger than the pot with nothing. Big bets read as strength only while they are.',
    source: 'MIT 3',
  },
  small_on_wet: {
    label: 'Small bets on draw-heavy boards',
    why: 'Under a third of the pot gives a draw the price to call; bet at least that to deny it.',
    source: 'JHU 2',
  },
  same_chips_barrel: {
    label: 'Barrels of the same chips',
    why: 'The second bet was the first again in chips while the pot had grown: a smaller share each street.',
    source: 'MIT 3; JHU 5',
  },
}
