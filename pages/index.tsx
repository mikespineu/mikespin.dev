import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { Canvas, useThree, useFrame, ThreeElements } from '@react-three/fiber'
import * as THREE from 'three'
import {MeshProps} from "@react-three/fiber/dist/declarations/src/three-types";

interface BoxType extends MeshProps {
    speed: number
}

function Box(props: BoxType) {
    const mesh = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    useFrame((state, delta) => {
        mesh.current.rotation.x += props.speed
        mesh.current.rotation.y += props.speed
    })
    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={( event) => setHover(false)}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}

const Home: NextPage = () => {
  return (
    <div className='m-0 p-0 bg-neutral-900 min-h-screen w-full flex justify-center items-center'>
      <main className='text-center'>
        <Image src="/ms-logo.svg" alt="Vercel Logo" width={150} height={150} />
        <h1 className='text-xl text-slate-100'>mikespin.dev !</h1>
          <div style={{ width: "50vw", height: "50vh" }}>
        <Canvas camera={{ fov: 30, position: [0, 0, 20]}}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Box position={[-2.2, 0, 0]} speed={0.01} />
            <Box position={[2.2, 0, 0]} speed={0.02} />
        </Canvas>
          </div>
      </main>
    </div>
  )
}

export default Home
