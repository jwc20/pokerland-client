import type { ReactNode } from 'react'
import { Link } from 'react-router'
import type { Explanation } from '../api/generated/data-contracts.ts'
import { asText, formatCost, PRIORITY_LABELS, practiceHref, sections, verdictLabel } from '../explain/format.ts'
import { formatDateTime } from '../handFormat.ts'
import CopyButton from './CopyButton.tsx'
import './ExplanationView.css'

/**
 * One explanation, read top down like a review: the headline and who wrote it, a summary, what went well, the
 * suggestions by priority, then each street with the decisions made on it and the engine's verdict on each. No score:
 * the verdicts are Pokerland's, and the words are the model's.
 */
function ExplanationView({
  explanation,
  modelLabel,
  onStep,
  onRate,
  onDelete,
  children,
}: {
  explanation: Explanation
  modelLabel: string
  /** Opens the replay at a decision, for an explanation of a hand. */
  onStep?: (step: number) => void
  onRate: (useful: boolean | null) => void
  onDelete: () => void
  /** What goes under it: the questions about it. */
  children?: ReactNode
}) {
  const { content } = explanation
  const cost = formatCost(explanation.cost)
  return (
    <article className="explanation" aria-labelledby={`explanation-${explanation.id}`}>
      <header className="explanation-header">
        <div>
          <h3 id={`explanation-${explanation.id}`}>{content.headline}</h3>
          <p className="explanation-meta">
            Written by {modelLabel} · {formatDateTime(explanation.created)}
            {cost && ` · ${cost}`}
          </p>
        </div>
        <CopyButton text={asText(explanation, modelLabel)} />
      </header>

      <section className="explanation-section">
        <h4>Summary</h4>
        <p>{content.summary}</p>
      </section>

      {content.strengths.length > 0 && (
        <section className="explanation-section">
          <h4>Strengths</h4>
          <ul>
            {content.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="explanation-section">
        <h4>Suggestions</h4>
        <ul>
          {content.suggestions.map((suggestion, index) => {
            const href = suggestion.practice ? practiceHref(suggestion.practice) : null
            return (
              <li key={index}>
                <strong className={`explanation-priority explanation-priority-${suggestion.priority}`}>
                  {PRIORITY_LABELS[suggestion.priority]}
                </strong>{' '}
                — {suggestion.text}
                {href && (
                  <>
                    {' '}
                    <Link to={href}>Practise it</Link>
                  </>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      {sections(explanation).map((section, index) => (
        <section className="explanation-section explanation-part" key={index}>
          <h4>{section.label}</h4>
          {section.text && <p>{section.text}</p>}
          {section.decisions.map((decision) => (
            <div className="explanation-decision" key={decision.ref}>
              <p className="explanation-decision-move">
                {onStep && decision.step !== null ? (
                  <button type="button" className="link-button" onClick={() => onStep(decision.step!)}>
                    {decision.move ?? decision.ref}
                  </button>
                ) : (
                  <span>{decision.move ?? decision.ref}</span>
                )}
                <span className={`explanation-verdict explanation-verdict-${decision.verdict}`}>
                  {verdictLabel(decision)}
                </span>
              </p>
              <p>{decision.why}</p>
              {decision.instead && (
                <p>
                  <em>Instead:</em> {decision.instead}
                </p>
              )}
            </div>
          ))}
        </section>
      ))}

      {content.luck && (
        <section className="explanation-section">
          <h4>Luck and play</h4>
          <p>{content.luck}</p>
        </section>
      )}

      {content.caveats.length > 0 && <p className="explanation-caveats">{content.caveats.join(' ')}</p>}

      <footer className="explanation-footer">
        <span>Useful?</span>
        <button
          type="button"
          className="link-button"
          aria-pressed={explanation.useful === true}
          onClick={() => onRate(explanation.useful === true ? null : true)}
        >
          Yes
        </button>
        <button
          type="button"
          className="link-button"
          aria-pressed={explanation.useful === false}
          onClick={() => onRate(explanation.useful === false ? null : false)}
        >
          No
        </button>
        <span className="explanation-footer-spacer" />
        <button type="button" className="link-button" onClick={onDelete}>
          Delete
        </button>
      </footer>

      {children}
    </article>
  )
}

export default ExplanationView
