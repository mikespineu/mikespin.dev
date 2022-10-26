import {FC, useEffect, useRef} from "react";
import { setup as setupAnimatedGradients} from "../webgl/animatedGradients";

export const AnimatedGradients: FC = () => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const effectRan = useRef(false);

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
        </>
    )
}
