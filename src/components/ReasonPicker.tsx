import type { PracticeActionEnum, ReasonEnum } from '../api/generated/data-contracts.ts'
import { REASONS } from '../practice.ts'
import './ReasonPicker.css'

/**
 * Why: the reason behind a move, picked from a short list. The same action is right for one reason and wrong for
 * another, so the coach grades the reason too [GA 3:57; GA 11:57]. With `action` the list keeps to that move's
 * reasons; without it, it offers them all, to pick before you act.
 */
function ReasonPicker({
  action,
  value,
  onChange,
  required = false,
}: {
  action?: PracticeActionEnum
  value?: ReasonEnum
  onChange: (reason: ReasonEnum | undefined) => void
  required?: boolean
}) {
  const reasons = action ? REASONS.filter((reason) => reason.for.includes(action)) : REASONS
  return (
    <fieldset className="reason-picker">
      <legend>
        Why?{!required && <span className="reason-picker-optional"> (optional)</span>}
      </legend>
      <div className="reason-picker-options">
        {reasons.map((reason) => (
          <label key={reason.reason} title={reason.hint}>
            <input
              type="radio"
              name="reason"
              value={reason.reason}
              checked={value === reason.reason}
              onChange={() => onChange(reason.reason)}
              onClick={() => value === reason.reason && !required && onChange(undefined)}
            />
            {reason.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default ReasonPicker
