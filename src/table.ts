import { formatAmount, formatBb } from './handFormat.ts'

/**
 * The practice table's geometry and money: where each seat sits on the felt, the chips a bet is drawn with, and
 * amounts in chips or in big blinds.
 */

/** A point on the table, in percent of its width and height. */
export interface Point {
  x: number
  y: number
}

/** Amounts as the hand has them (chips, or money), or in big blinds. */
export type Unit = 'chips' | 'bb'

/**
 * Where `count` seats sit on the felt's ellipse: `heroIndex`'s at the bottom centre, the others clockwise from it
 * in seat order, as players sit. `portrait` stands the oval upright, for phones.
 */
export function seatLayout(count: number, heroIndex: number, portrait = false): Point[] {
  // A little inside the felt's rail top and bottom, where the seats' cards make them tallest.
  const [rx, ry] = portrait ? [38, 36] : [44, 36]
  return Array.from({ length: count }, (_, i) => {
    const turn = (i - heroIndex + count) % count
    // From the bottom (π/2, with y pointing down), round to the left, the top and the right.
    const angle = Math.PI / 2 + (turn / count) * 2 * Math.PI
    return { x: 50 + rx * Math.cos(angle), y: 50 + ry * Math.sin(angle) }
  })
}

/**
 * Where a seat's bet sits: part of the way from the seat to the middle of the table, further in for the seats
 * above and below the board, whose cards stand between them and the middle.
 */
export function betPoint(seat: Point): Point {
  const share = 0.42 + 0.16 * Math.min(1, Math.abs(seat.y - 50) / 40)
  return { x: seat.x + (50 - seat.x) * share, y: seat.y + (50 - seat.y) * share }
}

/**
 * Where the dealer button sits: a little in front of its seat, off to one side of the line its bet takes to the
 * middle, so the two never cover each other.
 */
export function dealerPoint(seat: Point): Point {
  const dx = 50 - seat.x
  const dy = 50 - seat.y
  const length = Math.hypot(dx, dy) || 1
  return { x: seat.x + dx * 0.3 - (dy / length) * 9, y: seat.y + dy * 0.3 + (dx / length) * 9 }
}

/**
 * Where the hero's bet and the dealer button sit when the hero has them: beside the hero's cards, which stand
 * where another seat's would go, the bet to the left and the button to the right.
 */
export function heroMarks(seat: Point, portrait = false): { bet: Point; dealer: Point } {
  const [side, rise] = portrait ? [25, 13] : [14, 16]
  return { bet: { x: seat.x - side, y: seat.y - rise }, dealer: { x: seat.x + side, y: seat.y - rise / 3 } }
}

/** Chip values in big blinds, smallest first. Each has its own colour, in the chart palette's fixed order. */
export const CHIP_VALUES = [0.5, 1, 5, 25, 100]

/**
 * The chips a bet is drawn with, biggest at the bottom: indexes into CHIP_VALUES, at most `most` of them. The
 * amount is always written beside the stack, so the chips only give its rough size at a glance.
 */
export function chipStack(amount: number, bigBlind: number, most = 6): number[] {
  let left = amount / bigBlind
  const chips: number[] = []
  for (let i = CHIP_VALUES.length - 1; i >= 0 && chips.length < most; i--) {
    while (left >= CHIP_VALUES[i] - 1e-9 && chips.length < most) {
      chips.push(i)
      left -= CHIP_VALUES[i]
    }
  }
  return chips.length ? chips : [0]
}

/** An amount in the unit chosen: "1,250", "$1.25" or "12.5 bb". */
export function formatUnit(amount: number, currency: string, bigBlind: number, unit: Unit): string {
  return unit === 'bb' && bigBlind ? formatBb(amount / bigBlind, false) : formatAmount(amount, currency)
}
