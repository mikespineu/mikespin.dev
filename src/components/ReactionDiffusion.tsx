import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Leva } from 'leva'
import * as THREE from 'three/webgpu'
import {
  createSimulation,
  type Simulation,
} from '@/webgl/reactionDiffusion/simulation'
import {
  useVideoSource,
  type VideoSource,
} from '@/webgl/reactionDiffusion/useVideoSource'
import {
  useReactionDiffusionControls,
  type ReactionDiffusionSettings,
} from '@/webgl/reactionDiffusion/useReactionDiffusionControls'

// Simulation grid, portrait 9:16 like the example clip. More cells = more,
// finer lines: override with ?res=<height>, e.g. ?res=1400 or ?res=720.
const SIM_H = Math.round(
  Number(new URLSearchParams(window.location.search).get('res')) || 1024
)
const SIM_W = Math.round((SIM_H * 9) / 16)
// H.264 for Safari/Chrome, VP9 for browsers built without H.264 (e.g. Chromium).
const EXAMPLE_SOURCES = [
  {
    url: '/video/reaction-diffusion.mp4',
    type: 'video/mp4; codecs="avc1.640028"',
  },
  { url: '/video/reaction-diffusion.webm', type: 'video/webm; codecs="vp9"' },
]

/** Cursor state written by pointer events, read once per frame. */
type Hover = { x: number; y: number; inside: boolean }

function Sim({
  sim,
  settings,
  source,
  resetToken,
  hover,
}: {
  sim: Simulation
  settings: ReactionDiffusionSettings
  source: VideoSource | null
  resetToken: number
  hover: React.RefObject<Hover>
}) {
  const gl = useThree((s) => s.gl) as unknown as THREE.WebGPURenderer
  const needsInit = useRef(true)
  const prevHover = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    needsInit.current = true
  }, [resetToken])

  useEffect(() => {
    if (!source) return
    sim.setSource(source.texture, source.width, source.height)
    sim.uniforms.mirror.value = source.mirrored ? 1 : 0
  }, [sim, source])

  useEffect(() => {
    const u = sim.uniforms
    u.feed.value = settings.feed
    u.kill.value = settings.kill
    u.hMin.value = settings.hMin
    u.hMax.value = settings.hMax
    u.localContrast.value = settings.localContrast
    u.lumLow.value = settings.lumLow
    u.lumHigh.value = settings.lumHigh
    u.gamma.value = settings.gamma
    u.lineWidth.value = settings.lineWidth
    u.toneWidth.value = settings.toneWidth
    u.threshold.value = settings.threshold
    u.ink.value.set(settings.ink)
    u.paper.value.set(settings.paper)
    u.sourceOpacity.value = settings.sourceOpacity
    u.mapOpacity.value = settings.mapOpacity
    u.hoverRadius.value = settings.hoverRadius
    u.hoverSoftness.value = settings.hoverSoftness
    u.lensStrength.value = settings.lensStrength
    u.pushStrength.value = settings.pushStrength
    u.dragStrength.value = settings.dragStrength
    u.seedMode.value = settings.fillAll ? 1 : 0
  }, [sim, settings])

  useFrame((_, delta) => {
    // Hover: position, velocity (cells per sim step) and a smooth fade in/out.
    const u = sim.uniforms
    const hv = hover.current
    const target = settings.hoverEnabled && hv.inside ? 1 : 0
    u.hoverAmount.value +=
      (target - u.hoverAmount.value) * (1 - Math.exp(-delta * 8))
    if (hv.inside) {
      const steps = Math.max(1, settings.steps * 2)
      if (prevHover.current) {
        const vx = (hv.x - prevHover.current.x) / steps
        const vy = (hv.y - prevHover.current.y) / steps
        // light smoothing so jittery mice don't tear the pattern
        u.hoverVel.value.set(
          u.hoverVel.value.x * 0.5 + vx * 0.5,
          u.hoverVel.value.y * 0.5 + vy * 0.5
        )
      }
      prevHover.current = { x: hv.x, y: hv.y }
      u.hoverPos.value.set(hv.x, hv.y)
    } else {
      prevHover.current = null
      u.hoverVel.value.multiplyScalar(0.8)
    }

    if (needsInit.current) {
      gl.compute(sim.init)
      needsInit.current = false
    }
    if (settings.paused) return
    gl.compute(sim.analysis)
    for (let i = 0; i < settings.steps; i++) {
      gl.compute(sim.stepAB)
      gl.compute(sim.stepBA)
    }
  })

  return (
    <mesh material={sim.material} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  )
}

export function ReactionDiffusion() {
  const supported = typeof navigator !== 'undefined' && 'gpu' in navigator
  const sim = useMemo(
    () => (supported ? createSimulation(SIM_W, SIM_H) : null),
    [supported]
  )
  useEffect(() => () => sim?.dispose(), [sim])

  const { source, error, loadExample, startWebcam, loadFile } =
    useVideoSource(EXAMPLE_SOURCES)
  const [resetToken, setResetToken] = useState(0)
  const restart = () => setResetToken((t) => t + 1)
  const fileInput = useRef<HTMLInputElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const hover = useRef<Hover>({ x: -1000, y: -1000, inside: false })

  const settings = useReactionDiffusionControls({
    example: () => void loadExample().then((ok) => ok && restart()),
    webcam: () => void startWebcam().then((ok) => ok && restart()),
    upload: () => fileInput.current?.click(),
    restart,
  })

  // Pointer → cell coordinates: hover always, seeding while a button is held.
  const toCells = (e: React.PointerEvent) => {
    const rect = frameRef.current!.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * SIM_W,
      y: (1 - (e.clientY - rect.top) / rect.height) * SIM_H,
    }
  }
  const setBrush = (e: React.PointerEvent) => {
    const { x, y } = toCells(e)
    sim?.uniforms.brushPos.value.set(x, y)
  }
  const clearBrush = () => sim?.uniforms.brushPos.value.set(-1000, -1000)
  const setHover = (e: React.PointerEvent) => {
    hover.current = { ...toCells(e), inside: true }
  }

  return (
    <div className="relative h-dvh w-full bg-neutral-900 flex items-center justify-center overflow-hidden">
      <Leva titleBar={{ title: 'Reaction–diffusion' }} />

      {sim ? (
        <div
          ref={frameRef}
          data-testid="rd-frame"
          className="relative h-full max-h-dvh aspect-[9/16] max-w-full touch-none cursor-crosshair"
          style={{ background: settings.paper }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            setBrush(e)
          }}
          onPointerEnter={setHover}
          onPointerMove={(e) => {
            setHover(e)
            if (e.buttons) setBrush(e)
          }}
          onPointerLeave={() =>
            (hover.current = { ...hover.current, inside: false })
          }
          onPointerUp={clearBrush}
          onPointerCancel={clearBrush}
        >
          <Canvas
            flat
            dpr={[1, 2]}
            gl={async (props) => {
              const renderer = new THREE.WebGPURenderer(
                props as ConstructorParameters<typeof THREE.WebGPURenderer>[0]
              )
              await renderer.init()
              return renderer
            }}
          >
            <Sim
              sim={sim}
              settings={settings}
              source={source}
              resetToken={resetToken}
              hover={hover}
            />
          </Canvas>
        </div>
      ) : (
        <p className="max-w-sm px-6 text-center text-white/70">
          This experiment needs WebGPU. Try a recent Chrome, Edge or Safari.
        </p>
      )}

      <input
        ref={fileInput}
        type="file"
        accept="video/*"
        className="hidden"
        data-testid="rd-file"
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (file) void loadFile(file).then((ok) => ok && restart())
        }}
      />

      <div className="pointer-events-none fixed bottom-3 left-4 md:bottom-7 md:left-16 flex flex-col gap-1 text-sm text-white">
        <span
          data-testid="rd-source"
          data-mode={source?.mode ?? 'loading'}
          className="opacity-40"
        >
          {source ? `source: ${source.mode}` : 'loading video…'} · click or drag
          to seed
        </span>
        {error && (
          <span role="alert" className="text-red-300">
            {error}
          </span>
        )}
      </div>
    </div>
  )
}
