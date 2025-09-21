import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { GLTFLoader } from 'three-stdlib';
import { Group } from 'three';

interface Inline3DViewerProps {
  modelUrl: string;
  className?: string;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Model({ url }: { url: string }) {
  const meshRef = useRef<Group>(null);
  const gltf = useLoader(GLTFLoader, url);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={meshRef}>
      <primitive object={gltf.scene} scale={0.6} />
    </group>
  );
}

export function Inline3DViewer({ modelUrl, className = '' }: Inline3DViewerProps) {
  return (
    <div className={`w-16 h-12 border rounded-lg overflow-hidden ${className}`}>
      <Suspense fallback={<LoadingSpinner />}>
        <Canvas
          camera={{ position: [0, 0, 2], fov: 50 }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Environment preset="studio" />

          <Model url={modelUrl} />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
