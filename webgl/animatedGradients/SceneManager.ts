import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
// @ts-ignore
import fragmentShader from "./fragmentShader.glsl";
// @ts-ignore
import vertexShader from "./vertexShader.glsl";
import {Mesh} from "three";

export default class SceneManager extends THREE.Scene{
    private readonly gltfLoader = new GLTFLoader();
    private plane = {} as Mesh;
    initialize() {
        // const light = new THREE.AmbientLight( 0x404040 ); // soft white light
        // this.add( light );
        const geometry = new THREE.PlaneGeometry( 1, 1, 100, 100 )
        // const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        const material = new THREE.ShaderMaterial( {
            uniforms: {
                time: { value: 1.0 },
                resolution: { value: new THREE.Vector2() }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            wireframe: true
        } );
        this.plane = new THREE.Mesh( geometry, material );
        this.add(this.plane);
    }

    update() {
        // code gose here to update the scene
        // @ts-ignore
        this.plane.material.uniforms.time.value += 0.01;
    }
}
