import type { Stat } from './api/generated/data-contracts.ts'

/**
 * Below this many chances a share says more about the sample than the player
 * (two of two is "100%"), so the page says how many more it needs instead.
 */
export const MIN_CHANCES = 10

/** A statistic with chances enough to show its share and range. */
export type ShownStat = Stat & { pct: number; ci_low: number; ci_high: number }

export function enough(stat: Stat): stat is ShownStat {
  return stat.could >= MIN_CHANCES && stat.pct !== null && stat.ci_low !== null && stat.ci_high !== null
}

/** "25%", or "4.5%" below ten. */
export function formatPct(pct: number) {
  return `${pct.toLocaleString(undefined, { maximumFractionDigits: pct < 10 ? 1 : 0 })}%`
}

/**
 * Where the style quadrant splits tight from loose (VPIP) and passive from
 * aggressive (aggression frequency after the flop). The lectures name the four
 * types [MIT 1] but give no numbers, so these lines are a judgement call, the
 * kind the feature ideas want made settings one day.
 */
export const LOOSE_VPIP = 25
export const AGGRESSIVE = 40

/** The player type a VPIP and an aggression frequency fall in, as the MIT course names them. */
export function playerType(vpip: number, aggression: number) {
  const loose = vpip >= LOOSE_VPIP
  if (aggression >= AGGRESSIVE) return loose ? 'loose-aggressive (LAG)' : 'tight-aggressive (TAG)'
  return loose ? 'a calling station: loose-passive' : 'a rock: tight-passive'
}
