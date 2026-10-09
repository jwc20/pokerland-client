import { useState } from 'react'
import { COURSE_PRESETS, shareText } from '../rangePresets.ts'
import { formatRange, parseRange } from '../ranges.ts'
import RangeGrid from './RangeGrid.tsx'
import './RangePicker.css'

// The course's memory aids for ranges as percentiles [MIT 4]: places to start from, not the answer.
const ANCHORS = COURSE_PRESETS.filter((preset) => preset.source === 'MIT 4')

/**
 * The answer to "which hands does this line represent?": hands picked on the grid by a click, a drag or the space
 * bar, or typed in range notation, starting from one of the course's memory aids if you like.
 */
function RangePicker({ disabled, onSubmit }: { disabled: boolean; onSubmit: (notation: string) => void }) {
  const [hands, setHands] = useState<Set<string>>(new Set())
  const [typed, setTyped] = useState<string>()
  const [error, setError] = useState<string>()
  const text = typed ?? formatRange(hands)

  function pick(next: Set<string>) {
    setHands(next)
    setTyped(undefined)
    setError(undefined)
  }

  /** The typed range, once it reads; undefined, with the reason shown, while it doesn't. */
  function read(): Set<string> | undefined {
    if (typed === undefined) return hands
    try {
      const next = parseRange(typed)
      pick(next)
      return next
    } catch (err) {
      setError(err instanceof RangeError ? err.message : 'Not a range.')
      return undefined
    }
  }

  function submit() {
    const chosen = read()
    if (chosen) onSubmit(formatRange(chosen))
  }

  return (
    <div className="range-picker">
      <RangeGrid
        mode="selection"
        selected={hands}
        onSelect={disabled ? undefined : pick}
        label="Pick the hands: click or drag, or move with the arrow keys and press space"
      />
      <div className="range-picker-side">
        <p className="range-picker-share" aria-live="polite">
          {hands.size ? shareText(hands) : 'No hands picked yet'}
        </p>
        <fieldset className="range-picker-anchors" disabled={disabled}>
          <legend>Start from the course’s memory aids</legend>
          {ANCHORS.map((preset) => (
            <button key={preset.key} type="button" onClick={() => pick(new Set(preset.hands))} title={preset.label}>
              {preset.claimed?.replace('about ', '≈ ') ?? preset.label}
            </button>
          ))}
          <button type="button" onClick={() => pick(new Set())}>
            Clear
          </button>
        </fieldset>
        <label className="range-picker-text">
          <span>Or type them</span>
          <input
            type="text"
            value={text}
            disabled={disabled}
            placeholder="TT+, AQs+, AKo"
            spellCheck={false}
            onChange={(event) => {
              setTyped(event.target.value)
              setError(undefined)
            }}
            onBlur={read}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                read()
              }
            }}
            aria-invalid={Boolean(error)}
          />
        </label>
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <button type="button" className="button" disabled={disabled || Boolean(error)} onClick={submit}>
          {typed === undefined ? `Answer with ${hands.size ? shareText(hands) : 'no hands'}` : 'Answer'}
        </button>
      </div>
    </div>
  )
}

export default RangePicker
