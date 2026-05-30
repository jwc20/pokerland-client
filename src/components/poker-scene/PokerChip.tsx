import {useEffect, useRef} from "react";
import {CylinderCollider, RigidBody, type RapierRigidBody} from "@react-three/rapier";
import {playerLayout, potPosition} from "./replay/tableLayout";
import type {ReplayChipMove, ReplayPlayer} from "./replay/types";

const chipRadius = 0.12;
const chipHeight = 0.055;
const gravity = -9.81;

function chipColor(amount: number) {
    if (amount >= 1000) return "#232323";
    if (amount >= 500) return "#7a35b8";

    return "#d8d8d8";
}

function chipCount(amount: number) {
    return Math.max(3, Math.min(8, Math.ceil(amount / 250)));
}

function PhysicsChip({index, count, amount, from, to}: {
    index: number;
    count: number;
    amount: number;
    from: [number, number, number];
    to: [number, number, number];
}) {
    const body = useRef<RapierRigidBody>(null);
    const spread = index - (count - 1) / 2;
    const dx = to[0] - from[0];
    const dz = to[2] - from[2];
    const length = Math.hypot(dx, dz) || 1;
    const sideX = -dz / length;
    const sideZ = dx / length;
    const startOffset = spread * 0.035;
    const targetOffset = spread * 0.025;
    const startX = from[0] + sideX * startOffset;
    const startY = from[1] + chipHeight * 1.4 + index * 0.01;
    const startZ = from[2] + sideZ * startOffset;
    const targetX = to[0] + sideX * targetOffset;
    const targetY = to[1] + chipHeight * 0.8;
    const targetZ = to[2] + sideZ * targetOffset;

    useEffect(() => {
        const rigidBody = body.current;
        if (!rigidBody) return;

        const flightTime = 0.58 + index * 0.025;
        rigidBody.setLinvel({
            x: (targetX - startX) / flightTime,
            y: (targetY - startY - 0.5 * gravity * flightTime * flightTime) / flightTime,
            z: (targetZ - startZ) / flightTime,
        }, true);
        rigidBody.setAngvel({
            x: sideZ * (10 + index),
            y: 3 + index * 0.6,
            z: -sideX * (10 + index),
        }, true);
    }, [index, sideX, sideZ, startX, startY, startZ, targetX, targetY, targetZ]);

    return (
        <RigidBody
            ref={body}
            colliders={false}
            friction={0.92}
            restitution={0.12}
            linearDamping={0.45}
            angularDamping={0.65}
            position={[startX, startY, startZ]}
            rotation={[0, 0, spread * 0.08]}
        >
            <CylinderCollider args={[chipHeight / 2, chipRadius]}/>
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[chipRadius, chipRadius, chipHeight, 36]}/>
                <meshStandardMaterial color={chipColor(amount)} roughness={0.48} metalness={0.08}/>
            </mesh>
        </RigidBody>
    );
}

export default function PokerChip({move, players}: {
    move: ReplayChipMove;
    players: ReplayPlayer[];
}) {
    const player = players.find((candidate) => candidate.name === move.player);
    const playerPoint = player ? playerLayout(player.visualSeat).chipPosition : potPosition;
    const from = move.direction === "to-pot" ? playerPoint : potPosition;
    const to = move.direction === "to-pot" ? potPosition : playerPoint;
    const count = chipCount(move.amount);

    return (
        <>
            {Array.from({length: count}, (_, index) => (
                <PhysicsChip key={`${move.id}-${index}`} index={index} count={count} amount={move.amount} from={from} to={to}/>
            ))}
        </>
    );
}
