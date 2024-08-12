import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Points = () => {
  const pointsRef = useRef();
  const particles = new Float32Array(3000).map(() => THREE.MathUtils.randFloatSpread(10));

  useFrame(({ mouse }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = mouse.y * 0.2;
      pointsRef.current.rotation.y = mouse.x * 0.2;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={['attributes', 'position']}
          array={particles}
          itemSize={3}
          count={particles.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial attach="material" color="#888888" size={0.05} />
    </points>
  );
};

const ThreeBackground = () => (
  <Canvas>
    <Points />
  </Canvas>
);

export default ThreeBackground;
