import type { Condition, RuleCard } from './api/generated/data-contracts.ts'

/**
 * Editing a coach's playbook (pokerland-practice-mode-additional.md, 7): its cards as the editor holds them, and
 * back to what the API checks (practice.playbook.clean_rules).
 *
 * A card's test is {condition: value}. A value is a choice or a list of them, yes or no, a number or a range
 * {min, max}, or a line of moves such as "check_call". A card's move is one branch, or a list tried in order, each
 * but the last with its own test (`if`).
 */

export type Range = { min?: number; max?: number }
export type ConditionValue = string | string[] | boolean | number | Range
export type Test = Record<string, ConditionValue>

export interface Branch {
  if?: Test
  action: string
  size?: number
  to_bb?: number
  accepts?: string[]
  verdict?: 'clear' | 'close'
}

/** A card as the editor holds it: its move always a list of branches. */
export interface EditableCard extends Omit<RuleCard, 'when' | 'then' | 'number'> {
  when: Test
  branches: Branch[]
}

export const LIMITS = { rule: 160, why: 400, exceptions: 300, source: 40, name: 100, description: 1000 }
export const MAX_CARDS = 40
export const MAX_BRANCHES = 6

export function toEditable(card: RuleCard): EditableCard {
  const { when, then, number: _number, ...rest } = card
  void _number
  const branches: Branch[] = Array.isArray(then) ? then : then ? [then] : [{ action: 'check' }]
  return { ...rest, when: { ...(when ?? {}) }, branches: branches.map((branch) => ({ ...branch })) }
}

/** A card as the API takes it: one branch alone unless it has a test, empty fields left out. */
export function fromEditable(card: EditableCard): Record<string, unknown> {
  const { branches, when, ...rest } = card
  const then = branches.length === 1 && !branches[0].if ? stripBranch(branches[0]) : branches.map(stripBranch)
  const out: Record<string, unknown> = { ...rest, when, then }
  if (!card.exceptions?.trim()) delete out.exceptions
  if (!card.unless?.length) delete out.unless
  if (!card.adjustment) {
    delete out.adjustment
    delete out.read
  }
  if (!card.simplification) delete out.simplification
  if (!card.basis) delete out.basis
  out.source = card.source.map((item) => item.trim()).filter(Boolean)
  return out
}

function stripBranch(branch: Branch): Branch {
  const out: Branch = { action: branch.action }
  if (branch.if && Object.keys(branch.if).length) out.if = branch.if
  if (branch.action === 'bet' && branch.size !== undefined) out.size = branch.size
  if (branch.action === 'raise' && branch.to_bb !== undefined) out.to_bb = branch.to_bb
  if (branch.accepts?.length) out.accepts = Array.from(new Set([branch.action, ...branch.accepts]))
  if (branch.verdict) out.verdict = branch.verdict
  return out
}

/** A value to start a condition with, of its kind. */
export function defaultValue(condition: Condition): ConditionValue {
  if (condition.kind === 'bool') return true
  if (condition.kind === 'choice') return condition.choices?.[0] ?? ''
  if (condition.kind === 'line') return 'check_call'
  return { min: condition.low ?? 0 }
}

/** A new card, made up from nothing: the editor asks for the rest. */
export function blankCard(taken: Set<string>): EditableCard {
  return {
    id: freeId('new_card', taken),
    family: 'showdown_value',
    kind: 'action',
    rule: '',
    why: '',
    scope: 'anyone',
    source: [],
    when: { street: 'flop' },
    branches: [{ action: 'check' }],
  }
}

/** A card's id from its rule's words, not taken by another card: letters, digits and underscores. */
export function freeId(base: string, taken: Set<string>): string {
  const stem =
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 32) || 'card'
  let id = stem.length >= 2 ? stem : `${stem}_card`
  for (let n = 2; taken.has(id); n += 1) id = `${stem}_${n}`
  return id
}

/** A list of choices, whether the value is one choice or several. */
export function chosen(value: ConditionValue): string[] {
  if (Array.isArray(value)) return value
  return typeof value === 'string' && value ? [value] : []
}

/** One choice stays a string, as the house cards write it; several are a list. */
export function asChoice(values: string[]): string | string[] {
  return values.length === 1 ? values[0] : values
}

/** A number condition's range, whether it was written as one number or {min, max}. */
export function asRange(value: ConditionValue): Range {
  if (typeof value === 'number') return { min: value, max: value }
  if (value && typeof value === 'object' && !Array.isArray(value)) return value
  return {}
}

/** A short reading of a condition's value, for a card's summary. */
export function describeValue(condition: Condition | undefined, value: ConditionValue): string {
  if (typeof value === 'boolean') return value ? 'yes' : 'no'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return value.replace(/_/g, ' ')
  if (Array.isArray(value)) return value.map((item) => item.replace(/_/g, ' ')).join(' or ')
  const { min, max } = value
  if (min !== undefined && max !== undefined) return `${min} to ${max}`
  if (min !== undefined) return `at least ${min}`
  if (max !== undefined) return `at most ${max}`
  return condition ? 'any' : ''
}
