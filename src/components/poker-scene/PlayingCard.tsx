import {useRef} from "react";
import {useFrame} from "@react-three/fiber";
import {Group, Vector3} from "three";
import {isRedCard} from "./replay/cardUtils";
import {boardPosition, deckPosition, muckPosition, playerLayout, type Point3} from "./replay/tableLayout";
import type {ReplayCardState, ReplayEvent, ReplayPlayer} from "./replay/types";

function pointForCard(card: ReplayCardState, players: ReplayPlayer[]): Point3 {
    if (card.zone === "board" && card.boardIndex !== undefined) return boardPosition(card.boardIndex);
    if (card.zone === "muck") return muckPosition;

    const player = players.find((candidate) => candidate.name === card.owner);
    if (!player) return deckPosition;

    return playerLayout(player.visualSeat).cardPositions[card.index] ?? deckPosition;
}

function startForCard(card: ReplayCardState, players: ReplayPlayer[], currentEvent?: ReplayEvent): Point3 {
    if (currentEvent?.type === "deal-hole-card" && currentEvent.player === card.owner && currentEvent.cardIndex === card.index) {
        return deckPosition;
    }

    if (currentEvent?.type === "deal-board-card" && currentEvent.boardIndex === card.boardIndex) {
        return deckPosition;
    }

    if (currentEvent?.type === "muck-cards" && currentEvent.player === card.owner) {
        return pointForCard({...card, zone: "player"}, players);
    }

    return pointForCard(card, players);
}

export default function PlayingCard({card, players, progress, currentEvent}: {
    card: ReplayCardState;
    players: ReplayPlayer[];
    progress: number;
    currentEvent?: ReplayEvent;
}) {
    const ref = useRef<Group>(null);
    const target = pointForCard(card, players);
    const start = startForCard(card, players, currentEvent);
    const frontColor = isRedCard(card.card) ? "#b51f32" : "#151515";

    useFrame(() => {
        const group = ref.current;
        if (!group) return;

        const animated = currentEvent?.type === "deal-hole-card" || currentEvent?.type === "deal-board-card" || currentEvent?.type === "muck-cards";
        const t = animated ? progress : 1;
        group.position.lerpVectors(new Vector3(...start), new Vector3(...target), t);
        group.rotation.set(0, 0, 0);
    });

    return (
        <group ref={ref}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[0.24, 0.015, 0.34]}/>
                <meshStandardMaterial color={card.faceUp ? "#f7f1df" : "#243f91"} roughness={0.72}/>
            </mesh>
            {card.faceUp ? (
                <mesh position={[0, 0.012, -0.06]}>
                    <boxGeometry args={[0.12, 0.006, 0.05]}/>
                    <meshStandardMaterial color={frontColor}/>
                </mesh>
            ) : null}
        </group>
    );
}
