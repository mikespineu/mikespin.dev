import {FC, useEffect, useRef} from "react";
import { setup as setupAnimatedTexture } from "../webgl/animatedTexture";

export const AnimatedTexture: FC = () => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const effectRan = useRef(false);


    useEffect(() => {
        if(!effectRan.current ) {
            setupAnimatedTexture({
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
            <div className="absolute top-[50%] translate-y-[-50%] left-[50px] sm:left-[100px] lg:left-[250px] text-left flex flex-col opacity-75 select-none">
                <h1 className="text-5xl sm:text-7xl lg:text-9xl tracking-widest font-outline-black relative z-10">
                WebGL 
                </h1>
                <span className="text-5xl sm:text-7xl lg:text-9xl tracking-widest font-outline-white absolute top-0.5 left-0.5 lg:top-1.5 lg:left-1.5">
                WebGL 
                </span>
                <h2 className="text-white text-lg sm:text-4xl lg:text-5xl">
                    Animated Texture
                </h2>
                {/* <button 
                    className="bg-transparent border-2 border-white text-white text-sm px-4 py-2 lg:px-6 lg:py-4 rounded-lg mt-4 lg:mt-10 width-auto self-start uppercase tracking-widest hover:translate-x-1 transition-transform"
                >
                    Change texture
                </button> */}
            </div>
        </>
    )
}
