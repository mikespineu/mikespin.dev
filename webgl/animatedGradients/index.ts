import { Color, PerspectiveCamera, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import niceColors from 'nice-color-palettes'

import { getDocumentHeight, getDocumentWidth } from '@/utils/utils.client'

import SceneManager from './SceneManager'

type SetupPayload = {
  canvas: HTMLCanvasElement
}

const index = Math.floor((Math.random() * niceColors.length) | 0) // just to get a random color palette
// const index = 24; // 17
console.log('index', index)

const palette = niceColors[index].map((color) => new Color(color))

export function setup({ canvas }: SetupPayload) {
  const scene = new SceneManager({ palette })
  scene.initialize()

  const mainCamera: PerspectiveCamera = new PerspectiveCamera(
    45,
    getDocumentWidth() / getDocumentHeight(),
    0.1,
    1000
  )
  mainCamera.position.set(0, 0, 2.3)
  const renderer: WebGLRenderer = new WebGLRenderer({ antialias: true, canvas })
  const controls = new OrbitControls(mainCamera, renderer.domElement)
  controls.update()

  renderer.setClearColor(new Color(0xffffff))
  renderer.setSize(getDocumentWidth(), getDocumentHeight())

  function onWindowResize() {
    mainCamera.aspect = getDocumentWidth() / getDocumentHeight()
    mainCamera.updateProjectionMatrix()
    renderer.setSize(getDocumentWidth(), getDocumentHeight())
    controls.update()
  }

  window.addEventListener('resize', onWindowResize)

  const render = function () {
    renderer.render(scene, mainCamera)
    scene.update()
    requestAnimationFrame(render)
  }

  render()
}
