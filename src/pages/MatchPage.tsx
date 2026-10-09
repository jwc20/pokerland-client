import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { changes } from '../api/changes.ts'
import { errorMessage, practice } from '../api/client.ts'
import type { HttpResponse } from '../api/generated/http-client.ts'
import type { MatchState, PracticeActionEnum, ReasonEnum, WhyEnum } from '../api/generated/data-contracts.ts'
import { queries } from '../api/queries.ts'
import ActionBar from '../components/ActionBar.tsx'
import CoachRail from '../components/CoachRail.tsx'
import { SpotPanel } from '../components/DecisionPanel.tsx'
import PokerTable from '../components/PokerTable.tsx'
import ReadCard, { type CardNote } from '../components/ReadCard.tsx'
import ReasonPicker from '../components/ReasonPicker.tsx'
import { stageShows } from '../coach.ts'
import { pendingDecision } from '../decision.ts'
import { formatBb, streetLabel } from '../handFormat.ts'
import { buildReplay } from '../replay.ts'
import { formatUnit } from '../table.ts'
import { useFourColour, useUnit } from '../useUnit.ts'
import './MatchPage.css'

const FREE_SECONDS = 8 // a decision's own time before the match's time bank runs, as online
const LOW_BANK = 15

/** A coached match: the table, the coach's rail and the read card beside it, and your moves below. */
function MatchPage() {
  const { id = '' } = useParams()
  const valid = /^\d+$/.test(id)
  // The match as the server has it on each visit, never from the cache: the table below plays on from there.
  const query = useQuery({ ...queries.practice.match(Number(id)), enabled: valid })
  const current: { state?: MatchState; error?: string } | undefined = !valid
    ? { error: 'Not found.' }
    : query.error
      ? { error: errorMessage(query.error) }
      : query.data && { state: query.data }
  return (
    <section className="match">
      <Link className="back-link" to="/practice/match/new">
        ← Coached matches
      </Link>
      {current?.state ? (
        <Match key={current.state.id} initial={current.state} />
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

function Match({ initial }: { initial: MatchState }) {
  const client = useQueryClient()
  const [state, setState] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()
  const [reason, setReason] = useState<ReasonEnum>()
  const { unit, toggle: toggleUnit } = useUnit()
  const { fourColour, toggle: toggleDeck } = useFourColour()
  const { hand, decision, legal } = state
  const money = (chips = 0) => formatUnit(chips, '', hand.big_blind, unit)
  const steps = useMemo(() => buildReplay(hand, (chips = 0) => formatUnit(chips, '', hand.big_blind, unit)), [hand, unit])
  const step = steps[steps.length - 1]
  const pending = useMemo(() => pendingDecision(hand, steps), [hand, steps])
  const shows = decision ? stageShows(decision.stage) : undefined
  const intentFirst = decision?.stage === 2 && !decision.intent
  // From stage 3 the clock runs: a decision's own seconds, then the match's time bank. Out of time, the move is a
  // check if it's free and a fold if not, as at an online table.
  const clock = useClock(
    decision && shows?.timeBank ? `${state.hand_number}-${decision.step}` : undefined,
    FREE_SECONDS + state.time_bank,
    () => {
      if (legal && !busy) act(legal.can_check ? 'check' : 'fold')
    },
  )
  const bankLeft = state.time_bank - Math.max(0, clock - FREE_SECONDS)

  function send(request: () => Promise<HttpResponse<MatchState>>) {
    setBusy(true)
    request().then(
      ({ data }) => {
        // The end of a match moves the list of recent ones on, and the user's stage in the families it played.
        if (data.finished && !state.finished) void changes.match(client)
        setState(data)
        setBusy(false)
        setError(undefined)
        setReason(undefined)
      },
      (err) => {
        setBusy(false)
        setError(errorMessage(err))
      },
    )
  }

  function act(action: PracticeActionEnum, amount?: number) {
    if (busy) return
    if (intentFirst) {
      if (!reason) {
        setError('Say why first: pick a reason, then the move you would make.')
        return
      }
      send(() => practice.practiceMatchesIntentCreate({ id: state.id }, { action, amount, reason }))
      return
    }
    const time_taken = Math.round(clock * 10) / 10
    send(() => practice.practiceMatchesActCreate({ id: state.id }, { action, amount, reason, time_taken }))
  }

  const next = () => send(() => practice.practiceMatchesNextCreate({ id: state.id }))
  const ask = () => send(() => practice.practiceMatchesAskCreate({ id: state.id }))
  const resign = () => send(() => practice.practiceMatchesResignCreate({ id: state.id }))
  const note = (cardNote: CardNote) => send(() => practice.practiceMatchesReadsCreate({ id: state.id }, cardNote))
  const departure = (why: WhyEnum) => {
    if (state.departure) {
      const { hand: number, step: at } = state.departure
      send(() => practice.practiceMatchesDepartureCreate({ id: state.id }, { hand: number, step: at, why }))
    }
  }

  // N or Enter deals the next hand once this one is over.
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    if (!state.hand_over || state.finished || busy || target.closest('input, select, textarea, button, a')) return
    if (event.key === 'n' || event.key === 'Enter') {
      event.preventDefault()
      next()
    }
  })
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="match-play">
      <header className="match-header">
        <h1>
          Hand {state.hand_number} <span>of {state.hands_planned}</span>
        </h1>
        <p>
          Blinds {money(state.small_blind)}/{money(state.big_blind)}
          {state.next_level_in > 0 && !state.finished && ` · up in ${state.next_level_in}`} · Result{' '}
          <span className={state.result_bb > 0 ? 'win' : state.result_bb < 0 ? 'loss' : ''}>
            {formatBb(state.result_bb)}
          </span>
        </p>
        <div className="practice-toggles">
          <button type="button" onClick={toggleUnit} aria-pressed={unit === 'bb'} title="Big blinds or chips (B)">
            Units: {unit === 'bb' ? 'bb' : 'chips'}
          </button>
          <button type="button" onClick={toggleDeck} aria-pressed={fourColour}>
            Four-colour deck
          </button>
          {!state.finished && (
            <button type="button" onClick={resign} disabled={busy}>
              End the match
            </button>
          )}
        </div>
      </header>

      <div className="match-main">
        <div className="match-table">
          <PokerTable
            step={step}
            hand={hand}
            labels="names"
            unit={unit}
            actor={decision ? hand.hero : undefined}
            fourColour={fourColour}
          />
          <p className="match-log" aria-live="polite">
            {streetLabel(step.street)} – {step.text}
          </p>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <CoachRail state={state} busy={busy} onAsk={ask} onDeparture={departure} compact />

          {decision && legal && (
            <div className="match-answer">
              {intentFirst && <p className="match-ask">What would you do? Pick a reason, then the move.</p>}
              {decision.intent && <p className="match-ask">Now make your move.</p>}
              <ReasonPicker value={reason} onChange={setReason} required={intentFirst} />
              <ActionBar
                key={`${state.hand_number}-${decision.step}-${decision.intent ? 'move' : 'intent'}`}
                legal={legal}
                pot={step.seats.reduce((sum, seat) => sum + seat.bet, step.pot)}
                currency=""
                bigBlind={hand.big_blind}
                unit={unit}
                disabled={busy}
                onAct={act}
              />
              {shows?.timeBank && (
                <p className={bankLeft < LOW_BANK ? 'match-clock low' : 'match-clock'} role="timer">
                  ⏱ {Math.max(0, Math.ceil(FREE_SECONDS - clock))}s, then the bank: {Math.max(0, Math.ceil(bankLeft))}s
                  {bankLeft < LOW_BANK && ' · your time bank is almost out'}
                </p>
              )}
            </div>
          )}

          {state.hand_over && !state.finished && (
            <button type="button" className="button match-next" disabled={busy} onClick={next}>
              Next hand →
            </button>
          )}
          {state.finished && (
            <div className="match-over">
              <p>The match is over: {formatBb(state.result_bb)}.</p>
              <Link className="button" to={`/practice/match/${state.id}/debrief`}>
                See the debrief →
              </Link>
            </div>
          )}
        </div>

        <aside className="match-rail">
          <CoachRail state={state} busy={busy} onAsk={ask} onDeparture={departure} />
          {shows?.panel && pending && <SpotPanel decision={pending} hand={hand} />}
          <ReadCard card={state.read} busy={busy} onNote={note} />
        </aside>
      </div>
    </div>
  )
}

/**
 * Seconds since `key` last changed, ticking while there is one: the time a decision has taken. At `limit` seconds
 * it stops and calls `onExpire`.
 */
function useClock(key: string | undefined, limit: number, onExpire: () => void) {
  const [tick, setTick] = useState({ key, seconds: 0 })
  const expire = useEffectEvent(onExpire)
  useEffect(() => {
    if (!key) return
    const at = performance.now()
    const timer = setInterval(() => {
      const seconds = (performance.now() - at) / 1000
      setTick({ key, seconds })
      if (seconds >= limit) {
        clearInterval(timer)
        expire()
      }
    }, 250)
    return () => clearInterval(timer)
  }, [key, limit])
  return key && tick.key === key ? tick.seconds : 0
}

export default MatchPage
