import type {
  HandDetail,
  HandEvent,
  HandNote,
  NotePurposeEnum,
  ReviewStateEnum,
} from './api/generated/data-contracts.ts'

/**
 * Why a bet or raise was made, in the order the picker offers them. "If you
 * can't say why you bet, maybe you shouldn't be betting" [JHU 5].
 */
export const PURPOSES: { purpose: NotePurposeEnum; label: string; hint: string }[] = [
  { purpose: 'value', label: 'Value', hint: 'Worse hands call.' },
  { purpose: 'bluff', label: 'Bluff', hint: 'Better hands fold.' },
  { purpose: 'semi_bluff', label: 'Semi-bluff', hint: 'A bluff with outs if it is called.' },
  { purpose: 'protection', label: 'Protection', hint: 'Make the draws pay to see the next card, or fold.' },
  { purpose: 'pot_control', label: 'Pot control', hint: 'Keep the pot small with a hand that wants a showdown.' },
  { purpose: 'blocking', label: 'Blocking bet', hint: 'A small bet that sets the price before they bet bigger.' },
]

export const PURPOSE_LABELS = Object.fromEntries(PURPOSES.map(({ purpose, label }) => [purpose, label])) as Record<
  NotePurposeEnum,
  string
>

export const REVIEW_LABELS: Record<ReviewStateEnum, string> = { to_review: 'To review', reviewed: 'Reviewed' }

/** The streets a note can be on, the whole hand first, as the notes panel lists them. */
export const NOTE_STREETS = [
  ['', 'The whole hand'],
  ['preflop', 'Preflop'],
  ['flop', 'Flop'],
  ['turn', 'Turn'],
  ['river', 'River'],
] as const

/** One of the hero's bets or raises: what a purpose is kept with. */
export interface HeroBet {
  /** Counted from 0 in the order made, as the API keys purposes. */
  bet: number
  /** The replay step that shows it, one after its event's index; the decision before it is a step earlier. */
  step: number
  street: string
  event: HandEvent
}

/** In a stored hand's replay, what the decision panel needs to show and set the purpose of the hero's bets. */
export interface PurposeControl {
  bets: HeroBet[]
  of: (bet: number) => NotePurposeEnum | undefined
  onChange: (bet: number, purpose: NotePurposeEnum | undefined) => void
}

/** The hero's bets and raises in a hand, in the order made. */
export function heroBets(hand: Pick<HandDetail, 'events' | 'hero'>): HeroBet[] {
  const found: HeroBet[] = []
  hand.events.forEach((event, index) => {
    if (hand.hero && event.player === hand.hero && (event.type === 'bet' || event.type === 'raise')) {
      found.push({ bet: found.length, step: index + 1, street: event.street, event })
    }
  })
  return found
}

/** The streets a hand reached, from its events: notes go on these. */
export function streetsReached(hand: Pick<HandDetail, 'events'>): Set<string> {
  return new Set(hand.events.map((event) => event.street))
}

export function reviewOf(notes: HandNote[]): HandNote | undefined {
  return notes.find((note) => note.kind === 'review')
}

export function tagsOf(notes: HandNote[]): HandNote[] {
  return notes.filter((note) => note.kind === 'tag').sort((a, b) => a.value.localeCompare(b.value))
}

export function noteOn(notes: HandNote[], street: string): HandNote | undefined {
  return notes.find((note) => note.kind === 'note' && note.street === street)
}

export function purposeOf(notes: HandNote[], bet: number): HandNote | undefined {
  return notes.find((note) => note.kind === 'purpose' && note.bet === bet)
}

/** The notes with a saved one in its place, or added. */
export function withNote(notes: HandNote[], saved: HandNote): HandNote[] {
  return [...notes.filter((note) => note.id !== saved.id), saved]
}

/** A tag as the API keeps it: lower case, single spaces. */
export function normalTag(text: string): string {
  return text.split(/\s+/).filter(Boolean).join(' ').toLowerCase()
}
