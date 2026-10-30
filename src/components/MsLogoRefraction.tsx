import {useEffect, useRef} from "react";
import { setup as setupAnimatedGradients} from "../webgl/msLogoRefreaction";

export const MsLogoRefraction = (
    { className }:{className?: string}
) => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const effectRan = useRef(false);

    useEffect(() => {
        if(!effectRan.current ) {
            (async () => {
                await setupAnimatedGradients({
                    canvas: canvas.current as HTMLCanvasElement,
                })
            })();
        }
        return () => {
            effectRan.current = true;
        }
    }, [effectRan])

    return (
        <canvas id="canvas"  className={className} ref={canvas} />
    )
}
