import { useRef } from 'react'
import { button, folder, useControls } from 'leva'
import {
  COLOR_PRESETS,
  PATTERN_PRESETS,
  type ColorPresetName,
  type PatternPresetName,
} from './presets'

export type ControlActions = {
  example: () => void
  webcam: () => void
  upload: () => void
  restart: () => void
}

const DEFAULT_STEPS =
  Number(new URLSearchParams(window.location.search).get('steps')) || 24

/**
 * All tweakables live in one Leva panel. Buttons call through a ref so the
 * schema never has to be rebuilt when the callbacks change.
 */
export function useReactionDiffusionControls(actions: ControlActions) {
  const actionsRef = useRef(actions)
  actionsRef.current = actions
  // `set` only exists after the hook returns; presets reach it through this ref.
  const setRef = useRef<((v: Record<string, unknown>) => void) | null>(null)

  const [values, set] = useControls(() => ({
    Source: folder({
      'Example video': button(() => actionsRef.current.example()),
      Webcam: button(() => actionsRef.current.webcam()),
      'Upload video…': button(() => actionsRef.current.upload()),
    }),

    Pattern: folder({
      pattern: {
        label: 'preset',
        value: 'Coral' as PatternPresetName,
        options: Object.keys(PATTERN_PRESETS) as PatternPresetName[],
        onChange: (
          name: PatternPresetName,
          _path: string,
          ctx: { initial: boolean }
        ) => {
          if (ctx.initial || !setRef.current) return
          const p = PATTERN_PRESETS[name]
          setRef.current({
            feed: p.feed,
            kill: p.kill,
            ...('hMin' in p
              ? { hMin: p.hMin, hMax: p.hMax }
              : { hMin: 0.45, hMax: 1.3 }),
          })
          actionsRef.current.restart()
        },
        transient: false,
      },
      feed: { value: 0.0545, min: 0.01, max: 0.1, step: 0.0005 },
      kill: { value: 0.062, min: 0.045, max: 0.07, step: 0.0005 },
      'Restart growth': button(() => actionsRef.current.restart()),
      fillAll: {
        label: 'fill all',
        value: false,
        onChange: (_v: boolean, _p: string, ctx: { initial: boolean }) => {
          if (!ctx.initial) actionsRef.current.restart()
        },
        transient: false,
      },
      paused: false,
      steps: {
        label: 'steps / frame',
        value: DEFAULT_STEPS,
        min: 2,
        max: 60,
        step: 2,
      },
    }),

    'Image mapping': folder(
      {
        hMin: {
          label: 'spacing (shadows)',
          value: 0.45,
          min: 0.3,
          max: 1.2,
          step: 0.01,
        },
        hMax: {
          label: 'spacing (highlights)',
          value: 1.3,
          min: 0.6,
          max: 2.5,
          step: 0.01,
        },
        localContrast: {
          label: 'local contrast',
          value: 3,
          min: 0,
          max: 8,
          step: 0.1,
        },
        lumLow: {
          label: 'black point',
          value: 0.25,
          min: 0,
          max: 0.8,
          step: 0.01,
        },
        lumHigh: {
          label: 'white point',
          value: 0.95,
          min: 0.4,
          max: 1.5,
          step: 0.01,
        },
        gamma: { value: 1, min: 0.3, max: 3, step: 0.05 },
      },
      { collapsed: true }
    ),

    Lines: folder(
      {
        colors: {
          label: 'palette',
          value: 'Ink on paper' as ColorPresetName,
          options: Object.keys(COLOR_PRESETS) as ColorPresetName[],
          onChange: (
            name: ColorPresetName,
            _p: string,
            ctx: { initial: boolean }
          ) => {
            if (ctx.initial || !setRef.current) return
            setRef.current({
              ink: COLOR_PRESETS[name].ink,
              paper: COLOR_PRESETS[name].paper,
            })
          },
          transient: false,
        },
        ink: { label: 'lines', value: '#262626' },
        paper: { label: 'background', value: '#fbfbfa' },
        lineWidth: { label: 'width', value: 1.3, min: 0.5, max: 4, step: 0.1 },
        toneWidth: {
          label: 'extra width in shadows',
          value: 0.6,
          min: 0,
          max: 2,
          step: 0.05,
        },
        threshold: {
          label: 'contour level',
          value: 0.22,
          min: 0.05,
          max: 0.4,
          step: 0.01,
        },
      },
      { collapsed: true }
    ),

    Overlays: folder(
      {
        sourceOpacity: {
          label: 'source video',
          value: 0,
          min: 0,
          max: 1,
          step: 0.01,
        },
        mapOpacity: {
          label: 'spacing map',
          value: 0,
          min: 0,
          max: 1,
          step: 0.01,
        },
      },
      { collapsed: true }
    ),

    Hover: folder(
      {
        hoverEnabled: { label: 'enabled', value: true },
        hoverRadius: {
          label: 'radius (cells)',
          value: 70,
          min: 10,
          max: 250,
          step: 1,
        },
        hoverSoftness: {
          label: 'falloff',
          value: 1.5,
          min: 0.3,
          max: 4,
          step: 0.05,
        },
        lensStrength: {
          label: 'lens',
          value: 0.5,
          min: 0,
          max: 0.95,
          step: 0.01,
        },
        pushStrength: {
          label: 'push',
          value: 0.35,
          min: 0,
          max: 2,
          step: 0.01,
        },
        dragStrength: { label: 'drag', value: 0.5, min: 0, max: 3, step: 0.05 },
      },
      { collapsed: true }
    ),
  }))

  setRef.current = set as (v: Record<string, unknown>) => void
  return values
}

export type ReactionDiffusionSettings = ReturnType<
  typeof useReactionDiffusionControls
>
