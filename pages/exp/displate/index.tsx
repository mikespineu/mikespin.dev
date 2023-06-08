import type { NextPage } from 'next'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  AccumulativeShadows,
  RandomizedLight,
} from '@react-three/drei'
import { Group, Mesh, Vector3 } from 'three'
import { USDZExporter } from 'three/examples/jsm/exporters/USDZExporter'
import Poster from '@/components/3dViews/displate/Poster'
import ButtonAr from '@/components/dom/displate/ButtonAr'
import Room from '@/components/3dViews/displate/Room'

function Backdrop() {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const shadows = useRef<typeof AccumulativeShadows>(null!)

  // useFrame((state, delta) => {
  //   if (!shadows.current) return
  //   return easing.dampC(
  //     shadows.current.getMesh().material.color,
  //     state.selectedColor,
  //     0.25,
  //     delta
  //   )
  // })

  return (
    <AccumulativeShadows
      temporal
      frames={40}
      alphaTest={0.85}
      scale={10}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.03]}
      color="#fff"
      opacity={0.5}
    >
      <RandomizedLight
        amount={4}
        radius={9}
        intensity={0.55}
        ambient={0.25}
        position={[5, 5, -10]}
      />
      <RandomizedLight
        amount={4}
        radius={5}
        intensity={0.25}
        ambient={0.55}
        position={[-5, 5, -9]}
      />
    </AccumulativeShadows>
  )
}

const R3F: NextPage = () => {
  const position = new Vector3(0, 0, 2.5)
  const fov = 25

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const mesh = useRef<Group>(null!)

  const createBlob = async (mesh: Mesh | Group) => {
    const exporter = new USDZExporter()
    const arraybuffer = await exporter.parse(mesh)
    const blob = new Blob([arraybuffer], { type: 'application/octet-stream' })
    const link = document.getElementById('link') as HTMLLinkElement
    if (link) {
      link.href = URL.createObjectURL(blob)
    }
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!mesh.current) return
      await createBlob(mesh.current)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const posterList = [
    { positionX: 0.3, textureId: 1 },
    { positionX: -0.3, textureId: 2 },
  ]

  return (
    <div className="h-screen min-h-screen" suppressHydrationWarning={true}>
      <Suspense fallback={null}>
        <Canvas
          shadows
          gl={{ preserveDrawingBuffer: true }}
          eventPrefix="client"
        >
          <OrbitControls
            target={[0, 0, 0]}
            maxPolarAngle={1.85}
            minPolarAngle={1.05}
            maxAzimuthAngle={(Math.PI / 180) * 85}
            minAzimuthAngle={(-Math.PI / 180) * 85}
          />
          <PerspectiveCamera makeDefault position={position} fov={fov} />
          <ambientLight intensity={1} />

          {/*<Environment preset="city" />*/}

          <Backdrop />
          <group ref={mesh}>
            {posterList.map(({ positionX, textureId }) => (
              <Poster
                key={`text-${textureId}`}
                positionX={positionX}
                textureId={textureId}
              />
            ))}
          </group>
          <Room />
        </Canvas>
      </Suspense>
      <div className="fixed top-2 right-2">
        <ButtonAr />
      </div>
    </div>
  )
}

export default R3F
