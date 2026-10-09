import { useState } from 'react'
import type { SavedSpot } from '../api/generated/data-contracts.ts'
import { readSpec, specParam, type SpotSpec } from '../spots.ts'
import { useSavedSpots } from '../useScope.ts'
import SpotBuilder from './SpotBuilder.tsx'

/** The URL parameters a spot lives in: a saved spot, conditions being built, and the saved spot being edited. */
export interface SpotParams {
  spot?: number
  spec?: string
  spotEdit?: number
}

/**
 * Narrowing a page's hands to a spot (B7): one of the user's saved spots, or conditions built on the spot, which
 * the builder below opens. Building starts from the chosen spot's conditions; saving makes the result the chosen
 * spot. `onChange` sets the URL's parameters.
 */
function SpotFilter({ value, onChange }: { value: SpotParams; onChange: (changes: SpotParams) => void }) {
  const { spots, changed } = useSavedSpots()
  const [open, setOpen] = useState(Boolean(value.spec))
  const editing = spots?.find((spot) => spot.id === value.spotEdit)
  const chosen = spots?.find((spot) => spot.id === value.spot)
  const spec = readSpec(value.spec)

  function build() {
    if (open) {
      setOpen(false)
      return
    }
    setOpen(true)
    if (chosen) onChange({ spot: undefined, spec: JSON.stringify(chosen.spec), spotEdit: chosen.id })
  }

  function saved(spot: SavedSpot) {
    changed(spot.id)
    setOpen(false)
    onChange({ spot: spot.id, spec: undefined, spotEdit: undefined })
  }

  return (
    <>
      <label>
        Spot
        <select
          value={value.spec ? 'built' : String(value.spot ?? '')}
          onChange={(event) => {
            const next = event.target.value
            if (next === 'built') return
            setOpen(false)
            onChange({ spot: Number(next) || undefined, spec: undefined, spotEdit: undefined })
          }}
        >
          <option value="">Any hands</option>
          {value.spec && <option value="built">The conditions below</option>}
          {spots?.map((spot) => (
            <option key={spot.id} value={spot.id}>
              {spot.name}
            </option>
          ))}
          {value.spot && !chosen && <option value={value.spot}>Spot {value.spot}</option>}
        </select>
      </label>
      <button type="button" className="link-button" onClick={build} aria-expanded={open}>
        {open ? 'Hide the spot builder' : chosen ? 'Edit this spot' : 'Build a spot'}
      </button>
      {open && (
        <div className="scope-builder">
          <SpotBuilder
            key={editing?.id ?? 'new'}
            spec={spec}
            spot={editing}
            onChange={(next: SpotSpec) => onChange({ spot: undefined, spec: specParam(next), spotEdit: value.spotEdit })}
            onSaved={saved}
          />
        </div>
      )}
    </>
  )
}

export default SpotFilter
