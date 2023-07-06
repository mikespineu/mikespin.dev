import type { NextPage } from 'next'
import { Canvas, useFrame } from '@react-three/fiber'
import { ReactNode, Suspense, useEffect, useRef, useState } from 'react'
import {
  OrbitControls,
  PerspectiveCamera,
  SoftShadows,
} from '@react-three/drei'
import { Scene } from '@/components/3dViews/displate/Scene'
import { Group, Mesh, Vector3 } from 'three'
import { USDZExporter } from 'three/examples/jsm/exporters/USDZExporter'
import Poster from '@/components/3dViews/displate/Poster'
import ButtonAr from '@/components/dom/displate/ButtonAr'
import Lights from '@/components/3dViews/displate/Lights'
import Wall from '@/components/3dViews/displate/Wall'
import { easing } from 'maath'


const R3F: NextPage = () => {
  const cameraPosition = new Vector3(0, 0.5, 3.5)
  const [blob, setBlob] = useState<Blob | null>(null)
  const fov = 25

  const mesh = useRef<Group | null>(null)

  const createBlob = async (mesh: Mesh | Group) => {
    const exporter = new USDZExporter()
    const arraybuffer = await exporter.parse(mesh)
    setBlob(new Blob([arraybuffer], { type: 'application/octet-stream' }))
  }
  useEffect(() => {
    // no idea when Canvas is ready
    const interval = setInterval(async () => {
      if (!mesh.current) return
      if (!blob) await createBlob(mesh.current)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const posterList = [
    { positionX: 0, positionY: 0.3, positionZ: 0.003, textureId: 1 },
  ]

  return (
    <div className="h-screen min-h-screen">
      <Suspense fallback={null}>
        <Canvas
          shadows
          gl={{ preserveDrawingBuffer: true }}
          eventPrefix="client"
        >
          <SoftShadows samples={32} size={64} focus={0.4} />
          <OrbitControls
            target={[0, 0, 0]}
            maxPolarAngle={1.85}
            minPolarAngle={1.05}
            maxAzimuthAngle={(Math.PI / 180) * 35}
            minAzimuthAngle={(-Math.PI / 180) * 35}
            minDistance={1}
            maxDistance={4}
          />
          <PerspectiveCamera makeDefault position={cameraPosition} fov={fov} />
          <group ref={mesh}>
            {posterList.map(
              ({ positionX, textureId, positionY, positionZ }) => (
                <Poster
                  key={`text-${textureId}`}
                  positionX={positionX}
                  positionY={positionY}
                  positionZ={positionZ}
                  textureId={textureId}
                />
              )
            )}
          </group>
          <Scene position={new Vector3(0, -1, 0.25)} />
          <Wall />
          <Lights />
        </Canvas>
      </Suspense>
      <div className="fixed top-4 right-2">
        <ButtonAr blob={blob} />
      </div>
    </div>
  )
}

export default R3F
