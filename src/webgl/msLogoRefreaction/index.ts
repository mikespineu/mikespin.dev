import {
  Color,
  type ColorRepresentation,
  PerspectiveCamera,
  WebGLRenderer,
} from 'three'
import { gsap } from 'gsap'

import { getDocumentHeight, getDocumentWidth } from '@/utils/viewport'

import SceneManager from './SceneManager'
type SetupPayload = {
  canvas: HTMLCanvasElement
}

const pallet = ['#490a3d', '#bd1550', '#e97f02', '#f8ca00', '#8a9b0f']

const palette = pallet.map((color) => new Color(color as ColorRepresentation))

// Pulls the camera back on narrow screens so the logo keeps a side margin.
function getCameraZ(aspect: number) {
  return Math.max(2.3, 0.2 + 1.24 / aspect)
}

export async function setup({ canvas }: SetupPayload) {
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

  canvas.addEventListener(
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

  function setupRotation({ clientX, clientY }: MouseEvent) {
    const documentWidth = getDocumentWidth()
    const documentHeight = getDocumentHeight()
    const deltaX = (clientX - documentWidth / 2) / documentWidth
    const deltaY = (clientY - documentHeight / 2) / documentHeight
    const factor = 0.3

    gsap.to(scene.getLogo().rotation, {
      x: Math.PI / 2 + deltaY * factor,
      z: -deltaX * factor,
      duration: 3.5,
      ease: 'power2.out',
    })
  }

  window.addEventListener('resize', onWindowResize)

  const render = function () {
    scene.render(renderer, mainCamera)
    scene.update()
    requestAnimationFrame(render)
  }

  render()
}
