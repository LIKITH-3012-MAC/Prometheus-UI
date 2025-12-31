"use client";
import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";

// ---------- PARTICLES ----------
interface Particle {
  x: number; y: number; z: number; size: number; speed: number;
}

function Particles({ audioLevel }: { audioLevel: number }) {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 250 }, () => ({
      x: (Math.random() - 0.5) * 120,
      y: (Math.random() - 0.5) * 60,
      z: (Math.random() - 0.5) * 120,
      size: Math.random() * 0.25 + 0.05,
      speed: Math.random() * 0.02 + 0.003,
    }))
  );

  useFrame(() => {
    particles.forEach(p => { p.y -= p.speed * (audioLevel + 1); if(p.y < -30) p.y = 30; });
  });

  return (
    <group>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshStandardMaterial color="#00f6ff" emissive="#00f6ff" emissiveIntensity={0.7 + audioLevel} />
        </mesh>
      ))}
    </group>
  );
}

// ---------- ORB ----------
function Orb({ audioLevel }: { audioLevel: number }) {
  const ref = useRef<any>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.25;
      ref.current.scale.setScalar(1 + audioLevel * 0.4);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial
        color="#a855f7"
        emissive="#a855f7"
        emissiveIntensity={1 + audioLevel * 0.7}
        roughness={0.2}
        metalness={0.6}
      />
    </mesh>
  );
}

// ---------- FLOATING NODES ----------
function Nodes({ audioLevel }: { audioLevel: number }) {
  const [nodes] = useState(
    Array.from({ length: 16 }, () => ({
      x: (Math.random() - 0.5) * 12,
      y: (Math.random() - 0.5) * 12,
      z: (Math.random() - 0.5) * 12,
      size: Math.random() * 0.2 + 0.05,
    }))
  );
  return (
    <group>
      {nodes.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.size, 16, 16]} />
          <meshStandardMaterial color="#00f6ff" emissive="#00f6ff" emissiveIntensity={0.7 + audioLevel} />
        </mesh>
      ))}
    </group>
  );
}

// ---------- MICROPHONE LEVEL ----------
export function useMicLevel() {
  const [level, setLevel] = useState(0);
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      source.connect(analyser);
      analyser.fftSize = 256;
      const data = new Uint8Array(analyser.frequencyBinCount);

      const update = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a,b) => a+b, 0) / data.length / 255;
        setLevel(avg);
        requestAnimationFrame(update);
      };
      update();
    });
  }, []);
  return level;
}

// ---------- CURSOR TRAILS ----------
function CursorTrail() {
  const [points, setPoints] = useState<{x:number,y:number}[]>([]);
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPoints(prev => [...prev.slice(-20), { x: e.clientX, y: e.clientY }]);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
      {points.map((p,i) => (
        <div key={i} className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 blur-xl" style={{ left: p.x, top: p.y }} />
      ))}
    </div>
  );
}

// ---------- ULTRA COSMIC STARFIELD ----------
export default function UltraCosmic() {
  const audioLevel = useMicLevel();
  return (
    <>
      {/* Cursor Trail */}
      <CursorTrail />
      {/* WebGL Canvas */}
      <Canvas camera={{ position: [0,0,50], fov:75 }}>
        <ambientLight intensity={0.3}/>
        <pointLight position={[10,10,10]} intensity={1}/>
        <pointLight position={[-10,-5,-10]} intensity={0.5} color="#ff00ff"/>
        <Particles audioLevel={audioLevel}/>
        <Orb audioLevel={audioLevel}/>
        <Nodes audioLevel={audioLevel}/>
      </Canvas>
      {/* Future: Nebula background, TTS bubble glow */}
    </>
  );
}
