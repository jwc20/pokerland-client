import { useState, type FormEvent } from 'react'
import type { Explanation } from '../api/generated/data-contracts.ts'
import { ask, ExplainError, looksLikeKey, type Choice } from '../explain/run.ts'
import './AskWhy.css'

const QUESTIONS = 10 // per explanation, as the API allows

/**
 * Questions about an explanation, and the answers: each sent with the conversation so far to the model chosen now,
 * from this browser with the player's key, and saved under the explanation.
 */
function AskWhy({
  explanation,
  choice,
  owner,
  onAsked,
}: {
  explanation: Explanation
  choice: Choice | undefined
  owner: number
  onAsked: () => Promise<unknown>
}) {
  const [question, setQuestion] = useState('')
  const [running, setRunning] = useState<AbortController>()
  const [error, setError] = useState<string>()
  const turns = explanation.turns

  async function submit(event: FormEvent) {
    event.preventDefault()
    const text = question.trim()
    if (!text || !choice) return
    if (looksLikeKey(text)) {
      setError('That looks like an API key. Take it out before asking.')
      return
    }
    const controller = new AbortController()
    setRunning(controller)
    setError(undefined)
    try {
      await ask(explanation, text, choice, owner, controller.signal, () => {})
      setQuestion('')
      await onAsked()
    } catch (failure) {
      setError(failure instanceof ExplainError ? failure.message : String(failure))
    } finally {
      setRunning(undefined)
    }
  }

  return (
    <section className="ask-why" aria-label="Questions about this explanation">
      <h4>Ask about it</h4>
      {turns.map((turn) => (
        <div className="ask-why-turn" key={turn.id}>
          <p className="ask-why-question">{turn.question}</p>
          <p>{turn.answer}</p>
        </div>
      ))}
      {turns.length < QUESTIONS ? (
        <form onSubmit={submit}>
          <label className="visually-hidden" htmlFor={`ask-why-${explanation.id}`}>
            Your question
          </label>
          <textarea
            id={`ask-why-${explanation.id}`}
            rows={2}
            maxLength={1000}
            value={question}
            placeholder="Ask a question about it"
            onChange={(event) => setQuestion(event.target.value)}
            disabled={Boolean(running)}
          />
          <div className="ask-why-bar">
            <button type="submit" className="button" disabled={!question.trim() || Boolean(running) || !choice}>
              Ask
            </button>
            {running && choice && (
              <span role="status">
                Answering with {choice.label}…{' '}
                <button type="button" className="link-button" onClick={() => running.abort()}>
                  Stop
                </button>
              </span>
            )}
          </div>
        </form>
      ) : (
        <p className="card-hint">That’s {QUESTIONS} questions on this explanation.</p>
      )}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
    </section>
  )
}

export default AskWhy
