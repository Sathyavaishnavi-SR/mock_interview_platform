import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Interactive3DExperience({ scrollProgress = 0 }) {
  const groupRef = useRef();
  const coreRef = useRef();
  const ringRef = useRef();
  const particlesRef = useRef();
  const resumeNodesRef = useRef();
  const evaluationRingRef = useRef();
  const careerNodesRef = useRef();

  // Create lightweight particle positions
  const particleCount = 180;
  const particlePositions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    const p = Math.min(Math.max(scrollProgress, 0), 1);
    const isMobile = window.innerWidth < 768;

    // Spatial Position Interpolation across the 5 Scroll Stages
    let targetX = isMobile ? 0 : 2.2;
    let targetY = isMobile ? -1.0 : 0;
    let targetZ = 0;

    if (p < 0.20) {
      // Stage 1: Hero -> Right column position
      targetX = isMobile ? 0 : 2.2;
      targetY = isMobile ? -1.0 : 0;
    } else if (p < 0.40) {
      // Stage 2: Preparation / Value Props
      targetX = isMobile ? 0 : 2.0;
      targetY = isMobile ? -0.8 : -0.3;
    } else if (p < 0.60) {
      // Stage 3: Interview / Rating & Marquee
      targetX = isMobile ? 0 : 2.2;
      targetY = isMobile ? -0.6 : 0.2;
    } else if (p < 0.80) {
      // Stage 4: Evaluation / How It Works
      targetX = isMobile ? 0 : 2.0;
      targetY = isMobile ? -0.8 : -0.2;
    } else {
      // Stage 5: Career Growth / Final CTA
      targetX = isMobile ? 0 : 1.8;
      targetY = isMobile ? -0.5 : (p - 0.7) * 2.5;
    }

    if (groupRef.current) {
      // Smooth lerp to target spatial position
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.06);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.06);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.06);

      // Continuous subtle rotation
      groupRef.current.rotation.y += delta * 0.2;
    }

    // Stage 1: Hero AI Sphere Core
    if (coreRef.current) {
      const baseScale = isMobile ? 0.7 : 1.0;
      const coreTargetScale = p < 0.25 ? baseScale * (1 + p * 1.2) : Math.max(0.3, baseScale * (1.2 - (p - 0.25) * 1.8));
      coreRef.current.scale.lerp(new THREE.Vector3(coreTargetScale, coreTargetScale, coreTargetScale), 0.1);
      coreRef.current.rotation.x += delta * 0.4;
      coreRef.current.rotation.y += delta * 0.6;
    }

    // Orbital Ring
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.4 + p * Math.PI;
      ringRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.4;
    }

    // Stage 2: Resume / Preparation Floating Nodes
    if (resumeNodesRef.current) {
      const active = p >= 0.15 && p <= 0.45;
      const targetScale = active ? (isMobile ? 0.7 : 1.0) : 0.001;
      resumeNodesRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      resumeNodesRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.15;
    }

    // Stage 3 & 4: Interview & Evaluation Progress Ring
    if (evaluationRingRef.current) {
      const active = p >= 0.40 && p <= 0.85;
      const targetScale = active ? (isMobile ? 0.7 : 1.0) : 0.001;
      evaluationRingRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      evaluationRingRef.current.rotation.z += delta * 0.5;
    }

    // Stage 5: Career Growth Ascending Nodes
    if (careerNodesRef.current) {
      const active = p >= 0.70;
      const targetYNode = active ? (p - 0.7) * 2.5 : -4;
      careerNodesRef.current.position.y = THREE.MathUtils.lerp(careerNodesRef.current.position.y, targetYNode, 0.05);
    }
  });

  return (
    <group ref={groupRef} position={[2.2, 0, 0]}>
      {/* Central AI Core (Icosahedron) */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial
          color="#3b82f6"
          wireframe
          emissive="#6366f1"
          emissiveIntensity={0.65}
          roughness={0.2}
        />
      </mesh>

      {/* Orbital Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.55, 0.035, 16, 100]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Resume Data Nodes Group (Stage 2) */}
      <group ref={resumeNodesRef} scale={[0.001, 0.001, 0.001]}>
        {[-1.1, 0, 1.1].map((x, i) => (
          <mesh key={i} position={[x, (i - 1) * 0.65, 0]}>
            <boxGeometry args={[0.6, 0.45, 0.1]} />
            <meshStandardMaterial color="#6366f1" wireframe />
          </mesh>
        ))}
      </group>

      {/* Evaluation Progress Ring (Stage 4) */}
      <group ref={evaluationRingRef} scale={[0.001, 0.001, 0.001]}>
        <mesh>
          <ringGeometry args={[1.3, 1.48, 32]} />
          <meshStandardMaterial color="#10b981" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Career Trajectory Nodes (Stage 5) */}
      <group ref={careerNodesRef} position={[0, -4, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[(i - 1.5) * 0.6, i * 0.65, 0]}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1} />
          </mesh>
        ))}
      </group>

      {/* Particle Field */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#60a5fa"
          transparent
          opacity={0.65}
          sizeAttenuation
        />
      </points>

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -5, -5]} color="#06b6d4" intensity={1.5} />
    </group>
  );
}
