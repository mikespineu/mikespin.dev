import {type RefObject, useEffect, useRef} from "react";
import { setup as setupAnimatedGradients} from "../webgl/msLogoRefreaction";

export const MsLogoRefraction = (
    { className, anchorRef }:{className?: string, anchorRef: RefObject<HTMLElement | null>}
) => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const effectRan = useRef(false);

    useEffect(() => {
        if(!effectRan.current ) {
            (async () => {
                await setupAnimatedGradients({
                    canvas: canvas.current as HTMLCanvasElement,
                    anchor: anchorRef.current as HTMLElement,
                })
            })();
        }
        return () => {
            effectRan.current = true;
        }
    }, [effectRan, anchorRef])

    return (
        <canvas id="canvas" aria-hidden="true" className={className} ref={canvas} />
    )
}
