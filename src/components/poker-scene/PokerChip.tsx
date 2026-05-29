import {useRef} from "react";
import {useFrame} from "@react-three/fiber";
import {Group, Vector3} from "three";
import {playerLayout, potPosition} from "./replay/tableLayout";
import type {ReplayChipMove, ReplayPlayer} from "./replay/types";

export default function PokerChip({move, players, progress}: {
    move: ReplayChipMove;
    players: ReplayPlayer[];
    progress: number;
}) {
    const ref = useRef<Group>(null);
    const player = players.find((candidate) => candidate.name === move.player);
    const playerPoint = player ? playerLayout(player.visualSeat).chipPosition : potPosition;
    const from = move.direction === "to-pot" ? playerPoint : potPosition;
    const to = move.direction === "to-pot" ? potPosition : playerPoint;
    const color = move.amount >= 1000 ? "#232323" : move.amount >= 500 ? "#7a35b8" : "#d8d8d8";

    useFrame(() => {
        const group = ref.current;
        if (!group) return;

        const lift = Math.sin(progress * Math.PI) * 0.35;
        group.position.lerpVectors(new Vector3(...from), new Vector3(...to), progress);
        group.position.y += lift;
        group.rotation.y += 0.08;
    });

    return (
        <group ref={ref}>
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.12, 0.12, 0.055, 32]}/>
                <meshStandardMaterial color={color} roughness={0.5}/>
            </mesh>
        </group>
    );
}
