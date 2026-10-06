import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { errorMessage, hands } from '../api/client.ts'
import type { HandDetail } from '../api/generated/data-contracts.ts'
import PlayingCard from '../components/PlayingCard.tsx'
import ReplayControls from '../components/ReplayControls.tsx'
import ReplayTimeline from '../components/ReplayTimeline.tsx'
import { formatAmount, formatDateTime, gameLabel, streetLabel } from '../handFormat.ts'
import { buildReplay, hasBoard, holeCardCount, type ReplaySeat } from '../replay.ts'
import { useReplayPlayer } from '../useReplayPlayer.ts'
import './GameReplayPage.css'

function GameReplayPage() {
  const { id = '' } = useParams()
  // Remembers which id it holds, so a different hand in the URL shows as loading.
  const [loaded, setLoaded] = useState<{ id: string; hand?: HandDetail; error?: string }>()

  useEffect(() => {
    if (!/^\d+$/.test(id)) return
    let active = true
    hands.handsRetrieve({ id: Number(id) }).then(
      ({ data }) => {
        if (active) setLoaded({ id, hand: data })
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
  const player = useReplayPlayer(steps.length)
  const step = steps[player.index]
  const money = (amount: number) => formatAmount(amount, hand.currency)
  const heroSeat = step.seats.find((seat) => seat.name === hand.hero)
  const holeCards = holeCardCount(hand)
  const boards = step.boards.length ? step.boards : [[]]

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

      <p className="replay-step" aria-live="polite">
        {streetLabel(step.street)} – {step.text}
      </p>

      <div className="replay-seats">
        {step.seats
          .filter((seat) => seat !== heroSeat)
          .map((seat) => (
            <Seat key={seat.seat} seat={seat} active={step.event?.player === seat.name} holeCards={holeCards} money={money} />
          ))}
      </div>

      <div className="replay-board">
        <h2 className="replay-label">Board</h2>
        {hasBoard(hand) &&
          boards.map((board, run) => (
            <div key={run} className="replay-board-cards">
              {boards.length > 1 && <span className="replay-run">Run {run + 1}</span>}
              {Array.from({ length: 5 }, (_, i) =>
                board[i] ? <PlayingCard key={i} card={board[i]} /> : <PlayingCard key={i} empty />,
              )}
            </div>
          ))}
        <p className="replay-pot">
          Pot: {money(step.pot)}
          {player.index === player.last && hand.rake ? ` · Rake: ${money(hand.rake)}` : ''}
        </p>
      </div>

      {heroSeat && (
        <div className="replay-seats">
          <Seat seat={heroSeat} active={step.event?.player === heroSeat.name} holeCards={holeCards} money={money} hero />
        </div>
      )}

      <div className="replay-footer">
        <ReplayTimeline steps={steps} index={player.index} hero={hand.hero} onSeek={player.seek} />
        <ReplayControls player={player} />
      </div>
    </div>
  )
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
      <div className="seat-cards">
        {showCards && seat.cards.map((card) => <PlayingCard key={card} card={card} />)}
        {Array.from({ length: hidden }, (_, i) => (
          <PlayingCard key={i} />
        ))}
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
