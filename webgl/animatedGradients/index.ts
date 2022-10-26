import * as THREE from "three";
import {getDocumentHeight, getDocumentWidth} from "@/utils/utils.client";
import {fragmentShader} from "./fragmentShader";
import {vertexShader} from "./vertexShader";
import {WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

type SetupPayload = {
    canvas: HTMLCanvasElement
}

class SceneManager extends THREE.Scene{
    private readonly gltfLoader = new GLTFLoader();
    initialize() {
        const geometry = new THREE.PlaneGeometry( 1, 1 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        const plane = new THREE.Mesh( geometry, material );
        this.add(plane);
    }

    update() {
        // code gose here to update the scene
    }
}

console.log('shaders', vertexShader, fragmentShader);

export function setup({
       canvas,
   } : SetupPayload) {

    const scene = new SceneManager()
    scene.initialize();

    const mainCamera = new THREE.PerspectiveCamera( 45, getDocumentWidth() / getDocumentHeight(), 0.1, 1000 );
    mainCamera.position.z = 5;
    const renderer: WebGLRenderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
    });

    const controls = new OrbitControls( mainCamera, renderer.domElement );
    controls.update();



    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(getDocumentWidth(), getDocumentHeight());


    function onWindowResize(){
        mainCamera.aspect = getDocumentWidth() / getDocumentHeight();
        mainCamera.updateProjectionMatrix();
        renderer.setSize(getDocumentWidth(), getDocumentHeight());
        controls.update();
    }

    window.addEventListener('resize', onWindowResize);

    const render = function () {
        renderer.render(scene, mainCamera);
        scene.update();

        requestAnimationFrame( render );
    };

    render();

}
