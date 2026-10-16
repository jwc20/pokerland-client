import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useId, useState } from 'react'
import { errorMessage, explanations as explanationsApi } from '../api/client.ts'
import { changes } from '../api/changes.ts'
import type { Explanation } from '../api/generated/data-contracts.ts'
import { queries } from '../api/queries.ts'
import { useAuth } from '../auth/useAuth.ts'
import { updateChoices, useChoices } from '../explain/choices.ts'
import { chosen } from '../explain/format.ts'
import { useKeys } from '../explain/keyStore.ts'
import { explain, ExplainError, type Subject } from '../explain/run.ts'
import { EXPLANATIONS_ENABLED } from '../features.ts'
import AskWhy from './AskWhy.tsx'
import ExplainConsent from './ExplainConsent.tsx'
import ExplanationView from './ExplanationView.tsx'
import KeyDialog from './KeyDialog.tsx'
import ModelPicker from './ModelPicker.tsx'
import './ExplainPanel.css'

/** "Oct 11": enough to tell explanations apart on their cards; the explanation itself gives the time. */
function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

interface Running {
  controller: AbortController
  started: number
  chars: number
}

/**
 * Explanations of one subject (pokerland-llm-reports.md, 3.2): the ones saved, a tab for each model that wrote one,
 * and the button that has the chosen model write another. The brief comes from Pokerland's API, the call goes from
 * this browser to the provider with the player's key, and the API checks and saves the answer. One click, one call:
 * nothing retries by itself.
 */
function ExplainPanel({
  subject,
  heading = 'Explanation',
  action,
  intro,
  onStep,
}: {
  subject: Subject
  /** The card's title: "Explanation" unless it needs to say of what. */
  heading?: string
  /** The button's words: "Explain this hand". */
  action: string
  /** What explaining does, before there's an explanation. */
  intro: string
  /** Opens the replay at a decision's step, for a hand. */
  onStep?: (step: number) => void
}) {
  const { user } = useAuth()
  const owner = user?.pk
  const client = useQueryClient()
  const headingId = useId()
  const catalogQuery = useQuery({ ...queries.explanations.models(), enabled: EXPLANATIONS_ENABLED })
  const listQuery = useQuery({ ...queries.explanations.of(subject.kind, subject.id), enabled: EXPLANATIONS_ENABLED })
  const choices = useChoices()
  const keys = useKeys(owner)
  const [selected, setSelected] = useState<number>()
  const [keyOpen, setKeyOpen] = useState(false)
  const [consenting, setConsenting] = useState(false)
  const [running, setRunning] = useState<Running>()
  const [error, setError] = useState<ExplainError>()
  const [now, setNow] = useState(() => Date.now())

  const started = running?.started
  useEffect(() => {
    if (started === undefined) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [started])

  if (!EXPLANATIONS_ENABLED || owner === undefined) return null

  const catalog = catalogQuery.data
  const list = listQuery.data ?? []
  const current = list.find((explanation) => explanation.id === selected) ?? list[0]
  const choice = catalog && chosen(catalog, choices, keys.has)
  const provider = catalog?.providers.find((found) => found.key === choice?.provider)
  const labelOf = (explanation: Explanation) =>
    catalog?.models.find((model) => model.id === explanation.model)?.label ?? explanation.model
  const companyOf = (explanation: Explanation) =>
    catalog?.providers.find((found) => found.key === explanation.provider)?.company ?? explanation.provider
  const refresh = () => changes.explanation(client, subject.kind, subject.id)

  function start() {
    if (!choice) return
    setError(undefined)
    if (!keys.has(choice.provider)) setKeyOpen(true)
    else if (!choices.consented[choice.provider]) setConsenting(true)
    else void run()
  }

  async function run() {
    if (!choice || owner === undefined) return
    const controller = new AbortController()
    setRunning({ controller, started: Date.now(), chars: 0 })
    setNow(Date.now())
    try {
      const saved = await explain(subject, choice, owner, controller.signal, (chars) =>
        setRunning((before) => before && { ...before, chars }),
      )
      await refresh()
      setSelected(saved.id)
    } catch (failure) {
      setError(failure instanceof ExplainError ? failure : new ExplainError(String(failure)))
    } finally {
      setRunning(undefined)
    }
  }

  function accept() {
    if (!choice) return
    updateChoices({ consented: { ...choices.consented, [choice.provider]: true } })
    setConsenting(false)
    void run()
  }

  function rate(explanation: Explanation, useful: boolean | null) {
    explanationsApi.explanationsPartialUpdate({ id: explanation.id }, { useful }).then(refresh, (failure) =>
      setError(new ExplainError(errorMessage(failure))),
    )
  }

  function remove(explanation: Explanation) {
    if (!window.confirm('Delete this explanation and its questions?')) return
    explanationsApi.explanationsDestroy({ id: explanation.id }).then(refresh, (failure) =>
      setError(new ExplainError(errorMessage(failure))),
    )
  }

  const seconds = running ? Math.max(0, Math.round((now - running.started) / 1000)) : 0
  const failed = catalogQuery.error ?? listQuery.error
  return (
    <section className="card explain-panel" aria-labelledby={headingId}>
      <h2 id={headingId} className="card-header">
        {heading}
      </h2>
      <div className="card-body">
        {list.length > 1 && (
          <>
            <div className="explain-panel-tabs" role="tablist" aria-label="Explanations by model">
              {list.map((explanation) => (
                <button
                  key={explanation.id}
                  type="button"
                  role="tab"
                  aria-selected={explanation.id === current?.id}
                  onClick={() => setSelected(explanation.id)}
                >
                  <strong>{labelOf(explanation)}</strong>
                  <span>
                    {companyOf(explanation)} · {shortDate(explanation.created)}
                  </span>
                </button>
              ))}
            </div>
            <p className="card-hint">Each was written by the model named. The verdicts are Pokerland’s either way.</p>
          </>
        )}

        {current ? (
          <ExplanationView
            key={current.id}
            explanation={current}
            modelLabel={labelOf(current)}
            onStep={onStep}
            onRate={(useful) => rate(current, useful)}
            onDelete={() => remove(current)}
          >
            <AskWhy explanation={current} choice={choice} owner={owner} onAsked={refresh} />
          </ExplanationView>
        ) : (
          <p className="card-hint">{intro}</p>
        )}

        <div className="explain-panel-bar">
          <button type="button" className="button" onClick={start} disabled={Boolean(running) || !choice}>
            {current ? 'Explain again' : action}
          </button>
          {catalog && choice && (
            <ModelPicker catalog={catalog} choice={choice} owner={owner} onKey={() => setKeyOpen(true)} />
          )}
        </div>

        {running && choice && (
          <p className="explain-panel-status" role="status">
            Writing with {choice.label}… {seconds} s
            {running.chars > 0 && ` · ${running.chars.toLocaleString()} characters`}{' '}
            <button type="button" className="link-button" onClick={() => running.controller.abort()}>
              Stop
            </button>
          </p>
        )}
        {consenting && provider && (
          <ExplainConsent provider={provider} onAccept={accept} onDecline={() => setConsenting(false)} />
        )}
        {error && (
          <p className="error-message" role="alert">
            {error.message}{' '}
            {error.key && (
              <button type="button" className="link-button" onClick={() => setKeyOpen(true)}>
                Open the key settings
              </button>
            )}
          </p>
        )}
        {failed ? (
          <p className="error-message" role="alert">
            {errorMessage(failed)}
          </p>
        ) : null}
      </div>
      {provider && catalog && choice && (
        <KeyDialog
          provider={provider}
          model={catalog.models.find((model) => model.id === choice.model)}
          owner={owner}
          open={keyOpen}
          onClose={() => setKeyOpen(false)}
        />
      )}
    </section>
  )
}

export default ExplainPanel
