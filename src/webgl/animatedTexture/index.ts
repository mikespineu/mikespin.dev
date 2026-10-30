import { Color, PerspectiveCamera, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import niceColors from 'nice-color-palettes'

import { getDocumentHeight, getDocumentWidth } from '@/utils/utils.client'

import SceneManager from './SceneManager'

type SetupPayload = {
  canvas: HTMLCanvasElement
}

const selectedPallates = [6, 93, 73, 27, 29, 15, 36, 40]
const getRandomIndex = (pallates: number[]) =>
  Math.floor((Math.random() * pallates.length) | 0)

const index = getRandomIndex(selectedPallates)
const palette: Color[] = niceColors[index].map((color) => new Color(color))
let SceneManagerInstance: SceneManager

export function setup({ canvas }: SetupPayload) {
  SceneManagerInstance = new SceneManager({ palette })
  SceneManagerInstance.initialize()

  const mainCamera: PerspectiveCamera = new PerspectiveCamera(
    45,
    getDocumentWidth() / getDocumentHeight(),
    0.1,
    1000
  )
  mainCamera.position.set(0, 0, 10)
  const renderer: WebGLRenderer = new WebGLRenderer({ antialias: true, canvas })
  const controls = new OrbitControls(mainCamera, renderer.domElement)
  controls.update()

  renderer.setClearColor(new Color(0x171616))
  renderer.setSize(getDocumentWidth(), getDocumentHeight())
  renderer.setPixelRatio(3)

  function onWindowResize() {
    mainCamera.aspect = getDocumentWidth() / getDocumentHeight()
    mainCamera.updateProjectionMatrix()
    renderer.setSize(getDocumentWidth(), getDocumentHeight())
    controls.update()
  }

  window.addEventListener('resize', onWindowResize)

  const render = function () {
    renderer.render(SceneManagerInstance, mainCamera)
    SceneManagerInstance.update()
    requestAnimationFrame(render)
  }

  render()
}

export function changeGradient() {
  const newIndex = getRandomIndex(selectedPallates)
  const palette: Color[] = niceColors[newIndex].map((color) => new Color(color))
  SceneManagerInstance.setPalette(palette)
}
