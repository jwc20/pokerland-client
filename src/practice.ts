import type {
  GeneratedSkillEnum,
  GradeEnum,
  Legal,
  PracticeActionEnum,
  PracticeSkillEnum,
  ReasonEnum,
  ScenarioGradingEnum,
} from './api/generated/data-contracts.ts'

/** A bet size the action bar offers: its label, and the total it makes the bet. */
export interface Preset {
  label: string
  to: number
}

// Shares of the pot the action bar offers: ⅓, ½, ¾ and the pot [JHU 2; MIT 3].
const SHARES: [string, number][] = [
  ['⅓', 1 / 3],
  ['½', 1 / 2],
  ['¾', 3 / 4],
  ['Pot', 1],
]

/** A bet or raise's total clamped to what the rules allow: no less than the minimum, no more than all-in. */
export function clampTo(legal: Legal, to: number): number {
  if (legal.min_to === null || legal.max_to === null) return to
  return Math.round(Math.min(legal.max_to, Math.max(legal.min_to, to)))
}

/**
 * The sizes the action bar offers, each as the total it makes the bet: a share of the pot, then all-in. A raise's
 * share is of the pot after calling, so "Pot" is the pot-size raise. Sizes the rules don't allow are clamped, and
 * those that clamp to the same amount are offered once. `pot` is everything in the middle now.
 */
export function presets(legal: Legal, pot: number): Preset[] {
  if (!legal.can_raise || legal.max_to === null) return []
  const found: Preset[] = []
  for (const [label, share] of SHARES) {
    const to = clampTo(legal, legal.bet + legal.to_call + share * (pot + legal.to_call))
    if (to < legal.max_to && !found.some((preset) => preset.to === to)) found.push({ label, to })
  }
  found.push({ label: 'All-in', to: legal.max_to })
  return found
}

/** A bet's chips as a share of the pot before it, as the playbook's sizing cards measure it. */
export function betShare(legal: Legal, pot: number, to: number): number {
  return pot ? (to - legal.bet) / pot : 0
}

export const ACTION_LABELS: Record<PracticeActionEnum, string> = {
  fold: 'Fold',
  check: 'Check',
  call: 'Call',
  bet: 'Bet',
  raise: 'Raise',
}

/** The bots' styles, as the style quadrant names them [MIT 1]. */
export const STYLE_LABELS: Record<string, string> = {
  tag: 'Tight-aggressive',
  lag: 'Loose-aggressive',
  station: 'Calling station',
  rock: 'Rock',
}

/** "you folded", "you bet", ... */
export const DID: Record<PracticeActionEnum, string> = {
  fold: 'folded',
  check: 'checked',
  call: 'called',
  bet: 'bet',
  raise: 'raised',
}

export const GRADE_LABELS: Record<GradeEnum, string> = {
  good: 'Good',
  acceptable: 'Acceptable',
  poor: 'Poor',
  ungraded: 'Not graded',
}

/** How each grading kind works its answer out, as the feedback card names it (pokerland-practice-mode.md, 5). */
export const GRADING_INFO: Record<ScenarioGradingEnum, { label: string; hint: string }> = {
  exact: { label: 'Exact', hint: 'Worked out from the numbers on the table, and any range stated with the spot.' },
  reference: { label: 'Reference range', hint: 'A published chart of which hands to play.' },
  rule: { label: 'Rule of thumb', hint: 'A playbook card applied to the spot. It counts at half weight.' },
  reflection: { label: 'Reflection', hint: 'Spots like this have no answer to check against: it isn’t graded.' },
}

export const SKILL_HINTS: Record<PracticeSkillEnum, string> = {
  arithmetic: 'Pot odds, the equity a call needs, MDF, how often a bluff must work, M.',
  preflop: 'Your own decisions before the flop, graded by the playbook where a card applies.',
  postflop: 'Your own decisions after the flop, and all-ins against a shown hand.',
  push_fold: 'Short stacks: shove or fold, call or fold, against a stated range.',
  hand_reading: 'Which hands a line represents.',
}

/** What each generated set drills. */
export const GENERATED_HINTS: Record<GeneratedSkillEnum, string> = {
  arithmetic: 'A bet to face, or one of yours: the equity a call needs, pot odds, MDF, how often a bluff must work.',
  postflop: 'An all-in from a hand that is shown, against your draw: call or fold, with every card to come counted.',
  push_fold: 'Ten big blinds or so: shove or fold, or call a shove, against a range stated with the spot.',
}

/** The reasons the picker offers for a move, by the moves they fit (pokerland-practice-mode-additional.md, 4.3). */
export const REASONS: { reason: ReasonEnum; label: string; hint: string; for: PracticeActionEnum[] }[] = [
  { reason: 'value', label: 'Worse hands call', hint: 'Value', for: ['bet', 'raise'] },
  { reason: 'bluff', label: 'Better hands fold', hint: 'Bluff', for: ['bet', 'raise'] },
  { reason: 'draw', label: 'Draw', hint: 'Outs if called', for: ['bet', 'raise'] },
  { reason: 'protect', label: 'Protect', hint: 'Charge the draws', for: ['bet', 'raise'] },
  { reason: 'bluff_catch', label: 'Beats bluffs only', hint: 'Showdown value', for: ['check', 'call'] },
  { reason: 'price', label: 'The price is good', hint: 'Pot odds', for: ['check', 'call'] },
  { reason: 'trap', label: 'Trap', hint: 'Let them bet', for: ['check', 'call'] },
  { reason: 'give_up', label: 'Giving up', hint: 'Nothing to win with', for: ['check', 'call', 'fold'] },
  { reason: 'cant_say', label: 'Can’t say', hint: '', for: ['fold', 'check', 'call', 'bet', 'raise'] },
]

/** A question's text with its amounts written in the table's unit: "{a0}" becomes "12.3 bb", "2,450" or "$1.20". */
export function fillAmounts(
  text: string,
  amounts: Record<string, number> | undefined,
  format: (chips: number) => string,
): string {
  return text.replace(/\{(a\d+)\}/g, (slot, key: string) => (amounts && key in amounts ? format(amounts[key]) : slot))
}

/** "24%", from a share. */
export function percent(share: number): string {
  return share.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 0 })
}

/** "+1.8 bb", "−0.6 bb": an EV in big blinds, to a tenth. */
export function evText(bb: number): string {
  return `${bb.toLocaleString(undefined, { maximumFractionDigits: 2, signDisplay: 'exceptZero' })} bb`
}
