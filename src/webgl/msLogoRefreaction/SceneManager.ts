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

import fragmentShader from './fragmentShader.glsl?raw'
import vertexShader from './vertexShader.glsl?raw'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'

export default class SceneManager extends Scene {
  private readonly gltfLoader = new GLTFLoader()
  private readonly hdrLoader = new HDRLoader()
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
    const hdrEquirect = this.hdrLoader.load(
      '/empty_warehouse_01_1k.hdr',
      () => {
        hdrEquirect.mapping = EquirectangularReflectionMapping
      }
    )

    const normalMapTexture = this.TextureLoader.load('/normals.jpg')
    normalMapTexture.wrapS = RepeatWrapping
    normalMapTexture.wrapT = RepeatWrapping

    this.gltfLoader.load('/ms-logo.glb', (gltf) => {
      const logo = gltf.scene.children.find(
        (mesh) => mesh.name === 'Curve'
      ) as Mesh
      const geometry = logo.geometry.clone()
      const material = new MeshPhysicalMaterial({
        transmission: 0.499,
        // thickness: 0.9,
        // roughness: 0.9,
        envMap: hdrEquirect,
        envMapIntensity: 0.2,
        // clearcoatNormalMap: normalMapTexture,
        // clearcoatNormalScale: new Vector2(1, 1),
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.15,
      })

      const mesh = new Mesh(geometry, material)
      const scale = 8
      mesh.position.set(0, 0, 0.2)
      mesh.scale.set(scale, scale, scale)
      mesh.rotation.set(Math.PI / 2, 0, 0)
      mesh.name = 'logo'
      mesh.castShadow = true
      mesh.receiveShadow = true

      this.add(mesh)
      this.logoObject = mesh
    })
  }

  update() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.plane.material.uniforms.time.value += 0.0004
  }
}
