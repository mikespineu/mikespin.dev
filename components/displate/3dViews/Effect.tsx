import { DepthOfField, EffectComposer } from '@react-three/postprocessing'

export default function Effect() {
  return (
    <EffectComposer>
      <DepthOfField
        target={[0, 0, 3]}
        focalLength={1.4}
        bokehScale={14}
        height={1200}
      />
    </EffectComposer>
  )
}
