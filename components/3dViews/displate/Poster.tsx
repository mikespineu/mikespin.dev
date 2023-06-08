import { useTexture } from '@react-three/drei'
import { useRef } from 'react'
import { Mesh } from 'three'

interface Props {
  positionX: number
  textureId: number
}
export default function Poster({ positionX, textureId }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const mesh = useRef<Mesh>(null!)

  const texture = useTexture(`/displate/texture_${textureId}.jpg`)

  return (
    <mesh ref={mesh} castShadow dispose={null} position={[positionX, 0, 0]}>
      <boxGeometry args={[0.45, 0.675, 0.01, 30]} />
      <meshStandardMaterial map={texture} />
      {/* <meshStandardMaterial />
        <Decal rotation={[0, 0, 0]} scale={[0.45, 0.675, 0.01]}>
        </Decal> */}
    </mesh>
  )
}
