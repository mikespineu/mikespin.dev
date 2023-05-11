import type { NextPage } from 'next'
import { Canvas, ThreeElements, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import {
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
  Environment,
  AccumulativeShadows,
  RandomizedLight,
  useTexture,
  Decal,
  Html,
} from '@react-three/drei'
import { ColorRepresentation, Mesh, Vector3 } from 'three'
import { USDZExporter } from 'three/examples/jsm/exporters/USDZExporter'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'
import { easing } from 'maath'

const createBlob = async (mesh) => {
  const exporter = new USDZExporter()
  const arraybuffer = await exporter.parse(mesh.current)
  const blob = new Blob([arraybuffer], { type: 'application/octet-stream' })
  const link = document.getElementById('link') as HTMLLinkElement
  if (link) {
    link.href = URL.createObjectURL(blob)
    console.log()
  }
}

function Poster({
  positionX,
  textureId,
}: {
  positionX: number
  textureId: number
}) {
  const mesh = useRef<Mesh>(null!)

  const texture = useTexture(`/texture_${textureId}.jpg`, () => {
    setTimeout(() => {
      createBlob(mesh)
    }, 500)
  })

  useEffect(() => {
    createBlob(mesh)
  }, [])

  return (
    <mesh ref={mesh} castShadow dispose={null} position={[positionX, 0, 0]}>
      <boxGeometry args={[0.45, 0.675, 0.01, 30]} />
      <meshStandardMaterial />
      <Decal rotation={[0, 0, 0]} scale={[0.45, 0.675, 0.01]}>
        <meshStandardMaterial map={texture} />
      </Decal>
    </mesh>
  )
}

function Backdrop() {
  const shadows = useRef()

  useFrame((state, delta) => {
    if (!shadows.current) return
    return easing.dampC(
      shadows.current.getMesh().material.color,
      state.selectedColor,
      0.25,
      delta
    )
  })

  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.85}
      scale={10}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.1]}
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

function CameraRig({ children }: { children: React.ReactNode }) {
  const group = useRef()

  useFrame((state, delta) => {
    // if (!group.current) return
    // easing.damp3(state.camera.position, [0, 0, 2], 0.25, delta)
    // easing.dampE(
    //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //   group.current.rotation,
    //   [state.pointer.y / 10, -state.pointer.x / 5, 0],
    //   0.25,
    //   delta
    // )
  })
  return <group ref={group}>{children}</group>
}

useGLTF.preload('/displate.glb')

const R3F: NextPage = () => {
  const position = new Vector3(0, 0, 2.5)
  const fov = 25

  return (
    <div className="h-screen min-h-screen" suppressHydrationWarning={true}>
      <Suspense fallback={null}>
        <Canvas
          shadows
          gl={{ preserveDrawingBuffer: true }}
          eventPrefix="client"
        >
          <OrbitControls target={[0, 0, 0]} maxPolarAngle={1.45} />
          <PerspectiveCamera makeDefault position={position} fov={fov} />
          <ambientLight intensity={0.5} />
          <Environment preset="city" />
          <CameraRig>
            <Backdrop />
            <group>
              <Poster positionX={-0.3} textureId={1} />
              <Poster positionX={0.3} textureId={2} />
            </group>
          </CameraRig>
        </Canvas>
      </Suspense>
      <a
        className="px-2 bg-slate-200 z-10 rounded-md fixed top-2 right-2"
        id="link"
        rel="ar"
        href=""
        download="asset.usdz"
      >
        View in AR
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/arkit.png" alt="ARKit" className="w-4 h-4 ml-1 hidden" />
      </a>
    </div>
  )
}

export default R3F
