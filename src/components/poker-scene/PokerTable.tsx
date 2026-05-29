import {useLayoutEffect, useRef} from "react";
import {useLoader} from "@react-three/fiber";
import {Box3, Mesh, Vector3, type Group} from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import pokerTableUrl from "../../assets/poker_table.glb";

export default function PokerTable() {
    const gltf = useLoader(GLTFLoader, pokerTableUrl);
    const groupRef = useRef<Group>(null);

    useLayoutEffect(() => {
        const group = groupRef.current;
        if (!group) return;

        group.position.set(0, 0, 0);
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
