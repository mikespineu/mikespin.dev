import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
// @ts-ignore
import fragmentShader from "./fragmentShader.glsl";
// @ts-ignore
import vertexShader from "./vertexShader.glsl";
import {Mesh, Color} from "three";

export default class SceneManager extends THREE.Scene{
    private readonly gltfLoader = new GLTFLoader();
    private plane = {} as Mesh;
    palette: Color[]
    constructor({ palette } : { palette: Color[] }) {
        super();
        this.palette = palette;
    }
    initialize() {

        const geometry = new THREE.PlaneGeometry( 10, 8, 300, 300 )
        // const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        const material = new THREE.ShaderMaterial( {
            uniforms: {
                time: { value: 1.0 },
                resolution: { value: new THREE.Vector2() },
                uColor: { value: this.palette },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            // wireframe: true
        } );
        this.plane = new THREE.Mesh( geometry, material );
        this.add(this.plane);
        console.log('palette', this.palette);
    }

    update() {
        // code gose here to update the scene
        // @ts-ignore
        this.plane.material.uniforms.time.value += 0.01;
    }
}
