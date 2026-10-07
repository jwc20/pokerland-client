import type { Stat, StatSet } from './api/generated/data-contracts.ts'

/** Each statistic's name and what it counts, in the order the pages list them. */
export const STAT_INFO: Record<keyof StatSet, { label: string; hint: string; street: 'preflop' | 'postflop' | 'showdown' }> = {
  vpip: { label: 'VPIP', hint: 'Put money in by choice before the flop: called or raised.', street: 'preflop' },
  pfr: { label: 'PFR', hint: 'Raised before the flop.', street: 'preflop' },
  rfi: { label: 'Raise first in', hint: 'Raised when the pot was folded to you.', street: 'preflop' },
  limp: { label: 'Limp', hint: 'Called the big blind with no raise in front.', street: 'preflop' },
  cold_call: { label: 'Cold call', hint: 'Called a raise with no money in by choice yet.', street: 'preflop' },
  three_bet: { label: '3-bet', hint: 'Re-raised a raise.', street: 'preflop' },
  fold_to_three_bet: { label: 'Fold to 3-bet', hint: 'Opened, then folded to a re-raise.', street: 'preflop' },
  four_bet: { label: '4-bet', hint: 'Re-raised a 3-bet.', street: 'preflop' },
  squeeze: { label: 'Squeeze', hint: 'Re-raised a raise that had been called.', street: 'preflop' },
  steal: { label: 'Steal', hint: 'Raised first in from the cutoff, the button or the small blind.', street: 'preflop' },
  fold_to_steal: { label: 'Fold to steal', hint: 'In a blind, folded to a steal.', street: 'preflop' },
  call_vs_steal: { label: 'Call a steal', hint: 'In a blind, called a steal.', street: 'preflop' },
  three_bet_vs_steal: { label: '3-bet a steal', hint: 'In a blind, re-raised a steal.', street: 'preflop' },
  bb_defend: { label: 'Big blind defense', hint: 'In the big blind, called or re-raised a steal.', street: 'preflop' },
  cbet_flop: { label: 'C-bet flop', hint: 'Raised last before the flop, then bet it when checked to.', street: 'postflop' },
  cbet_turn: { label: 'C-bet turn', hint: 'Bet the turn too, after a flop c-bet nobody raised.', street: 'postflop' },
  cbet_river: { label: 'C-bet river', hint: 'Bet the river too, after a turn c-bet nobody raised.', street: 'postflop' },
  fold_to_cbet_flop: { label: 'Fold to flop c-bet', hint: 'Folded to a c-bet on the flop.', street: 'postflop' },
  fold_to_cbet_turn: { label: 'Fold to turn c-bet', hint: 'Folded to a c-bet on the turn.', street: 'postflop' },
  fold_to_cbet_river: { label: 'Fold to river c-bet', hint: 'Folded to a c-bet on the river.', street: 'postflop' },
  donk_flop: { label: 'Donk bet', hint: 'Bet the flop into the last raiser before the flop.', street: 'postflop' },
  check_raise: { label: 'Check-raise', hint: 'Checked, then raised a bet on the same street.', street: 'postflop' },
  aggression: {
    label: 'Aggression',
    hint: 'Bets and raises out of your bets, raises, calls and folds after the flop.',
    street: 'postflop',
  },
  saw_flop: { label: 'Saw the flop', hint: 'Of the hands you were dealt.', street: 'showdown' },
  went_to_showdown: { label: 'Went to showdown', hint: 'Of the flops you saw.', street: 'showdown' },
  won_at_showdown: { label: 'Won at showdown', hint: 'Of the showdowns you went to.', street: 'showdown' },
}

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
