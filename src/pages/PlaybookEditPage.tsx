import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { errorMessage, practice } from '../api/client.ts'
import type { HttpResponse } from '../api/generated/http-client.ts'
import type { PlaybookDetail, PlaybookVocabulary } from '../api/generated/data-contracts.ts'
import RuleEditor from '../components/RuleEditor.tsx'
import { blankCard, fromEditable, LIMITS, MAX_CARDS, toEditable, type EditableCard } from '../playbooks.ts'
import './PlaybookEditPage.css'

interface Draft {
  name: string
  description: string
  cards: EditableCard[]
}

/** The problems the server found, card by card, as it words them; or the request's own error. */
function saveErrors(err: unknown): string[] {
  if (err instanceof Response) {
    const body = (err as HttpResponse<unknown, unknown>).error as Record<string, unknown> | undefined
    if (body && Array.isArray(body.rules)) return body.rules.map(String)
  }
  return [errorMessage(err)]
}

/**
 * Editing one of your own playbooks: its name, description and cards. Saving makes its next version; matches played
 * by the earlier one keep reading it, and the classes it is assigned to move to the new one.
 */
function PlaybookEditPage() {
  const id = Number(useParams().id)
  const navigate = useNavigate()
  const [playbook, setPlaybook] = useState<PlaybookDetail>()
  const [vocabulary, setVocabulary] = useState<PlaybookVocabulary>()
  const [draft, setDraft] = useState<Draft>()
  const [loadError, setLoadError] = useState<string>()
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    Promise.all([practice.practicePlaybooksRetrieve({ id }), practice.practicePlaybooksVocabularyRetrieve()]).then(
      ([{ data: found }, { data: words }]) => {
        if (!active) return
        setPlaybook(found)
        setVocabulary(words)
        setDraft({ name: found.name, description: found.description, cards: found.rules.map(toEditable) })
      },
      (err) => {
        if (active) setLoadError(errorMessage(err))
      },
    )
    return () => {
      active = false
    }
  }, [id])

  if (loadError) {
    return (
      <p className="error-message" role="alert">
        {loadError}
      </p>
    )
  }
  if (!playbook || !vocabulary || !draft) return <p>Loading…</p>
  if (!playbook.mine || !playbook.latest) {
    return (
      <section className="playbook-edit">
        <Link className="back-link" to={`/practice/playbook/${playbook.id}`}>
          ← {playbook.name}
        </Link>
        <p>
          {playbook.mine
            ? 'This is an earlier version: edit the latest one.'
            : 'Only its author can edit this playbook. Make a copy of your own to change it.'}
        </p>
      </section>
    )
  }

  const setCard = (at: number, card: EditableCard) =>
    setDraft({ ...draft, cards: draft.cards.map((old, i) => (i === at ? card : old)) })
  const moveCard = (from: number, to: number) => {
    const cards = [...draft.cards]
    const [card] = cards.splice(from, 1)
    cards.splice(to, 0, card)
    setDraft({ ...draft, cards })
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    if (!draft || !playbook) return
    setSaving(true)
    setErrors([])
    try {
      const { data } = await practice.practicePlaybooksUpdate(
        { id: playbook.id },
        { name: draft.name.trim(), description: draft.description.trim(), rules: draft.cards.map(fromEditable) },
      )
      navigate(`/practice/playbook/${data.id}`)
    } catch (err) {
      setErrors(saveErrors(err))
      setSaving(false)
    }
  }

  return (
    <form className="playbook-edit" onSubmit={save}>
      <Link className="back-link" to={`/practice/playbook/${playbook.id}`}>
        ← {playbook.name}
      </Link>
      <header>
        <h1>Edit your playbook</h1>
        <p>
          Version {playbook.version}. Saving makes version {playbook.version + 1}: matches played by this one keep it
          {playbook.classes.length ? `, and ${playbook.classes.join(', ')} move to the new one` : ''}.
        </p>
      </header>

      <div className="fields">
        <label className="fields-wide">
          Name
          <input
            value={draft.name}
            maxLength={LIMITS.name}
            required
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
          />
        </label>
        <label className="fields-wide">
          Description
          <textarea
            value={draft.description}
            maxLength={LIMITS.description}
            rows={3}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
          />
        </label>
      </div>

      <h2>
        Cards <span className="playbook-edit-count">{draft.cards.length}</span>
      </h2>
      {draft.cards.map((card, at) => (
        <RuleEditor
          key={at}
          card={card}
          index={at}
          count={draft.cards.length}
          vocabulary={vocabulary}
          onChange={(next) => setCard(at, next)}
          onMove={(to) => moveCard(at, to)}
          onRemove={() => setDraft({ ...draft, cards: draft.cards.filter((_, i) => i !== at) })}
        />
      ))}
      <button
        type="button"
        className="link-button playbook-edit-add"
        disabled={draft.cards.length >= MAX_CARDS}
        onClick={() =>
          setDraft({ ...draft, cards: [...draft.cards, blankCard(new Set(draft.cards.map((card) => card.id)))] })
        }
      >
        + Add a card
      </button>

      <footer className="playbook-edit-footer">
        {errors.length > 0 && (
          <div className="error-message" role="alert">
            <p>The playbook wasn’t saved:</p>
            <ul>
              {errors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="playbook-edit-buttons">
          <button type="submit" className="button" disabled={saving}>
            {saving ? 'Saving…' : `Save version ${playbook.version + 1}`}
          </button>
          <Link className="link-button" to={`/practice/playbook/${playbook.id}`}>
            Cancel
          </Link>
        </div>
      </footer>
    </form>
  )
}

export default PlaybookEditPage
