import {
  Color,
  Mesh,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
} from 'three'

import fragmentShader from './fragmentShader.glsl?raw'
import vertexShader from './vertexShader.glsl?raw'

export default class SceneManager extends Scene {
  private plane = {} as Mesh
  private grainSpeed = 6
  private speed = 1
  palette: Color[]
  constructor({ palette }: { palette: Color[] }) {
    super()
    this.palette = palette
  }
  initialize() {
    const geometry = new PlaneGeometry(20, 20, 200, 200)
    const material = new ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        resolution: { value: new Vector2() },
        uColor: { value: this.palette },
        grainAmount: { value: 0.1 },
        grainMix: { value: 0.4 },
        grainSize: { value: 1 },
        grainSeed: { value: 0 },
        scale: { value: 1 },
        softness: { value: 0.5 },
        relief: { value: 0.6 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })


    this.plane = new Mesh(geometry, material)
    this.add(this.plane)
  }

  setPalette(palette: Color[]) {
    this.palette = palette
  }

  setGrain({
    amount,
    mix,
    size,
    speed,
  }: {
    amount: number
    mix: number
    size: number
    speed: number
  }) {
    this.grainSpeed = speed
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { uniforms } = this.plane.material
    uniforms.grainAmount.value = amount
    uniforms.grainMix.value = mix
    uniforms.grainSize.value = size
  }

  setShape({
    speed,
    scale,
    softness,
    relief,
  }: {
    speed: number
    scale: number
    softness: number
    relief: number
  }) {
    this.speed = speed
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { uniforms } = this.plane.material
    uniforms.scale.value = scale
    uniforms.softness.value = softness
    uniforms.relief.value = relief
  }

  update() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.plane.material.uniforms.uColor.value = this.palette
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.plane.material.uniforms.time.value += 0.0002 * this.speed
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.plane.material.uniforms.grainSeed.value =
      Math.floor((performance.now() / 1000) * this.grainSpeed) % 256
  }
}
