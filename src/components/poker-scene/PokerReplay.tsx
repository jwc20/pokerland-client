import {useEffect, useRef, useState} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import {CuboidCollider, Physics, RigidBody, type RapierRigidBody} from "@react-three/rapier";
import {Card, Flex, Heading, Text} from "@radix-ui/themes";
import {PCFShadowMap} from "three";
import PlayingCard from "./PlayingCard";
import PokerChip from "./PokerChip";
import ReplayControls from "./ReplayControls";
import {parseCardRevealOrder, type CardRevealOrder} from "./replay/cardRevealParser";
import {createReplayHand} from "./replay/handLogAdapter";
import {createReplayTimeline} from "./replay/replayTimeline";
import {playerLayout, potPosition} from "./replay/tableLayout";
import {formatCard} from "./replay/cardUtils";
import type {ReplayChipMove, ReplayEvent, ReplayHand, ReplayPlayer, ReplayStreet, ReplayViewState} from "./replay/types";

const eventDuration = 360;
const boardDealEventDuration = 1400;
const bettingEventDuration = 2200;

function initialViewState(): ReplayViewState {
    return {
        cards: [],
        foldedPlayers: [],
        pot: 0,
        playerBets: {},
        chipMoves: [],
        actionLabel: "Ready to replay hand",
        isComplete: false,
    };
}

function chipMoveId(event: Extract<ReplayEvent, {type: "move-chips-to-pot" | "return-chips" | "collect-pot"}>, eventKey: number) {
    return `${eventKey}-${event.type}-${event.player}-${event.amount}`;
}

function subtractFromPotChips(chipMoves: ReplayChipMove[], amount: number) {
    let remaining = amount;
    const next = [...chipMoves];

    for (let index = next.length - 1; index >= 0 && remaining > 0; index -= 1) {
        const move = next[index];
        if (move.source !== "bet" || move.direction !== "to-pot") continue;

        const removed = Math.min(move.amount, remaining);
        remaining -= removed;
        next[index] = {...move, amount: move.amount - removed};
    }

    return next.filter((move) => move.amount > 0);
}

function applyEvent(state: ReplayViewState, event: ReplayEvent, eventKey: number): ReplayViewState {
    const next: ReplayViewState = {
        ...state,
        cards: state.cards.map((card) => ({...card})),
        foldedPlayers: [...state.foldedPlayers],
        playerBets: {...state.playerBets},
        chipMoves: [...state.chipMoves],
        activePlayer: undefined,
        actionLabel: event.label,
    };

    if (event.type === "deal-hole-card") {
        next.cards.push({
            id: `${event.player}-${event.cardIndex}`,
            owner: event.player,
            card: event.card,
            faceUp: event.faceUp,
            zone: "player",
            index: event.cardIndex,
        });
        next.activePlayer = event.player;
    }

    if (event.type === "deal-board-card") {
        next.cards.push({
            id: `board-${event.boardIndex}`,
            card: event.card,
            faceUp: true,
            zone: "board",
            index: event.boardIndex,
            boardIndex: event.boardIndex,
        });
    }

    if (event.type === "reveal-hole-cards") {
        const existingCards = next.cards.filter((card) => card.owner === event.player);
        if (existingCards.length > 0) {
            let cardIndex = 0;
            next.cards = next.cards.map((card) => {
                if (card.owner !== event.player) return card;

                const revealed = event.cards[cardIndex];
                cardIndex += 1;
                return {...card, card: revealed ?? card.card, faceUp: true};
            });
        } else {
            next.cards.push(...event.cards.map((card, index) => ({
                id: `${event.player}-showdown-${index}`,
                owner: event.player,
                card,
                faceUp: true,
                zone: "player" as const,
                index,
            })));
        }
        next.activePlayer = event.player;
    }


    if (event.type === "move-chips-to-pot") {
        next.pot += event.amount;
        next.playerBets[event.player] = (next.playerBets[event.player] ?? 0) + event.amount;
        next.chipMoves.push({id: chipMoveId(event, eventKey), player: event.player, amount: event.amount, direction: "to-pot", source: "bet"});
        next.activePlayer = event.player;
    }

    if (event.type === "return-chips") {
        next.pot = Math.max(0, next.pot - event.amount);
        next.chipMoves = subtractFromPotChips(next.chipMoves, event.amount);
        next.chipMoves.push({id: chipMoveId(event, eventKey), player: event.player, amount: event.amount, direction: "from-pot", source: "return"});
        next.activePlayer = event.player;
    }

    if (event.type === "collect-pot") {
        next.pot = 0;
        next.chipMoves.push({id: chipMoveId(event, eventKey), player: event.player, amount: event.amount, direction: "from-pot", source: "collect"});
        next.activePlayer = event.player;
    }

    if (event.type === "show-action") {
        next.activePlayer = event.player;
    }

    if (event.type === "muck-cards") {
        next.foldedPlayers = next.foldedPlayers.includes(event.player) ? next.foldedPlayers : [...next.foldedPlayers, event.player];
        next.cards = next.cards.filter((card) => card.owner !== event.player);
        next.activePlayer = event.player;
    }

    if (event.type === "finish") {
        next.isComplete = true;
    }

    return next;
}

function ChipSweepWall({move, players}: {move: ReplayChipMove; players: ReplayPlayer[]}) {
    const body = useRef<RapierRigidBody>(null);
    const startTime = useRef<number | null>(null);
    const player = players.find((candidate) => candidate.name === move.player);
    const playerPoint = player ? playerLayout(player.visualSeat).chipPosition : potPosition;
    const dx = playerPoint[0] - potPosition[0];
    const dz = playerPoint[2] - potPosition[2];
    const length = Math.hypot(dx, dz) || 1;
    const forwardX = dx / length;
    const forwardZ = dz / length;
    const yaw = Math.atan2(forwardX, forwardZ);
    const start = -0.72;
    const end = length + 0.36;
    const duration = 1.55;

    useFrame(({clock}) => {
        const rigidBody = body.current;
        if (!rigidBody || !player) return;

        startTime.current ??= clock.getElapsedTime();
        const elapsed = clock.getElapsedTime() - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        const distance = start + (end - start) * progress;

        rigidBody.setNextKinematicTranslation({
            x: potPosition[0] + forwardX * distance,
            y: 0.22,
            z: potPosition[2] + forwardZ * distance,
        });
    });

    if (!player) return null;

    return (
        <RigidBody ref={body} type="kinematicPosition" colliders={false} position={[potPosition[0] + forwardX * start, 0.2, potPosition[2] + forwardZ * start]} rotation={[0, yaw, 0]}>
            <CuboidCollider args={[1.35, 0.26, 0.055]} friction={1.55} restitution={0.01}/>
            <CuboidCollider args={[0.62, 0.24, 0.045]} position={[-0.86, 0, -0.28]} rotation={[0, -0.55, 0]} friction={1.55} restitution={0.01}/>
            <CuboidCollider args={[0.62, 0.24, 0.045]} position={[0.86, 0, -0.28]} rotation={[0, 0.55, 0]} friction={1.55} restitution={0.01}/>
        </RigidBody>
    );
}

function buildViewState(events: ReplayEvent[], count: number) {
    let state = initialViewState();
    for (const [index, event] of events.slice(0, count).entries()) {
        state = applyEvent(state, event, index);
    }

    return state;
}

function cardsFromReveal(reveal: CardRevealOrder, type: ReplayStreet["type"]) {
    if (type === "flop") return reveal.streets.flop;
    if (type === "turn") return reveal.streets.turn;

    return reveal.streets.river;
}

function applyRevealOrder(hand: ReplayHand, reveal: CardRevealOrder | null): ReplayHand {
    if (!reveal || reveal.revealTimeline.length === 0) return hand;

    const streetTypes: ReplayStreet["type"][] = ["flop", "turn", "river"];
    const streets = streetTypes.flatMap((type) => {
        const cards = cardsFromReveal(reveal, type);
        const existing = hand.streets.find((street) => street.type === type);
        if (cards.length === 0 && !existing) return [];

        return [{
            type,
            cards: cards.length > 0 ? cards : existing?.cards ?? [],
            actions: existing?.actions ?? [],
        }];
    });
    const heroName = reveal.hero || hand.heroName;
    const heroCards = reveal.streets.holeCards.hero?.cards ?? hand.heroCards;

    return {
        ...hand,
        handId: reveal.handId || hand.handId,
        tableName: reveal.table || hand.tableName,
        buttonSeat: reveal.buttonSeat ?? hand.buttonSeat,
        heroName,
        heroCards,
        players: hand.players.map((player) => ({...player, isHero: player.name === heroName})),
        streets,
        showdownCards: reveal.streets.showdown.flatMap((showdown) => showdown.cards ? [{
            player: showdown.player,
            cards: showdown.cards,
            result: showdown.result,
            alreadyKnown: showdown.alreadyKnown,
        }] : []),
    };
}

function ReplayScene({hand, events, viewState, currentEvent, progress}: {
    hand: ReplayHand;
    events: ReplayEvent[];
    viewState: ReplayViewState;
    currentEvent?: ReplayEvent;
    progress: number;
}) {
    void events;

    return (
        <div className="poker-scene poker-replay-scene" aria-label="3D poker hand replay">
            <Canvas shadows={{type: PCFShadowMap}} camera={{position: [0, 1.25, 3.75], rotation: [-0.32, 0, 0], fov: 64}}>
                <color attach="background" args={["#ffffff"]}/>
                <ambientLight intensity={1.7}/>
                <directionalLight position={[1.5, 4, 2]} intensity={1.3} castShadow/>
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[7, 5.6]}/>
                    <meshStandardMaterial color="#ffffff" roughness={0.82}/>
                </mesh>
                <gridHelper args={[7, 28, "#cfd6df", "#edf0f4"]}/>
                <Physics gravity={[0, -9.81, 0]}>
                    <CuboidCollider args={[3.5, 0.03, 2.8]} position={[0, -0.03, 0]} friction={1.15} restitution={0.04}/>
                    {viewState.chipMoves.filter((move) => move.source === "collect").map((move) => (
                        <ChipSweepWall key={`${move.id}-wall`} move={move} players={hand.players}/>
                    ))}
                    {viewState.chipMoves.map((move) => (
                        <PokerChip key={move.id} move={move} players={hand.players}/>
                    ))}
                </Physics>
                {viewState.cards.map((card) => (
                    <PlayingCard key={card.id} card={card} players={hand.players} progress={progress} currentEvent={currentEvent}/>
                ))}
            </Canvas>
        </div>
    );
}

function ReplayDetails({hand, viewState}: {hand: ReplayHand; viewState: ReplayViewState}) {
    const heroCards = hand.heroCards.length ? hand.heroCards.map(formatCard).join(" ") : "Unknown";

    return (
        <Flex direction="column" gap="2" className="poker-replay-details">
            <Text size="2"><strong>Hero:</strong> {hand.heroName || "Unknown"} ({heroCards})</Text>
            <Text size="2"><strong>Pot:</strong> {viewState.pot}</Text>
            <Text size="2"><strong>Current action:</strong> {viewState.actionLabel}</Text>
            <Flex gap="2" wrap="wrap">
                {hand.players.map((player) => (
                    <Text key={player.name} size="1" className={player.name === viewState.activePlayer ? "poker-active-player" : undefined}>
                        Seat {player.seat}: {player.name}{player.isHero ? " (you)" : ""}{viewState.foldedPlayers.includes(player.name) ? " folded" : ""}
                    </Text>
                ))}
            </Flex>
        </Flex>
    );
}

function ReplayProgress({value, current, total, labels, onSeek}: {
    value: number;
    current: number;
    total: number;
    labels: string[];
    onSeek: (value: number) => void;
}) {
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const percent = Math.round(value * 100);
    const hoverPercent = hoverValue === null ? 0 : Math.round(hoverValue * 100);
    const hoverIndex = hoverValue === null ? -1 : Math.min(Math.floor(hoverValue * total), Math.max(total - 1, 0));
    const hoverLabel = hoverIndex >= 0 ? labels[hoverIndex] : "";

    function valueFromPointer(event: React.PointerEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>) {
        const bounds = event.currentTarget.getBoundingClientRect();
        return Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1);
    }

    return (
        <Flex direction="column" gap="1" className="poker-replay-progress-wrap">
            <Flex justify="between" align="center">
                <Text size="1" color="gray">Replay progress</Text>
                <Text size="1" color="gray">{Math.min(current, total)} / {total} events</Text>
            </Flex>
            <button
                className="poker-replay-progress"
                type="button"
                role="slider"
                aria-label="Replay progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                onPointerMove={(event) => setHoverValue(valueFromPointer(event))}
                onPointerLeave={() => setHoverValue(null)}
                onClick={(event) => {
                    onSeek(valueFromPointer(event));
                }}
            >
                {hoverLabel ? (
                    <span className="poker-replay-progress-tooltip" style={{left: `${hoverPercent}%`}}>{hoverLabel}</span>
                ) : null}
                <div className="poker-replay-progress-fill" style={{width: `${percent}%`}}/>
            </button>
        </Flex>
    );
}

function ValidPokerReplay({hand, revealOrder}: {hand: ReplayHand; revealOrder: CardRevealOrder | null}) {
    const [playing, setPlaying] = useState(false);
    const [eventIndex, setEventIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const events = createReplayTimeline(hand);
    const currentEvent = events[eventIndex];
    const currentEventDuration = currentEvent?.type === "move-chips-to-pot" ? bettingEventDuration : currentEvent?.type === "deal-board-card" ? boardDealEventDuration : eventDuration;
    const viewState = buildViewState(events, eventIndex);
    const animatedViewState = currentEvent && currentEvent.type !== "muck-cards" && (playing || progress > 0) ? applyEvent(viewState, currentEvent, eventIndex) : viewState;
    const canStep = eventIndex < events.length;
    const replayProgress = events.length > 0 ? Math.min((eventIndex + progress) / events.length, 1) : 0;

    useEffect(() => {
        if (!playing || eventIndex >= events.length) return;

        let frame = 0;
        const startedAt = performance.now();

        function tick(now: number) {
            const nextProgress = Math.min((now - startedAt) / currentEventDuration, 1);
            setProgress(nextProgress);

            if (nextProgress >= 1) {
                setEventIndex((value) => Math.min(value + 1, events.length));
                setProgress(0);
                if (eventIndex + 1 >= events.length) setPlaying(false);
                return;
            }

            frame = requestAnimationFrame(tick);
        }

        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
    }, [currentEventDuration, eventIndex, events.length, playing]);

    return (
        <Card>
            <Flex direction="column" gap="3">
                <Flex direction="column" gap="1">
                    <Heading size="4">Hand Replay</Heading>
                    <Text size="2" color="gray">{hand.tableName} hand {hand.handId}</Text>
                </Flex>
                <ReplayControls
                    playing={playing}
                    canStep={canStep}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onStep={() => {
                        setPlaying(false);
                        setProgress(0);
                        setEventIndex((value) => Math.min(value + 1, events.length));
                    }}
                    onRestart={() => {
                        setPlaying(false);
                        setProgress(0);
                        setEventIndex(0);
                    }}
                />
                <ReplayProgress
                    value={replayProgress}
                    current={eventIndex}
                    total={events.length}
                    labels={events.map((event) => event.label)}
                    onSeek={(value) => {
                        setPlaying(false);
                        setProgress(0);
                        setEventIndex(Math.min(Math.floor(Math.max(0, value) * events.length), events.length));
                    }}
                />
                <ReplayScene hand={hand} events={events} viewState={animatedViewState} currentEvent={currentEvent} progress={progress}/>
                <ReplayDetails hand={hand} viewState={animatedViewState}/>
                {revealOrder?.warnings.length ? (
                    <Text size="1" color="amber">Reveal parser warnings: {revealOrder.warnings.join(" ")}</Text>
                ) : null}
            </Flex>
        </Card>
    );
}

export default function PokerReplay({parsed, rawHandHistory}: {parsed: unknown; rawHandHistory?: string}) {
    const parsedHand = createReplayHand(parsed);
    const revealOrder = rawHandHistory ? parseCardRevealOrder(rawHandHistory) : null;
    const hand = parsedHand ? applyRevealOrder(parsedHand, revealOrder) : null;

    if (!hand) {
        return (
            <Card>
                <Heading size="3" mb="1">Replay Unavailable</Heading>
                <Text size="2" color="gray">This hand history does not contain enough parsed data for a replay.</Text>
            </Card>
        );
    }

    return <ValidPokerReplay hand={hand} revealOrder={revealOrder}/>;
}
