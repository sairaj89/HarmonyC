import React, { useRef, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';

const Model = (props) => {
  const obj = useLoader(OBJLoader, '/problemsout.obj');
  const modelRef = useRef();

  // Set the initial rotation to face the front
  const initialRotation = [-0.378, 200, 0];

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
        color: props.color,
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
      {...props}
    />
  );
};

const Harmony3DTextThreeColors = ({ baseColor, diamondColor, harColor, monyColor }) => {
  // Validate colors
  const isValidColor = (color) => /^#[0-9A-F]{6}$/i.test(color);

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
        {isValidColor(baseColor) && <Model position={[0, 0, 0]} color={baseColor} />}
        {isValidColor(diamondColor) && <Model position={[0, 0, 0]} color={diamondColor} />}
        {isValidColor(harColor) && <Model position={[0, 0, 0]} color={harColor} />}
        {isValidColor(monyColor) && <Model position={[0, 0, 0]} color={monyColor} />}
      </Canvas>
    </div>
  );
};

export default Harmony3DTextThreeColors;
