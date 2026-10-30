import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { Leva, button, useControls } from "leva";
import {
    getPaletteHexes,
    getRandomPaletteHexes,
    setColors,
    setGrain,
    savePng,
    setShape,
    setup as setupAnimatedGradients,
} from "../webgl/animatedGradients";
import { readValues, toSearch, valueKeys } from "../webgl/animatedGradients/values";

const getShareUrl = (get: (key: string) => string | number) => {
    const values = Object.fromEntries(valueKeys.map((key) => [key, get(key)]));
    return `${window.location.origin}${window.location.pathname}?${toSearch(values)}`;
}

export const AnimatedGradients: FC = () => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const effectRan = useRef(false);
    const [copyStatus, setCopyStatus] = useState("");

    const embed = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("embed");

    const copy = (text: string) => {
        navigator.clipboard.writeText(text).then(
            () => setCopyStatus("Copied"),
            () => setCopyStatus("Copy failed")
        );
    }

    const [controls, setControls] = useControls(() => {
        const [color1, color2, color3, color4, color5] = getPaletteHexes();
        const { colors, numbers } = readValues(
            typeof window === "undefined" ? "" : window.location.search
        );
        return {
            color1,
            color2,
            color3,
            color4,
            color5,
            ...colors,
            speed: { value: numbers.speed, min: 0, max: 5, step: 0.1, label: "gradient speed" },
            scale: { value: numbers.scale, min: 0.2, max: 4, step: 0.1 },
            softness: { value: numbers.softness, min: 0.05, max: 1.5, step: 0.05 },
            relief: { value: numbers.relief, min: 0, max: 2, step: 0.05 },
            grainAmount: { value: numbers.grainAmount, min: 0, max: 0.5, step: 0.01, label: "grain amount" },
            grainMix: { value: numbers.grainMix, min: 0, max: 1, step: 0.01, label: "grain mix" },
            grainSpeed: { value: numbers.grainSpeed, min: 0, max: 30, step: 1, label: "grain speed" },
            grainSize: { value: numbers.grainSize, min: 1, max: 6, step: 1, label: "grain size" },
            "save PNG": button(() => savePng(canvas.current as HTMLCanvasElement)),
            "copy values": button((get) => copy(getShareUrl(get))),
            "copy iframe": button((get) => {
                const src = `${getShareUrl(get)}&embed=1`.replaceAll("&", "&amp;");
                copy(`<iframe src="${src}" width="100%" height="100%" style="border:0" title="Animated gradient"></iframe>`);
            }),
        };
    });

    const handleClick = () => {
        const [color1, color2, color3, color4, color5] = getRandomPaletteHexes();
        setControls({ color1, color2, color3, color4, color5 });
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

    useEffect(() => {
        const { color1, color2, color3, color4, color5, speed, scale, softness, relief, grainAmount, grainMix, grainSize, grainSpeed } = controls;
        setColors([color1, color2, color3, color4, color5]);
        setShape({ speed, scale, softness, relief });
        setGrain({ amount: grainAmount, mix: grainMix, size: grainSize, speed: grainSpeed });
    }, [controls])

    return (
        <>
            {embed && <Leva hidden />}
            <canvas id="canvas"  ref={canvas} />
            <span role="status" className="embed-hidden fixed bottom-4 right-4 text-sm text-white">
                {copyStatus}
            </span>
            <div className="embed-hidden absolute top-[50%] translate-y-[-50%] left-[50px] sm:left-[100px] lg:left-[250px] text-left flex flex-col opacity-75 mix-blend-overlay select-none">
                <h1 className="text-5xl sm:text-7xl lg:text-9xl tracking-widest font-outline-black relative z-10">
                WebGL 
                </h1>
                <span className="text-5xl sm:text-7xl lg:text-9xl tracking-widest font-outline-white absolute top-0.5 left-0.5 lg:top-1.5 lg:left-1.5">
                WebGL 
                </span>
                <h2 className="text-lg sm:text-4xl lg:text-5xl">
                    Animated Gradients
                </h2>
                <button 
                    className="cursor-pointer bg-transparent border-2 border-black text-black text-sm px-4 py-2 lg:px-6 lg:py-4 rounded-lg mt-4 lg:mt-10 width-auto self-start uppercase tracking-widest hover:translate-x-1 transition-transform"
                    onClick={() => handleClick()}
                >
                    Change gradient
                </button>
            </div>
        </>
    )
}
