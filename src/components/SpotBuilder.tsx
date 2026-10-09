import { useEffect, useState } from 'react'
import { errorMessage, spots as spotsApi } from '../api/client.ts'
import type { SavedSpot, SpotField } from '../api/generated/data-contracts.ts'
import { browserTimeZone } from '../calendar.ts'
import { LEAK_INFO } from '../leaks.ts'
import { STAT_INFO } from '../playerStats.ts'
import { formatRange, parseRange } from '../ranges.ts'
import {
  FIELD_INFO,
  SECTIONS,
  blankCondition,
  choiceLabel,
  choicesOf,
  describeCondition,
  isCondition,
  rangeError,
  type SpotCondition,
  type SpotSpec,
} from '../spots.ts'
import CopyButton from './CopyButton.tsx'
import RangeGrid from './RangeGrid.tsx'
import './SpotBuilder.css'

type Root = { all: SpotSpec[] } | { any: SpotSpec[] }
type Path = number[]

let fieldsCache: Promise<SpotField[]> | undefined

/** The conditions a spot can hold and their choices, from the API, fetched once. */
function useSpotFields() {
  const [fields, setFields] = useState<SpotField[]>()
  useEffect(() => {
    let active = true
    fieldsCache ??= spotsApi.spotsFieldsList().then(({ data }) => data)
    fieldsCache.then(
      (data) => {
        if (active) setFields(data)
      },
      () => {
        fieldsCache = undefined
      },
    )
    return () => {
      active = false
    }
  }, [])
  return fields
}

function statName(stat: string) {
  return STAT_INFO[stat as keyof typeof STAT_INFO]?.label ?? stat
}

function labelFor(field: string, choice: string) {
  if (field === 'stat') return statName(choice)
  if (field === 'leak') return LEAK_INFO[choice as keyof typeof LEAK_INFO]?.label ?? choice
  return choiceLabel(choice)
}

function rootOf(spec: SpotSpec | undefined): Root {
  if (!spec) return { all: [] }
  if ('all' in spec || 'any' in spec) return spec
  return { all: [spec] }
}

function membersOf(root: Root) {
  return 'all' in root ? root.all : root.any
}

/**
 * The spot builder (B7): conditions as chips, all of them or any of them, each one excludable, with a group of
 * alternatives inside; a live count of the hands that match; and saving it as a named spot, or sharing a saved one
 * as a link [MIT 2: PokerTracker's filters with AND, OR and NOT]. `spec` is the spot being built, and `onChange`
 * gets each change; `spot` is the saved spot it started from, if any.
 */
function SpotBuilder({
  spec,
  onChange,
  spot,
  onSaved,
}: {
  spec: SpotSpec | undefined
  onChange: (spec: SpotSpec) => void
  spot?: SavedSpot
  onSaved: (spot: SavedSpot) => void
}) {
  const fields = useSpotFields()
  const root = rootOf(spec)
  const members = membersOf(root)
  const [editing, setEditing] = useState<Path>()
  const [count, setCount] = useState<{ key: string; hands?: number; error?: string }>()
  const key = JSON.stringify(root)

  // The live count, once the conditions have stopped changing for a moment.
  useEffect(() => {
    let active = true
    const timer = setTimeout(() => {
      spotsApi.spotsCountCreate({ spec: JSON.parse(key), tz: browserTimeZone() }).then(
        ({ data }) => {
          if (active) setCount({ key, hands: data.hands })
        },
        (err) => {
          if (active) setCount({ key, error: errorMessage(err) })
        },
      )
    }, 400)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [key])

  function update(next: SpotSpec[]) {
    onChange('all' in root ? { all: next } : { any: next })
  }

  function setAt(path: Path, item: SpotSpec | undefined) {
    const [first, second] = path
    const next = [...members]
    if (second === undefined) {
      if (item === undefined) next.splice(first, 1)
      else next[first] = item
    } else {
      const group = next[first] as { any: SpotSpec[] }
      const inner = [...group.any]
      if (item === undefined) inner.splice(second, 1)
      else inner[second] = item
      next[first] = { any: inner }
    }
    update(next)
  }

  function add(field: string, into?: number) {
    const condition = blankCondition(field)
    if (into === undefined) {
      update([...members, condition])
      setEditing([members.length])
    } else {
      const group = members[into] as { any: SpotSpec[] }
      setAt([into], { any: [...group.any, condition] })
      setEditing([into, group.any.length])
    }
  }

  const current = count?.key === key ? count : undefined
  return (
    <section className="spot-builder" aria-label="Spot builder">
      <div className="spot-builder-head">
        <div className="segmented" role="tablist" aria-label="Which conditions must hold">
          <button
            type="button"
            role="tab"
            aria-selected={'all' in root}
            onClick={() => onChange({ all: members })}
          >
            All of these
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={'any' in root}
            onClick={() => onChange({ any: members })}
          >
            Any of these
          </button>
        </div>
        <p className="spot-builder-count" aria-live="polite">
          {current?.error ? (
            <span className="error-message">{current.error}</span>
          ) : current?.hands !== undefined ? (
            <>
              <strong>{current.hands.toLocaleString()}</strong> {current.hands === 1 ? 'hand matches' : 'hands match'}
            </>
          ) : (
            'Counting…'
          )}
        </p>
      </div>

      {members.length === 0 ? (
        <p className="card-hint">No conditions yet: every hand matches. Add one below.</p>
      ) : (
        <ul className="spot-builder-items">
          {members.map((member, i) =>
            'any' in member && !isCondition(member) ? (
              <li key={i} className="spot-builder-group">
                <div className="spot-builder-group-head">
                  <span>Any of:</span>
                  <button type="button" className="link-button" onClick={() => setAt([i], undefined)}>
                    Remove the group
                  </button>
                </div>
                <ul className="spot-builder-items">
                  {member.any.map((inner, j) => (
                    <Item
                      key={j}
                      item={inner}
                      fields={fields}
                      editing={editing?.[0] === i && editing[1] === j}
                      onEdit={(on) => setEditing(on ? [i, j] : undefined)}
                      onChange={(next) => setAt([i, j], next)}
                    />
                  ))}
                </ul>
                <AddCondition onAdd={(field) => add(field, i)} label="Add an alternative" />
              </li>
            ) : (
              <Item
                key={i}
                item={member}
                fields={fields}
                editing={editing?.[0] === i && editing.length === 1}
                onEdit={(on) => setEditing(on ? [i] : undefined)}
                onChange={(next) => setAt([i], next)}
              />
            ),
          )}
        </ul>
      )}

      <div className="spot-builder-add">
        <AddCondition onAdd={(field) => add(field)} label="Add a condition" />
        <button type="button" className="link-button" onClick={() => update([...members, { any: [] }])}>
          Add a group of alternatives
        </button>
      </div>

      <SaveBar spec={root} spot={spot} onSaved={onSaved} />
    </section>
  )
}

/** A condition's chip, or a condition being edited; a `not` shows as an exclusion. */
function Item({
  item,
  fields,
  editing,
  onEdit,
  onChange,
}: {
  item: SpotSpec
  fields?: SpotField[]
  editing: boolean
  onEdit: (on: boolean) => void
  onChange: (item: SpotSpec | undefined) => void
}) {
  const excluded = 'not' in item
  const condition = (excluded ? item.not : item) as SpotSpec
  if (!isCondition(condition)) return null
  const wrap = (next: SpotCondition) => onChange(excluded ? { not: next } : next)
  return (
    <li className={excluded ? 'spot-builder-item excluded' : 'spot-builder-item'}>
      <div className="spot-builder-chip">
        <span className="spot-builder-text">
          {excluded && <strong>Not: </strong>}
          {describeCondition(condition, statName)}
        </span>
        <button type="button" className="link-button" onClick={() => onEdit(!editing)} aria-expanded={editing}>
          {editing ? 'Done' : 'Edit'}
        </button>
        <button type="button" className="link-button" onClick={() => onChange(excluded ? condition : { not: condition })}>
          {excluded ? 'Include' : 'Exclude'}
        </button>
        <button
          type="button"
          className="link-button"
          aria-label={`Remove ${describeCondition(condition, statName)}`}
          onClick={() => onChange(undefined)}
        >
          Remove
        </button>
      </div>
      {editing && <Editor condition={condition} fields={fields} onChange={wrap} />}
    </li>
  )
}

function AddCondition({ onAdd, label }: { onAdd: (field: string) => void; label: string }) {
  return (
    <label className="spot-builder-picker">
      <span className="visually-hidden">{label}</span>
      <select
        value=""
        onChange={(event) => {
          if (event.target.value) onAdd(event.target.value)
        }}
      >
        <option value="">{label}…</option>
        {SECTIONS.map((section) => (
          <optgroup key={section} label={section}>
            {Object.entries(FIELD_INFO)
              .filter(([, info]) => info.section === section)
              .map(([field, info]) => (
                <option key={field} value={field}>
                  {info.label}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </label>
  )
}

function numberOrUndefined(text: string) {
  return text === '' || Number.isNaN(Number(text)) ? undefined : Number(text)
}

/** The parameters of one condition, picked by its kind (spots.ts's FIELD_INFO). */
function Editor({
  condition,
  fields,
  onChange,
}: {
  condition: SpotCondition
  fields?: SpotField[]
  onChange: (condition: SpotCondition) => void
}) {
  const { field } = condition
  const info = FIELD_INFO[field]
  const set = (changes: Partial<SpotCondition>) => onChange({ ...condition, ...changes })
  const values = Array.isArray(condition.value) ? condition.value : []

  const choices = (param = 'value') => choicesOf(fields, field, param)
  const checkboxes = (
    <fieldset className="spot-builder-choices">
      <legend className="visually-hidden">{info?.label}</legend>
      {choices().map((choice) => (
        <label key={choice}>
          <input
            type="checkbox"
            checked={values.includes(choice)}
            onChange={(event) =>
              set({ value: event.target.checked ? [...values, choice] : values.filter((value) => value !== choice) })
            }
          />
          {labelFor(field, choice)}
        </label>
      ))}
    </fieldset>
  )
  const street = (
    <label>
      Street
      <select value={condition.street ?? ''} onChange={(event) => set({ street: event.target.value })}>
        {choices('street').map((choice) => (
          <option key={choice} value={choice}>
            {choiceLabel(choice)}
          </option>
        ))}
      </select>
    </label>
  )
  const between = (
    <>
      <label>
        At least{info?.unit ? ` (${info.unit})` : ''}
        <input
          type="number"
          step="any"
          value={condition.min ?? ''}
          onChange={(event) => set({ min: numberOrUndefined(event.target.value) })}
        />
      </label>
      <label>
        At most{info?.unit ? ` (${info.unit})` : ''}
        <input
          type="number"
          step="any"
          value={condition.max ?? ''}
          onChange={(event) => set({ max: numberOrUndefined(event.target.value) })}
        />
      </label>
    </>
  )

  let body
  switch (info?.editor) {
    case 'choices':
      body = checkboxes
      break
    case 'choice':
      body = (
        <label>
          {info.label}
          <select value={String(condition.value ?? '')} onChange={(event) => set({ value: event.target.value })}>
            <option value="">Choose…</option>
            {choices().map((choice) => (
              <option key={choice} value={choice}>
                {labelFor(field, choice)}
              </option>
            ))}
          </select>
        </label>
      )
      break
    case 'between':
      body = between
      break
    case 'boolean':
      body = (
        <label>
          {info.label}
          <select value={String(condition.value ?? true)} onChange={(event) => set({ value: event.target.value === 'true' })}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>
      )
      break
    case 'text': {
      const text = String(condition.value ?? '')
      const error = field === 'range' && text ? rangeError(text) : undefined
      body = (
        <label>
          {info.label}
          <input
            type="text"
            value={text}
            placeholder={info.hint}
            aria-invalid={Boolean(error)}
            onChange={(event) => set({ value: event.target.value })}
          />
          {error && <span className="error-message">{error}</span>}
        </label>
      )
      break
    }
    case 'names':
      body = (
        <label>
          {info.label}, with commas between
          <input
            type="text"
            value={values.join(', ')}
            placeholder={info.hint}
            onChange={(event) =>
              set({ value: event.target.value.split(',').map((name) => name.trim()).filter(Boolean) })
            }
          />
        </label>
      )
      break
    case 'hands':
      body = <HandsEditor hands={values} onChange={(hands) => set({ value: hands })} />
      break
    case 'percent':
      body = (
        <label>
          The top so many percent of starting hands
          <input
            type="number"
            min={1}
            max={100}
            value={Number(condition.value ?? 10)}
            onChange={(event) => set({ value: numberOrUndefined(event.target.value) })}
          />
        </label>
      )
      break
    case 'street_choices':
      body = (
        <>
          {street}
          {checkboxes}
        </>
      )
      break
    case 'street_choice':
      body = (
        <>
          {street}
          <label>
            Move
            <select value={String(condition.value ?? '')} onChange={(event) => set({ value: event.target.value })}>
              {choices().map((choice) => (
                <option key={choice} value={choice}>
                  {choiceLabel(choice)}
                </option>
              ))}
            </select>
          </label>
        </>
      )
      break
    case 'street_between':
      body = (
        <>
          {street}
          {between}
        </>
      )
      break
    case 'line':
      body = (
        <>
          {street}
          {(['role', 'first', 'faced'] as const).map((param) => (
            <label key={param}>
              {{ role: 'Before the flop you', first: 'With nothing to call', faced: 'Facing a bet' }[param]}
              <select
                value={condition[param] ?? ''}
                onChange={(event) => set({ [param]: event.target.value || undefined })}
              >
                <option value="">Any</option>
                {choices(param).map((choice) => (
                  <option key={choice} value={choice}>
                    {param === 'role' ? choice : choiceLabel(choice).toLowerCase()}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <label>
            Position
            <select
              value={condition.ip === undefined ? '' : String(condition.ip)}
              onChange={(event) => set({ ip: event.target.value === '' ? undefined : event.target.value === 'true' })}
            >
              <option value="">Any</option>
              <option value="true">In position</option>
              <option value="false">Out of position</option>
            </select>
          </label>
        </>
      )
      break
    case 'stat':
      body = (
        <>
          <label>
            Statistic
            <select value={String(condition.value ?? '')} onChange={(event) => set({ value: event.target.value })}>
              {choices().map((choice) => (
                <option key={choice} value={choice}>
                  {statName(choice)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Your decision
            <select
              value={condition.did === undefined ? '' : String(condition.did)}
              onChange={(event) => set({ did: event.target.value === '' ? undefined : event.target.value === 'true' })}
            >
              <option value="">Every chance</option>
              <option value="true">Took it</option>
              <option value="false">Let it go</option>
            </select>
          </label>
        </>
      )
      break
    case 'dates':
      body = (
        <>
          <label>
            From
            <input type="date" value={condition.since ?? ''} onChange={(event) => set({ since: event.target.value || undefined })} />
          </label>
          <label>
            To
            <input type="date" value={condition.until ?? ''} onChange={(event) => set({ until: event.target.value || undefined })} />
          </label>
        </>
      )
      break
    default:
      body = null
  }
  return (
    <div className="spot-builder-editor filter-bar">
      {body}
      {info?.hint && info.editor !== 'text' && info.editor !== 'names' && <p className="card-hint">{info.hint}</p>}
    </div>
  )
}

/** Starting hands picked on the range grid, or typed as notation. */
function HandsEditor({ hands, onChange }: { hands: string[]; onChange: (hands: string[]) => void }) {
  const [typed, setTyped] = useState<string>()
  const chosen = new Set(hands)
  const text = typed ?? formatRange(chosen)
  const error = typed ? rangeError(typed) : undefined
  return (
    <div className="spot-builder-hands">
      <label>
        Hands, as notation
        <input
          type="text"
          value={text}
          aria-invalid={Boolean(error)}
          placeholder="TT+, AQs+, KQo"
          onChange={(event) => {
            setTyped(event.target.value)
            if (!rangeError(event.target.value)) onChange([...parseRange(event.target.value)])
          }}
          onBlur={() => setTyped(undefined)}
        />
        {error && <span className="error-message">{error}</span>}
      </label>
      <RangeGrid
        mode="selection"
        selected={chosen}
        onSelect={(next) => {
          setTyped(undefined)
          onChange([...next])
        }}
        label="Pick starting hands: click or drag across cells, or use the arrow keys and the space bar"
      />
    </div>
  )
}

/** Saving the conditions as a named spot, and sharing a saved one. */
function SaveBar({ spec, spot, onSaved }: { spec: Root; spot?: SavedSpot; onSaved: (spot: SavedSpot) => void }) {
  const [name, setName] = useState(spot?.name ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()
  const [shared, setShared] = useState<string | null | undefined>(spot?.share_code)

  async function save(asNew: boolean) {
    setBusy(true)
    setError(undefined)
    try {
      const { data } =
        spot && !asNew
          ? await spotsApi.spotsPartialUpdate({ id: spot.id }, { name: name.trim(), spec })
          : await spotsApi.spotsCreate({ name: name.trim(), spec })
      onSaved(data)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  async function share() {
    if (!spot) return
    try {
      const { data } = await spotsApi.spotsShareCreate({ id: spot.id })
      setShared(data.share_code)
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const link = shared ? `${window.location.origin}/spots/import/${shared}` : undefined
  return (
    <div className="spot-builder-save">
      <div className="filter-bar">
        <label>
          Name
          <input type="text" value={name} maxLength={80} placeholder="Button opens" onChange={(e) => setName(e.target.value)} />
        </label>
        <button type="button" className="button" disabled={busy || !name.trim()} onClick={() => save(false)}>
          {spot ? 'Save changes' : 'Save as a spot'}
        </button>
        {spot && (
          <button type="button" className="link-button" disabled={busy || !name.trim()} onClick={() => save(true)}>
            Save as a new spot
          </button>
        )}
        {spot && !link && (
          <button type="button" className="link-button" onClick={share}>
            Share…
          </button>
        )}
      </div>
      {link && (
        <p className="card-hint spot-builder-link">
          Anyone signed in can import a copy from <code>{link}</code> <CopyButton text={link} />. Conditions that name a
          player or a tournament stay with you.
        </p>
      )}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default SpotBuilder
