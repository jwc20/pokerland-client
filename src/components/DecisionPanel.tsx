import { useMemo, type ReactNode } from 'react'
import type { HandDetail, HandEvent } from '../api/generated/data-contracts.ts'
import { heroDecisions, heroM, mZone, type Decision, type Price } from '../decision.ts'
import { formatAmount, formatBb, streetLabel } from '../handFormat.ts'
import type { ReplayStep } from '../replay.ts'
import './DecisionPanel.css'

const percent = (share: number) => share.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 0 })
const decimal = (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 1 })
// With a no-break space, so "1 caller" wraps as one.
const plural = (count: number, word: string) => `${count}\u00a0${word}${count === 1 ? '' : 's'}`
/** "3.1 : 1": what is in the pot against the call. */
const odds = (price: Price) => `${decimal((price.pot - price.toCall) / price.toCall)} : 1`

// 16×16 chevrons, stroked in the text color.
const CHEVRONS = { previous: 'M10 3 5 8l5 5', next: 'm6 3 5 5-5 5' }

/**
 * The numbers behind the hero's decision at this point of the replay, or their
 * last one before it: the price they faced, the size they chose, and their
 * stack and position. The arrows step between their decisions.
 */
function DecisionPanel({
  hand,
  steps,
  index,
  onSeek,
}: {
  hand: HandDetail
  steps: ReplayStep[]
  index: number
  onSeek: (index: number) => void
}) {
  const decisions = useMemo(() => heroDecisions(hand, steps), [hand, steps])
  if (!hand.hero) return null

  const decision = decisions.findLast((d) => d.step <= index) ?? decisions[0]
  const previous = decisions.findLast((d) => d.step < index)
  const next = decisions.find((d) => d.step > index)
  // At the decision, or at the step that shows what the hero did.
  const now = decision && (index === decision.step || index === decision.step + 1)
  const m = heroM(hand)

  return (
    <aside className={now ? 'decision now' : 'decision'} aria-label="Your decisions">
      <header className="decision-header">
        <h2>{decision ? `${streetLabel(decision.street)} decision` : 'Your decisions'}</h2>
        {decision && (
          <span className="decision-count">
            {decisions.indexOf(decision) + 1} of {decisions.length}
          </span>
        )}
        {decisions.length > 1 && (
          <div className="decision-nav">
            {(['previous', 'next'] as const).map((direction) => {
              const target = direction === 'previous' ? previous : next
              return (
                <button
                  key={direction}
                  type="button"
                  disabled={!target}
                  onClick={() => target && onSeek(target.step)}
                  aria-label={direction === 'previous' ? 'Previous decision' : 'Next decision'}
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d={CHEVRONS[direction]} />
                  </svg>
                </button>
              )
            })}
          </div>
        )}
      </header>

      {decision ? (
        <DecisionFacts decision={decision} hand={hand} m={m} />
      ) : (
        <p className="decision-section">You had no decisions to make in this hand.</p>
      )}

      <details className="decision-help">
        <summary>How these are worked out</summary>
        <dl>
          <dt>Pot odds</dt>
          <dd>
            The pot against your call. Calling pays when your chance of winning beats the equity needed: your call ÷
            the pot after it.
          </dd>
          <dt>Defend (MDF)</dt>
          <dd>
            Minimum defense frequency, pot ÷ (pot + bet). Fold more often and a bluff of that size profits with any
            two cards.
          </dd>
          <dt>A bluff must work</dt>
          <dd>Your bet ÷ (pot + your bet) of the time, to break even when it is called and loses.</dd>
          <dt>Effective stack</dt>
          <dd>The most you can still lose: your stack, or less when nobody still in can match it.</dd>
          <dt>SPR</dt>
          <dd>Stack-to-pot ratio: the effective stack ÷ the pot, when the flop came.</dd>
          {m !== undefined && (
            <>
              <dt>M</dt>
              <dd>
                Harrington's M, your stack at the start of the hand ÷ (small blind + big blind + antes): the rounds
                you would last by folding. MIT 15.S50's zones: dead below 2, stealing to 8, steal and re-steal to 12,
                value-betting to 30, set-mining above.
              </dd>
            </>
          )}
        </dl>
      </details>
    </aside>
  )
}

function DecisionFacts({ decision, hand, m }: { decision: Decision; hand: HandDetail; m?: number }) {
  const money = (amount = 0) => formatAmount(amount, hand.currency)
  const bb = (amount = 0) => formatBb(amount / hand.big_blind, false)
  const chips = (amount = 0) => `${money(amount)} (${bb(amount)})`
  const { price, sizing } = decision
  return (
    <>
      <section className="decision-section">
        <p className="decision-lead">{facingText(decision, money, bb)}</p>
        {/* Only a bet or raise has a price worth weighing: limping into the blinds is not calling one. */}
        {decision.facing && price.toCall > 0 && (
          <dl className="decision-facts">
            <Fact term="To call">
              {chips(price.toCall)}
              {price.allIn && ', all-in'}
            </Fact>
            <Fact term="Pot if you call">{chips(price.pot)}</Fact>
            <Fact term="Pot odds">{odds(price)}</Fact>
            <Fact term="Equity needed">{percent(price.toCall / price.pot)}</Fact>
            {decision.mdf !== undefined && <Fact term="Defend (MDF)">{percent(decision.mdf)}</Fact>}
          </dl>
        )}
      </section>

      <section className="decision-section">
        <p className="decision-lead decision-move">{moveText(decision.move, chips)}</p>
        {sizing && (
          <dl className="decision-facts">
            <Fact term="Size">
              {money(sizing.amount)} into {money(sizing.potBefore)} ({percent(sizing.amount / sizing.potBefore)})
            </Fact>
            <Fact term="A bluff must work">{percent(sizing.breakEven)}</Fact>
            {sizing.next && (
              <Fact term={`${sizing.next.player}'s price`}>
                {odds(sizing.next.price)}, needs {percent(sizing.next.price.toCall / sizing.next.price.pot)}
              </Fact>
            )}
          </dl>
        )}
      </section>

      <section className="decision-section">
        <dl className="decision-facts">
          <Fact term="Your stack">{bb(decision.stack)}</Fact>
          <Fact term="Effective stack">{bb(decision.effectiveStack)}</Fact>
          {decision.spr !== undefined && <Fact term="SPR">{decimal(decision.spr)}</Fact>}
          {m !== undefined && (
            <Fact term="M">
              {decimal(m)}, {mZone(m)}
            </Fact>
          )}
          <Fact term="Players left">{decision.players}</Fact>
          {decision.inPosition !== undefined && (
            <Fact term="Position">{decision.inPosition ? 'In position' : 'Out of position'}</Fact>
          )}
        </dl>
      </section>
    </>
  )
}

function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div>
      <dt>{term}</dt>
      <dd>{children}</dd>
    </div>
  )
}

/** What the hero faces: "Bob raises to 600 (3 bb) · 1 caller", "2 limpers", "Checked to you", ... */
function facingText(decision: Decision, money: (amount?: number) => string, bb: (amount?: number) => string) {
  const { facing, callers, street } = decision
  if (facing) {
    const { event, potBefore } = facing
    const action =
      event.type === 'raise'
        ? `raises ${event.all_in ? 'all-in ' : ''}to ${money(event.to)} (${bb(event.to)})`
        : `bets ${money(event.amount)} into ${money(potBefore)} (${percent((event.amount ?? 0) / potBefore)})` +
          (event.all_in ? ', all-in' : '')
    return `${event.player} ${action}${callers ? ` ·\u00a0${plural(callers, 'caller')}` : ''}`
  }
  if (street === 'preflop') return callers ? plural(callers, 'limper') : 'Unopened pot'
  return decision.checks ? 'Checked to you' : 'First to act'
}

/** What the hero did: "You fold", "You raise to 600 (3 bb)", ... */
function moveText(move: HandEvent, chips: (amount?: number) => string) {
  const allIn = move.all_in ? ', all-in' : ''
  switch (move.type) {
    case 'fold':
      return 'You fold'
    case 'check':
      return 'You check'
    case 'call':
      return `You call ${chips(move.amount)}${allIn}`
    case 'bet':
      return `You bet ${chips(move.amount)}${allIn}`
    case 'raise':
      return `You raise ${move.all_in ? 'all-in ' : ''}to ${chips(move.to)}`
    default:
      return ''
  }
}

export default DecisionPanel
