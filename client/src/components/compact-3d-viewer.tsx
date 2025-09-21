ruimport React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Group } from 'three';

interface CompactModelViewerProps {
  modelUrl?: string;
  className?: string;
  autoRotate?: boolean;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function CompactModel({ url, autoRotate = true }: { url: string; autoRotate?: boolean }) {
  const meshRef = useRef<Group>(null);
  const gltf = useLoader(GLTFLoader, url);

  useFrame((state) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={meshRef}>
      <primitive object={gltf.scene} scale={0.8} />
    </group>
  );
}

export function CompactModelViewer({
  modelUrl,
  className = '',
  autoRotate = true
}: CompactModelViewerProps) {
  const [error, setError] = useState<string | null>(null);

  const handleError = () => {
    setError('Failed to load 3D model');
  };

  if (!modelUrl) {
    return (
      <div className={`w-20 h-20 bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-xs">📦</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-20 h-20 bg-destructive/10 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-xs">⚠️</span>
      </div>
    );
  }

  return (
    <div className={`w-20 h-20 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        className="w-full h-full"
      >
        <Suspense fallback={<LoadingSpinner />}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Environment preset="studio" />

          <CompactModel url={modelUrl} autoRotate={autoRotate} />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            autoRotate={false}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
