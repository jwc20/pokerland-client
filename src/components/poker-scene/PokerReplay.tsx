import {useEffect, useState} from "react";
import {Canvas} from "@react-three/fiber";
import {Card, Flex, Heading, Text} from "@radix-ui/themes";
import {PCFShadowMap} from "three";
import PlayingCard from "./PlayingCard";
import PokerChip from "./PokerChip";
import ReplayControls from "./ReplayControls";
import {createReplayHand} from "./replay/handLogAdapter";
import {createReplayTimeline} from "./replay/replayTimeline";
import {formatCard} from "./replay/cardUtils";
import {potPosition} from "./replay/tableLayout";
import type {ReplayEvent, ReplayHand, ReplayViewState} from "./replay/types";

const eventDuration = 360;

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

function applyEvent(state: ReplayViewState, event: ReplayEvent): ReplayViewState {
    const next: ReplayViewState = {
        ...state,
        cards: state.cards.map((card) => ({...card})),
        foldedPlayers: [...state.foldedPlayers],
        playerBets: {...state.playerBets},
        chipMoves: [],
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
            faceUp: false,
            zone: "board",
            index: event.boardIndex,
            boardIndex: event.boardIndex,
        });
    }

    if (event.type === "move-chips-to-pot") {
        next.pot += event.amount;
        next.playerBets[event.player] = (next.playerBets[event.player] ?? 0) + event.amount;
        next.chipMoves = [{id: `${event.player}-${event.amount}-${Date.now()}`, player: event.player, amount: event.amount, direction: "to-pot"}];
        next.activePlayer = event.player;
    }

    if (event.type === "return-chips") {
        next.pot = Math.max(0, next.pot - event.amount);
        next.chipMoves = [{id: `${event.player}-${event.amount}-${Date.now()}`, player: event.player, amount: event.amount, direction: "from-pot"}];
        next.activePlayer = event.player;
    }

    if (event.type === "collect-pot") {
        next.pot = 0;
        next.chipMoves = [{id: `${event.player}-${event.amount}-${Date.now()}`, player: event.player, amount: event.amount, direction: "from-pot"}];
        next.activePlayer = event.player;
    }

    if (event.type === "show-action") {
        next.activePlayer = event.player;
    }

    if (event.type === "muck-cards") {
        next.foldedPlayers = next.foldedPlayers.includes(event.player) ? next.foldedPlayers : [...next.foldedPlayers, event.player];
        next.cards = next.cards.map((card) => card.owner === event.player ? {...card, zone: "muck"} : card);
        next.activePlayer = event.player;
    }

    if (event.type === "finish") {
        next.isComplete = true;
    }

    return next;
}

function buildViewState(events: ReplayEvent[], count: number) {
    let state = initialViewState();
    for (const event of events.slice(0, count)) {
        state = applyEvent(state, event);
    }

    return state;
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
            <Canvas shadows={{type: PCFShadowMap}} camera={{position: [0, 1.15, 3.15], rotation: [-0.36, 0, 0], fov: 60}}>
                <color attach="background" args={["#ffffff"]}/>
                <ambientLight intensity={1.7}/>
                <directionalLight position={[1.5, 4, 2]} intensity={1.3} castShadow/>
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[7, 5.6]}/>
                    <meshStandardMaterial color="#ffffff" roughness={0.82}/>
                </mesh>
                <gridHelper args={[7, 28, "#cfd6df", "#edf0f4"]}/>
                <mesh position={potPosition} castShadow receiveShadow>
                    <cylinderGeometry args={[0.2, 0.2, Math.max(0.04, Math.min(viewState.pot / 5000, 0.45)), 32]}/>
                    <meshStandardMaterial color="#d8d8d8" roughness={0.45}/>
                </mesh>
                {viewState.cards.map((card) => (
                    <PlayingCard key={card.id} card={card} players={hand.players} progress={progress} currentEvent={currentEvent}/>
                ))}
                {viewState.chipMoves.map((move) => (
                    <PokerChip key={move.id} move={move} players={hand.players} progress={progress}/>
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

function ValidPokerReplay({hand}: {hand: ReplayHand}) {
    const [playing, setPlaying] = useState(false);
    const [eventIndex, setEventIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const events = createReplayTimeline(hand);
    const currentEvent = events[eventIndex];
    const viewState = buildViewState(events, eventIndex);
    const animatedViewState = currentEvent && (playing || progress > 0) ? applyEvent(viewState, currentEvent) : viewState;
    const canStep = eventIndex < events.length;
    const replayProgress = events.length > 0 ? Math.min((eventIndex + progress) / events.length, 1) : 0;

    useEffect(() => {
        if (!playing || eventIndex >= events.length) return;

        let frame = 0;
        const startedAt = performance.now();

        function tick(now: number) {
            const nextProgress = Math.min((now - startedAt) / eventDuration, 1);
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
    }, [eventIndex, events.length, playing]);

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
            </Flex>
        </Card>
    );
}

export default function PokerReplay({parsed}: {parsed: unknown}) {
    const hand = createReplayHand(parsed);

    if (!hand) {
        return (
            <Card>
                <Heading size="3" mb="1">Replay Unavailable</Heading>
                <Text size="2" color="gray">This hand history does not contain enough parsed data for a replay.</Text>
            </Card>
        );
    }

    return <ValidPokerReplay hand={hand}/>;
}
