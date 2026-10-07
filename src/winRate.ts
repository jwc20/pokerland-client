import type { HandTag } from './api/generated/data-contracts.ts'

/**
 * Below this many hands a range says more about the sample than the player:
 * the usual minimum for the normal approximation it rests on. Poker results
 * are lopsided, a few big pots among many small ones, so even this is generous.
 */
export const RANGE_MIN_HANDS = 30

/** How many standard errors a 95% range reaches either side of the rate. */
const Z95 = 1.96

/** A win rate in big blinds per 100 hands, and how sure it is. */
export interface WinRate {
  /** Big blinds won per 100 hands. */
  rate: number
  /** Where the true rate lies, 95% of the time: rate ± 1.96 standard errors. From RANGE_MIN_HANDS hands on. */
  range?: { low: number; high: number }
  /**
   * While the range still takes in zero: about how many more hands at this rate
   * until it doesn't, and you know whether you win. Undefined once known, or at
   * a rate of exactly zero, which never gets there.
   */
  handsToTell?: number
}

/** A rate in bb/100 with its sign, whole once it is in the hundreds: "+560", "−3.2". */
export function formatRate(rate: number) {
  return rate.toLocaleString(undefined, {
    maximumFractionDigits: Math.abs(rate) >= 100 ? 0 : 1,
    signDisplay: 'exceptZero',
  })
}

/** The win rate of hands with these results; undefined for no hands. */
export function winRate({ hands, net_bb, bb_stdev }: Pick<HandTag, 'hands' | 'net_bb' | 'bb_stdev'>): WinRate | undefined {
  if (hands === 0) return undefined
  const perHand = net_bb / hands
  const rate = perHand * 100
  if (hands < RANGE_MIN_HANDS || bb_stdev === null) return { rate }

  // bb/100's standard error is 100 × stdev ÷ √hands.
  const margin = (Z95 * 100 * bb_stdev) / Math.sqrt(hands)
  const range = { low: rate - margin, high: rate + margin }
  if (range.low > 0 || range.high < 0 || perHand === 0) return { rate, range }
  // The range clears zero once 1.96 × stdev ÷ √n is smaller than the rate per hand.
  const needed = Math.ceil(((Z95 * bb_stdev) / perHand) ** 2)
  return { rate, range, handsToTell: Math.max(1, needed - hands) }
}
