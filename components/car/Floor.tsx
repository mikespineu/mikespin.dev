import { MeshReflectorMaterial } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import React, { useEffect } from "react"
import { LinearEncoding, RepeatWrapping, TextureLoader, Vector2 } from "three"

type IFloorProps = {
    children?: React.ReactNode
}

export const Floor: React.FC<IFloorProps> = ({ children }) => {
    const [roughness, normal] = useLoader(TextureLoader, [
        '/car/textures/terrain-roughness.jpg', 
        '/car/textures/terrain-normal.jpg'
    ]);

    useEffect(() => {
     [normal, roughness].forEach((texture) => {
            texture.wrapS = RepeatWrapping
            texture.wrapT = RepeatWrapping
            texture.repeat.set(12, 12) 
     });

     normal.encoding = LinearEncoding
    },[roughness, normal])
    
    return (
        <>
            <mesh receiveShadow castShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[100, 100]} />
                <MeshReflectorMaterial
                    normalMap={normal}
                    color={[0.15, 0.15, 0.15]}
                    normalScale={new Vector2(0.3, 0.3)}
                    roughnessMap={roughness}
                    roughness={0.9}
                    blur={[1000, 1000]} // Blur ground reflections (width, height), 0 skips blur
                    mixBlur={30} // How much blur mixes with surface roughness (default = 1)
                    mixStrength={2} // Strength of the reflections
                    mixContrast={0.6} // Contrast of the reflections
                    resolution={1024} // Off-buffer resolution, lower=faster, higher=better quality, slower
                    mirror={0.8} // Mirror environment, 0 = texture colors, 1 = pick up env colors
                    depthScale={0} // Scale the depth factor (0 = no depth, default = 0)
                    minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
                    maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
                    depthToBlurRatioBias={2.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
                    distortion={1} // Amount of distortion based on the distortionMap texture
                    reflectorOffset={0.1} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
                    dithering={true}
                />
            </mesh>
            {
                children && React.Children.map(children, (child) => child)
            }
        </>
    )
}