import {FC, useEffect, useRef} from "react";
import { setup as setupAnimatedGradients, changeGradient } from "../webgl/animatedGradients";

export const AnimatedGradients: FC = () => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const effectRan = useRef(false);

    const handleClick = () => {
        changeGradient();
    }

    useEffect(() => {
        if(!effectRan.current ) {
            setupAnimatedGradients({
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
            <div className="absolute top-[50%] translate-y-[-50%] left-[50px] sm:left-[100px] lg:left-[250px] text-left flex flex-col opacity-75 mix-blend-overlay">
                <h1 className="text-6xl sm:text-7xl lg:text-9xl tracking-widest">
                WebGL 
                </h1>
                <h2 className="text-xl sm:text-4xl lg:text-5xl">
                    Animated Gradients
                </h2>
                <button 
                    className="bg-transparent border-2 border-black text-black px-6 py-4 rounded-lg mt-16 width-auto self-start uppercase tracking-widest hover:translate-x-1 transition-transform"
                    onClick={() => handleClick()}
                >
                    Change gradient
                </button>
            </div>
        </>
    )
}
