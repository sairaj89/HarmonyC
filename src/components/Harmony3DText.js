import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';

const Model = ({ baseColor, diamondColor, harColor, monyColor }) => {
  const obj = useLoader(OBJLoader, '/problemsout.obj');
  const modelRef = useRef();

  // Set the initial rotation to face the front
  const initialRotation = useMemo(() => [-0.378, 200, 0], []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (modelRef.current) {
        const { innerWidth } = window;
        const mouseX = (event.clientX / innerWidth) * 2 - 1;
        modelRef.current.rotation.set(initialRotation[0], initialRotation[1] + mouseX * 0.3, initialRotation[2]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [initialRotation]);

  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const material = new THREE.MeshBasicMaterial({
        color: baseColor,
      });
      child.material = material;
    }
  });

  return (
    <primitive
      object={obj}
      ref={modelRef}
      position={[0, 0, 0]}
      rotation={initialRotation} // Set initial rotation
      scale={0.6} // Scale down the object
    />
  );
};

const Harmony3DText = ({ baseColor, diamondColor, harColor, monyColor }) => {
  return (
    <div className="section">
      <Canvas
        style={{
          width: '800px',
          height: '600px',
          background: 'transparent',
          display: 'block',
          margin: 'auto',
        }}
        camera={{ position: [0, 2, 5], fov: 50 }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Model baseColor={baseColor} diamondColor={diamondColor} harColor={harColor} monyColor={monyColor} />
      </Canvas>
    </div>
  );
};

export default React.memo(Harmony3DText);
