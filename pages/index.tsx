import type { NextPage } from 'next'
import { FC, Suspense, useRef } from 'react'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import {
  MeshReflectorMaterial,
  OrbitControls,
  PerspectiveCamera,
  Text,
} from '@react-three/drei'
import { Mesh, TextureLoader, Vector2 } from 'three'

const textProps = {
  fontSize: 3.9,
  font: 'http://fonts.gstatic.com/s/modak/v5/EJRYQgs1XtIEskMA-hI.woff',
}

function Mirrors() {
  // const [roughness, normal] = useLoader(TextureLoader, [
  //   '/car/textures/terrain-roughness.jpg',
  //   '/car/textures/terrain-normal.jpg',
  // ])
  //
  // useFrame(() => {
  //   if (ref.current) {
  //     ref.current.rotation.y += 0.001
  //     ref.current.rotation.z += -0.01
  //   }
  // })

  return null
}

const Title: FC = () => {
  return (
    <Text
      position={[0, 1, 0]}
      material-toneMapped={false}
      material-color="#FFFFFF"
      fillOpacity={0.9}
      {...textProps}
    >
      MIKESPIN
    </Text>
  )
}

const Home: NextPage = () => {
  return (
    <div className="h-screen min-h-screen">
      <Suspense fallback={null}>
        <Canvas shadows={true} camera={{ fov: 20 }}>
          <OrbitControls target={[0, 0, 0]} maxPolarAngle={1.45} />
          <PerspectiveCamera makeDefault position={[0, 2, 7]} fov={35} />
          <color attach="background" args={['#000']} />
          <Mirrors />
          <Title />
          <ambientLight intensity={0.4} />
        </Canvas>
      </Suspense>
      <a
        className="absolute bottom-1 md:bottom-5 right-8 md:right-16"
        href="mailto:michalkrecisz@yahoo.com"
      >
        michalkrecisz@yahoo.com
      </a>
    </div>
  )
}

export default Home
