import type { NextPage } from 'next'
import { Canvas } from '@react-three/fiber'
import {
  Environment,
  MeshTransmissionMaterial,
  OrbitControls,
} from '@react-three/drei'
import { useControls } from 'leva'

const R3F: NextPage = () => {
  const materialProps = useControls({
    transmission: { value: 0.2, min: 0, max: 3, step: 0.01 },
    thickness: { value: 0.2, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0, min: 0, max: 1, step: 0.01 },
    backsideThickness: { value: 0.1, min: 0, max: 1, step: 0.01 },
    chromaticAberration: { value: 0.5, min: 0, max: 200, step: 0.01 },
    anisotropicBlur: { value: 0.5, min: 0, max: 200, step: 0.01 },
    distortion: { value: 0.5, min: 0, max: 200, step: 0.01 },
    distortionScale: { value: 0.5, min: 0, max: 2, step: 0.01 },
    temporalDistortion: { value: 0.5, min: 0, max: 2, step: 0.01 },
  })
  return (
    <div className="fixed h-full w-full">
      <Canvas>
        <OrbitControls />
        <Environment preset={'studio'} background backgroundBlurriness={0.3} />
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[4, 4, 5, 20]} />
          {/*<meshStandardMaterial color="blue" />*/}
          <MeshTransmissionMaterial {...materialProps} />
        </mesh>
      </Canvas>
    </div>
  )
}

export default R3F
