import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Interactive3DExperience from './Interactive3DExperience';

export default function ScrollScene({ scrollProgress }) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <Interactive3DExperience scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
