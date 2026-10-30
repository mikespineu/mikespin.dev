import {
  Color,
  LinearFilter,
  Mesh,
  NoColorSpace,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  Vector2,
  VideoTexture,
  WebGLRenderer,
} from 'three'

import { getDocumentHeight, getDocumentWidth } from '@/utils/viewport'
import vertexShader from '@/webgl/animatedGradients/vertexShader.glsl?raw'

import fragmentShader from './fragmentShader.glsl?raw'

export type GrainSettings = {
  size: number
  amount: number
  match: number
  character: number
  blackPoint: number
  whitePoint: number
  blur: number
  speed: number
}

export type GradientShape = {
  speed: number
  scale: number
  softness: number
  relief: number
}

export function createGrainMirror(canvas: HTMLCanvasElement) {
  const scene = new Scene()
  const uniforms = {
    time: { value: 1.0 },
    uColor: { value: [] as Color[] },
    scale: { value: 1 },
    softness: { value: 0.5 },
    relief: { value: 0.6 },
    resolution: { value: new Vector2(1, 1) },
    mask: { value: new Texture() },
    maskAspect: { value: 9 / 16 },
    mirror: { value: 0 },
    maskBlur: { value: 0 },
    blackPoint: { value: 0.15 },
    whitePoint: { value: 0.85 },
    maskMatch: { value: 1 },
    grainAmount: { value: 0.85 },
    grainSize: { value: 3 },
    grainCharacter: { value: 0.7 },
    grainSeed: { value: 0 },
  }
  const geometry = new PlaneGeometry(20, 20, 200, 200)
  const material = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  })
  scene.add(new Mesh(geometry, material))

  const camera = new PerspectiveCamera(45, 1, 0.1, 1000)
  camera.position.set(0, 0, 2.3)
  const renderer = new WebGLRenderer({ antialias: true, canvas })
  renderer.setClearColor(new Color(0xffffff))

  function resize() {
    camera.aspect = getDocumentWidth() / getDocumentHeight()
    camera.updateProjectionMatrix()
    renderer.setSize(getDocumentWidth(), getDocumentHeight())
    renderer.getDrawingBufferSize(uniforms.resolution.value)
  }
  resize()
  window.addEventListener('resize', resize)

  let grainSpeed = 12
  let gradientSpeed = 1
  let frame = requestAnimationFrame(function render() {
    uniforms.time.value += 0.0002 * gradientSpeed
    // Speed 0 leaves the seed alone, so the grain holds still.
    if (grainSpeed > 0) {
      uniforms.grainSeed.value =
        Math.floor((performance.now() / 1000) * grainSpeed) % 256
    }
    renderer.render(scene, camera)
    frame = requestAnimationFrame(render)
  })

  return {
    setColors(hexes: string[]) {
      uniforms.uColor.value = hexes.map((hex) => new Color(hex))
    },
    setShape(shape: GradientShape) {
      gradientSpeed = shape.speed
      uniforms.scale.value = shape.scale
      uniforms.softness.value = shape.softness
      uniforms.relief.value = shape.relief
    },
    setGrain(settings: GrainSettings) {
      grainSpeed = settings.speed
      uniforms.grainSize.value = settings.size
      uniforms.grainAmount.value = settings.amount
      uniforms.maskMatch.value = settings.match
      uniforms.grainCharacter.value = settings.character
      uniforms.blackPoint.value = settings.blackPoint
      uniforms.whitePoint.value = settings.whitePoint
      uniforms.maskBlur.value = settings.blur
    },
    setMirror(mirrored: boolean) {
      uniforms.mirror.value = mirrored ? 1 : 0
    },
    setVideo(el: HTMLVideoElement, width: number, height: number) {
      // Raw sRGB values: the mask's levels should match what the eye sees.
      const texture = new VideoTexture(el)
      texture.colorSpace = NoColorSpace
      texture.minFilter = LinearFilter
      texture.generateMipmaps = false
      uniforms.mask.value.dispose()
      uniforms.mask.value = texture
      uniforms.maskAspect.value = width / height
    },
    dispose() {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      uniforms.mask.value.dispose()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    },
  }
}

export type GrainMirror = ReturnType<typeof createGrainMirror>
