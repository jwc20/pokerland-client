import { chipStack } from '../table.ts'

/**
 * A bet as a small stack of chips, biggest at the bottom, each value its own colour. The amount is always
 * written beside it, so the stack is never the only way to read it.
 */
function ChipStack({ amount, bigBlind }: { amount: number; bigBlind: number }) {
  const chips = chipStack(amount, bigBlind)
  const height = 8 + (chips.length - 1) * 3
  return (
    <svg className="chip-stack" viewBox={`0 0 16 ${height}`} width="16" height={height} aria-hidden="true">
      {chips.map((value, i) => (
        <ellipse
          key={i}
          cx="8"
          cy={height - 4 - i * 3}
          rx="7"
          ry="3.5"
          style={{ fill: `var(--chip-${value + 1})` }}
        />
      ))}
    </svg>
  )
}

export default ChipStack
