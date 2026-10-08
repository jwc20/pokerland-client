import { useEffect, useEffectEvent, useRef, useState } from 'react'
import type { Legal, PracticeActionEnum } from '../api/generated/data-contracts.ts'
import { clampTo, presets } from '../practice.ts'
import { formatUnit, type Unit } from '../table.ts'
import './ActionBar.css'

const TEXT_FIELDS = 'input:not([type="radio"], [type="checkbox"], [type="range"]), select, textarea'

/**
 * The moves a decision allows: fold, check or call, and a bet or raise sized with the presets, the slider or a
 * typed amount, which the presets keep off the minimum bet. Keys: F fold, X check, C call, R bet or raise, A
 * all-in, ← and → to size, Enter to confirm; a number key starts an amount in the box.
 *
 * Amounts go to `onAct` as chips: for a bet or raise, the total it makes the bet on this street.
 */
function ActionBar({
  legal,
  pot,
  currency,
  bigBlind,
  unit,
  allInOnly = false,
  disabled = false,
  onAct,
}: {
  legal: Legal
  /** Everything in the middle now: the pot and the bets in front of the players. */
  pot: number
  currency: string
  bigBlind: number
  unit: Unit
  /** Push or fold: the only raise is all-in. */
  allInOnly?: boolean
  disabled?: boolean
  onAct: (action: PracticeActionEnum, amount?: number) => void
}) {
  const sizes = presets(legal, pot)
  const [to, setTo] = useState(() => sizes[1]?.to ?? legal.min_to ?? 0)
  const [typed, setTyped] = useState<string>()
  const box = useRef<HTMLInputElement>(null)
  const show = (chips: number) => formatUnit(chips, currency, bigBlind, unit)
  // Chips in one unit of the box: a big blind, a whole currency unit (amounts are cents), or a chip; and the
  // box's precision, to a tenth of a big blind or a cent.
  const scale = unit === 'bb' ? bigBlind : currency ? 100 : 1
  const places = unit === 'bb' ? 10 : 100
  const allIn = legal.max_to !== null && to >= legal.max_to
  const raise = legal.raise_kind
  const callAllIn = legal.to_call > 0 && legal.to_call >= legal.stack

  function size(chips: number) {
    setTo(clampTo(legal, chips))
    setTyped(undefined)
  }

  function confirm(amount = to) {
    if (disabled || !legal.can_raise) return
    onAct(raise, clampTo(legal, amount))
  }

  function fromBox(text: string) {
    setTyped(text)
    const value = Number(text)
    if (text.trim() && Number.isFinite(value)) setTo(clampTo(legal, Math.round(value * scale)))
  }

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    if (disabled || event.altKey || event.ctrlKey || event.metaKey) return
    // Text fields keep their keys; a reason's radio button or the slider doesn't stop the shortcuts.
    if (target.closest(TEXT_FIELDS)) {
      if (event.key === 'Enter' && target === box.current) {
        event.preventDefault()
        confirm()
      }
      return
    }
    if (target.closest('input[type="range"]') && event.key.startsWith('Arrow')) return // the slider moves itself
    if (target.closest('button, a') && (event.key === 'Enter' || event.key === ' ')) return
    const key = event.key.toLowerCase()
    const step = (event.shiftKey ? 5 : 1) * (unit === 'bb' ? bigBlind : Math.max(1, Math.round(pot / 20)))
    if (key === 'f' && !legal.can_check) onAct('fold')
    else if (key === 'x' && legal.can_check) onAct('check')
    else if (key === 'c' && legal.to_call > 0) onAct('call')
    else if (key === 'r' && legal.can_raise && !allInOnly) confirm()
    else if (key === 'a' && legal.can_raise && legal.max_to !== null) confirm(legal.max_to)
    else if (key === 'a' && callAllIn) onAct('call')
    else if (event.key === 'ArrowRight' && legal.can_raise && !allInOnly) size(to + step)
    else if (event.key === 'ArrowLeft' && legal.can_raise && !allInOnly) size(to - step)
    else if (/^[0-9]$/.test(event.key) && legal.can_raise && !allInOnly) {
      box.current?.focus()
      fromBox(event.key)
    } else return
    event.preventDefault()
  })
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="action-bar" role="group" aria-label="Your move">
      <div className="action-bar-moves">
        <button
          type="button"
          className="action-bar-fold"
          disabled={disabled || legal.can_check}
          title={legal.can_check ? 'Checking is free' : 'Fold (F)'}
          onClick={() => onAct('fold')}
        >
          Fold
        </button>
        {legal.can_check ? (
          <button type="button" disabled={disabled} title="Check (X)" onClick={() => onAct('check')}>
            Check
          </button>
        ) : (
          <button type="button" disabled={disabled} title="Call (C)" onClick={() => onAct('call')}>
            Call {show(legal.to_call)}
            {callAllIn && ', all-in'}
          </button>
        )}
        {legal.can_raise && legal.max_to !== null && (
          <button
            type="button"
            className="action-bar-raise"
            disabled={disabled}
            title={allInOnly ? 'All-in (A)' : `${raise === 'bet' ? 'Bet' : 'Raise'} (R)`}
            onClick={() => confirm(allInOnly ? (legal.max_to ?? to) : to)}
          >
            {allInOnly || allIn
              ? `All-in ${show(legal.max_to)}`
              : `${raise === 'bet' ? 'Bet' : 'Raise to'} ${show(to)}`}
          </button>
        )}
      </div>

      {legal.can_raise && legal.min_to !== null && legal.max_to !== null && !allInOnly && (
        <div className="action-bar-size">
          <div className="action-bar-presets" role="group" aria-label="Sizes">
            {sizes.map((preset) => (
              <button
                key={preset.label}
                type="button"
                disabled={disabled}
                aria-pressed={preset.to === to}
                onClick={() => size(preset.to)}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <input
            type="range"
            min={legal.min_to}
            max={legal.max_to}
            step={Math.max(1, Math.round(bigBlind / 2))}
            value={to}
            disabled={disabled}
            aria-label={`${raise === 'bet' ? 'Bet' : 'Raise to'}: ${show(to)}`}
            onChange={(event) => size(Number(event.target.value))}
          />
          <label className="action-bar-amount">
            <span>{unit === 'bb' ? 'bb' : currency || 'chips'}</span>
            <input
              ref={box}
              type="text"
              inputMode="decimal"
              value={typed ?? String(Math.round((to / scale) * places) / places)}
              disabled={disabled}
              aria-label="Amount"
              onChange={(event) => fromBox(event.target.value)}
              onBlur={() => setTyped(undefined)}
            />
          </label>
        </div>
      )}
    </div>
  )
}

export default ActionBar
