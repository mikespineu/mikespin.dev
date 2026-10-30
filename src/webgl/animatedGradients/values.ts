export const numberDefaults = {
  speed: 1,
  scale: 1,
  softness: 0.5,
  relief: 0.6,
  grainAmount: 0.1,
  grainMix: 0.4,
  grainSpeed: 6,
  grainSize: 1,
}

const colorKeys = ['color1', 'color2', 'color3', 'color4', 'color5'] as const

export const valueKeys = [...colorKeys, ...Object.keys(numberDefaults)]

// Invalid or missing params are skipped, so the caller's defaults stay in place.
export function readValues(search: string) {
  const params = new URLSearchParams(search)
  const colors: Partial<Record<(typeof colorKeys)[number], string>> = {}
  const numbers = { ...numberDefaults }

  for (const key of colorKeys) {
    const value = params.get(key)
    if (value && /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) {
      colors[key] = value.startsWith('#') ? value : `#${value}`
    }
  }
  for (const key of Object.keys(numbers) as (keyof typeof numberDefaults)[]) {
    const value = params.get(key)
    if (value !== null && value.trim() !== '' && Number.isFinite(Number(value))) {
      numbers[key] = Number(value)
    }
  }
  return { colors, numbers }
}

export function toSearch(values: Record<string, string | number>) {
  const params = new URLSearchParams()
  for (const key of valueKeys) params.set(key, String(values[key]))
  return params.toString()
}
