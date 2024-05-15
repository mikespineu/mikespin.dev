import { CircleGeometry, Color, Mesh, MeshBasicMaterial, Scene } from 'three'

export default class SceneManager extends Scene {
  private planes: Mesh[] = []
  constructor() {
    super()
    this.background = new Color(0x000000)
  }
  createPlanes(index: number) {
    const color = new Color().setHSL(0, 1, index * 0.05)
    const geometry = new CircleGeometry(1, 5)
    // const geometry = new PlaneGeometry(10, 10, 10)

    const material = new MeshBasicMaterial({
      color,
      transparent: true,
    })
    const plane = new Mesh(geometry, material)
    plane.position.set(0, 0, index / 40)
    plane.scale.multiplyScalar(1 - index * 0.05)
    plane.rotation.z = Math.PI * index * 0.005
    this.add(plane)
    this.planes.push(plane)
  }
  initialize() {
    const array = new Array(20).fill(0)
    array.forEach((_, i) => {
      this.createPlanes(i)
    })
  }

  update(timeStep: number) {
    this.planes.forEach((plane, index) => {
      plane.rotation.z += Math.cos(timeStep) * index * 0.0008
    })
  }
}
