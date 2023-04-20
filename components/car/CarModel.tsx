import { useLoader } from '@react-three/fiber'
import React, { useEffect } from 'react'
import { Vector3, Box3, Mesh } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const CarModel: React.FC = () => {
    const gltf = useLoader(GLTFLoader, '/car/bmw/scene.gltf')
    
    useEffect(() => {
        const model = gltf.scene.children[0].children[0]
        const bb = new Box3().setFromObject(gltf.scene.children[0])
        gltf.scene.position.y = 1.03
        gltf.scene.position.z = -1.03
        gltf.scene.position.x = -.53
        console.log('size', bb.getCenter(new Vector3()),  bb.getSize(new Vector3()))
        model.traverse((child) => {
            if (child instanceof Mesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }, [gltf])


    return <primitive object={gltf.scene} dispose={null} />
  }

  export default CarModel