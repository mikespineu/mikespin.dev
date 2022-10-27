import {
    Color,
    PerspectiveCamera,
    WebGLRenderer,
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

import {getDocumentHeight, getDocumentWidth} from "@/utils/utils.client";

import SceneManager from "./SceneManager";
// @ts-ignore
import fragmentShader from "./fragmentShader.glsl";
// @ts-ignore
import vertexShader from "./vertexShader.glsl";

type SetupPayload = {
    canvas: HTMLCanvasElement
}

console.log('shaders', vertexShader, fragmentShader);

export function setup({
       canvas,
   } : SetupPayload) {

    const scene = new SceneManager()
    scene.initialize();

    const mainCamera = new PerspectiveCamera( 45, getDocumentWidth() / getDocumentHeight(), 0.1, 1000 );
    mainCamera.position.z = 5;
    const renderer: WebGLRenderer = new WebGLRenderer({
        antialias: true,
        canvas,
    });

    const controls = new OrbitControls( mainCamera, renderer.domElement );
    controls.update();


    renderer.setClearColor(new Color(0x000000));
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
