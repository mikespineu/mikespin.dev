import { Color, PerspectiveCamera, WebGLRenderer } from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import niceColors from 'nice-color-palettes'

import { getDocumentHeight, getDocumentWidth } from '@/utils/viewport'

import SceneManager from './SceneManager'

type SetupPayload = {
  canvas: HTMLCanvasElement
}

const selectedPallates = [6, 93, 73, 27, 29, 15, 36, 40]
const getRandomIndex = (pallates: number[]) =>
  Math.floor((Math.random() * pallates.length) | 0)

const index = getRandomIndex(selectedPallates)
let palette: Color[] = niceColors[index].map((color) => new Color(color))
let SceneManagerInstance: SceneManager
let renderFrame: () => void

export function setup({ canvas }: SetupPayload) {
  SceneManagerInstance = new SceneManager({ palette })
  SceneManagerInstance.initialize()

  const mainCamera: PerspectiveCamera = new PerspectiveCamera(
    45,
    getDocumentWidth() / getDocumentHeight(),
    0.1,
    1000
  )
  mainCamera.position.set(0, 0, 2.3)
  const renderer: WebGLRenderer = new WebGLRenderer({ antialias: true, canvas })
  // const controls = new OrbitControls(mainCamera, renderer.domElement)
  // controls.update()

  renderer.setClearColor(new Color(0xffffff))
  renderer.setSize(getDocumentWidth(), getDocumentHeight())

  function onWindowResize() {
    mainCamera.aspect = getDocumentWidth() / getDocumentHeight()
    mainCamera.updateProjectionMatrix()
    renderer.setSize(getDocumentWidth(), getDocumentHeight())
    // controls.update()
  }

  window.addEventListener('resize', onWindowResize)

  const render = function () {
    renderer.render(SceneManagerInstance, mainCamera)
    SceneManagerInstance.update()
    requestAnimationFrame(render)
  }

  render()

  renderFrame = () => renderer.render(SceneManagerInstance, mainCamera)
}

export function savePng(canvas: HTMLCanvasElement) {
  // The drawing buffer is cleared after compositing, so draw right before reading it.
  renderFrame()
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'gradient.png'
    link.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}

export function getPaletteHexes() {
  return palette.map((color) => `#${color.getHexString()}`)
}

export function getRandomPaletteHexes() {
  return niceColors[getRandomIndex(selectedPallates)]
}

export function setColors(hexes: string[]) {
  palette = hexes.map((hex) => new Color(hex))
  SceneManagerInstance.setPalette(palette)
}

export function setShape(shape: {
  speed: number
  scale: number
  softness: number
  relief: number
}) {
  SceneManagerInstance.setShape(shape)
}

export function setGrain(grain: {
  amount: number
  mix: number
  size: number
  speed: number
}) {
  SceneManagerInstance.setGrain(grain)
}
