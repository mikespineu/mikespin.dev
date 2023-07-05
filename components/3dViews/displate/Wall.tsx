import { Color, Vector2, Vector3 } from 'three'

export default function Wall({
  position = new Vector3(0, 0, -0.005),
}: {
  position?: Vector3
}) {
  const size: Vector2 = new Vector2(10, 5)
  const color: Color = new Color('#a3b8a7')
  return (
    <mesh receiveShadow={true} position={position}>
      <planeGeometry args={[size.x, size.y, 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}
