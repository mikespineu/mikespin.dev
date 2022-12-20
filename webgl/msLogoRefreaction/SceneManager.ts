import {
  Color,
  DirectionalLight,
  EquirectangularReflectionMapping,
  Mesh,
  MeshPhysicalMaterial,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector2,
} from 'three'

import fragmentShader from './fragmentShader.glsl'
import vertexShader from './vertexShader.glsl'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

export default class SceneManager extends Scene {
  private readonly gltfLoader = new GLTFLoader()
  private readonly RGBELoader = new RGBELoader()
  private readonly TextureLoader = new TextureLoader()
  private plane = {} as Mesh
  private logoObject = {} as Mesh
  palette: Color[]
  constructor({ palette }: { palette: Color[] }) {
    super()
    this.palette = palette
  }

  async initialize() {
    this.createBackground()
    await this.createLogo()
    this.createLight()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.scene = this
  }

  createBackground() {
    const geometry = new PlaneGeometry(10, 8, 100, 100)
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

  createLight() {
    const light = new DirectionalLight(new Color(0xfff0dd), 1)
    light.position.set(0, 5, 10)
    this.add(light)
  }

  getLogo() {
    return this.logoObject
  }

  async createLogo() {
    const hdrEquirect = await this.RGBELoader.load(
      'empty_warehouse_01_1k.hdr',
      () => {
        hdrEquirect.mapping = EquirectangularReflectionMapping
      }
    )

    const normalMapTexture = this.TextureLoader.load('normals.jpg')
    normalMapTexture.wrapS = RepeatWrapping
    normalMapTexture.wrapT = RepeatWrapping

    await this.gltfLoader.load('/ms3-modifer.glb', (gltf) => {
      const logo = gltf.scene.children.find(
        (mesh) => mesh.name === 'Curve'
      ) as Mesh
      const geometry = logo.geometry.clone()
      const material = new MeshPhysicalMaterial({
        // metalness: 0,
        transmission: 0.9,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        thickness: 1.5,
        roughness: 0.07,
        envMap: hdrEquirect,
        envMapIntensity: 0.9,
        clearcoatNormalMap: normalMapTexture,
        clearcoatRoughness: 19,
      })

      const mesh = new Mesh(geometry, material)
      const scale = 12
      mesh.position.set(0, 0, 0.2)
      mesh.scale.set(scale, scale, scale)
      mesh.rotation.set(Math.PI / 2, 0, 0)
      mesh.name = 'logo'

      this.add(mesh)
      this.logoObject = mesh
    })
  }

  update() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.plane.material.uniforms.time.value += 0.0002
  }
}
