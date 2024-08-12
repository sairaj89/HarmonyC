import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function createCombinedGradientParticles() {
  const particles = new THREE.BufferGeometry();
  const particleCount = 200000;
  const positions = [];
  const colors = [];
  const color = new THREE.Color();

  const gridSize = 70;
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        const xOffset = THREE.MathUtils.randFloatSpread(1);
        const yOffset = THREE.MathUtils.randFloatSpread(1);
        const zOffset = THREE.MathUtils.randFloatSpread(1);
        positions.push(
          (x / gridSize) * 3 + xOffset,
          (y / gridSize) * 3 + yOffset,
          (z / gridSize) * 3 + zOffset
        );

        const isCoolSide = x < gridSize / 2;
        const colorIndex = (y + z) / (gridSize * 2);

        const coolColors = [
          new THREE.Color('#00008B'),
          new THREE.Color('#4B0082'),
          new THREE.Color('#008080'),
          new THREE.Color('#00FFFF'),
          new THREE.Color('#ADFF2F'),
          new THREE.Color('#800080')
        ];

        const warmColors = [
          new THREE.Color('#FFFF00'),
          new THREE.Color('#FFA500'),
          new THREE.Color('#FF0000'),
          new THREE.Color('#FF4500'),
          new THREE.Color('#FF69B4'),
          new THREE.Color('#FFD700')
        ];

        const t = colorIndex * (coolColors.length - 1);
        const i = Math.floor(t);
        const f = t - i;

        if (isCoolSide) {
          color.copy(coolColors[i]).lerp(coolColors[i + 1] || coolColors[i], f);
        } else {
          color.copy(warmColors[i]).lerp(warmColors[i + 1] || warmColors[i], f);
        }

        colors.push(color.r, color.g, color.b);
      }
    }
  }

  particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  return particles;
}

function ParticleCube() {
  const particlesRef = useRef();
  const particles = useMemo(() => createCombinedGradientParticles(), []);
  useFrame(() => {
    particlesRef.current.rotation.x += 0.0005;
    particlesRef.current.rotation.y += 0.0005;
  });

  return (
    <points ref={particlesRef} geometry={particles}>
      <pointsMaterial size={0.002} vertexColors={true} transparent={true} opacity={0.8} />
    </points>
  );
}

function Cube() {
  return (
    <Canvas style={{ height: '100vh', background: 'black' }} shadows>
      <ambientLight intensity={2} />
      <spotLight position={[5, 5, 5]} intensity={3} angle={1} penumbra={1} castShadow />
      <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
      <directionalLight position={[-5, 5, 5]} intensity={2} castShadow />
      <directionalLight position={[5, -5, 5]} intensity={2} castShadow />
      <directionalLight position={[5, 5, -5]} intensity={2} castShadow />
      <ParticleCube />
      <OrbitControls enableZoom={true} zoomSpeed={0.5} minDistance={0} maxDistance={Infinity} />
    </Canvas>
  );
}

export default Cube;

