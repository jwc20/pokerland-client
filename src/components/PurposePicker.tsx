import type { NotePurposeEnum } from '../api/generated/data-contracts.ts'
import { PURPOSES } from '../notes.ts'
import './PurposePicker.css'

/**
 * Why the hero made a bet or raise, picked from a short list; picking the
 * chosen one again clears it. `name` keeps each bet's choices a group of their own.
 */
function PurposePicker({
  name,
  value,
  onChange,
  disabled = false,
}: {
  name: string
  value?: NotePurposeEnum
  onChange: (purpose: NotePurposeEnum | undefined) => void
  disabled?: boolean
}) {
  return (
    <fieldset className="purpose-picker" disabled={disabled}>
      <legend>Why?</legend>
      <div className="purpose-picker-options">
        {PURPOSES.map(({ purpose, label, hint }) => (
          <label key={purpose} title={hint}>
            <input
              type="radio"
              name={name}
              value={purpose}
              checked={value === purpose}
              onChange={() => onChange(purpose)}
              onClick={() => value === purpose && onChange(undefined)}
            />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default PurposePicker
