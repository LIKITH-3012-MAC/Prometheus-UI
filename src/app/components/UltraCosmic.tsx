"use client";
import React, { useRef, useEffect, useState } from "react";

export default function UltraCosmic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const p = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.8,
      dy: (Math.random() - 0.5) * 0.8,
      color: `hsl(${Math.random()*360},100%,60%)`
    }));
    setParticles(p);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      p.forEach((particle) => {
        particle.x += particle.dx;
        particle.y += particle.dy;
        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI*2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}

export function useMicLevel() {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!navigator.mediaDevices.getUserMedia) return;
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const update = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a,b)=>a+b,0)/data.length/256;
        setLevel(avg);
        requestAnimationFrame(update);
      };
      update();
    });
  }, []);

  return level;
}
