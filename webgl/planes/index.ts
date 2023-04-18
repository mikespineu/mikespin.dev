import { Clock, Color, PerspectiveCamera, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import niceColors from 'nice-color-palettes'

import { getDocumentHeight, getDocumentWidth } from '@/utils/utils.client'

import SceneManager from './SceneManager'

type SetupPayload = {
  canvas: HTMLCanvasElement
}
export function setup({ canvas }: SetupPayload) {
  const scene = new SceneManager()
  scene.initialize()

  const mainCamera: PerspectiveCamera = new PerspectiveCamera(
    30,
    getDocumentWidth() / getDocumentHeight(),
    0.1,
    1000
  )
  mainCamera.position.set(0, 0, 12)
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

  const render = function (t: number) {
    const timeMultiplier = 0.0003;
    renderer.render(scene, mainCamera)
    scene.update(t * timeMultiplier )
    console.log('t', t)
    requestAnimationFrame(render)
  }

  render(0)
}
