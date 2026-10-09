import { useEffect, useState, type FormEvent } from 'react'
import { errorMessage, leaks } from '../api/client.ts'
import type { PatchedPresetsUpdateRequest, Preset } from '../api/generated/data-contracts.ts'
import { useScrollToHash } from '../useScrollToHash.ts'
import './CoachPresets.css'

const number = (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 2 })

/**
 * The thresholds of the preflop discipline checks (B3): the course values, or
 * the user's own. The lecturers disagree on some of them, so they are presets
 * the user can change, and put back.
 */
function CoachPresets() {
  const [rows, setRows] = useState<Preset[]>()
  // What the user has typed, by preset, until it is saved.
  const [draft, setDraft] = useState<Partial<Record<Preset['key'], string>>>({})
  const [error, setError] = useState<string>()
  const [status, setStatus] = useState<'saving' | 'saved'>()
  useScrollToHash('coach-presets', rows !== undefined)

  useEffect(() => {
    let active = true
    leaks.leaksPresetsList().then(
      ({ data }) => {
        if (active) setRows(data)
      },
      (err) => {
        if (active) setError(errorMessage(err))
      },
    )
    return () => {
      active = false
    }
  }, [])

  async function save(changes: PatchedPresetsUpdateRequest) {
    setStatus('saving')
    setError(undefined)
    try {
      const { data } = await leaks.leaksPresetsPartialUpdate(changes)
      setRows(data)
      setDraft({})
      setStatus('saved')
    } catch (err) {
      setError(errorMessage(err))
      setStatus(undefined)
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const changes: PatchedPresetsUpdateRequest = {}
    for (const row of rows ?? []) {
      const typed = draft[row.key]
      if (typed !== undefined && typed !== '' && Number(typed) !== row.value) changes[row.key] = Number(typed)
    }
    void save(changes)
  }

  const changed = Object.entries(draft).some(([key, typed]) => {
    const row = rows?.find((candidate) => candidate.key === key)
    return row && typed !== '' && Number(typed) !== row.value
  })
  return (
    <section className="card" id="coach-presets" aria-labelledby="coach-presets-heading">
      <h2 id="coach-presets-heading" className="card-header">
        Coach presets
      </h2>
      <div className="card-body">
        <p className="card-hint">
          The rules of thumb My game's preflop discipline checks hold you to. Each starts at the course value, with
          the lecture it comes from; set your own where you play differently.
        </p>
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        {rows === undefined ? (
          !error && <p>Loading…</p>
        ) : (
          <form className="coach-presets" onSubmit={submit}>
            {rows.map((row) => (
              <div key={row.key} className="coach-preset">
                <label htmlFor={`preset-${row.key}`}>{row.label}</label>
                <input
                  id={`preset-${row.key}`}
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  min={row.min}
                  max={row.max}
                  value={draft[row.key] ?? String(row.value)}
                  onChange={(event) => {
                    setStatus(undefined)
                    setDraft((current) => ({ ...current, [row.key]: event.target.value }))
                  }}
                />
                <span className="coach-preset-course">
                  {row.value === row.default ? (
                    <>Course value{row.source && ` [${row.source}]`}</>
                  ) : (
                    <>
                      Course value {number(row.default)}
                      {row.source && ` [${row.source}]`} ·{' '}
                      <button
                        type="button"
                        className="link-button"
                        disabled={status === 'saving'}
                        onClick={() => void save({ [row.key]: null })}
                      >
                        Put it back
                      </button>
                    </>
                  )}
                </span>
              </div>
            ))}
            <div className="coach-presets-actions">
              <button type="submit" className="button" disabled={!changed || status === 'saving'}>
                {status === 'saving' ? 'Saving…' : 'Save'}
              </button>
              {status === 'saved' && <span role="status">Saved.</span>}
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

export default CoachPresets
