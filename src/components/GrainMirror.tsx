import { useEffect, useRef } from 'react'
import { button, folder, useControls } from 'leva'
import { useShareLink } from '@/hooks/useShareLink'
import { getRandomPaletteHexes } from '@/webgl/animatedGradients'
import {
  createGrainMirror,
  type GrainMirror as Effect,
} from '@/webgl/grainMirror/createGrainMirror'
import { useVideoSource } from '@/webgl/reactionDiffusion/useVideoSource'

// H.264 for Safari/Chrome, VP9 for browsers built without H.264 (e.g. Chromium).
const EXAMPLE_SOURCES = [
  {
    url: '/video/reaction-diffusion.mp4',
    type: 'video/mp4; codecs="avc1.640028"',
  },
  { url: '/video/reaction-diffusion.webm', type: 'video/webm; codecs="vp9"' },
]

const DEFAULTS = {
  size: 1,
  amount: 0.4,
  match: 0.24,
  character: 0.74,
  mode: 'Live',
  speed: 3,
  blackPoint: 0.22,
  whitePoint: 1,
  blur: 0,
  color1: '#e8ddcb',
  color2: '#cdb380',
  color3: '#036564',
  color4: '#033649',
  color5: '#031634',
  gradientSpeed: 0.4,
  scale: 1.5,
  softness: 0.3,
  relief: 0.95,
}

export function GrainMirror() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const effect = useRef<Effect | null>(null)
  const { source, error, loadExample, startWebcam } =
    useVideoSource(EXAMPLE_SOURCES)
  const actions = useRef({ loadExample, startWebcam })
  actions.current = { loadExample, startWebcam }
  // `set` only exists after the hook returns; buttons reach it through this ref.
  const setRef = useRef<((v: Record<string, unknown>) => void) | null>(null)

  const { initial, copyLink, status } = useShareLink(DEFAULTS)
  // Buttons never rebuild, so they read the latest values through this ref.
  const latest = useRef<Record<string, unknown>>(initial)

  const [controls, set] = useControls(() => {
    const { color1, color2, color3, color4, color5 } = initial
    return {
      Source: folder({
        'Example video': button(() => void actions.current.loadExample()),
        Webcam: button(() => void actions.current.startWebcam()),
        mirror: false,
      }),
      Grain: folder({
        size: { label: 'thickness', value: initial.size, min: 1, max: 16, step: 1 },
        amount: {
          label: 'intensity',
          value: initial.amount,
          min: 0,
          max: 1,
          step: 0.01,
        },
        match: {
          label: 'mask match',
          value: initial.match,
          min: 0,
          max: 1,
          step: 0.01,
        },
        character: {
          label: 'soft → specks',
          value: initial.character,
          min: 0,
          max: 1,
          step: 0.01,
        },
        mode: {
          value: initial.mode === 'Static' ? 'Static' : 'Live',
          options: ['Live', 'Static'],
        },
        speed: {
          label: 'tempo',
          value: initial.speed,
          min: 1,
          max: 30,
          step: 1,
          render: (get) => get('Grain.mode') === 'Live',
        },
      }),
      Mask: folder({
        blackPoint: {
          label: 'black point',
          value: initial.blackPoint,
          min: 0,
          max: 1,
          step: 0.01,
        },
        whitePoint: {
          label: 'white point',
          value: initial.whitePoint,
          min: 0,
          max: 1,
          step: 0.01,
        },
        blur: { value: initial.blur, min: 0, max: 0.1, step: 0.002 },
      }),
      Gradient: folder({
        color1,
        color2,
        color3,
        color4,
        color5,
        gradientSpeed: {
          label: 'gradient speed',
          value: initial.gradientSpeed,
          min: 0,
          max: 5,
          step: 0.1,
        },
        scale: { value: initial.scale, min: 0.2, max: 4, step: 0.1 },
        softness: {
          value: initial.softness,
          min: 0.05,
          max: 1.5,
          step: 0.05,
        },
        relief: { value: initial.relief, min: 0, max: 2, step: 0.05 },
        'Change gradient': button(() => {
          const [c1, c2, c3, c4, c5] = getRandomPaletteHexes()
          setRef.current?.({
            color1: c1,
            color2: c2,
            color3: c3,
            color4: c4,
            color5: c5,
          })
        }),
      }),
      'Copy link': button(() => copyLink(latest.current)),
    }
  })
  latest.current = controls
  setRef.current = set as (v: Record<string, unknown>) => void

  useEffect(() => {
    const instance = createGrainMirror(canvas.current as HTMLCanvasElement)
    effect.current = instance
    return () => {
      effect.current = null
      instance.dispose()
    }
  }, [])

  useEffect(() => {
    if (!source) return
    effect.current?.setVideo(
      source.texture.image as HTMLVideoElement,
      source.width,
      source.height
    )
    set({ mirror: source.mirrored })
  }, [source, set])

  useEffect(() => {
    const {
      color1,
      color2,
      color3,
      color4,
      color5,
      mirror,
      mode,
      gradientSpeed,
      scale,
      softness,
      relief,
    } = controls
    effect.current?.setColors([color1, color2, color3, color4, color5])
    effect.current?.setMirror(mirror)
    effect.current?.setShape({ speed: gradientSpeed, scale, softness, relief })
    effect.current?.setGrain({
      ...controls,
      speed: mode === 'Live' ? controls.speed : 0,
    })
  }, [controls])

  return (
    <>
      <canvas ref={canvas} className="block" data-testid="gm-canvas" />
      <div className="pointer-events-none fixed bottom-3 left-4 md:bottom-7 md:left-16 flex flex-col gap-1 text-sm text-white">
        <span
          data-testid="gm-source"
          data-mode={source?.mode ?? 'loading'}
          className="opacity-40"
        >
          {source ? `source: ${source.mode}` : 'loading video…'}
        </span>
        {status && <span role="status">{status}</span>}
        {error && (
          <span role="alert" className="text-red-300">
            {error}
          </span>
        )}
      </div>
    </>
  )
}
