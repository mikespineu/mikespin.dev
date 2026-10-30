import {
  Color,
  type ColorRepresentation,
  MathUtils,
  PerspectiveCamera,
  WebGLRenderer,
} from 'three'
import { gsap } from 'gsap'

import { getDocumentHeight, getDocumentWidth } from '@/utils/viewport'

import SceneManager from './SceneManager'
type SetupPayload = {
  canvas: HTMLCanvasElement
  anchor: HTMLElement
}

const pallet = ['#490a3d', '#bd1550', '#e97f02', '#f8ca00', '#8a9b0f']

const palette = pallet.map((color) => new Color(color as ColorRepresentation))

// Degrees of device tilt for the full effect, and that effect's size.
const MAX_TILT = 30
const TILT_STRENGTH = 0.25

// Pulls the camera back on narrow screens so the logo keeps a side margin.
function getCameraZ(aspect: number) {
  return Math.max(2.3, 0.2 + 1.24 / aspect)
}

export async function setup({ canvas, anchor }: SetupPayload) {
  const scene = new SceneManager({ palette })
  await scene.initialize()

  const mainCamera: PerspectiveCamera = new PerspectiveCamera(
    25,
    getDocumentWidth() / getDocumentHeight(),
    0.1,
    1000
  )
  mainCamera.position.set(0, 0, getCameraZ(mainCamera.aspect))
  const renderer: WebGLRenderer = new WebGLRenderer({ antialias: true, canvas })
  // const controls = new OrbitControls( mainCamera, renderer.domElement );
  // controls.update();

  renderer.setClearColor(new Color(0xffffff))
  renderer.setSize(getDocumentWidth(), getDocumentHeight())
  renderer.setPixelRatio(window.devicePixelRatio)

  // On window because the HTML layer above the canvas takes the pointer events.
  window.addEventListener(
    'mousemove',
    (e) => {
      setupRotation(e)
    },
    false
  )

  function onWindowResize() {
    mainCamera.aspect = getDocumentWidth() / getDocumentHeight()
    mainCamera.position.z = getCameraZ(mainCamera.aspect)
    mainCamera.updateProjectionMatrix()
    renderer.setSize(getDocumentWidth(), getDocumentHeight())
  }

  function rotateLogo(deltaX: number, deltaY: number) {
    const factor = 0.3

    gsap.to(scene.getLogo().rotation, {
      x: Math.PI / 2 + deltaY * factor,
      z: -deltaX * factor,
      duration: 3.5,
      ease: 'power2.out',
      overwrite: true,
    })
  }

  // Measured from the logo, not the viewport, so it rests with the cursor on it.
  function setupRotation({ clientX, clientY }: MouseEvent) {
    const { left, top, width, height } = anchor.getBoundingClientRect()
    rotateLogo(
      (clientX - (left + width / 2)) / getDocumentWidth(),
      (clientY - (top + height / 2)) / getDocumentHeight()
    )
  }

  // The first reading is the rest pose, so any holding angle starts level.
  let restTilt: { beta: number; gamma: number } | null = null

  function onDeviceTilt({ beta, gamma }: DeviceOrientationEvent) {
    if (beta === null || gamma === null) return
    restTilt ??= { beta, gamma }
    rotateLogo(
      MathUtils.clamp((gamma - restTilt.gamma) / MAX_TILT, -1, 1) * TILT_STRENGTH,
      MathUtils.clamp((beta - restTilt.beta) / MAX_TILT, -1, 1) * TILT_STRENGTH
    )
  }

  if (window.matchMedia('(hover: none)').matches) {
    const { requestPermission } = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<PermissionState>
    }
    if (requestPermission) {
      // iOS only grants motion access from inside a user gesture.
      window.addEventListener(
        'touchend',
        () => {
          requestPermission.call(DeviceOrientationEvent).then((state) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', onDeviceTilt)
            }
          })
        },
        { once: true }
      )
    } else {
      window.addEventListener('deviceorientation', onDeviceTilt)
    }
  }

  let jump: gsap.core.Timeline | null = null

  function jumpAndSpin() {
    if (jump?.isActive()) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    jump = gsap
      .timeline()
      .to(scene.logoJump, { lift: 0.3, duration: 0.45, ease: 'power3.out' })
      .to(scene.logoJump, { lift: 0, duration: 0.85, ease: 'bounce.out' })
      .to(
        scene.logoRig.rotation,
        { y: Math.PI * 4, duration: 1.2, ease: 'power2.inOut' },
        0
      )
      .set(scene.logoRig.rotation, { y: 0 })
  }

  anchor.addEventListener('click', jumpAndSpin)

  function scaleLogo(scale: number, ease: string) {
    if (!window.matchMedia('(hover: hover)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.to(scene.logoRig.scale, {
      x: scale,
      y: scale,
      z: scale,
      duration: 0.5,
      ease,
      overwrite: true,
    })
  }

  // A springy swell hints that the logo reacts to a click.
  anchor.addEventListener('mouseenter', () => scaleLogo(1.08, 'back.out(3)'))
  anchor.addEventListener('mouseleave', () => scaleLogo(1, 'power2.out'))

  window.addEventListener('resize', onWindowResize)

  // Read every frame so the logo follows resizes, scrolling and late font swaps.
  function fitLogoToAnchor() {
    const canvasRect = canvas.getBoundingClientRect()
    const anchorRect = anchor.getBoundingClientRect()
    const distance = mainCamera.position.z - scene.getLogoDepth()
    const visibleHeight =
      2 * distance * Math.tan(MathUtils.degToRad(mainCamera.fov / 2))
    const worldPerPixel = visibleHeight / canvasRect.height
    const centerX = anchorRect.left + anchorRect.width / 2 - canvasRect.left
    const centerY = anchorRect.top + anchorRect.height / 2 - canvasRect.top

    scene.fitLogo(
      (centerX - canvasRect.width / 2) * worldPerPixel,
      (canvasRect.height / 2 - centerY) * worldPerPixel,
      anchorRect.width * worldPerPixel
    )
  }

  const render = function () {
    fitLogoToAnchor()
    scene.render(renderer, mainCamera)
    // Wait for the logo so the background and logo fade in as one.
    if (scene.getLogo().isMesh) canvas.style.opacity = '1'
    scene.update()
    requestAnimationFrame(render)
  }

  render()
}
