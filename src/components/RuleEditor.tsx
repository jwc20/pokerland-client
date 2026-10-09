import type { Condition, PlaybookVocabulary } from '../api/generated/data-contracts.ts'
import {
  asChoice,
  asRange,
  chosen,
  defaultValue,
  LIMITS,
  MAX_BRANCHES,
  type Branch,
  type ConditionValue,
  type EditableCard,
  type Test,
} from '../playbooks.ts'
import './RuleEditor.css'

/**
 * One card of a coach's playbook, open for editing: what it says and why, who it is for, the test that says when it
 * applies, and the move it advises, in branches tried in order. The server checks the whole card on save.
 */
function RuleEditor({
  card,
  index,
  count,
  vocabulary,
  onChange,
  onMove,
  onRemove,
}: {
  card: EditableCard
  index: number
  count: number
  vocabulary: PlaybookVocabulary
  onChange: (card: EditableCard) => void
  onMove: (to: number) => void
  onRemove: () => void
}) {
  const set = (patch: Partial<EditableCard>) => onChange({ ...card, ...patch })
  const prefix = `card-${index}`
  const setBranch = (at: number, branch: Branch) =>
    set({ branches: card.branches.map((old, i) => (i === at ? branch : old)) })

  return (
    <article className="rule-editor" aria-labelledby={`${prefix}-title`}>
      <header className="rule-editor-header">
        <h3 id={`${prefix}-title`}>
          <span className="rule-editor-number">{index + 1}</span>
          {card.rule.trim() || 'A new card'}
        </h3>
        <div className="rule-editor-tools">
          <button type="button" className="link-button" disabled={index === 0} onClick={() => onMove(index - 1)}>
            Move up
          </button>
          <button
            type="button"
            className="link-button"
            disabled={index === count - 1}
            onClick={() => onMove(index + 1)}
          >
            Move down
          </button>
          <button type="button" className="link-button rule-editor-remove" disabled={count === 1} onClick={onRemove}>
            Remove
          </button>
        </div>
      </header>

      <div className="fields">
        <label className="fields-wide">
          The rule
          <input
            value={card.rule}
            maxLength={LIMITS.rule}
            required
            onChange={(event) => set({ rule: event.target.value })}
          />
        </label>
        <label className="fields-wide">
          Why
          <textarea
            value={card.why}
            maxLength={LIMITS.why}
            rows={2}
            required
            onChange={(event) => set({ why: event.target.value })}
          />
        </label>
        <label>
          Family
          <select value={card.family} onChange={(event) => set({ family: event.target.value as EditableCard['family'] })}>
            {vocabulary.families.map((family) => (
              <option key={family.key} value={family.key}>
                {family.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Kind
          <select value={card.kind ?? 'action'} onChange={(event) => set({ kind: event.target.value as 'action' })}>
            <option value="action">What to do</option>
            <option value="sizing">How much to bet</option>
          </select>
        </label>
        <label>
          For
          <select
            value={card.adjustment ? (card.read ?? card.scope) : card.scope}
            disabled={card.adjustment}
            onChange={(event) => set({ scope: event.target.value })}
          >
            {vocabulary.scopes.map((scope) => (
              <option key={scope.key} value={scope.key}>
                {scope.label}
              </option>
            ))}
          </select>
        </label>
        <label className="fields-check">
          <input
            type="checkbox"
            checked={!!card.simplification}
            onChange={(event) => set({ simplification: event.target.checked })}
          />
          A simplification, swapped out in time
        </label>
        <label className="fields-check">
          <input
            type="checkbox"
            checked={!!card.adjustment}
            onChange={(event) => {
              const read = card.read ?? (vocabulary.reads[0]?.key as EditableCard['read'])
              set(event.target.checked ? { adjustment: true, read, scope: read ?? card.scope } : { adjustment: false })
            }}
          />
          An adjustment a read unlocks
        </label>
        {card.adjustment && (
          <label>
            The read
            <select
              value={card.read}
              onChange={(event) => {
                const read = event.target.value as EditableCard['read']
                set({ read, scope: read ?? card.scope })
              }}
            >
              {vocabulary.reads.map((read) => (
                <option key={read.key} value={read.key}>
                  {read.label}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="fields-wide">
          Except (in words)
          <input
            value={card.exceptions ?? ''}
            maxLength={LIMITS.exceptions}
            onChange={(event) => set({ exceptions: event.target.value })}
          />
        </label>
        <label className="fields-wide">
          Sources, one per line
          <textarea
            value={card.source.join('\n')}
            rows={2}
            onChange={(event) => set({ source: event.target.value.split('\n').slice(0, 8) })}
          />
        </label>
      </div>

      <fieldset className="rule-editor-section">
        <legend>When it applies</legend>
        <TestEditor
          test={card.when}
          conditions={vocabulary.conditions}
          idPrefix={`${prefix}-when`}
          onChange={(when) => set({ when })}
        />
        <div className="rule-editor-unless">
          <span>Leave out:</span>
          {vocabulary.unless.map((item) => (
            <label key={item.key} className="fields-check">
              <input
                type="checkbox"
                checked={card.unless?.includes(item.key) ?? false}
                onChange={(event) => {
                  const others = (card.unless ?? []).filter((key) => key !== item.key)
                  set({ unless: event.target.checked ? [...others, item.key] : others })
                }}
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="rule-editor-section">
        <legend>What it advises</legend>
        <p className="rule-editor-hint">
          Branches are tried in order: the first whose test fits gives the move. The last needs no test.
        </p>
        <ol className="rule-editor-branches">
          {card.branches.map((branch, at) => (
            <li key={at}>
              <BranchEditor
                branch={branch}
                last={at === card.branches.length - 1}
                only={card.branches.length === 1}
                sizing={card.kind === 'sizing'}
                vocabulary={vocabulary}
                idPrefix={`${prefix}-branch-${at}`}
                onChange={(next) => setBranch(at, next)}
                onRemove={() => set({ branches: card.branches.filter((_, i) => i !== at) })}
              />
            </li>
          ))}
        </ol>
        {card.branches.length === 1 && (
          <button
            type="button"
            className="link-button"
            onClick={() =>
              set({ branches: [{ ...card.branches[0], if: { street: 'flop' } }, { action: 'fold' }] })
            }
          >
            Split into branches
          </button>
        )}
        {card.branches.length > 1 && card.branches.length < MAX_BRANCHES && (
          <button
            type="button"
            className="link-button"
            onClick={() => {
              const last = card.branches.length - 1
              const added: Branch = { if: { street: 'flop' }, action: 'check' }
              set({ branches: [...card.branches.slice(0, last), added, card.branches[last]] })
            }}
          >
            Add a branch before the last
          </button>
        )}
      </fieldset>
    </article>
  )
}

function BranchEditor({
  branch,
  last,
  only,
  sizing,
  vocabulary,
  idPrefix,
  onChange,
  onRemove,
}: {
  branch: Branch
  last: boolean
  only: boolean
  sizing: boolean
  vocabulary: PlaybookVocabulary
  idPrefix: string
  onChange: (branch: Branch) => void
  onRemove: () => void
}) {
  const set = (patch: Partial<Branch>) => onChange({ ...branch, ...patch })
  const actions = sizing ? ['bet'] : vocabulary.actions
  return (
    <div className="rule-editor-branch">
      {!last && (
        <div className="rule-editor-if">
          <span className="rule-editor-if-label">If</span>
          <TestEditor
            test={branch.if ?? {}}
            conditions={vocabulary.conditions}
            idPrefix={`${idPrefix}-if`}
            onChange={(test) => set({ if: test })}
          />
        </div>
      )}
      {last && !only && <span className="rule-editor-if-label">Otherwise</span>}
      <div className="fields">
        <label>
          Move
          <select value={branch.action} onChange={(event) => set({ action: event.target.value })}>
            {actions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </label>
        {branch.action === 'bet' && (
          <label>
            Size, share of the pot
            <input
              type="number"
              min={0.05}
              max={3}
              step={0.05}
              value={branch.size ?? ''}
              onChange={(event) => set({ size: numberOrUndefined(event.target.value) })}
            />
          </label>
        )}
        {branch.action === 'raise' && (
          <label>
            Raise to, in big blinds
            <input
              type="number"
              min={1}
              max={50}
              step={0.5}
              value={branch.to_bb ?? ''}
              onChange={(event) => set({ to_bb: numberOrUndefined(event.target.value) })}
            />
          </label>
        )}
        <label className="fields-check">
          <input
            type="checkbox"
            checked={branch.verdict === 'close'}
            onChange={(event) => set({ verdict: event.target.checked ? 'close' : undefined })}
          />
          A close call
        </label>
      </div>
      <div className="rule-editor-accepts">
        <span>Also keeps it:</span>
        {vocabulary.actions
          .filter((action) => action !== branch.action)
          .map((action) => (
            <label key={action} className="fields-check">
              <input
                type="checkbox"
                checked={branch.accepts?.includes(action) ?? false}
                onChange={(event) => {
                  const others = (branch.accepts ?? []).filter((item) => item !== action && item !== branch.action)
                  const accepts = event.target.checked ? [...others, action] : others
                  set({ accepts: accepts.length ? [branch.action, ...accepts] : undefined })
                }}
              />
              {action}
            </label>
          ))}
      </div>
      {!only && (
        <button type="button" className="link-button rule-editor-remove" onClick={onRemove}>
          Remove this branch
        </button>
      )}
    </div>
  )
}

function numberOrUndefined(text: string): number | undefined {
  return text === '' ? undefined : Number(text)
}

/** A test: a row per condition, each with a value of its kind, and one to add. */
function TestEditor({
  test,
  conditions,
  idPrefix,
  onChange,
}: {
  test: Test
  conditions: Condition[]
  idPrefix: string
  onChange: (test: Test) => void
}) {
  const byKey = new Map(conditions.map((condition) => [condition.key, condition]))
  const unused = conditions.filter((condition) => !(condition.key in test))
  const setValue = (key: string, value: ConditionValue) => onChange({ ...test, [key]: value })
  const remove = (key: string) => {
    const next = { ...test }
    delete next[key]
    onChange(next)
  }

  return (
    <div className="test-editor">
      {Object.entries(test).map(([key, value]) => {
        const condition = byKey.get(key)
        const id = `${idPrefix}-${key}`
        return (
          <div key={key} className="test-editor-row">
            <span className="test-editor-label" id={id}>
              {condition?.label ?? key}
            </span>
            {condition ? (
              <ValueEditor condition={condition} value={value} labelledBy={id} onChange={(v) => setValue(key, v)} />
            ) : (
              <span className="test-editor-unknown">Not a condition the engine knows: remove it.</span>
            )}
            <button type="button" className="link-button" aria-label={`Remove ${condition?.label ?? key}`} onClick={() => remove(key)}>
              ✕
            </button>
          </div>
        )
      })}
      {unused.length > 0 && (
        <label className="test-editor-add">
          <span className="visually-hidden">Add a condition</span>
          <select
            value=""
            onChange={(event) => {
              const condition = byKey.get(event.target.value)
              if (condition) setValue(condition.key, defaultValue(condition))
            }}
          >
            <option value="">Add a condition…</option>
            {unused.map((condition) => (
              <option key={condition.key} value={condition.key}>
                {condition.label}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  )
}

function ValueEditor({
  condition,
  value,
  labelledBy,
  onChange,
}: {
  condition: Condition
  value: ConditionValue
  labelledBy: string
  onChange: (value: ConditionValue) => void
}) {
  if (condition.kind === 'bool') {
    return (
      <span className="segmented" role="radiogroup" aria-labelledby={labelledBy}>
        {[true, false].map((option) => (
          <button
            key={String(option)}
            type="button"
            role="radio"
            aria-checked={value === option}
            aria-selected={value === option}
            onClick={() => onChange(option)}
          >
            {option ? 'Yes' : 'No'}
          </button>
        ))}
      </span>
    )
  }
  if (condition.kind === 'choice') {
    const picked = chosen(value)
    return (
      <span className="test-editor-choices" role="group" aria-labelledby={labelledBy}>
        {(condition.choices ?? []).map((choice) => (
          <label key={choice} className="fields-check">
            <input
              type="checkbox"
              checked={picked.includes(choice)}
              onChange={(event) => {
                const next = event.target.checked
                  ? (condition.choices ?? []).filter((item) => item === choice || picked.includes(item))
                  : picked.filter((item) => item !== choice)
                if (next.length) onChange(asChoice(next))
              }}
            />
            {choice.replace(/_/g, ' ')}
          </label>
        ))}
      </span>
    )
  }
  if (condition.kind === 'line') {
    return (
      <input
        className="test-editor-line"
        aria-labelledby={labelledBy}
        value={typeof value === 'string' ? value : ''}
        pattern="[a-z_]+"
        placeholder="check_call"
        onChange={(event) => onChange(event.target.value)}
      />
    )
  }
  const range = asRange(value)
  const setEnd = (end: 'min' | 'max', text: string) => {
    const next = { ...range }
    if (text === '') delete next[end]
    else next[end] = Number(text)
    onChange(next)
  }
  return (
    <span className="test-editor-range" role="group" aria-labelledby={labelledBy}>
      <label>
        from
        <input
          type="number"
          min={condition.low}
          max={condition.high}
          step="any"
          value={range.min ?? ''}
          onChange={(event) => setEnd('min', event.target.value)}
        />
      </label>
      <label>
        to
        <input
          type="number"
          min={condition.low}
          max={condition.high}
          step="any"
          value={range.max ?? ''}
          onChange={(event) => setEnd('max', event.target.value)}
        />
      </label>
    </span>
  )
}

export default RuleEditor
