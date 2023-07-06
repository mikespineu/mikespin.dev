import { Environment } from '@react-three/drei'

export default function Lights() {
  return (
    <>
      {/*<ambientLight intensity={0.1} />*/}
      {/*<spotLight*/}
      {/*  intensity={1.0}*/}
      {/*  angle={0.3}*/}
      {/*  penumbra={0.5}*/}
      {/*  position={[3, 5, 5]}*/}
      {/*  castShadow*/}
      {/*  decay={1}*/}
      {/*  shadow-mapSize-width={2048}*/}
      {/*  shadow-mapSize-height={2048}*/}
      {/*/>*/}
      {/*<spotLight*/}
      {/*  intensity={0.2}*/}
      {/*  angle={0.4}*/}
      {/*  penumbra={0.5}*/}
      {/*  decay={1}*/}
      {/*  position={[-2, 3, 3]}*/}
      {/*  castShadow*/}
      {/*  shadow-mapSize-width={2048}*/}
      {/*  shadow-mapSize-height={2048}*/}
      {/*/>*/}
      <directionalLight
        position={[3, 5, 5]}
        castShadow
        intensity={2.5}
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
      <Environment preset="apartment" />
    </>
  )
}
