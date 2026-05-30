import {useRef} from "react";
import {useFrame, useLoader} from "@react-three/fiber";
import {Group, Mesh, MeshStandardMaterial, TextureLoader, Vector3} from "three";
import {boardPosition, deckPosition, playerLayout, type Point3} from "./replay/tableLayout";
import type {ReplayCardState, ReplayEvent, ReplayPlayer} from "./replay/types";

const textureUrls = import.meta.glob("../../assets/textures/*_baseColor.jpeg", {eager: true, query: "?url", import: "default"}) as Record<string, string>;

const cardTextureFiles: Record<string, string> = {
    back: "01_-_Default_baseColor.jpeg",
    As: "02_-_Default_baseColor.jpeg",
    "2s": "13_-_Default_baseColor.jpeg",
    "3s": "08_-_Default_baseColor.jpeg",
    "4s": "09_-_Default_baseColor.jpeg",
    "5s": "03_-_Default_baseColor.jpeg",
    "6s": "14_-_Default_baseColor.jpeg",
    "7s": "15_-_Default_baseColor.jpeg",
    "8s": "19_-_Default_baseColor.jpeg",
    "9s": "20_-_Default_baseColor.jpeg",
    Ts: "21_-_Default_baseColor.jpeg",
    Js: "04_-_Default_baseColor.jpeg",
    Qs: "05_-_Default_baseColor.jpeg",
    Ks: "06_-_Default_baseColor.jpeg",
    Ah: "material_baseColor.jpeg",
    "2h": "material_17_baseColor.jpeg",
    "3h": "material_26_baseColor.jpeg",
    "4h": "material_18_baseColor.jpeg",
    "5h": "material_27_baseColor.jpeg",
    "6h": "material_21_baseColor.jpeg",
    "7h": "material_23_baseColor.jpeg",
    "8h": "material_16_baseColor.jpeg",
    "9h": "material_24_baseColor.jpeg",
    Th: "material_25_baseColor.jpeg",
    Jh: "material_19_baseColor.jpeg",
    Qh: "material_22_baseColor.jpeg",
    Kh: "material_20_baseColor.jpeg",
    Ad: "material_28_baseColor.jpeg",
    "2d": "material_30_baseColor.jpeg",
    "3d": "material_39_baseColor.jpeg",
    "4d": "material_31_baseColor.jpeg",
    "5d": "material_40_baseColor.jpeg",
    "6d": "material_37_baseColor.jpeg",
    "7d": "material_36_baseColor.jpeg",
    "8d": "material_29_baseColor.jpeg",
    "9d": "material_34_baseColor.jpeg",
    Td: "material_38_baseColor.jpeg",
    Jd: "material_32_baseColor.jpeg",
    Qd: "material_35_baseColor.jpeg",
    Kd: "22_-_Default_baseColor.jpeg",
    Ac: "material_41_baseColor.jpeg",
    "2c": "material_43_baseColor.jpeg",
    "3c": "material_52_baseColor.jpeg",
    "4c": "material_44_baseColor.jpeg",
    "5c": "material_53_baseColor.jpeg",
    "6c": "material_50_baseColor.jpeg",
    "7c": "material_49_baseColor.jpeg",
    "8c": "material_42_baseColor.jpeg",
    "9c": "material_47_baseColor.jpeg",
    Tc: "material_51_baseColor.jpeg",
    Jc: "material_45_baseColor.jpeg",
    Qc: "material_48_baseColor.jpeg",
    Kc: "material_46_baseColor.jpeg",
};

const suitAliases: Record<string, string> = {clubs: "c", diamonds: "d", hearts: "h", spades: "s"};

function textureUrlForCard(card?: string) {
    const normalized = card ? card.replace(/^(10)/, "T").replace(/(clubs|diamonds|hearts|spades)$/i, (suit) => suitAliases[suit.toLowerCase()]) : "back";
    const filename = cardTextureFiles[normalized ?? "back"] ?? cardTextureFiles.back;

    return textureUrls[`../../assets/textures/${filename}`];
}

function pointForCard(card: ReplayCardState, players: ReplayPlayer[]): Point3 {
    if (card.zone === "board" && card.boardIndex !== undefined) return boardPosition(card.boardIndex);

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

    return pointForCard(card, players);
}

export default function PlayingCard({card, players, progress, currentEvent}: {
    card: ReplayCardState;
    players: ReplayPlayer[];
    progress: number;
    currentEvent?: ReplayEvent;
}) {
    const ref = useRef<Group>(null);
    const bodyRef = useRef<Mesh>(null);
    const faceRef = useRef<Mesh>(null);
    const target = pointForCard(card, players);
    const start = startForCard(card, players, currentEvent);
    const texture = useLoader(TextureLoader, textureUrlForCard(card.faceUp ? card.card : undefined));

    useFrame(() => {
        const group = ref.current;
        if (!group) return;

        const animated = currentEvent?.type === "deal-hole-card" || currentEvent?.type === "deal-board-card" || currentEvent?.type === "muck-cards";
        const t = animated ? progress : 1;
        group.position.lerpVectors(new Vector3(...start), new Vector3(...target), t);
        if (currentEvent?.type === "muck-cards" && currentEvent.player === card.owner) {
            group.position.y -= progress * 0.035;
        }
        group.rotation.set(0, 0, 0);

        const opacity = currentEvent?.type === "muck-cards" && currentEvent.player === card.owner ? 1 - progress : 1;
        for (const mesh of [bodyRef.current, faceRef.current]) {
            if (mesh?.material instanceof MeshStandardMaterial) {
                mesh.material.opacity = opacity;
            }
        }
    });

    return (
        <group ref={ref}>
            <mesh ref={bodyRef} castShadow receiveShadow>
                <boxGeometry args={[0.24, 0.015, 0.34]}/>
                <meshStandardMaterial color="#ffffff" roughness={0.72} transparent/>
            </mesh>
            <mesh ref={faceRef} position={[0, 0.009, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.235, 0.335]}/>
                <meshStandardMaterial map={texture} roughness={0.5} transparent/>
            </mesh>
        </group>
    );
}
