const DefaultLights = () => {
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight color="white" position={[-0.5, 1, 5]} />
    </>
  )
}

export default DefaultLights
