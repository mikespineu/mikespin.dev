import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import fragmentShader from './fragmentShader.glsl'
import vertexShader from './vertexShader.glsl'

export default class SceneManager extends THREE.Scene {
  private readonly gltfLoader = new GLTFLoader()
  initialize() {
    // const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    // this.add( light );
    const geometry = new THREE.SphereGeometry(1, 32, 16)
    // const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2() },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })
    const plane = new THREE.Mesh(geometry, material)
    this.add(plane)
  }

  update() {
    // code gose here to update the scene
  }
}
