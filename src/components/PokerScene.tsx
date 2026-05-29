import {Suspense, useLayoutEffect, useRef} from "react";
import {Canvas, useLoader} from "@react-three/fiber";
import {Box3, Mesh, Vector3, type Group} from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import pokerTableUrl from "../assets/poker_table.glb";

function PokerTableModel() {
    const gltf = useLoader(GLTFLoader, pokerTableUrl);
    const groupRef = useRef<Group>(null);

    useLayoutEffect(() => {
        const group = groupRef.current;
        if (!group) return;

        group.position.set(0, 100, 0);
        group.scale.setScalar(1);

        gltf.scene.traverse((object) => {
            if (object instanceof Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });

        const bounds = new Box3().setFromObject(group);
        if (bounds.isEmpty()) return;

        const size = bounds.getSize(new Vector3());
        const center = bounds.getCenter(new Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scale = maxDimension > 0 ? 7 / maxDimension : 1;

        group.scale.setScalar(scale);
        group.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    }, [gltf.scene]);

    return (
        <group ref={groupRef}>
            <primitive object={gltf.scene}/>
        </group>
    );
}

function LoadingTable() {
    return (
        <mesh rotation={[0.35, 0.7, 0]}>
            <boxGeometry args={[2.6, 0.18, 1.5]}/>
            <meshStandardMaterial color="#254734" roughness={0.8}/>
        </mesh>
    );
}

export default function PokerScene() {
    return (
        <div className="poker-scene" aria-label="3D poker table scene">
            <Canvas shadows camera={{position: [4, 2.5, 4], fov: 40}}>
                <color attach="background" args={["#09120f"]}/>
                <ambientLight intensity={0.65}/>
                <directionalLight position={[4, 6, 4]} intensity={2.6} castShadow/>
                <spotLight position={[-4, 4, -3]} angle={0.45} penumbra={0.5} intensity={1.2}/>
                <Suspense fallback={<LoadingTable/>}>
                    <PokerTableModel/>
                </Suspense>
            </Canvas>
        </div>
    );
}
