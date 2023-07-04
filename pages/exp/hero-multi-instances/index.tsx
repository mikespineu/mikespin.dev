import type { NextPage } from 'next'
import { Environment, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useMemo, useRef, useState } from 'react'
import { Color, HexColorString, Mesh, Vector2 } from 'three'
import * as THREE from 'three'
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'
import { OrbitControls } from '@react-three/drei'
import niceColors from 'nice-color-palettes'

import fragmentShader from '../../../webgl/animatedGradients/fragmentShader.glsl'
import vertexShader from '../../../webgl/animatedGradients/vertexShader.glsl'

function Poster({
  index,
  z,
  speed,
  textureId = 1,
}: {
  index: number
  z: number
  speed: number
  textureId: number
}) {
  const meshRef = useRef<Mesh | null>(null)
  const { viewport, camera } = useThree()
  const OFFSET_Y = 0.5
  const SCALE = 3.5
  const { width, height } = viewport.getCurrentViewport(camera, [
    0,
    0,
    -z + OFFSET_Y,
  ])

  const STATIC_RANDOM_Z = Math.random() * Math.PI
  const STATIC_RANDOM_X = Math.random() * Math.PI

  const [data] = useState({
    // Randomly distributing the objects along the vertical
    y: THREE.MathUtils.randFloatSpread(height * 2),
    // This gives us a random value between -1 and 1, we will multiply it with the viewport width
    x: THREE.MathUtils.randFloatSpread(4),
    // How fast objects spin, randFlost gives us a value between min and max, in this case 8 and 12
    spin: THREE.MathUtils.randFloat(1, 4),
    // Some random rotations, Math.PI represents 360 degrees in radian
    rX: STATIC_RANDOM_X,
    rZ: STATIC_RANDOM_Z,
  })
  const texture = useTexture(`/displate/texture_${textureId}.jpg`)
  const backTexture = useTexture(`/displate/back.jpg`)

  useFrame((state, dt) => {
    if (!meshRef.current) return
    // Make the X position responsive, slowly scroll objects up at the Y, distribute it along the Z
    // dt is the delta, the time between this frame and the previous, we can use it to be independent of the screens refresh rate
    // We cap dt at 0.1 because now it can't accumulate while the user changes the tab, it will simply stop
    if (dt < 0.1)
      meshRef.current.position.set(
        index === 0 ? 0 : data.x * width,
        (data.y += dt * speed),
        -z
      )
    // Rotate the object around
    meshRef.current.rotation.set(
      Math.cos((data.rX += dt / data.spin)) / 2,
      Math.sin(index * 1000 + state.clock.elapsedTime / 10) * Math.PI,
      0
    )
    // If they're too far up, set them back to the bottom
    if (data.y > height * (index === 0 ? 4 : 1))
      data.y = -(height * (index === 0 ? 4 : 1))
  })

  return (
    <group ref={meshRef}>
      <mesh
        onClick={() => console.log('textureId', textureId)}
        castShadow
        dispose={null}
      >
        <planeGeometry args={[0.45 * SCALE, 0.675 * SCALE, 30]} />
        <meshStandardMaterial map={texture} roughness={0.2} />
      </mesh>
      <mesh
        onClick={() => console.log('textureId', textureId)}
        rotation={[0, Math.PI, 0]}
        position={[0, 0, 0.001]}
        castShadow
        dispose={null}
      >
        <planeGeometry args={[0.45 * SCALE, 0.675 * SCALE, 30]} />
        <meshStandardMaterial map={backTexture} roughness={0.2} />
      </mesh>
    </group>
  )
}

const BgPlane = () => {
  const selectedPallates = [0]
  const getRandomIndex = (pallates: number[]) =>
    Math.floor((Math.random() * pallates.length) | 0)

  const index = getRandomIndex(selectedPallates)

  const palette: Color[] = niceColors[20].map(
    (color) => new Color(color as HexColorString)
  )

  const palette2: Color[] = [
    new Color('#000000'),
    new Color('#252526'),
    new Color('#2d2d30'),
    new Color('#3e3e42'),
    new Color('#1e1e1e'),
  ]

  const data = useMemo(
    () => ({
      uniforms: {
        time: { value: 1.0 },
        resolution: { value: new Vector2() },
        uColor: { value: palette2 },
      },
      fragmentShader,
      vertexShader,
    }),
    []
  )

  useFrame(() => {
    data.uniforms.time.value += 0.0003
  })

  console.log('palette', palette, index, niceColors)
  return (
    <mesh
      receiveShadow
      rotation={[0, 0, 0]}
      position={[0, 0, -20]}
      dispose={null}
    >
      <planeGeometry args={[100, 100, 500]} />
      <shaderMaterial attach="material" {...data} />
    </mesh>
  )
}

const R3F: NextPage = () => {
  const depth = 8
  const count = 40
  const speed = 0.5
  const easing = (x: number) => Math.sqrt(1 - Math.pow(x - 1, 2))

  return (
    <div className="h-screen min-h-screen">
      <Suspense fallback={null}>
        <Canvas
          className="h-screen min-h-screen"
          gl={{ antialias: true, alpha: true }}
          // dpr={[1, 1.5]}
          shadows
          camera={{
            position: [0, 0, 10],
            fov: 20,
            near: 0.01,
            far: depth + 25,
          }}
        >
          <color attach="background" args={['black']} />
          <spotLight
            position={[10, 20, 10]}
            penumbra={1}
            intensity={3}
            color="white"
          />
          {Array.from(
            { length: count },
            (_, i) => <Poster key={i} index={i} z={Math.round(easing(i / count) * depth)} speed={speed} textureId={i%2 + 1} /> /* prettier-ignore */
          )}
          <BgPlane />
          {/*<OrbitControls />*/}
          <Environment preset="forest" blur={0.5} />
          <EffectComposer multisampling={0}>
            <DepthOfField
              target={[0, 0, 4]}
              focalLength={1.4}
              bokehScale={14}
              height={1200}
            />
          </EffectComposer>
        </Canvas>
      </Suspense>
      <div className="absolute top-[50%] translate-y-[-50%] left-[50px] sm:left-[100px] lg:left-[250px] text-left flex flex-col opacity-75 select-none">
        <h1 className="text-5xl sm:text-7xl lg:text-9xl tracking-widest font-outline-black relative z-10">
          Displate
        </h1>
        <span className="text-5xl sm:text-7xl lg:text-9xl tracking-widest font-outline-white absolute top-0.5 left-0.5 lg:top-1.5 lg:left-1.5">
          Displate
        </span>
        <h2 className="text-white text-lg sm:text-4xl lg:text-5xl">
          Metal Posters
        </h2>
      </div>
    </div>
  )
}

export default R3F
