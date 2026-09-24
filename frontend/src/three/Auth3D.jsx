import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function SubtleGeometry() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Slow, smooth rotation
      meshRef.current.rotation.x += delta * 0.12;
      meshRef.current.rotation.y += delta * 0.18;
      // Gentle subtle floating motion
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15 - 0.5;
    }
  });

  return (
    <group position={[2.5, -0.5, 0]}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial
          color="#6366f1"
          wireframe
          emissive="#3b82f6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.35}
        />
      </mesh>

      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={0.8} />
    </group>
  );
}

export default function Auth3D() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div className="auth-canvas-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <SubtleGeometry />
        </Suspense>
      </Canvas>
    </div>
  );
}

