/**
 * Spots (FND-3, B7): filters kept as a spec of conditions grouped with all, any and not, which the API turns into
 * hands (hands/spots.py). This module types a spec, names each condition and its choices, and says a spec in words
 * for the spot builder's chips. The API lists the conditions and their choices at /api/spots/fields/.
 */
import type { SpotField } from './api/generated/data-contracts.ts'
import { formatRange, parseRange } from './ranges.ts'

export interface SpotCondition {
  field: string
  value?: string | string[] | number | boolean
  street?: string
  min?: number
  max?: number
  since?: string
  until?: string
  did?: boolean
  role?: string
  ip?: boolean
  first?: string
  faced?: string
}
export type SpotSpec = { all: SpotSpec[] } | { any: SpotSpec[] } | { not: SpotSpec } | SpotCondition

/** How a condition's parameters are picked in the builder. */
export type Editor =
  | 'choices'
  | 'choice'
  | 'between'
  | 'boolean'
  | 'text'
  | 'names'
  | 'hands'
  | 'percent'
  | 'street_choices'
  | 'street_choice'
  | 'line'
  | 'street_between'
  | 'stat'
  | 'dates'

export interface FieldInfo {
  label: string
  section: (typeof SECTIONS)[number]
  editor: Editor
  /** What a min or max is in: "BB", "× pot", ... */
  unit?: string
  hint?: string
}

export const SECTIONS = ['The game', 'The hand', 'Hole cards', 'The streets', 'The players', 'Your study'] as const

export const FIELD_INFO: Record<string, FieldInfo> = {
  tag: { label: 'Tag', section: 'The game', editor: 'text', hint: 'A tag key, such as position:BTN' },
  format: { label: 'Format', section: 'The game', editor: 'choices' },
  game: { label: 'Game', section: 'The game', editor: 'names', hint: "Hold'em No Limit, Omaha Pot Limit" },
  stakes: { label: 'Stakes', section: 'The game', editor: 'names', hint: 'As USD:5:10, or :100:200 for chips' },
  date: { label: 'Days', section: 'The game', editor: 'dates' },
  table_size: { label: 'Table size', section: 'The game', editor: 'between', unit: 'seats' },
  buy_in: { label: 'Tournament buy-in', section: 'The game', editor: 'between', unit: 'cents or chips' },
  m: { label: 'M', section: 'The game', editor: 'between', hint: "Harrington's M, in tournaments" },
  players: { label: 'Players dealt in', section: 'The hand', editor: 'between' },
  pot_type: { label: 'Pot type', section: 'The hand', editor: 'choices' },
  situation: { label: 'Situation before the flop', section: 'The hand', editor: 'choices' },
  first_action: { label: 'First move before the flop', section: 'The hand', editor: 'choices' },
  position: { label: 'Position', section: 'The hand', editor: 'choices' },
  saw_flop: { label: 'Saw the flop', section: 'The hand', editor: 'boolean' },
  showdown: { label: 'Went to showdown', section: 'The hand', editor: 'boolean' },
  all_in: { label: 'Went all-in', section: 'The hand', editor: 'boolean' },
  result: { label: 'Result', section: 'The hand', editor: 'choice' },
  pot_bb: { label: 'Final pot', section: 'The hand', editor: 'between', unit: 'BB' },
  effective_bb: { label: 'Effective stack', section: 'The hand', editor: 'between', unit: 'BB' },
  net_bb: { label: 'Your result', section: 'The hand', editor: 'between', unit: 'BB' },
  hands: { label: 'Starting hands', section: 'Hole cards', editor: 'hands', hint: "Hold'em only" },
  range: { label: 'Range', section: 'Hole cards', editor: 'text', hint: 'Notation, such as TT+, AQs+, KQo' },
  top: { label: 'Top of the ranking', section: 'Hole cards', editor: 'percent', hint: 'By equity against a random hand' },
  hand_group: { label: 'Starting-hand group', section: 'Hole cards', editor: 'choices' },
  made: { label: 'Made hand', section: 'The streets', editor: 'street_choices' },
  draw: { label: 'Draw', section: 'The streets', editor: 'street_choices' },
  texture: { label: 'Board texture', section: 'The streets', editor: 'street_choices' },
  line: { label: 'Your line', section: 'The streets', editor: 'line' },
  action: { label: 'Your move', section: 'The streets', editor: 'street_choice' },
  bet_size: { label: 'Your bet size', section: 'The streets', editor: 'street_between', unit: '× pot' },
  faced_size: { label: 'Bet size you faced', section: 'The streets', editor: 'street_between', unit: '× pot' },
  sizing_flag: { label: 'Sizing flag', section: 'The streets', editor: 'choices' },
  opponent: { label: 'Opponent', section: 'The players', editor: 'names', hint: 'Screen names, as they play' },
  opponent_label: { label: "Opponent's label", section: 'The players', editor: 'choices' },
  stat: { label: 'Statistic', section: 'Your study', editor: 'stat' },
  leak: { label: 'Leak', section: 'Your study', editor: 'choice' },
  review: { label: 'Review state', section: 'Your study', editor: 'choice' },
  note_tag: { label: 'Your tag', section: 'Your study', editor: 'text' },
  tournament: { label: 'Tournament', section: 'The game', editor: 'names', hint: 'Its number' },
}

/** Words for the choices that need them; others show as they are. */
export const CHOICE_LABELS: Record<string, string> = {
  cash: 'Cash',
  play_money: 'Play money',
  tournament: 'Tournament',
  walk: 'Walk',
  limped: 'Limped',
  single_raised: 'Single-raised',
  '3bet': '3-bet',
  '4bet+': '4-bet or more',
  unopened: 'Unopened',
  raised: 'Raised',
  fold: 'Fold',
  check: 'Check',
  call: 'Call',
  bet: 'Bet',
  raise: 'Raise',
  won: 'Won',
  lost: 'Lost',
  even: 'Broke even',
  preflop: 'Preflop',
  flop: 'Flop',
  turn: 'Turn',
  river: 'River',
  high_card: 'Nothing',
  overcards: 'Two overcards',
  underpair: 'An underpair',
  pocket_pair: 'A pocket pair under the top card',
  bottom_pair: 'Bottom pair',
  second_pair: 'Second pair',
  top_pair: 'Top pair',
  top_pair_top_kicker: 'Top pair, top kicker',
  overpair: 'An overpair',
  one_pair: 'One pair (Omaha)',
  two_pair: 'Two pair',
  trips: 'Trips',
  set: 'A set',
  three_of_a_kind: 'Three of a kind (Omaha)',
  straight: 'A straight',
  flush: 'A flush',
  full_house: 'A full house',
  four_of_a_kind: 'Four of a kind',
  straight_flush: 'A straight flush',
  nut_flush_draw: 'Nut flush draw',
  flush_draw: 'Flush draw',
  backdoor_flush_draw: 'Backdoor flush draw',
  open_ended: 'Open-ended straight draw',
  double_gutshot: 'Double gutshot',
  gutshot: 'Gutshot',
  dry: 'Dry',
  wet: 'Wet',
  paired: 'Paired',
  monotone: 'Three of a suit',
  overbet_bluff: 'Overbet bluffs',
  small_on_wet: 'Small bets on wet boards',
  same_chips_barrel: 'Barrels of the same chips',
  tag: 'Tight-aggressive',
  lag: 'Loose-aggressive',
  rock: 'Rock',
  station: 'Calling station',
  to_review: 'To review',
  reviewed: 'Reviewed',
  premium: 'Premium',
  big_pair: 'Big pairs',
  medium_pair: 'Medium pairs',
  small_pair: 'Small pairs',
  big_ace: 'Big ace',
  suited_connector: 'Suited connectors',
  trouble: 'Trouble hands',
  weak_ace: 'Weak aces',
  junk: 'Everything else',
}

export const choiceLabel = (choice: string) => CHOICE_LABELS[choice] ?? choice

/** A condition's parameters that take choices, from /api/spots/fields/. */
export function choicesOf(fields: SpotField[] | undefined, field: string, param = 'value'): string[] {
  return fields?.find((row) => row.field === field)?.choices[param] ?? []
}

/** A condition as it starts in the builder: with a street where it needs one. */
export function blankCondition(field: string): SpotCondition {
  const info = FIELD_INFO[field]
  switch (info?.editor) {
    case 'street_choices':
      return { field, street: 'flop', value: [] }
    case 'street_choice':
      return { field, street: 'flop', value: 'bet' }
    case 'line':
      return { field, street: 'flop' }
    case 'street_between':
      return { field, street: 'flop' }
    case 'boolean':
      return { field, value: true }
    case 'stat':
      return { field, value: 'vpip' }
    default:
      return { field }
  }
}

export function isCondition(spec: SpotSpec): spec is SpotCondition {
  return 'field' in spec
}

const amount = (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 2 })

function between(condition: SpotCondition, unit = '') {
  const suffix = unit ? ` ${unit}` : ''
  if (condition.min !== undefined && condition.max !== undefined) {
    return `${amount(condition.min)} to ${amount(condition.max)}${suffix}`
  }
  if (condition.min !== undefined) return `at least ${amount(condition.min)}${suffix}`
  if (condition.max !== undefined) return `at most ${amount(condition.max)}${suffix}`
  return 'any'
}

function list(value: SpotCondition['value']) {
  const items = Array.isArray(value) ? value : value === undefined ? [] : [String(value)]
  return items.map(choiceLabel).join(', ') || 'none chosen'
}

/** A condition in words, for its chip: "Position: BTN, CO", "Flop made hand: a set". */
export function describeCondition(condition: SpotCondition, statLabel = (stat: string) => stat): string {
  const info = FIELD_INFO[condition.field]
  const label = info?.label ?? condition.field
  const street = condition.street ? `${choiceLabel(condition.street)} ` : ''
  switch (info?.editor) {
    case 'between':
      return `${label}: ${between(condition, info.unit)}`
    case 'street_between':
      return `${street}${label.toLowerCase()}: ${between(condition, info.unit)}`
    case 'boolean':
      return condition.value ? label : `Not: ${label.toLowerCase()}`
    case 'street_choices':
      return `${street}${label.toLowerCase()}: ${list(condition.value)}`
    case 'percent':
      return `Top ${amount(Number(condition.value ?? 0))}% of starting hands`
    case 'hands': {
      const hands = Array.isArray(condition.value) ? condition.value : []
      return `${label}: ${hands.length ? formatRange(hands) : 'none chosen'}`
    }
    case 'dates':
      return `${label}: ${condition.since ?? 'the start'} to ${condition.until ?? 'today'}`
    case 'street_choice':
      return `${street}you ${choiceLabel(String(condition.value ?? '')).toLowerCase()}`
    case 'line': {
      const parts = [
        condition.role && `after you ${condition.role} before the flop`,
        condition.ip !== undefined && (condition.ip ? 'in position' : 'out of position'),
        condition.first && `you ${condition.first} first`,
        condition.faced && `you ${condition.faced} to a bet`,
      ].filter(Boolean)
      return `${street}line: ${parts.join(', ') || 'you played it'}`
    }
    case 'stat': {
      const name = statLabel(String(condition.value))
      if (condition.did === undefined) return `A chance at ${name}`
      return condition.did ? `${name}: taken` : `${name}: let go`
    }
    default:
      return `${label}: ${list(condition.value)}`
  }
}

/** Whether a range typed as notation reads; the error's message if not. */
export function rangeError(notation: string): string | undefined {
  try {
    parseRange(notation)
    return undefined
  } catch (error) {
    return error instanceof RangeError ? error.message : 'Not a range.'
  }
}

/** A spec with no conditions at all matches every hand. */
export function isEmpty(spec: SpotSpec | undefined): boolean {
  if (!spec) return true
  if ('all' in spec) return spec.all.every(isEmpty)
  if ('any' in spec) return spec.any.length === 0
  return false
}

/** The spec as the API's `spec` parameter. */
export function specParam(spec: SpotSpec | undefined) {
  return spec && !isEmpty(spec) ? JSON.stringify(spec) : undefined
}

/** A spec from a URL's `spec` parameter; undefined if it isn't one. */
export function readSpec(text: string | null | undefined): SpotSpec | undefined {
  if (!text) return undefined
  try {
    const spec = JSON.parse(text) as SpotSpec
    return spec && typeof spec === 'object' ? spec : undefined
  } catch {
    return undefined
  }
}

/** Filters, or the API's parameters, with more conditions added to their spec: a spec stays one spec. */
export function withConditions<T extends { spec?: string }>(scope: T, conditions: SpotCondition[]): T {
  if (!conditions.length) return scope
  const own = readSpec(scope.spec)
  return { ...scope, spec: JSON.stringify({ all: [...(own ? [own] : []), ...conditions] }) }
}
