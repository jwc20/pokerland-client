import type { ModelProvider } from '../api/generated/data-contracts.ts'
import './ExplainConsent.css'

/**
 * What explaining sends, and to whom, before the first explanation with a provider on this device
 * (pokerland-llm-reports.md, 7).
 */
function ExplainConsent({
  provider,
  onAccept,
  onDecline,
}: {
  provider: ModelProvider
  onAccept: () => void
  onDecline: () => void
}) {
  return (
    <div className="explain-consent" role="group" aria-label={`Sending to ${provider.company}`}>
      <p>
        Explaining sends it from this browser to {provider.company} with your key: positions, cards, actions,
        amounts, Pokerland’s numbers and your notes. Not screen names, tables or hand numbers. Pokerland never sees
        your key.
      </p>
      {provider.notice && <p>{provider.notice}</p>}
      <p>
        <a href={provider.terms_url} target="_blank" rel="noreferrer">
          {provider.company}’s terms
        </a>
      </p>
      <div className="explain-consent-actions">
        <button type="button" className="button" onClick={onAccept}>
          Go ahead
        </button>
        <button type="button" className="link-button" onClick={onDecline}>
          Not now
        </button>
      </div>
    </div>
  )
}

export default ExplainConsent
