/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef ,useEffect} from 'react'
import { useGLTF } from '@react-three/drei/useGLTF'

export default function Model(props) {
  const group = useRef()
  useEffect(() => {
    console.log(props)
    group.current.position.z = props.position.x;
    group.current.position.y = props.position.y;
    group.current.position.x = props.position.z;
    if(props.position.DIRECTION === "FRONT")
    group.current.rotation.y = 0
    if(props.position.DIRECTION === "LEFT")
    group.current.rotation.y = 1.5708
    if(props.position.DIRECTION === "RIGHT")
    group.current.rotation.y = -1.5708
    if(props.position.DIRECTION === "BACK")
    group.current.rotation.y = 3.14159
  })
 
  const { nodes, materials } = useGLTF('/turtle.gltf')
  return (
    <group ref={group}   dispose={null} scale={[0.4,0.4,0.4]}>
      <mesh material={materials.Material} geometry={nodes.Cube.geometry} />
    </group>
  )
}

useGLTF.preload('/turtle.gltf')
