import { useTexture } from '@react-three/drei'
interface Props {
  positionX: number
  textureId: number
}
export default function Poster({ positionX, textureId }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const texture = useTexture(`/displate/texture_${textureId}.jpg`)

  return (
    <mesh castShadow dispose={null} position={[positionX, 0, 0]}>
      <boxGeometry args={[0.45, 0.675, 0.001, 30]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}
