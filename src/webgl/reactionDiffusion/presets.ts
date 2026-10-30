/**
 * Gray-Scott parameter sets (with Karl Sims' diffusion rates 1.0 / 0.5).
 * `hMin` / `hMax` optionally override the line-spacing range.
 */
export const PATTERN_PRESETS = {
  Coral: { feed: 0.0545, kill: 0.062 },
  'Coral (wide range)': { feed: 0.0545, kill: 0.062, hMin: 0.35, hMax: 1.7 },
  Maze: { feed: 0.029, kill: 0.057 },
  Holes: { feed: 0.039, kill: 0.058 },
  Spots: { feed: 0.0367, kill: 0.0649 },
  Worms: { feed: 0.078, kill: 0.061 },
} as const

export type PatternPresetName = keyof typeof PATTERN_PRESETS

export const COLOR_PRESETS = {
  'Ink on paper': { ink: '#262626', paper: '#fbfbfa' },
  Inverted: { ink: '#f2f2f0', paper: '#111111' },
  Blueprint: { ink: '#e8f0ff', paper: '#1d3f8f' },
  Sepia: { ink: '#4a2f1b', paper: '#f1e6d2' },
  'Riso red': { ink: '#e8412c', paper: '#f6f1e7' },
  Phosphor: { ink: '#7dff9b', paper: '#0b1a10' },
} as const

export type ColorPresetName = keyof typeof COLOR_PRESETS
