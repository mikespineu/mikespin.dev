import type { NextPage } from 'next'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { ColorRepresentation } from 'three'
import { Floor } from '@/components/car/Floor'
import Lights from '@/components/car/Lights'
import CarModel from '@/components/car/CarModel'

type SceneAddonsProps = {
  children?: React.ReactNode
  backgroundColor: ColorRepresentation
  cameraPosition: [number, number, number]

}
const SceneAddons: React.FC<SceneAddonsProps> = ({
  backgroundColor = 'red',
  cameraPosition,
}) => {
  return (
  <>
    <OrbitControls target={[0, 0, 0]} maxPolarAngle={1.45}/>
    <PerspectiveCamera makeDefault position={cameraPosition} fov={35}/>
    <color attach="background" args={[backgroundColor]} />
  </>
  )
  
} 

const R3F: NextPage = () => {
  return (
    <div className="h-screen min-h-screen">
      <Suspense fallback={null}>
        <Canvas shadows>
          <SceneAddons backgroundColor='#000' cameraPosition={[0, 2, 7]} />
          <Lights />
          <Floor/>
          <CarModel />
        </Canvas>
      </Suspense>
    </div>
  )
}

export default R3F
