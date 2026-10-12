import { useId } from 'react'
import type { Catalog } from '../api/generated/data-contracts.ts'
import { updateChoices, useChoices } from '../explain/choices.ts'
import { typicalCost } from '../explain/format.ts'
import { useKeys } from '../explain/keyStore.ts'
import type { Effort, ProviderId } from '../explain/providers/types.ts'
import type { Choice } from '../explain/run.ts'
import './ModelPicker.css'

const EFFORTS: { value: Effort; label: string }[] = [
  { value: 'low', label: 'Low effort' },
  { value: 'medium', label: 'Medium effort' },
  { value: 'high', label: 'High effort' },
]

/**
 * Which model writes, and how hard it thinks: every model offered, grouped by provider with its typical cost, and
 * whether the chosen provider has a key, which opens the key dialog.
 */
function ModelPicker({
  catalog,
  choice,
  owner,
  onKey,
}: {
  catalog: Catalog
  choice: Choice
  owner: number
  onKey: () => void
}) {
  const id = useId()
  const keys = useKeys(owner)
  const choices = useChoices()
  const has = keys.has(choice.provider)

  function pick(value: string) {
    const [provider, model] = value.split('|') as [ProviderId, string]
    updateChoices({ provider, model })
  }

  return (
    <div className="model-picker">
      <label className="visually-hidden" htmlFor={`${id}-model`}>
        Model
      </label>
      <select
        id={`${id}-model`}
        value={`${choice.provider}|${choice.model}`}
        onChange={(event) => pick(event.target.value)}
      >
        {catalog.providers.map((provider) => (
          <optgroup
            key={provider.key}
            label={keys.has(provider.key) ? provider.label : `${provider.label} (add a key)`}
          >
            {catalog.models
              .filter((model) => model.provider === provider.key)
              .map((model) => (
                <option key={model.id} value={`${provider.key}|${model.id}`}>
                  {model.label} · {typicalCost(model)}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
      <label className="visually-hidden" htmlFor={`${id}-effort`}>
        Effort
      </label>
      <select
        id={`${id}-effort`}
        value={choices.effort}
        onChange={(event) => updateChoices({ effort: event.target.value as Effort })}
      >
        {EFFORTS.map((effort) => (
          <option key={effort.value} value={effort.value}>
            {effort.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        className={has ? 'model-picker-key' : 'model-picker-key model-picker-missing'}
        onClick={onKey}
      >
        {has ? `${choice.company} key ✓` : `⚠ Add your ${choice.company} key`}
      </button>
    </div>
  )
}

export default ModelPicker
