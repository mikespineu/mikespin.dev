import {
  Color,
  DirectionalLight,
  DoubleSide,
  EquirectangularReflectionMapping,
  HalfFloatType,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  type Camera,
  type WebGLRenderer,
} from 'three'

import fragmentShader from './fragmentShader.glsl?raw'
import vertexShader from './vertexShader.glsl?raw'
import logoFragmentShader from './logoFragmentShader.glsl?raw'
import logoVertexShader from './logoVertexShader.glsl?raw'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'

export default class SceneManager extends Scene {
  private readonly gltfLoader = new GLTFLoader()
  private readonly hdrLoader = new HDRLoader()
  private readonly TextureLoader = new TextureLoader()
  private plane = {} as Mesh
  private logoObject = {} as Mesh
  private readonly sceneTarget = new WebGLRenderTarget(1, 1, {
    type: HalfFloatType,
  })
  private readonly sceneResolution = new Vector2(1, 1)
  private readonly shadowTarget = new WebGLRenderTarget(512, 512)
  private readonly shadowMaterial = new MeshBasicMaterial({
    color: 0xffffff,
    side: DoubleSide,
  })
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
        uShadow: { value: this.shadowTarget.texture },
        uResolution: { value: this.sceneResolution },
        grainAmount: { value: 0.1 },
        grainMix: { value: 0.11 },
        grainSize: { value: 3 * window.devicePixelRatio },
        grainSeed: { value: 0 },
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
      // Centre the outline on screen; local y is depth, so leave it alone.
      geometry.computeBoundingBox()
      const center = geometry.boundingBox!.getCenter(new Vector3())
      geometry.translate(-center.x, 0, -center.z)
      const material = new ShaderMaterial({
        uniforms: {
          uScene: { value: this.sceneTarget.texture },
          uEnv: { value: hdrEquirect },
          uNormalMap: { value: normalMapTexture },
          uResolution: { value: this.sceneResolution },
          uRefraction: { value: 0.07 },
          uAberration: { value: 0.25 },
          uBlur: { value: 0.006 },
          uTint: { value: new Color('#ffffff') },
          // Shared with the background so the logo sits in the same film grain.
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          grainAmount: this.plane.material.uniforms.grainAmount,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          grainMix: this.plane.material.uniforms.grainMix,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          grainSize: this.plane.material.uniforms.grainSize,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          grainSeed: this.plane.material.uniforms.grainSeed,
        },
        vertexShader: logoVertexShader,
        fragmentShader: logoFragmentShader,
        side: DoubleSide,
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

  // Glass samples a copy of the background, so draw that first without the logo.
  render(renderer: WebGLRenderer, camera: Camera) {
    renderer.getDrawingBufferSize(this.sceneResolution)
    const { x, y } = this.sceneResolution
    if (this.sceneTarget.width !== x || this.sceneTarget.height !== y) {
      this.sceneTarget.setSize(x, y)
    }

    // White silhouette on black; the background blurs it into a soft shadow.
    const clearColor = renderer.getClearColor(new Color())
    this.plane.visible = false
    this.overrideMaterial = this.shadowMaterial
    renderer.setClearColor(0x000000)
    renderer.setRenderTarget(this.shadowTarget)
    renderer.render(this, camera)
    renderer.setClearColor(clearColor)
    this.overrideMaterial = null
    this.plane.visible = true

    this.logoObject.visible = false
    renderer.setRenderTarget(this.sceneTarget)
    renderer.render(this, camera)
    renderer.setRenderTarget(null)
    this.logoObject.visible = true
    renderer.render(this, camera)
  }

  update() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.plane.material.uniforms.time.value += 0.0002
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.plane.material.uniforms.grainSeed.value =
      Math.floor((performance.now() / 1000) * 7) % 256
  }
}
