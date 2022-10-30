import {
    Color,
    PerspectiveCamera,
    WebGLRenderer,
} from "three";
import { gsap } from "gsap";
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

// let index = Math.floor(Math.random() * niceColors.length | 0); // just to get a random color palette
const index = 24; // 17

const palette = niceColors[index].map((color) => new Color(color));

export async function setup({
       canvas,
   } : SetupPayload) {

    const scene = new SceneManager({ palette })
    await scene.initialize();

    const mainCamera: PerspectiveCamera =
        new PerspectiveCamera( 45, getDocumentWidth() / getDocumentHeight(), 0.1, 1000 );
    mainCamera.position.set(0, 0,2.3);
    const renderer: WebGLRenderer =
        new WebGLRenderer({ antialias: true, canvas });
    // const controls = new OrbitControls( mainCamera, renderer.domElement );
    // controls.update();

    renderer.setClearColor(new Color(0xffffff));
    renderer.setSize(getDocumentWidth(), getDocumentHeight());
    renderer.setPixelRatio(3)

    canvas.addEventListener('mousemove', (e) => { setupRotation(e) }, false);

    function onWindowResize(){
        mainCamera.aspect = getDocumentWidth() / getDocumentHeight();
        mainCamera.updateProjectionMatrix();
        renderer.setSize(getDocumentWidth(), getDocumentHeight());
    }

    function setupRotation({ clientX, clientY }: MouseEvent) {
        const documentWidth = getDocumentWidth();
        const documentHeight = getDocumentHeight()
        const deltaX = (clientX - documentWidth / 2) / documentWidth;
        const deltaY = (clientY - documentHeight / 2) / documentHeight;
        const factor = 0.3;

        gsap.to(scene.getLogo().rotation, {
            x: Math.PI / 2 + deltaY * factor,
            z: - deltaX * factor,
            duration: 3.5,
            ease: "power2.out"
        });
    }


    window.addEventListener('resize', onWindowResize);

    const render = function () {
        renderer.render(scene, mainCamera);
        scene.update();
        requestAnimationFrame( render );
    };

    render();

}
