import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { errorMessage, practice } from '../api/client.ts'
import type { HttpResponse } from '../api/generated/http-client.ts'
import type { PlayTable, PracticeActionEnum } from '../api/generated/data-contracts.ts'
import ActionBar from '../components/ActionBar.tsx'
import { SpotPanel } from '../components/DecisionPanel.tsx'
import PokerTable from '../components/PokerTable.tsx'
import { pendingDecision } from '../decision.ts'
import { formatBb, streetLabel } from '../handFormat.ts'
import { buildReplay } from '../replay.ts'
import { formatUnit } from '../table.ts'
import { useFourColour, useUnit } from '../useUnit.ts'
import './PlayPage.css'

/** A Play it out table: the hand, your moves when it is your turn, and who the bots at the table are. */
function PlayPage() {
  const { id = '' } = useParams()
  const [loaded, setLoaded] = useState<{ id: string; table?: PlayTable; error?: string }>()

  useEffect(() => {
    if (!/^\d+$/.test(id)) return
    let active = true
    practice.practiceTablesRetrieve({ id: Number(id) }).then(
      ({ data }) => {
        if (active) setLoaded({ id, table: data })
      },
      (err) => {
        if (active) setLoaded({ id, error: errorMessage(err) })
      },
    )
    return () => {
      active = false
    }
  }, [id])

  const current = /^\d+$/.test(id) ? (loaded?.id === id ? loaded : undefined) : { id, error: 'Not found.' }
  return (
    <section className="play">
      <Link className="back-link" to="/practice/play/new">
        ← Play it out
      </Link>
      {current?.table ? (
        <Table key={current.table.id} initial={current.table} />
      ) : current?.error ? (
        <p className="error-message" role="alert">
          {current.error}
        </p>
      ) : (
        <p>Loading…</p>
      )}
    </section>
  )
}

function Table({ initial }: { initial: PlayTable }) {
  const [table, setTable] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()
  const [panel, setPanel] = useState(false)
  const { unit, toggle: toggleUnit } = useUnit()
  const { fourColour, toggle: toggleDeck } = useFourColour()
  const { hand, legal, spot } = table
  const money = (chips = 0) => formatUnit(chips, hand.currency, hand.big_blind, unit)
  const steps = useMemo(
    () => buildReplay(hand, (chips = 0) => formatUnit(chips, hand.currency, hand.big_blind, unit)),
    [hand, unit],
  )
  const step = steps[steps.length - 1]
  const pending = useMemo(() => (legal ? pendingDecision(hand, steps) : undefined), [hand, steps, legal])

  function send(request: () => Promise<HttpResponse<PlayTable>>) {
    setBusy(true)
    request().then(
      ({ data }) => {
        setTable(data)
        setBusy(false)
        setError(undefined)
      },
      (err) => {
        setBusy(false)
        setError(errorMessage(err))
      },
    )
  }

  const act = (action: PracticeActionEnum, amount?: number) =>
    send(() => practice.practiceTablesActCreate({ id: table.id }, { action, amount }))
  const next = () => send(() => practice.practiceTablesNextCreate({ id: table.id }))

  // N or Enter deals the next hand once this one is over.
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    if (!table.hand_over || busy || target.closest('input, select, textarea, button, a')) return
    if (event.key === 'n' || event.key === 'Enter') {
      event.preventDefault()
      next()
    }
  })
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const bots = table.seats.filter((seat) => !seat.hero)
  return (
    <div className="play-table">
      <header className="play-header">
        <h1>
          Hand {table.hand_number}
          <span>
            {' '}
            · blinds {money(table.small_blind)}/{money(table.big_blind)}
          </span>
        </h1>
        <p>
          Since you sat down{' '}
          <span className={table.result_bb > 0 ? 'win' : table.result_bb < 0 ? 'loss' : ''}>
            {formatBb(table.result_bb)}
          </span>
        </p>
        <div className="practice-toggles">
          <button type="button" onClick={toggleUnit} aria-pressed={unit === 'bb'} title="Big blinds or chips (B)">
            Units: {unit === 'bb' ? 'bb' : 'chips'}
          </button>
          <button type="button" onClick={toggleDeck} aria-pressed={fourColour}>
            Four-colour deck
          </button>
          <button type="button" onClick={() => setPanel(!panel)} aria-pressed={panel}>
            The numbers
          </button>
        </div>
      </header>

      <p className="play-notice">
        {spot ? spotNotice(table) : 'The others are bots, weak on purpose. Nothing here counts toward your scores.'}
        {spot && (
          <>
            {' '}
            <Link to={`/games/${spot.hand}?step=${spot.step}`}>Open the hand’s replay</Link>
          </>
        )}
      </p>

      <div className={panel && pending ? 'play-main with-panel' : 'play-main'}>
        <div className="play-felt">
          <PokerTable
            step={step}
            hand={hand}
            labels="names"
            unit={unit}
            actor={legal ? hand.hero : undefined}
            fourColour={fourColour}
          />
          <p className="play-log" aria-live="polite">
            {streetLabel(step.street)} – {step.text}
          </p>
          <details className="play-history">
            <summary>Hand log</summary>
            <ol>
              {steps.slice(1).map((past, i) => (
                <li key={i}>
                  {streetLabel(past.street)} – {past.text}
                </li>
              ))}
            </ol>
          </details>
        </div>
        {panel && pending && <SpotPanel decision={pending} hand={hand} />}
      </div>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      {legal && (
        <ActionBar
          key={`${table.hand_number}-${hand.events.length}`}
          legal={legal}
          pot={step.seats.reduce((sum, seat) => sum + seat.bet, step.pot)}
          currency={hand.currency}
          bigBlind={hand.big_blind}
          unit={unit}
          disabled={busy}
          onAct={act}
        />
      )}
      {table.hand_over && (
        <div className="play-over">
          <p>
            The hand is over:{' '}
            <span className={(table.hand_net_bb ?? 0) > 0 ? 'win' : (table.hand_net_bb ?? 0) < 0 ? 'loss' : ''}>
              {formatBb(table.hand_net_bb ?? 0)}
            </span>
            .
          </p>
          <button type="button" className="button" disabled={busy} onClick={next}>
            Next hand →
          </button>
        </div>
      )}

      <section className="card play-seats" aria-labelledby="play-seats">
        <h2 id="play-seats" className="card-header">
          At the table
        </h2>
        <ul className="card-body">
          {bots.map((seat) => (
            <li key={seat.seat}>
              <strong>{seat.name}</strong>: {seat.label}
              {seat.based_on &&
                `, from ${seat.based_on.hands.toLocaleString()} ${seat.based_on.hands === 1 ? 'hand' : 'hands'} with you`}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

/** Where a table played on from a spot stands, in words. */
function spotNotice(table: PlayTable) {
  if (table.hand_number > 1) return 'Dealing on with the players from your hand, each a bot modelled on them.'
  if (table.hand_over) return 'Your hand, played on from the spot’s decision.'
  if (table.spot?.on_script) {
    return 'Your hand, from the spot’s decision: the others replay what they did while your line matches theirs.'
  }
  return 'Your hand, from the spot’s decision: your line left theirs, or a new card came, so bots play the others now.'
}

export default PlayPage
