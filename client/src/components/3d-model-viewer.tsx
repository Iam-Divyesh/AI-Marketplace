import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Group, Object3D } from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, Maximize2, Minimize2, Download } from 'lucide-react';

interface ModelViewerProps {
  modelUrl?: string;
  fallbackImage?: string;
  productName?: string;
  className?: string;
}

function LoadingSpinner() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center space-y-2">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">{Math.round(progress)}% loaded</p>
      </div>
    </Html>
  );
}

function Model({ url, onLoad }: { url: string; onLoad?: (model: Group) => void }) {
  const meshRef = useRef<Group>(null);
  const gltf = useLoader(GLTFLoader, url);

  React.useEffect(() => {
    if (gltf.scene && onLoad) {
      onLoad(gltf.scene);
    }
  }, [gltf.scene, onLoad]);

  useFrame((state) => {
    if (meshRef.current) {
      // Optional: Add subtle rotation animation
      // meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={meshRef}>
      <primitive object={gltf.scene} scale={1} />
    </group>
  );
}

function ModelViewerControls({ 
  onReset, 
  onFullscreen, 
  isFullscreen, 
  onDownload 
}: {
  onReset: () => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
  onDownload?: () => void;
}) {
  return (
    <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
      <Button
        size="sm"
        variant="secondary"
        onClick={onReset}
        className="h-8 w-8 p-0"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={onFullscreen}
        className="h-8 w-8 p-0"
      >
        {isFullscreen ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </Button>
      {onDownload && (
        <Button
          size="sm"
          variant="secondary"
          onClick={onDownload}
          className="h-8 w-8 p-0"
        >
          <Download className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export function ModelViewer({ 
  modelUrl, 
  fallbackImage, 
  productName, 
  className = '' 
}: ModelViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controlsRef = useRef<any>(null);

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    if (modelUrl) {
      const link = document.createElement('a');
      link.href = modelUrl;
      link.download = `${productName || 'model'}.glb`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleModelLoad = (model: Group) => {
    setModelLoaded(true);
    setError(null);
    
    // Center the model
    const box = new (require('three').Box3)().setFromObject(model);
    const center = box.getCenter(new (require('three').Vector3)());
    model.position.sub(center);
  };

  const handleError = () => {
    setError('Failed to load 3D model');
  };

  if (!modelUrl) {
    return (
      <Card className={`w-full h-96 ${className}`}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-muted-foreground">No 3D model available</p>
            {fallbackImage && (
              <img 
                src={fallbackImage} 
                alt={productName || 'Product'} 
                className="mt-4 max-w-full max-h-64 object-contain"
              />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const containerClass = isFullscreen 
    ? 'fixed inset-0 z-50 bg-background' 
    : `w-full h-96 ${className}`;

  return (
    <div className={containerClass}>
      <Card className="h-full">
        <CardContent className="p-0 h-full relative">
          <ModelViewerControls
            onReset={handleReset}
            onFullscreen={handleFullscreen}
            isFullscreen={isFullscreen}
            onDownload={handleDownload}
          />
          
          {error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <p className="text-destructive mb-4">{error}</p>
                {fallbackImage && (
                  <img 
                    src={fallbackImage} 
                    alt={productName || 'Product'} 
                    className="max-w-full max-h-64 object-contain"
                  />
                )}
              </div>
            </div>
          ) : (
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              className="w-full h-full"
            >
              <Suspense fallback={<LoadingSpinner />}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Environment preset="studio" />
                
                <Model 
                  url={modelUrl} 
                  onLoad={handleModelLoad}
                />
                
                <OrbitControls
                  ref={controlsRef}
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  autoRotate={false}
                  autoRotateSpeed={0.5}
                />
              </Suspense>
            </Canvas>
          )}
          
          {!modelLoaded && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <LoadingSpinner />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// AR Component for mobile devices
export function ARViewer({ modelUrl, productName }: { modelUrl: string; productName?: string }) {
  const [isSupported, setIsSupported] = useState(false);

  React.useEffect(() => {
    // Check if WebXR is supported
    if ('xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-ar').then(setIsSupported);
    }
  }, []);

  const startAR = async () => {
    if (!isSupported) {
      alert('AR is not supported on this device');
      return;
    }

    try {
      // This would integrate with WebXR for AR viewing
      // For now, we'll show a placeholder
      alert('AR feature coming soon!');
    } catch (error) {
      console.error('AR error:', error);
      alert('Failed to start AR session');
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button onClick={startAR} className="w-full">
      View in AR
    </Button>
  );
}
