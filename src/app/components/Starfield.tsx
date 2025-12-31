"use client";
import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { motion } from "framer-motion";

const Star = ({ position, size }: { position: [number, number, number]; size: number }) => {
  const meshRef = useRef<any>(null);
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.001;
  });
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial color="#00f6ff" emissive="#00f6ff" emissiveIntensity={0.7} />
    </mesh>
  );
};

const Stars = () => {
  const stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * 200 - 100,
    y: Math.random() * 200 - 100,
    z: Math.random() * 200 - 100,
    size: Math.random() * 0.3 + 0.05,
  }));
  return (
    <group>
      {stars.map((s, i) => (
        <Star key={i} position={[s.x, s.y, s.z]} size={s.size} />
      ))}
    </group>
  );
};

const Orb = () => {
  const meshRef = useRef<any>(null);
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.002;
    if (meshRef.current) meshRef.current.rotation.x += 0.001;
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.6} transparent opacity={0.4} />
    </mesh>
  );
};

const Nodes = () => {
  const [nodes, setNodes] = useState(
    Array.from({ length: 30 }, () => ({
      x: Math.random() * 20 - 10,
      y: Math.random() * 20 - 10,
      z: Math.random() * 20 - 10,
      size: Math.random() * 0.5 + 0.1,
    }))
  );
  return (
    <group>
      {nodes.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.size, 16, 16]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.7} />
        </mesh>
      ))}
    </group>
  );
};

// MIC WAVEFORM VISUALIZER
export const MicWaveform = ({ audioLevel }: { audioLevel: number }) => {
  return (
    <motion.div
      animate={{ scaleY: 0.5 + audioLevel * 3 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="w-1 h-6 bg-cyan-400 mx-0.5 rounded-full"
    />
  );
};

export default function Starfield() {
  return (
    <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars />
      <Orb />
      <Nodes />
    </Canvas>
  );
}
