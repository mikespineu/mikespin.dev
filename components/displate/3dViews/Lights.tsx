import { Environment } from '@react-three/drei'

export default function Lights() {
  return (
    <>
      <directionalLight
        position={[3, 5, 5]}
        castShadow
        intensity={1}
        shadow-mapSize={2048}
        shadow-bias={-0.004}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-3, 5, 5, -8.5, 0.1, 20]}
        />
      </directionalLight>
      <directionalLight
        position={[-2, 3, 3]}
        castShadow
        intensity={0.6}
        shadow-mapSize={2048}
        shadow-bias={-0.004}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-2, 3, 3, -8.5, 0.1, 20]}
        />
      </directionalLight>
      <Environment preset="studio" />
    </>
  )
}
