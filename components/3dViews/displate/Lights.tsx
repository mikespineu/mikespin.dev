import { Environment } from '@react-three/drei'

export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <spotLight
        intensity={1.0}
        angle={0.3}
        penumbra={0.5}
        position={[3, 3, 5]}
        castShadow
        decay={1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight
        intensity={0.4}
        angle={0.4}
        penumbra={0.5}
        decay={1}
        position={[-2, 2, 3]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Environment preset="apartment" />
    </>
  )
}
