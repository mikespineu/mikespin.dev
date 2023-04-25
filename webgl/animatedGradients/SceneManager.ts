import {
  Color,
  Mesh,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
} from 'three'

import fragmentShader from './fragmentShader.glsl'
import vertexShader from './vertexShader.glsl'

export default class SceneManager extends Scene {
  private plane = {} as Mesh
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

  update() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.plane.material.uniforms.uColor.value = this.palette
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.plane.material.uniforms.time.value += 0.0002
  }
}
