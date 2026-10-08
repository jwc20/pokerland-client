import type { Leak, LeakKeyEnum, Preset, PresetKeyEnum } from './api/generated/data-contracts.ts'
import { formatRate } from './winRate.ts'

/** The thresholds of the checks, by name: the user's own or the course values. */
export type Presets = Record<PresetKeyEnum, number>

export function presetValues(rows: Preset[]): Presets {
  return Object.fromEntries(rows.map((row) => [row.key, row.value])) as Presets
}

const number = (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 1 })
const bb = (value: number) => `${number(value)} bb`

/** Each check's name, its rule as the presets set it, and the lectures it comes from. */
export const LEAK_INFO: Record<LeakKeyEnum, { label: string; rule: (p: Presets) => string; source: string }> = {
  open_limp: {
    label: 'Open-limps',
    rule: () => 'Never open-limp: raise or fold when the pot is folded to you.',
    source: 'JHU 3; JHU 4',
  },
  open_size: {
    label: 'Open-raise size',
    rule: (p) =>
      `Open to ${bb(p.open_bb)}, plus ${bb(p.limper_bb)} for each limper; in tournaments, ${bb(p.tournament_open_bb)}. ` +
      `Within ${bb(p.size_slack)} counts.`,
    source: 'JHU 3; MIT 5',
  },
  three_bet_size: {
    label: '3-bet size',
    rule: (p) =>
      `3-bet to ${number(p.three_bet_x)} times the raise, plus one more for each caller. ` +
      `Within ${number(p.size_slack)} of a raise counts.`,
    source: 'JHU 4',
  },
  short_stack_raise: {
    label: 'Short stacks that raised small',
    rule: (p) => `With ${bb(p.short_stack_bb)} or less effective, move in rather than raise small.`,
    source: 'JHU 6',
  },
  premium_limp: {
    label: 'Premiums limped into multiway pots',
    rule: () => 'Raise queens or better and ace-king: don’t limp them into a pot four or more see the flop.',
    source: 'JHU 4',
  },
  short_buy_in: {
    label: 'Short buy-ins',
    rule: (p) => `Buy in for the full ${bb(p.buy_in_bb)} and top up: start every cash-game hand with at least that.`,
    source: 'JHU 3',
  },
  hands_per_orbit: {
    label: 'Hands per orbit',
    rule: (p) => `Play ${number(p.orbit_min)} to ${number(p.orbit_max)} hands an orbit, an orbit being a hand per player.`,
    source: 'JHU 3; JHU 4',
  },
}

/** The checks a short card shows: the rules, not the sizes, which need the explanation My game gives. */
export const SHORT_LIST: LeakKeyEnum[] = ['open_limp', 'premium_limp', 'short_stack_raise', 'short_buy_in', 'hands_per_orbit']

/** What came of a check beyond its count: sizes, and the results of breaking the rule against keeping it. */
export function leakDetails(check: Leak): string[] {
  const lines: string[] = []
  if (check.average !== null && check.below !== null && check.above !== null) {
    const size = check.key === 'open_size' ? bb(check.average) : `${number(check.average)} times the raise`
    lines.push(`Average ${size}: ${check.below} smaller and ${check.above} bigger than the standard.`)
  }
  const share = check.share
  if (share && share.could > 0 && check.net_broken_bb !== null && check.net_kept_bb !== null) {
    const kept = share.could - share.did
    const rate = (net: number, hands: number) => `${formatRate((net / hands) * 100)} bb/100 over ${hands.toLocaleString()}`
    if (share.did === 0) lines.push(`Kept every time.`)
    else if (kept === 0) lines.push(`Broken every time: ${rate(check.net_broken_bb, share.did)}.`)
    else
      lines.push(
        `When broken: ${rate(check.net_broken_bb, share.did)}; when kept: ${rate(check.net_kept_bb, kept)}.`,
      )
  }
  return lines
}

/** A check's count as the card leads with it: "2 of 7", or for hands per orbit, "3.1 an orbit". */
export function leakCount(check: Leak): string {
  if (check.key === 'hands_per_orbit') return check.rate === null ? 'No hands yet' : `${number(check.rate)} an orbit`
  if (!check.share || check.share.could === 0) return 'No chances yet'
  return `${check.share.did.toLocaleString()} of ${check.share.could.toLocaleString()}`
}
