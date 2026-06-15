import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import * as THREE from "three";

export default defineComponent({
  name: "AIOrb",
  setup() {
    const containerRef = ref<HTMLDivElement | null>(null);

    onMounted(() => {
      const container = containerRef.value;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      // Scene, Camera, Renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      camera.position.z = 6.2;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambientLight);

      const electricBlueLight = new THREE.PointLight(0x0066ff, 2.0, 100);
      electricBlueLight.position.set(5, 5, 5);
      scene.add(electricBlueLight);

      const royalBlueLight = new THREE.PointLight(0x001b4d, 1.5, 100);
      royalBlueLight.position.set(-5, -5, -5);
      scene.add(royalBlueLight);

      // Core Orb
      const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x0066ff,
        emissive: 0x0066ff,
        emissiveIntensity: 1.4,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.85,
      });
      const coreOrb = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(coreOrb);

      // Ring group
      const ringGroup = new THREE.Group();
      scene.add(ringGroup);

      // Helper function to create line rings
      const createRing = (radius: number, color: number, tiltX = 0, tiltY = 0) => {
        const ringGeo = new THREE.RingGeometry(radius - 0.02, radius + 0.02, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.45,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = tiltX;
        ring.rotation.y = tiltY;
        return ring;
      };

      const ring1 = createRing(1.8, 0x001b4d, Math.PI / 2);
      const ring2 = createRing(2.3, 0x0066ff, Math.PI / 2.5, Math.PI / 6);
      ringGroup.add(ring1);
      ringGroup.add(ring2);

      // Tiny orbital nodes
      const nodeGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      
      const node1 = new THREE.Mesh(nodeGeo, nodeMat);
      node1.position.set(1.8, 0, 0);
      ringGroup.add(node1);

      const node2 = new THREE.Mesh(nodeGeo, nodeMat);
      node2.position.set(-2.3, 0, 0);
      ringGroup.add(node2);

      // Animate
      const clock = new THREE.Clock();
      let animationFrameId: number;

      const animate = () => {
        const elapsed = clock.getElapsedTime();

        // Rotate core
        coreOrb.rotation.y = elapsed * 0.45;
        coreOrb.rotation.x = elapsed * 0.2;

        // Breathe Core
        const scale = 1.35 + Math.sin(elapsed * 2.2) * 0.08;
        coreOrb.scale.set(scale, scale, scale);

        // Rotate rings
        ringGroup.rotation.y = elapsed * 0.18;
        ringGroup.rotation.z = elapsed * 0.05;

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      // Resize handler
      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener("resize", handleResize);

      onUnmounted(() => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationFrameId);
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      });
    });

    return () => (
      <div className="flex flex-col items-center justify-center p-3 bg-black/40 border border-white/5 shadow-2xl rounded-2xl relative overflow-hidden h-44 w-full group select-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-slate-500/5 pointer-events-none" />
        <div ref={containerRef} className="w-full h-32 cursor-grab active:cursor-grabbing" />
        <div className="text-center z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/40 border border-blue-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[9px] font-bold tracking-[0.2em] font-orbitron text-blue-500">
              PROMETHEUS CORE ONLINE
            </span>
          </div>
        </div>
      </div>
    );
  },
});
