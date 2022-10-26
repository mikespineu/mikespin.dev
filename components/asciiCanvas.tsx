import {useEffect, useRef} from "react";
import * as THREE from "three";
import {getDocumentHeight, getDocumentWidth} from "@/utils/utils.client";
import {AsciiEffect} from "three/examples/jsm/effects/AsciiEffect";
import {MeshBasicMaterial, PlaneGeometry} from "three";

type SetupPayload = {
    canvas: HTMLDivElement
    video: HTMLVideoElement
}

function setup({
       canvas,
       video,
   } : SetupPayload) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 45, getDocumentWidth() / getDocumentHeight(), 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    const effect = new AsciiEffect( renderer, ' .:-+*=%@#', {
        invert: true,
        resolution: 0.2,
    });

    camera.position.z = 5;
    effect.setSize( window.innerWidth, window.innerHeight );
    effect.domElement.style.color = 'white';
    effect.domElement.style.backgroundColor = 'black';
    canvas.appendChild( effect.domElement );
    renderer.setClearColor("#ffffff");
    renderer.setSize( window.innerWidth, window.innerHeight );

    const texture = new THREE.VideoTexture(video);
    const materialPlane: MeshBasicMaterial = new THREE.MeshBasicMaterial(
        { map: texture }
    );
    const geometryPlane: PlaneGeometry = new THREE.PlaneGeometry( 16, 9 );
    geometryPlane.scale( 0.5, 0.5, 0.5 );
    const mesh = new THREE.Mesh(geometryPlane, materialPlane);
    mesh.lookAt(camera.position);
    scene.add( mesh );

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };
        navigator.mediaDevices.getUserMedia( constraints ).then( function ( stream ) {
            // apply the stream to the video element used in the texture
            video.srcObject = stream;
            video.play();
        } ).catch( function ( error ) {
            console.error( 'Unable to access the camera/webcam.', error );
        } );

    } else {
        console.error( 'MediaDevices interface not available.' );
    }

    function onWindowResize(){
        camera.aspect = getDocumentWidth() / getDocumentHeight();
        camera.updateProjectionMatrix();
        renderer.setSize(getDocumentWidth(), getDocumentHeight());
        effect.setSize(getDocumentWidth(), getDocumentHeight());
    }

    window.addEventListener('resize', onWindowResize);


    const render = function () {
        requestAnimationFrame( render );
        renderer.render(scene, camera);
        effect.render( scene, camera );
    };

    render();

}

export function AsciiCanvas() {
    const canvas = useRef<HTMLDivElement>(null);
    const video = useRef<HTMLVideoElement>(null);
    const effectRan = useRef(false);

    useEffect(() => {
        if(!effectRan.current ) {
            setup({
                canvas: canvas.current as HTMLDivElement,
                video: video.current as HTMLVideoElement
            })
        }
        return () => {
            effectRan.current = true;
        }
    }, [effectRan])

    return (
        <>
            <video id="video" ref={video} style={{display: 'none'}} autoPlay playsInline/>
            <div id="canvas"  ref={canvas} />
        </>
    )
}
