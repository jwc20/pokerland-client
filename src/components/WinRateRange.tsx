import type { HandTag } from '../api/generated/data-contracts.ts'
import { RANGE_MIN_HANDS, winRate } from '../winRate.ts'
import './WinRateRange.css'

/** A rate in bb/100 with its sign, whole once it is in the hundreds: "+560", "−3.2". */
function formatRate(rate: number) {
  return rate.toLocaleString(undefined, {
    maximumFractionDigits: Math.abs(rate) >= 100 ? 0 : 1,
    signDisplay: 'exceptZero',
  })
}

/** A rough count of hands: "1,200", "3.4 million". */
function aboutHands(count: number) {
  return count >= 1_000_000
    ? count.toLocaleString(undefined, { notation: 'compact', compactDisplay: 'long', maximumSignificantDigits: 2 })
    : count.toLocaleString(undefined, { maximumSignificantDigits: 2 })
}

/**
 * How sure a win rate is: its 95% range drawn against zero, and whether the
 * hands so far tell a winner from a loser, or how many more it would take.
 */
function WinRateRange({ stats }: { stats: Pick<HandTag, 'hands' | 'net_bb' | 'bb_stdev'> }) {
  const result = winRate(stats)
  if (!result) return null
  const { rate, range, handsToTell } = result
  if (!range) {
    return (
      <p className="win-rate-note">
        Too few hands for a 95% range: {stats.hands.toLocaleString()} of {RANGE_MIN_HANDS}.
      </p>
    )
  }

  const side = range.low > 0 ? 'above' : range.high < 0 ? 'below' : 'across'
  const verdict =
    side === 'above'
      ? 'Winning: the whole range is above zero.'
      : side === 'below'
        ? 'Losing: the whole range is below zero.'
        : `Too soon to tell whether you win or lose${
            handsToTell ? `: at this rate, about ${aboutHands(handsToTell)} more hands would show it` : ''
          }.`
  const rangeText = `${formatRate(range.low)} to ${formatRate(range.high)} bb/100`

  // The strip runs from the lower of the range and zero to the higher, with a margin so no mark sits on an edge.
  const from = Math.min(range.low, 0)
  const to = Math.max(range.high, 0)
  const margin = (to - from || 1) * 0.06
  const at = (value: number) => `${((value - from + margin) / (to - from + 2 * margin)) * 100}%`

  return (
    <div className="win-rate">
      <div
        className="win-rate-strip"
        role="img"
        aria-label={`${formatRate(rate)} bb/100; 95% range ${rangeText}, ${side} zero`}
        title={`${formatRate(rate)} bb/100, 95% range ${rangeText}`}
      >
        <span className="win-rate-track" />
        <span
          className={`win-rate-span ${side}`}
          style={{ left: at(range.low), width: `calc(${at(range.high)} - ${at(range.low)})` }}
        />
        <span className="win-rate-zero" style={{ left: at(0) }} />
        <span className="win-rate-dot" style={{ left: at(rate) }} />
        <span className="win-rate-zero-label" style={{ left: at(0) }} aria-hidden="true">
          0
        </span>
      </div>
      <p className="win-rate-text">95% range {rangeText}</p>
      <p className="win-rate-note">{verdict}</p>
    </div>
  )
}

export default WinRateRange
