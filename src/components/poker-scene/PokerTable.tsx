export default function PokerTable() {
    return (
        <mesh receiveShadow>
            <boxGeometry args={[7, 0.12, 4]}/>
            <meshStandardMaterial color="#254734" roughness={0.8}/>
        </mesh>
    );
}
