import {FC, useEffect, useRef} from "react";
import * as THREE from "three";
import {getDocumentHeight, getDocumentWidth} from "@/utils/utils.client";

type SetupPayload = {
    canvas: HTMLCanvasElement
}

function setup({
       canvas,
   } : SetupPayload) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 45, getDocumentWidth() / getDocumentHeight(), 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
    });

    function onWindowResize(){
        camera.aspect = getDocumentWidth() / getDocumentHeight();
        camera.updateProjectionMatrix();
        renderer.setSize(getDocumentWidth(), getDocumentHeight());
    }

    window.addEventListener('resize', onWindowResize);


    const render = function () {
        requestAnimationFrame( render );
        renderer.render(scene, camera);
    };

    render();

}

export const AnimatedGradients: FC = () => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const effectRan = useRef(false);

    useEffect(() => {
        if(!effectRan.current ) {
            setup({
                canvas: canvas.current as HTMLCanvasElement,
            })
        }
        return () => {
            effectRan.current = true;
        }
    }, [effectRan])

    return (
        <>
            <canvas id="canvas"  ref={canvas} />
        </>
    )
}
