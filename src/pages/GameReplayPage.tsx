import { useQuery } from '@tanstack/react-query'
import { useEffect, useEffectEvent, useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { errorMessage } from '../api/client.ts'
import type { HandDetail, NotePurposeEnum } from '../api/generated/data-contracts.ts'
import { queries } from '../api/queries.ts'
import CopyButton from '../components/CopyButton.tsx'
import DecisionPanel from '../components/DecisionPanel.tsx'
import NotesPanel from '../components/NotesPanel.tsx'
import PlayingCard from '../components/PlayingCard.tsx'
import ReplayControls from '../components/ReplayControls.tsx'
import ReplayTimeline from '../components/ReplayTimeline.tsx'
import ShareWithClass from '../components/ShareWithClass.tsx'
import { formatAmount, formatBb, formatDateTime, formatShare, gameLabel, handNickname, streetLabel } from '../handFormat.ts'
import { heroBets, purposeOf, streetsReached, type PurposeControl } from '../notes.ts'
import { buildReplay, holeCardCount, lastDecisionStreet, type ReplaySeat } from '../replay.ts'
import { useHandNotes, useTagChoices } from '../useHandNotes.ts'
import { useReplayPlayer } from '../useReplayPlayer.ts'
import './GameReplayPage.css'

function GameReplayPage() {
  const { id = '' } = useParams()
  const valid = /^\d+$/.test(id)
  // A stored hand never changes: one fetch, or Game History's prefetch on hovering its row, serves every visit.
  const query = useQuery({ ...queries.hands.detail(Number(id)), enabled: valid })
  const current = !valid
    ? { error: 'Not found.' }
    : query.error
      ? { error: errorMessage(query.error) }
      : query.data && { hand: query.data }
  return (
    <section className="replay-page">
      <Link className="replay-back" to="/games">
        ← Game History
      </Link>
      {current?.hand ? (
        <Replay key={current.hand.id} hand={current.hand} />
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

function Replay({ hand }: { hand: HandDetail }) {
  const steps = useMemo(() => buildReplay(hand), [hand])
  // ?step=N opens the replay at a step, as a practice spot's "Open the replay" does at its decision.
  const [params] = useSearchParams()
  const player = useReplayPlayer(steps.length, Number(params.get('step')) || 0)
  const step = steps[player.index]
  const money = (amount = 0) => formatAmount(amount, hand.currency)
  const heroSeat = step.seats.find((seat) => seat.name === hand.hero)
  const holeCards = holeCardCount(hand)
  const notes = useHandNotes(hand.id)
  const tagChoices = useTagChoices()
  const bets = useMemo(() => heroBets(hand), [hand])
  const streets = useMemo(() => streetsReached(hand), [hand])
  const saved = notes.notes
  const purposes: PurposeControl | undefined = saved && {
    bets,
    of: (bet) => purposeOf(saved, bet)?.value as NotePurposeEnum | undefined,
    onChange: (bet, purpose) => {
      const current = purposeOf(saved, bet)
      if (purpose) void notes.save({ kind: 'purpose', bet, purpose })
      else if (current) void notes.remove(current)
    },
  }

  // ← and → step, Home and End jump, the space bar plays and pauses.
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    if (event.altKey || event.ctrlKey || event.metaKey || target.closest('input, select, textarea')) return
    if (event.key === 'ArrowLeft') player.seek(player.index - 1)
    else if (event.key === 'ArrowRight') player.seek(player.index + 1)
    else if (event.key === 'Home') player.seek(0)
    else if (event.key === 'End') player.seek(player.last)
    else if (event.key === ' ' && !target.closest('button, a')) player.togglePlay()
    else return
    event.preventDefault()
  })
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const details = [
    hand.play_money && 'Play money',
    hand.tournament_id && `Tournament #${hand.tournament_id}`,
    `Table '${hand.table}'${hand.max_seats ? ` ${hand.max_seats}-max` : ''}`,
    `Hand #${hand.hand_id}`,
    formatDateTime(hand.played_at),
  ]

  return (
    <div className="replay">
      <header className="replay-header">
        <h1>{gameLabel(hand)}</h1>
        <p>{details.filter(Boolean).join(' · ')}</p>
      </header>

      {hand.hero_allin_equity !== null && hand.hero_ev_net_bb !== null && (
        <p className="replay-allin">
          All-in {moneyIn(lastDecisionStreet(hand))} with{' '}
          {formatShare(hand.hero_allin_equity)}: expected {formatBb(hand.hero_ev_net_bb)}, result{' '}
          {formatBb(hand.hero_net / hand.big_blind)}. The expected figure is what your decisions were worth when the
          money went in; the rest was the cards.
        </p>
      )}

      <div className="replay-main">
        <div className="replay-table">
          <p className="replay-step" aria-live="polite">
            {streetLabel(step.street)} – {step.text}
          </p>

          <div className="replay-seats">
            {step.seats
              .filter((seat) => seat !== heroSeat)
              .map((seat) => (
                <Seat
                  key={seat.seat}
                  seat={seat}
                  active={step.event?.player === seat.name}
                  holeCards={holeCards}
                  money={money}
                />
              ))}
          </div>

          <div className="replay-board">
            <h2 className="replay-label">Board</h2>
            <div className="replay-board-cards">
              {Array.from({ length: 5 }, (_, i) =>
                step.board[i] ? <PlayingCard key={i} card={step.board[i]} /> : <PlayingCard key={i} empty />,
              )}
            </div>
            <p className="replay-pot">
              Pot: {money(step.pot)}
              {player.index === player.last && hand.rake ? ` · Rake: ${money(hand.rake)}` : ''}
            </p>
          </div>

          {heroSeat && (
            <div className="replay-seats">
              <Seat
                seat={heroSeat}
                active={step.event?.player === heroSeat.name}
                holeCards={holeCards}
                money={money}
                hero
              />
            </div>
          )}

          <div className="replay-footer">
            <ReplayTimeline steps={steps} index={player.index} hero={hand.hero} onSeek={player.seek} />
            <ReplayControls player={player} />
          </div>
        </div>

        <DecisionPanel hand={hand} steps={steps} index={player.index} onSeek={player.seek} purposes={purposes} />
      </div>

      {hand.hero && (
        <NotesPanel
          notes={saved}
          streets={streets}
          bets={bets}
          tagChoices={tagChoices}
          money={money}
          error={notes.error}
          onSave={notes.save}
          onDelete={notes.remove}
          onSeek={player.seek}
        />
      )}

      {hand.hero && <ShareWithClass hand={hand.id} />}

      <details className="replay-phh">
        <summary>PHH notation</summary>
        <p>
          The hand as <a href="https://pokerkit.readthedocs.io/en/stable/notation.html">PokerKit</a> read it, in
          the <a href="https://phh.readthedocs.io">Poker Hand History</a> format.
        </p>
        <pre>{hand.phh}</pre>
        <CopyButton text={hand.phh} />
      </details>
    </div>
  )
}

/** "before the flop", or "on the turn": when the money went in. */
function moneyIn(street = 'preflop') {
  return street === 'preflop' ? 'before the flop' : `on the ${street}`
}

/** A player: name, position and stack in a box, their cards, and what they did this street. */
function Seat({
  seat,
  active,
  holeCards,
  money,
  hero = false,
}: {
  seat: ReplaySeat
  active: boolean
  holeCards: number
  money: (amount: number) => string
  hero?: boolean
}) {
  // A folded opponent's cards are gone; the hero still knows theirs.
  const showCards = hero || !seat.folded
  const hidden = showCards ? Math.max(0, holeCards - seat.cards.length) : 0
  const nickname = hero ? handNickname(seat.cards) : undefined
  const classes = ['seat', active && 'active', seat.folded && 'folded', hero && 'hero'].filter(Boolean).join(' ')
  return (
    <div className={classes}>
      <div className="seat-box">
        <div className="seat-name">
          <span>{seat.name}</span>
          {seat.position && <span className="seat-position">{seat.position}</span>}
        </div>
        <div>Stack: {money(seat.stack)}</div>
        <div className="seat-status">{seat.allIn ? 'All-in' : seat.folded ? 'Folded' : `Seat ${seat.seat}`}</div>
      </div>
      <div className="seat-hand">
        <div className="seat-cards">
          {showCards && seat.cards.map((card) => <PlayingCard key={card} card={card} />)}
          {Array.from({ length: hidden }, (_, i) => (
            <PlayingCard key={i} />
          ))}
        </div>
        {nickname && <div className="seat-nickname">{nickname}</div>}
      </div>
      <div className="seat-action">
        {seat.bet > 0 && <span className="seat-bet">Bet {money(seat.bet)}</span>}
        {seat.won > 0 && <span className="seat-won">Won {money(seat.won)}</span>}
        {seat.action && <span>{seat.action}</span>}
      </div>
    </div>
  )
}

export default GameReplayPage
