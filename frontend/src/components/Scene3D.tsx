'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';

export default function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
      <OrbitControls enableZoom={false} enablePan={false} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <Float speed={1} rotationIntensity={1} floatIntensity={2}>
        <mesh>
          <torusGeometry args={[1, 0.3, 16, 32]} />
          <meshNormalMaterial />
        </mesh>
      </Float>
      
      <Float speed={0.5} rotationIntensity={0.5} floatIntensity={1} position={[3, -1, 0]}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#0ea5e9" />
        </mesh>
      </Float>
      
      <Float speed={0.8} rotationIntensity={0.8} floatIntensity={1.5} position={[-3, 1, 0]}>
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#d946ef" />
        </mesh>
      </Float>
    </Canvas>
  );
}