import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { errorMessage } from '../api/client.ts'
import type { ModelProvider } from '../api/generated/data-contracts.ts'
import { queries } from '../api/queries.ts'
import { useAuth } from '../auth/useAuth.ts'
import { formatCost } from '../explain/format.ts'
import { useKeys } from '../explain/keyStore.ts'
import { EXPLANATIONS_ENABLED } from '../features.ts'
import { useScrollToHash } from '../useScrollToHash.ts'
import KeyDialog from './KeyDialog.tsx'
import './KeySettings.css'

/**
 * Settings for explanations (pokerland-llm-reports.md, 3.1): each provider's key, kept in this browser, and what this
 * month's explanations cost. The keys never reach Pokerland.
 */
function KeySettings() {
  const { user } = useAuth()
  const owner = user?.pk
  const keys = useKeys(owner)
  const catalogQuery = useQuery({ ...queries.explanations.models(), enabled: EXPLANATIONS_ENABLED })
  const spendQuery = useQuery({ ...queries.explanations.spend(), enabled: EXPLANATIONS_ENABLED })
  const [editing, setEditing] = useState<ModelProvider>()
  useScrollToHash('explanations', Boolean(catalogQuery.data))

  if (!EXPLANATIONS_ENABLED || owner === undefined) return null
  const catalog = catalogQuery.data
  const spend = spendQuery.data
  const failed = catalogQuery.error ?? spendQuery.error

  return (
    <section className="card" id="explanations" aria-labelledby="explanations-heading">
      <h2 id="explanations-heading" className="card-header">
        Explanations
      </h2>
      <div className="card-body">
        <p className="card-hint">
          A model of your choice can explain your hands and practice spots, using your own API key. Your keys stay in
          this browser: Pokerland’s servers never receive them, and explanations go from this browser straight to
          the provider. Signing out forgets them.
        </p>
        {failed ? (
          <p className="error-message" role="alert">
            {errorMessage(failed)}
          </p>
        ) : null}
        {catalog && (
          <ul className="key-settings">
            {catalog.providers.map((provider) => {
              const hint = keys.hint(provider.key)
              return (
                <li key={provider.key}>
                  <div>
                    <strong>{provider.label}</strong>
                    {provider.company !== provider.label && (
                      <span className="key-settings-company"> ({provider.company})</span>
                    )}
                    <p className="key-settings-state">{hint ? `Key saved: ${hint}` : 'No key'}</p>
                  </div>
                  <button type="button" className="button" onClick={() => setEditing(provider)}>
                    {hint ? 'Change' : 'Add key'}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
        <p className="card-hint">
          Keys are kept {keys.where === 'device' ? 'on this device' : 'in this tab only'}; change it in a key’s
          settings.
          {spend &&
            ` This month: ${spend.explanations} explanation${spend.explanations === 1 ? '' : 's'} and ` +
              `${spend.questions} question${spend.questions === 1 ? '' : 's'}${
                spend.cost ? `, ${formatCost(spend.cost)}` : ''
              }.`}
        </p>
      </div>
      {editing && catalog && (
        <KeyDialog
          provider={editing}
          model={catalog.models.find((model) => model.provider === editing.key && model.default)}
          owner={owner}
          open
          onClose={() => setEditing(undefined)}
        />
      )}
    </section>
  )
}

export default KeySettings
