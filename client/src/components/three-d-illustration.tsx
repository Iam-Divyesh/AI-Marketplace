import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh } from "three";

function FloatingPalette() {
  const meshRef = useRef<Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.3;
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={hovered ? 1.2 : 1}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <torusGeometry args={[1.2, 0.3, 16, 32]} />
      <meshStandardMaterial
        color={hovered ? "#a855f7" : "#06b6d4"}
        emissive={hovered ? "#7c3aed" : "#0891b2"}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function FloatingOrbs() {
  return (
    <>
      <mesh position={[2.5, 1, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#10b981" emissive="#065f46" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-2.5, -0.5, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#5b21b6" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, -2, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.5} />
      </mesh>
    </>
  );
}

export default function ThreeDIllustration() {
  return (
    <div className="w-80 h-80 relative" data-testid="three-d-illustration">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 animate-pulse-slow" />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        className="relative z-10"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#a855f7" />
        <pointLight position={[-10, -10, 5]} intensity={0.5} color="#06b6d4" />
        <FloatingPalette />
        <FloatingOrbs />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
    </div>
  );
}
