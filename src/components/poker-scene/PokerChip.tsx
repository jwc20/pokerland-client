import {Suspense, useEffect, useRef} from "react";
import {useLoader} from "@react-three/fiber";
import {CylinderCollider, RigidBody, type RapierRigidBody} from "@react-three/rapier";
import {BufferGeometry, Material, Mesh, type Group} from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import chip1 from "../../assets/poker_chips/poker_chip_1.glb";
import chip5 from "../../assets/poker_chips/poker_chip_5.glb";
import chip10 from "../../assets/poker_chips/poker_chip_10.glb";
import chip20 from "../../assets/poker_chips/poker_chip_20.glb";
import chip25 from "../../assets/poker_chips/poker_chip_25.glb";
import chip50 from "../../assets/poker_chips/poker_chip_50.glb";
import chip100 from "../../assets/poker_chips/poker_chip_100.glb";
import chip500 from "../../assets/poker_chips/poker_chip_500.glb";
import chip1000 from "../../assets/poker_chips/poker_chip_1000.glb";
import chip5000 from "../../assets/poker_chips/poker_chip_5000.glb";
import {playerLayout, potPosition, type Point3} from "./replay/tableLayout";
import type {ReplayChipMove, ReplayPlayer} from "./replay/types";

const chipRadius = 0.095;
const chipHeight = 0.035;
const gravity = -9.81;
const modelDiameter = 0.08016000318527222;
const modelScale = (chipRadius * 2) / modelDiameter;
const chipModels = [
    {value: 1, url: chip1},
    {value: 5, url: chip5},
    {value: 10, url: chip10},
    {value: 20, url: chip20},
    {value: 25, url: chip25},
    {value: 50, url: chip50},
    {value: 100, url: chip100},
    {value: 500, url: chip500},
    {value: 1000, url: chip1000},
    {value: 5000, url: chip5000},
];
const chipWeights = [
    ...chipModels.map(({value}) => value),
    10000,
    25000,
    50000,
    100000,
    500000,
    1000000,
].sort((a, b) => b - a);

type ChipMesh = {
    geometry: BufferGeometry;
    material: Material | Material[];
};

function chipAmounts(amount: number) {
    const chips: number[] = [];
    let remaining = Math.max(0, Math.round(amount));

    for (const value of chipWeights) {
        while (remaining >= value && chips.length < 12) {
            chips.push(value);
            remaining -= value;
        }
    }

    if (remaining > 0 && chips.length < 12) {
        chips.push(chipModels.reduce((best, candidate) => (
            Math.abs(candidate.value - remaining) < Math.abs(best.value - remaining) ? candidate : best
        )).value);
    }

    return chips.length ? chips : [1];
}

function chipUrl(amount: number) {
    return chipModels.reduce((best, candidate) => (
        Math.abs(candidate.value - amount) < Math.abs(best.value - amount) ? candidate : best
    )).url;
}

function meshFromScene(scene: Group, name: string): ChipMesh {
    const object = scene.getObjectByName(name);
    if (!(object instanceof Mesh)) {
        throw new Error(`Missing chip mesh: ${name}`);
    }

    return {geometry: object.geometry, material: object.material};
}

function PokerChipModel({amount}: {amount: number}) {
    const {scene} = useLoader(GLTFLoader, chipUrl(amount));
    const object4 = meshFromScene(scene, "Object_4");
    const object5 = meshFromScene(scene, "Object_5");
    const object6 = meshFromScene(scene, "Object_6");
    const object7 = meshFromScene(scene, "Object_7");

    return (
        <group dispose={null} rotation={[-Math.PI / 2, 0, 0]} scale={modelScale}>
            <group rotation={[0.005, 0, 0]}>
                <group rotation={[Math.PI / 2, 0, 0]}>
                    <group position={[0, -0.007, 0]} scale={[-0.334, 0.334, 0.334]}>
                        <mesh castShadow receiveShadow geometry={object4.geometry} material={object4.material}/>
                        <mesh castShadow receiveShadow geometry={object5.geometry} material={object5.material}/>
                        <mesh castShadow receiveShadow geometry={object6.geometry} material={object6.material}/>
                        <mesh castShadow receiveShadow geometry={object7.geometry} material={object7.material}/>
                    </group>
                </group>
            </group>
        </group>
    );
}

function PlaceholderChip({amount}: {amount: number}) {
    const color = amount >= 1000 ? "#232323" : amount >= 500 ? "#7a35b8" : "#d8d8d8";

    return (
        <mesh castShadow receiveShadow>
            <cylinderGeometry args={[chipRadius, chipRadius, chipHeight, 40]}/>
            <meshStandardMaterial color={color} roughness={0.5} metalness={0.08}/>
        </mesh>
    );
}

function ThrownChip({move, amount, index, count, from, to}: {
    move: ReplayChipMove;
    amount: number;
    index: number;
    count: number;
    from: Point3;
    to: Point3;
}) {
    const body = useRef<RapierRigidBody>(null);
    const spread = index - (count - 1) / 2;
    const dx = to[0] - from[0];
    const dz = to[2] - from[2];
    const length = Math.hypot(dx, dz) || 1;
    const sideX = -dz / length;
    const sideZ = dx / length;
    const forwardX = dx / length;
    const forwardZ = dz / length;
    const startOffset = spread * 0.035;
    const targetRing = move.direction === "to-pot" ? 0.045 : 0.12;
    const targetOffset = spread * targetRing;
    const startX = from[0] + sideX * startOffset - forwardX * 0.08;
    const startY = from[1] + chipHeight * 2.5 + index * 0.004;
    const startZ = from[2] + sideZ * startOffset - forwardZ * 0.08;
    const targetX = to[0] + sideX * targetOffset + forwardX * 0.015 * (index % 2 ? 1 : -1);
    const targetY = to[1] + chipHeight * 0.65;
    const targetZ = to[2] + sideZ * targetOffset + forwardZ * 0.015 * (index % 2 ? -1 : 1);

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
            linearDamping={0.18}
            angularDamping={0.45}
            canSleep={false}
            ccd
            position={[startX, startY, startZ]}
            rotation={[0, 0, spread * 0.08]}
        >
            <CylinderCollider args={[chipHeight / 2, chipRadius]}/>
            <Suspense
                fallback={<PlaceholderChip amount={amount}/>}
            >
                <PokerChipModel amount={amount}/>
            </Suspense>
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
    const amounts = chipAmounts(move.amount);

    return (
        <>
            {amounts.map((amount, index) => (
                <ThrownChip key={`${move.id}-${index}`} move={move} amount={amount} index={index} count={amounts.length} from={from} to={to}/>
            ))}
        </>
    );
}
