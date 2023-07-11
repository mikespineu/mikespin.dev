import { useTexture } from '@react-three/drei'
import { useRef } from 'react'
import { Mesh, Vector3 } from 'three'
import useConfigurationState from '@/components/displate/state/configurationState'

interface Props {
  positionX: number
  positionY: number
  positionZ: number
  textureId: number
}
export default function Poster({
  positionX,
  positionY,
  textureId,
  positionZ,
}: Props) {
  const meshRef = useRef<Mesh | null>(null)
  const { finish } = useConfigurationState((state) => state)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const texture = useTexture(`/displate/texture_${textureId}.jpg`)
  const backTexture = useTexture(`/displate/back.jpg`)

  return (
    <group
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ref={meshRef}
      position={new Vector3(positionX, positionY, positionZ)}
    >
      <mesh castShadow dispose={null}>
        <planeGeometry args={[0.45, 0.675, 30]} />
        <meshStandardMaterial
          map={texture}
          roughness={finish ? 0.1 : 0.95}
          metalness={finish ? 0.2 : 0}
          envMapIntensity={0.2}
        />
      </mesh>
      <mesh
        rotation={[0, Math.PI, 0]}
        position={[0, 0, 0.001]}
        castShadow
        dispose={null}
      >
        <planeGeometry args={[0.45, 0.675, 30]} />
        <meshStandardMaterial map={backTexture} roughness={0.2} />
      </mesh>
    </group>
  )
}
