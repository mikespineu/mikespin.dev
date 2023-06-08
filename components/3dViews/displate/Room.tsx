import { useGLTF } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import React, { useEffect } from 'react'
import { Mesh } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const CarModel: React.FC = () => {
  //   const gltf = useLoader(GLTFLoader, '/displate/sofa_combination.glb')
  const { nodes, materials } = useGLTF(
    '/displate/sofa_combination-transformed.glb'
  )

  console.log('nodes', nodes)
  //   useEffect(() => {
  //     const model = gltf.scene
  //     gltf.scene.position.y = -1.33
  //     gltf.scene.position.x = -1.5
  //     gltf.scene.position.z = 1.66

  //     model.children[0].children[0].children[0].visible = false
  //     // gltf.scene.position.x = -0.53
  //     gltf.scene.rotateY(Math.PI)
  //     model.traverse((child) => {
  //       console.log('elo', child)
  //       if (child instanceof Mesh) {
  //         child.castShadow = true
  //         child.receiveShadow = true
  //         child.material.envMapIntesity = 100
  //       }
  //     })
  //     return () => {
  //       model.traverse((child) => {
  //         if (child instanceof Mesh) {
  //           child.geometry.dispose()
  //           child.material.dispose()
  //         }
  //       })
  //     }
  //   }, [gltf])

  //   return <primitive object={nodes.scene} scale={0.01} dispose={null} />
  return (
    <mesh
      castShadow
      receiveShadow
      //   geometry={nodes.Object_6}
      //   material={materials.Material}
    />
  )
}

export default CarModel
