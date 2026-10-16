import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { ModelProvider, OfferedModel } from '../api/generated/data-contracts.ts'
import { updateChoices, useChoices } from '../explain/choices.ts'
import { forgetKey, keepIn, readKey, saveKey, setKeepIn, useKeys, type KeepIn } from '../explain/keyStore.ts'
import { adapterFor } from '../explain/providers/index.ts'
import { ProviderError, type ProviderId } from '../explain/providers/types.ts'
import './KeyDialog.css'

/** How to limit what a key can do, provider by provider (pokerland-llm-reports.md, 3.1). */
const ADVICE: Record<ProviderId, string> = {
  anthropic: 'Make one just for Pokerland, in its own workspace with a monthly spend limit.',
  openai: 'Make one just for Pokerland, in a project of its own, so it can be revoked alone.',
  google: 'Restrict it to the Gemini API, with this site as the allowed HTTP referrer.',
  deepseek: 'DeepSeek’s balance is prepaid: top up small amounts.',
}

const PROBLEMS: Partial<Record<ProviderError['kind'], string>> = {
  key: 'This key was refused.',
  credit: 'The key works, but the account needs credit.',
  model: 'This key can’t use that model.',
  rate: 'Rate limited: try again in a minute.',
  network: 'Couldn’t reach the provider.',
}

type Status = { kind: 'checking' } | { kind: 'ok'; text: string } | { kind: 'error'; text: string }

/**
 * A provider's key: add, change, check or forget it, and say where it's kept. The key goes only to the provider (for
 * Check) and into this browser's storage (src/explain/keyStore.ts), never to Pokerland.
 */
function KeyDialog({
  provider,
  model,
  owner,
  open,
  onClose,
}: {
  provider: ModelProvider
  model: OfferedModel | undefined
  owner: number
  open: boolean
  onClose: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const keys = useKeys(owner)
  const choices = useChoices()
  const [draft, setDraft] = useState('')
  const [show, setShow] = useState(false)
  const [where, setWhere] = useState<KeepIn>(keepIn)
  const [status, setStatus] = useState<Status>()
  const saved = keys.hint(provider.key)

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (open && !element.open) element.showModal()
    if (!open && element.open) element.close()
  }, [open])

  function close() {
    setDraft('')
    setShow(false)
    setStatus(undefined)
    onClose()
  }

  function save(event: FormEvent) {
    event.preventDefault()
    if (where !== keepIn()) setKeepIn(where, owner)
    if (draft.trim()) saveKey(provider.key, draft, owner)
    close()
  }

  async function check() {
    const key = draft.trim() || readKey(provider.key, owner)
    if (!key || !model) return
    setStatus({ kind: 'checking' })
    try {
      await (await adapterFor(provider.key)).check(key, model.id)
      setStatus({ kind: 'ok', text: `Works with ${model.label}.` })
    } catch (error) {
      const kind = error instanceof ProviderError ? error.kind : 'other'
      setStatus({ kind: 'error', text: PROBLEMS[kind] ?? 'The provider didn’t accept this key.' })
    }
  }

  function forget() {
    forgetKey(provider.key, owner)
    setDraft('')
    setStatus(undefined)
  }

  const headingId = `key-dialog-${provider.key}`
  return (
    <dialog className="key-dialog" ref={dialog} aria-labelledby={headingId} onClose={close}>
      <form onSubmit={save}>
        <h2 id={headingId}>{provider.company} API key</h2>
        <p className="key-dialog-hint">
          Get a key at{' '}
          <a href={provider.key_url} target="_blank" rel="noreferrer">
            {new URL(provider.key_url).host}
          </a>
          . {ADVICE[provider.key]}
          {provider.key === 'openai' && ' A ChatGPT subscription doesn’t include API use.'}
        </p>

        <label className="key-dialog-label" htmlFor={`${headingId}-key`}>
          {saved ? `Replace the saved key (${saved})` : 'API key'}
        </label>
        <div className="key-dialog-field">
          <input
            id={`${headingId}-key`}
            type={show ? 'text' : 'password'}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={provider.key === 'google' ? 'AIza…' : provider.key === 'anthropic' ? 'sk-ant-…' : 'sk-…'}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" className="link-button" onClick={() => setShow(!show)} aria-pressed={show}>
            {show ? 'Hide' : 'Show'}
          </button>
        </div>

        <fieldset className="key-dialog-where">
          <legend>Keep keys</legend>
          <label className="fields-check">
            <input type="radio" name="where" checked={where === 'tab'} onChange={() => setWhere('tab')} />
            In this tab only
          </label>
          <label className="fields-check">
            <input type="radio" name="where" checked={where === 'device'} onChange={() => setWhere('device')} />
            On this device
          </label>
        </fieldset>

        {provider.key === 'openai' && (
          <label className="fields-check">
            <input
              type="checkbox"
              checked={!choices.noStream.openai}
              onChange={(event) => updateChoices({ noStream: { ...choices.noStream, openai: !event.target.checked } })}
            />
            Stream answers (OpenAI may ask for a verified organisation)
          </label>
        )}

        <p className="key-dialog-note">
          Your keys stay in this browser. Pokerland’s servers never receive them: explanations go from this browser
          straight to {provider.company}. Signing out forgets them.
        </p>

        {status && (
          <p className={`key-dialog-status key-dialog-${status.kind}`} role="status">
            {status.kind === 'checking' ? 'Checking…' : status.text}
          </p>
        )}

        <div className="key-dialog-actions">
          <button type="button" className="link-button" onClick={check} disabled={!model || (!draft && !saved)}>
            Check
          </button>
          <button type="button" className="link-button" onClick={forget} disabled={!saved}>
            Forget
          </button>
          <span className="key-dialog-spacer" />
          <button type="button" className="link-button" onClick={close}>
            Cancel
          </button>
          <button type="submit" className="button">
            Save
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default KeyDialog
