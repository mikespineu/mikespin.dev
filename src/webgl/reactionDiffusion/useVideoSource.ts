import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three/webgpu'

export type SourceMode = 'example' | 'webcam' | 'file'

export type VideoSource = {
  mode: SourceMode
  texture: THREE.VideoTexture
  width: number
  height: number
  /** Webcam feeds are mirrored so the effect behaves like a mirror. */
  mirrored: boolean
}

type Active = VideoSource & {
  el: HTMLVideoElement
  stream?: MediaStream
  objectUrl?: string
}

function createVideoElement() {
  const el = document.createElement('video')
  el.muted = true
  el.loop = true
  el.playsInline = true
  el.crossOrigin = 'anonymous'
  el.setAttribute('playsinline', '')
  el.setAttribute('aria-hidden', 'true')
  // Kept in the DOM (but invisible): some browsers stop decoding frames for
  // detached video elements, which would freeze the effect.
  Object.assign(el.style, {
    position: 'fixed',
    width: '1px',
    height: '1px',
    opacity: '0',
    pointerEvents: 'none',
    left: '0',
    top: '0',
  })
  document.body.appendChild(el)
  return el
}

function release(active: Active | null) {
  if (!active) return
  active.texture.dispose()
  active.stream?.getTracks().forEach((t) => t.stop())
  if (active.objectUrl) URL.revokeObjectURL(active.objectUrl)
  active.el.pause()
  active.el.srcObject = null
  active.el.removeAttribute('src')
  active.el.remove()
}

async function waitForFrames(el: HTMLVideoElement) {
  if (el.readyState < HTMLMediaElement.HAVE_METADATA) {
    await new Promise<void>((resolve, reject) => {
      el.addEventListener('loadedmetadata', () => resolve(), { once: true })
      el.addEventListener(
        'error',
        () => reject(new Error('Could not load the video')),
        {
          once: true,
        }
      )
    })
  }
  await el.play()
}

function describeCameraError(e: unknown) {
  if (e instanceof DOMException) {
    if (e.name === 'NotAllowedError')
      return 'Camera access was blocked. Allow it in the browser’s site settings and try again.'
    if (e.name === 'NotFoundError') return 'No camera found.'
    if (e.name === 'NotReadableError')
      return 'The camera is in use by another app.'
  }
  if (!window.isSecureContext) return 'The webcam needs HTTPS (or localhost).'
  return e instanceof Error ? e.message : 'Could not open the webcam.'
}

/**
 * Owns the <video> element feeding the simulation: the bundled example clip,
 * the webcam, or a video file the visitor picks. Switching sources (or leaving
 * the page) stops the camera and frees the previous texture.
 */
/** `examples` should be a stable (module-level) array: it is an effect dependency. */
export function useVideoSource(
  examples: readonly { url: string; type: string }[]
) {
  const [source, setSource] = useState<VideoSource | null>(null)
  const [error, setError] = useState<string | null>(null)
  const active = useRef<Active | null>(null)
  // Bumped on every switch so a slow, superseded request can't win the race.
  const request = useRef(0)

  const activate = useCallback(
    async (
      mode: SourceMode,
      setup: (
        el: HTMLVideoElement
      ) => Promise<Partial<Active>> | Partial<Active>
    ) => {
      const id = ++request.current
      const el = createVideoElement()
      let extra: Partial<Active> = {}
      const discard = () => {
        extra.stream?.getTracks().forEach((t) => t.stop())
        if (extra.objectUrl) URL.revokeObjectURL(extra.objectUrl)
        el.pause()
        el.srcObject = null
        el.remove()
      }
      try {
        extra = await setup(el)
        await waitForFrames(el)
      } catch (e) {
        discard()
        if (id === request.current) {
          setError(
            mode === 'webcam'
              ? describeCameraError(e)
              : 'Could not play this video.'
          )
        }
        return false
      }
      if (id !== request.current) {
        discard()
        return false
      }
      const texture = new THREE.VideoTexture(el)
      texture.colorSpace = THREE.SRGBColorSpace
      const next: Active = {
        mode,
        el,
        texture,
        width: el.videoWidth || 9,
        height: el.videoHeight || 16,
        mirrored: mode === 'webcam',
        ...extra,
      }
      release(active.current)
      active.current = next
      setError(null)
      setSource({
        mode,
        texture,
        width: next.width,
        height: next.height,
        mirrored: next.mirrored,
      })
      return true
    },
    []
  )

  const loadExample = useCallback(
    () =>
      activate('example', (el) => {
        const playable =
          examples.find((s) => el.canPlayType(s.type) !== '') ?? examples[0]
        el.src = playable.url
        return {}
      }),
    [activate, examples]
  )

  const startWebcam = useCallback(
    () =>
      activate('webcam', async (el) => {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error(
            window.isSecureContext
              ? 'This browser has no webcam support.'
              : 'The webcam needs HTTPS (or localhost).'
          )
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        })
        el.srcObject = stream
        return { stream }
      }),
    [activate]
  )

  const loadFile = useCallback(
    (file: File) =>
      activate('file', (el) => {
        const objectUrl = URL.createObjectURL(file)
        el.src = objectUrl
        return { objectUrl }
      }),
    [activate]
  )

  useEffect(() => {
    void loadExample()
    return () => {
      request.current++
      release(active.current)
      active.current = null
    }
  }, [loadExample])

  return { source, error, loadExample, startWebcam, loadFile }
}
