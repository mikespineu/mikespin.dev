import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '@react-three/fiber'

export const Route = createFileRoute('/exp/react-three-fiber')({
  component: R3F,
})

function R3F() {
  return (
    <Canvas>
      <ambientLight intensity={0.1} />
      <directionalLight color="red" position={[0, 0, 5]} />
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial />
      </mesh>
    </Canvas>
  )
}
