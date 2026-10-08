import type { FamilyEnum, ReadEnum, RuleCard } from './api/generated/data-contracts.ts'

/**
 * The coached match's handover ladder (pokerland-practice-mode-additional.md, 4.3): what the coach does at each
 * stage, and what the table shows. A player moves through the stages one rule family at a time.
 */
export const STAGES: Record<number, { name: string; coach: string; you: string }> = {
  1: { name: 'Watch', coach: 'Names the move and its size, and says why.', you: 'Press it.' },
  2: { name: 'Call it', coach: 'Asks what you are thinking, and waits.', you: 'Choose a move and a reason first.' },
  3: { name: 'Play, then hear it', coach: 'Quiet during the hand; one comment after it.', you: 'Act alone.' },
  4: { name: 'Solo', coach: 'Quiet until the debrief.', you: 'Act alone, on the clock.' },
}

/** What a stage shows at the table. */
export function stageShows(stage: number) {
  return {
    /** The coach's advice comes with the decision. */
    adviceFirst: stage <= 1,
    /** You say what you would do, and why, before you act. */
    intent: stage === 2,
    /** The decision panel's numbers. */
    panel: stage <= 2,
    /** "Ask the coach", counted. */
    askCoach: stage >= 3,
    /** The match's time bank runs. */
    timeBank: stage >= 3,
  }
}

export const FAMILY_ORDER: FamilyEnum[] = [
  'button',
  'out_of_position',
  'sizing',
  'showdown_value',
  'stack_depth',
  'adjustments',
]

const READS: Record<ReadEnum, string> = {
  doesnt_fold: 'An opponent who doesn’t fold',
  unknown: 'An opponent you can’t read yet',
  big_bets_weak: 'An opponent whose big bets have shown up weak',
}

/** Who a card is for: anyone, heads-up play, or the kind of opponent an adjustment is for. */
export function scopeLabel(rule: RuleCard): string {
  if (rule.scope === 'anyone') return 'Anyone'
  if (rule.scope === 'heads_up') return 'Heads-up'
  return READS[rule.scope as ReadEnum] ?? rule.scope
}
