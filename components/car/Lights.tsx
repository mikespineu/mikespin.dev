import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { Object3D, PCFSoftShadowMap } from "three";

const Lights: React.FC = () => {
    const { scene, gl} = useThree();
    gl.shadowMap.type = PCFSoftShadowMap;
    const handleControls = useControls;

    const createTarget = (name: string, position: { x: number, y: number, z: number }) => {

        const { positionLeva } = handleControls(name, {
            positionLeva: { x: position.x, y: position.y, z: position.z },
            step: 0.1
        });
        const targetObject = new Object3D();
        targetObject.position.set(positionLeva.x, positionLeva.y, positionLeva.z);
        scene.add(targetObject);


        return targetObject 
    };

    return (
      <>
        <spotLight
            color={[1, 0.25, 0.7]}
            intensity={1.5}
            angle={Math.PI / 3}
            penumbra={0.5}
            position={[5, 5, 0]}
            castShadow
            shadow-bias={-0.015}
            target={createTarget("targetPostion2", { x: -4, y: 0, z: 0})}
        />
        <spotLight
            color={[0.14, 0.5, 1]}
            intensity={2}
            angle={Math.PI / 3}
            penumbra={0.5}
            position={[-5, 5, 0]}
            castShadow
            shadow-bias={-0.015}
            target={createTarget("targetPostion", { x: 4, y: 0, z: 0})}
        />
      </>
    )
  }
  
  export default Lights