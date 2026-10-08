import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { errorMessage, practice } from '../api/client.ts'
import type { Book, PlaybookDetail } from '../api/generated/data-contracts.ts'
import PlaybookCard from '../components/PlaybookCard.tsx'
import { FAMILY_ORDER, STAGES } from '../coach.ts'
import './PlaybookPage.css'

/** The house playbook's cards, with the user's stage in each family and how their own hands kept each rule. */
async function loadPlaybook(): Promise<{ playbook: PlaybookDetail; book: Book }> {
  const { data: playbooks } = await practice.practicePlaybooksList()
  const chosen = playbooks.find((playbook) => playbook.house) ?? playbooks[0]
  const [{ data: playbook }, { data: book }] = await Promise.all([
    practice.practicePlaybooksRetrieve({ id: chosen.id }),
    practice.practiceHandsByTheBookRetrieve({ playbook: chosen.id }),
  ])
  return { playbook, book }
}

/**
 * The playbook: a short list of defaults the coach teaches, each saying who it is for, and adjustments a read
 * unlocks. Beside each, how often your own hands kept it: the rule as a leak detector.
 */
function PlaybookPage() {
  const [loaded, setLoaded] = useState<{ playbook: PlaybookDetail; book: Book }>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    let active = true
    loadPlaybook().then(
      (data) => {
        if (active) setLoaded(data)
      },
      (err) => {
        if (active) setError(errorMessage(err))
      },
    )
    return () => {
      active = false
    }
  }, [])

  if (error) {
    return (
      <p className="error-message" role="alert">
        {error}
      </p>
    )
  }
  if (!loaded) return <p>Loading…</p>
  const { playbook, book } = loaded
  const byRule = new Map(book.rules.map((row) => [row.rule, row]))
  const families = [...playbook.families].sort(
    (a, b) => FAMILY_ORDER.indexOf(a.family) - FAMILY_ORDER.indexOf(b.family),
  )
  const chancesOf = (rule: string) => () =>
    practice
      .practiceHandsByTheBookRetrieve({ playbook: playbook.id, rule })
      .then(({ data }) => data.chances ?? [])

  return (
    <section className="playbook">
      <Link className="back-link" to="/practice">
        ← Practice
      </Link>
      <header className="playbook-header">
        <h1>{playbook.name}</h1>
        <p>{playbook.description}</p>
        <p className="playbook-meta">
          Version {playbook.version} · {playbook.game} · Your own hands: the {book.hands.toLocaleString()} most recent
          at least a day old.
        </p>
      </header>

      {families.map((family) => {
        const rules = playbook.rules.filter((rule) => rule.family === family.family)
        const stage = STAGES[family.stage]
        return (
          <section key={family.family} className="playbook-family" aria-labelledby={`family-${family.family}`}>
            <header>
              <h2 id={`family-${family.family}`}>{family.label}</h2>
              <span className="playbook-stage" title={`${stage.coach} ${stage.you}`}>
                Stage {family.stage}: {stage.name}
              </span>
            </header>
            <div className="playbook-cards">
              {rules.map((rule) => (
                <PlaybookCard key={rule.id} rule={rule} book={byRule.get(rule.id)} loadChances={chancesOf(rule.id)} />
              ))}
            </div>
          </section>
        )
      })}
    </section>
  )
}

export default PlaybookPage
