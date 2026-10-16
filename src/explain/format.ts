import type {
  Catalog,
  Explanation,
  ExplanationDecision,
  ExplanationVerdictEnum,
  ExplanationLevelEnum,
  OfferedModel,
} from '../api/generated/data-contracts.ts'
import type { Choices } from './choices.ts'
import type { ProviderId } from './providers/types.ts'
import type { Choice } from './run.ts'

/** The model to write with: the player's choice if it's still offered, else the default of a provider they have a key
 * for, else Claude's default. */
export function chosen(catalog: Catalog, choices: Choices, has: (provider: ProviderId) => boolean): Choice {
  const picked = catalog.models.find((model) => model.id === choices.model && model.provider === choices.provider)
  const withKey = catalog.providers.find((provider) => has(provider.key))
  const model: OfferedModel =
    picked ??
    catalog.models.find((model) => model.default && model.provider === withKey?.key) ??
    catalog.models.find((model) => model.default) ??
    catalog.models[0]
  const provider = catalog.providers.find((found) => found.key === model.provider) ?? catalog.providers[0]
  return {
    provider: provider.key,
    company: provider.company,
    model: model.id,
    label: model.label,
    effort: choices.effort,
    stream: !choices.noStream[provider.key],
    finished: provider.finished,
  }
}

/** About what something cost: "under 1¢", "about 8¢", "about $1.80". */
export function formatCost(dollars: number | null | undefined) {
  if (dollars === null || dollars === undefined) return ''
  if (dollars < 0.01) return 'under 1¢'
  if (dollars < 1) return `about ${Math.round(dollars * 100)}¢`
  return `about $${dollars.toFixed(2)}`
}

/** A model's typical cost of a hand, for the picker: "about 8¢ a hand", "about 2¢ a hand at peak". */
export function typicalCost(model: OfferedModel) {
  const cost = `${formatCost(model.typical_hand)} a hand`
  return model.off_peak ? `${cost} at peak` : cost
}

export const VERDICT_LABELS: Record<ExplanationVerdictEnum, string> = {
  kept: 'By the book',
  broke: 'Broke a rule',
  close: 'Close',
  your_call: 'Your call',
  none: 'No verdict',
}

/** A decision's verdict with its rule: "Broke rule 8", "Kept rule 2", "Close". */
export function verdictLabel(decision: ExplanationDecision) {
  if (decision.rule && decision.verdict === 'kept') return `Kept rule ${decision.rule}`
  if (decision.rule && decision.verdict === 'broke') return `Broke rule ${decision.rule}`
  return VERDICT_LABELS[decision.verdict]
}

export const PRIORITY_LABELS: Record<ExplanationLevelEnum, string> = { high: 'High', medium: 'Medium', low: 'Low' }

const STREETS: Record<string, string> = {
  preflop: 'Before the flop',
  flop: 'Flop',
  turn: 'Turn',
  river: 'River',
  showdown: 'Showdown',
}

/** A story part's heading: a street's name in words, or the model's own label. */
export function partLabel(label: string) {
  return STREETS[label.toLowerCase()] ?? label
}

export interface Section {
  label: string
  text: string | null
  decisions: ExplanationDecision[]
}

/** The story part by part, each with the decisions made in it: for a hand, a section per street. Decisions in no
 * part (another kind of subject) come last, in a section of their own. */
export function sections(explanation: Explanation): Section[] {
  const { story, decisions } = explanation.content
  const found: Section[] = story.map((part) => ({
    label: partLabel(part.label),
    text: part.text,
    decisions: decisions.filter((decision) => decision.street?.toLowerCase() === part.label.toLowerCase()),
  }))
  const placed = new Set(found.flatMap((section) => section.decisions))
  const rest = decisions.filter((decision) => !placed.has(decision))
  return rest.length ? [...found, { label: REST_LABELS[explanation.kind], text: null, decisions: rest }] : found
}

/** What the decisions in no part of the story are, by kind of subject. */
const REST_LABELS: Record<Explanation['kind'], string> = {
  hand: 'Your decisions',
  attempt: 'Your answer',
  decision: 'Your move',
  debrief: 'Hands to look at',
  test: 'Spots you missed',
  session: 'Your decisions',
}

/** The explanation as plain text, to copy out. */
export function asText(explanation: Explanation, modelLabel: string) {
  const { content } = explanation
  const lines = [content.headline, '', content.summary, '']
  for (const part of content.story) lines.push(`${partLabel(part.label)}: ${part.text}`)
  if (content.decisions.length) lines.push('', 'Your decisions')
  for (const decision of content.decisions) {
    lines.push(`- ${decision.move ?? decision.ref} (${verdictLabel(decision)}): ${decision.why}`)
    if (decision.instead) lines.push(`  Instead: ${decision.instead}`)
  }
  if (content.strengths.length) lines.push('', 'What went well', ...content.strengths.map((text) => `- ${text}`))
  lines.push('', 'Suggestions')
  for (const suggestion of content.suggestions) {
    lines.push(`- ${PRIORITY_LABELS[suggestion.priority]}: ${suggestion.text}`)
  }
  if (content.luck) lines.push('', `Luck and play: ${content.luck}`)
  if (content.caveats.length) lines.push('', "What it can't know", ...content.caveats.map((text) => `- ${text}`))
  lines.push('', `Written by ${modelLabel} for Pokerland.`)
  return lines.join('\n')
}

/** Where a "Practise it" link goes: a playbook rule's card, or a generated set of a skill. */
export function practiceHref(link: string) {
  const [kind, value] = link.split(':')
  if (kind === 'rule') return `/practice/playbook#rule-${value}`
  if (kind === 'skill') return `/practice?skill=${encodeURIComponent(value)}`
  return null
}
