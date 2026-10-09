import { HAND_GROUP_LABELS, HAND_GROUPS, HANDS, groupOf, parseRange, rangeShare, topHands } from './ranges.ts'

/** A reference range: what it holds, what the course calls it, and where it comes from. */
export interface RangePreset {
  key: string
  label: string
  hands: Set<string>
  source: string
  /** What the lecture says of its size, when it says; the page shows the exact share beside it. */
  claimed?: string
}

function preset(key: string, label: string, notation: string, source: string, claimed?: string): RangePreset {
  return { key, label, hands: parseRange(notation), source, claimed }
}

/** Card values for MIT 4's "adding up to 15 or more": two to ten at face value, picture cards 11 to 13, aces 14. */
const VALUE: Record<string, number> = { T: 10, J: 11, Q: 12, K: 13, A: 14 }
const value = (rank: string) => VALUE[rank] ?? Number(rank)

/**
 * The course's ranges (B2): MIT 4's percentile anchors, memory aids the lecture calls approximate, and MIT 5's
 * opening ranges for an M of 12 to 30. Each shows its exact share of hands beside the lecture's figure [risk 9 of
 * the feature ideas: the lecturers round for teaching].
 */
export const COURSE_PRESETS: RangePreset[] = [
  preset('top_1', 'Top 1%: aces, kings, ace-king', 'AA, KK, AK', 'MIT 4', 'about 1%'),
  preset('top_5', 'Top 5%: tens or better, ace-queen or better', 'TT+, AQ+', 'MIT 4', 'about 5%'),
  preset('top_10', 'Top 10%: any pair, ace-ten or better', '22+, AT+', 'MIT 4', 'about 10%'),
  preset('top_20', 'Top 20%: any pair or any ace', '22+, A2+', 'MIT 4', 'about 20%'),
  preset('top_30', 'Top 30%: and two Broadway cards', '22+, A2+, KT+, QT+, JT', 'MIT 4', 'about 30%'),
  {
    key: 'top_50',
    label: 'Top 50%: any pair, or cards adding up to 15 or more',
    hands: new Set(HANDS.filter((hand) => hand[0] === hand[1] || value(hand[0]) + value(hand[1]) >= 15)),
    source: 'MIT 4',
    claimed: 'about 50%',
  },
  preset('mit5_early', 'Opening from early position, M 12 to 30', 'TT+, AQs+, AK', 'MIT 5', 'about 5%'),
  preset('mit5_middle', 'Opening from middle position, M 12 to 30', '88+, AJ+, KQ', 'MIT 5', 'about 15%'),
]

/** The JHU starting-hand groups, each as a range [JHU 3; JHU 4]. */
export const GROUP_PRESETS: RangePreset[] = HAND_GROUPS.map((group) => ({
  key: `group_${group}`,
  label: HAND_GROUP_LABELS[group],
  hands: new Set(HANDS.filter((hand) => groupOf(hand) === group)),
  source: 'JHU 3; JHU 4',
}))

/** The top X% by equity against one random hand, for a slider. */
export function topPreset(percent: number): RangePreset {
  return {
    key: `top_${percent}_ranked`,
    label: `Top ${percent}% by equity against a random hand`,
    hands: topHands(percent),
    source: '',
  }
}

/** "5.4% of hands": a range's exact share. */
export function shareText(hands: Set<string>) {
  return `${(rangeShare(hands) * 100).toLocaleString(undefined, { maximumFractionDigits: 1 })}% of hands`
}
