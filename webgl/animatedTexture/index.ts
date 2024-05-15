import {
  Color,
  PerspectiveCamera,
  WebGLRenderer,
  MathUtils,
  Vector3,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { getDocumentHeight, getDocumentWidth } from '@/utils/utils.client'

import SceneManager from './SceneManager'
import MIDIController from '@/utils/MidiController'

type SetupPayload = {
  canvas: HTMLCanvasElement
}

const normalizeStep = (min: number, max: number, value: number) => {
  return (value / 127) * (max - min) + min
}

const cameraMinMax = [3, 30]
const isControlsEnabled = true
let SceneManagerInstance: SceneManager
let cameraTargetZ = 10

export function setup({ canvas }: SetupPayload) {
  SceneManagerInstance = new SceneManager()
  SceneManagerInstance.initialize()

  const mainCamera: PerspectiveCamera = new PerspectiveCamera(
    45,
    getDocumentWidth() / getDocumentHeight(),
    0.1,
    1000
  )
  mainCamera.position.set(0, 0, cameraTargetZ)
  const renderer: WebGLRenderer = new WebGLRenderer({ antialias: true, canvas })
  const controls = isControlsEnabled
    ? new OrbitControls(mainCamera, renderer.domElement)
    : null

  renderer.setClearColor(new Color(0x171616))
  renderer.setSize(getDocumentWidth(), getDocumentHeight())
  renderer.setPixelRatio(3)

  function onWindowResize() {
    mainCamera.aspect = getDocumentWidth() / getDocumentHeight()
    mainCamera.updateProjectionMatrix()
    renderer.setSize(getDocumentWidth(), getDocumentHeight())
    if (controls) {
      controls.update()
    }
  }

  window.addEventListener('resize', onWindowResize)

  const render = function () {
    renderer.render(SceneManagerInstance, mainCamera)
    mainCamera.position.z = MathUtils.lerp(
      mainCamera.position.z,
      cameraTargetZ,
      0.5
    )
    SceneManagerInstance.update()
    requestAnimationFrame(render)
  }

  render()

  const midiController = new MIDIController()
  midiController.initialize()
  midiController.setupCallback((controlNumber, value) => {
    console.log(`Control number: ${controlNumber}, Value: ${value}`)
    console.log(mainCamera.position.z)
    switch (controlNumber) {
      case 80:
        cameraTargetZ = normalizeStep(cameraMinMax[0], cameraMinMax[1], value)
        break
      case 81:
        SceneManagerInstance.rotate(
          new Vector3(0, (value / 127) * 2 * Math.PI, 0)
        )
        break
      case 82:
        SceneManagerInstance.setTextureRepeatX(normalizeStep(1, 20, value))
        break
      case 83:
        SceneManagerInstance.setTextureRepeatY(normalizeStep(1, 20, value))
        break
      default:
        break
    }
    // Implementacja specyficzna dla aplikacji
  })
}
