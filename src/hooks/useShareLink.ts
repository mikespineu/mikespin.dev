import { useCallback, useState } from 'react'

type Value = string | number | boolean
type Values = Record<string, Value>

// Missing or invalid params are skipped, so the defaults stay in place.
export function readSearchValues<T extends Values>(
  search: string,
  defaults: T
): T {
  const params = new URLSearchParams(search)
  const values: Values = { ...defaults }

  for (const [key, fallback] of Object.entries(defaults)) {
    const raw = params.get(key)
    if (raw === null || raw.trim() === '') continue
    if (typeof fallback === 'number') {
      if (Number.isFinite(Number(raw))) values[key] = Number(raw)
    } else if (typeof fallback === 'boolean') {
      if (raw === 'true' || raw === 'false') values[key] = raw === 'true'
    } else if (!fallback.startsWith('#')) {
      values[key] = raw
    } else if (/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw)) {
      values[key] = raw.startsWith('#') ? raw : `#${raw}`
    }
  }
  return values as T
}

/**
 * Settings in the URL: `initial` is `defaults` overridden by the query string,
 * `copyLink` puts a link with the given values on the clipboard, `getLink` and
 * `copy` are its parts for custom snippets. The keys of
 * `defaults` decide what gets shared; `defaults` should be module-level.
 */
export function useShareLink<T extends Values>(defaults: T) {
  const [initial] = useState(() =>
    readSearchValues(
      typeof window === 'undefined' ? '' : window.location.search,
      defaults
    )
  )
  const [status, setStatus] = useState('')

  const getLink = useCallback(
    (values: Record<string, unknown>) => {
      const params = new URLSearchParams()
      for (const key of Object.keys(defaults)) {
        params.set(key, String(values[key]))
      }
      return `${window.location.origin}${window.location.pathname}?${params}`
    },
    [defaults]
  )

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(
      () => setStatus('Copied'),
      () => setStatus('Copy failed')
    )
  }, [])

  const copyLink = useCallback(
    (values: Record<string, unknown>) => copy(getLink(values)),
    [copy, getLink]
  )

  return { initial, getLink, copy, copyLink, status }
}
