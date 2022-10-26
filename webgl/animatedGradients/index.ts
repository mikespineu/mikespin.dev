import {
    Color,
    PerspectiveCamera, Vector3,
    WebGLRenderer,
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import niceColors from "nice-color-palettes";

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

let palette = niceColors[Math.floor(Math.random() * niceColors.length | 0)].map((color) => new Color(color));


console.log('pallete', palette);

export function setup({
       canvas,
   } : SetupPayload) {

    const scene = new SceneManager({ palette })
    scene.initialize();

    const mainCamera: PerspectiveCamera =
        new PerspectiveCamera( 45, getDocumentWidth() / getDocumentHeight(), 0.1, 1000 );
    mainCamera.position.z = 3;
    mainCamera.position.set(-1.4210002836431703, -1.3310937992202898, 3.365735168442218)
    const renderer: WebGLRenderer =
        new WebGLRenderer({ antialias: true, canvas });
    const controls = new OrbitControls( mainCamera, renderer.domElement );
    controls.update();

    renderer.setClearColor(new Color(0xffffff));
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
