"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Stars, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingOrbs() {
  const group = useRef<THREE.Group>(null);

  // Rotate entire group slowly
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05;
      group.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 64, 64]} position={[-3, 1, -2]}>
          <MeshDistortMaterial color="#38bdf8" speed={2} distort={0.4} radius={1} roughness={0.2} metalness={0.8} opacity={0.6} transparent />
        </Sphere>
      </Float>
      
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={3}>
        <Sphere args={[1.5, 64, 64]} position={[4, -1, -5]}>
          <MeshDistortMaterial color="#8b5cf6" speed={1.5} distort={0.5} radius={1} roughness={0.1} metalness={0.9} opacity={0.6} transparent />
        </Sphere>
      </Float>
      
      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[0.5, 32, 32]} position={[2, 3, -1]}>
          <MeshDistortMaterial color="#a78bfa" speed={3} distort={0.3} radius={1} roughness={0.3} metalness={0.8} opacity={0.8} transparent />
        </Sphere>
      </Float>
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full opacity-60">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#e0e7ff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#38bdf8" />
        
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
}
