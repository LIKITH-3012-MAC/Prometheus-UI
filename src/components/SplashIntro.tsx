import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import * as THREE from "three";

export default defineComponent({
  name: "SplashIntro",
  emits: ["complete", "startTransition"],
  setup(props, { emit }) {
    const isTransitioning = ref(false);
    const orbContainerRef = ref<HTMLDivElement | null>(null);
    const showTitle = ref(false);
    const showSubtitle = ref(false);
    const showStatus = ref(false);
    const showCoreOnline = ref(false);
    const currentStatusLines = ref<string[]>([]);
    
    // List of timeout IDs to clean up on unmount
    const timeouts: any[] = [];
    
    const skipIntro = () => {
      if (isTransitioning.value) return;
      isTransitioning.value = true;
      emit("startTransition");
      const t = setTimeout(() => {
        emit("complete");
      }, 500); // Let the transition finish
      timeouts.push(t);
    };

    onMounted(() => {
      // 1. Setup Three.js scene
      const container = orbContainerRef.value;
      if (!container) {
        // If container missing, skip animation and auto-complete
        timeouts.push(setTimeout(() => {
          emit("startTransition");
        }, 500));
        timeouts.push(setTimeout(() => {
          emit("complete");
        }, 1000));
        return;
      }

      let renderer: THREE.WebGLRenderer | null = null;
      
      try {
      const width = container.clientWidth;
      const height = container.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 7;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
      scene.add(ambientLight);

      const blueLight = new THREE.PointLight(0x0066ff, 3, 50);
      blueLight.position.set(0, 0, 0);
      scene.add(blueLight);

      const accentLight = new THREE.DirectionalLight(0xffffff, 0.8);
      accentLight.position.set(5, 5, 5);
      scene.add(accentLight);

      // Core Sphere
      const sphereGeo = new THREE.SphereGeometry(1.2, 64, 64);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x0066ff,
        emissive: 0x0066ff,
        emissiveIntensity: 1.8,
        roughness: 0.05,
        metalness: 0.9,
        transparent: true,
        opacity: 0.0, // starts invisible, fades in during 0.5s - 1.3s
      });
      const coreOrb = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(coreOrb);

      // Rings group
      const ringGroup = new THREE.Group();
      scene.add(ringGroup);

      const createRing = (radius: number, color: number, opacity: number, tiltX = 0, tiltY = 0) => {
        const ringGeo = new THREE.RingGeometry(radius - 0.015, radius + 0.015, 128);
        const ringMat = new THREE.MeshBasicMaterial({
          color: color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0, // start invisible
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = tiltX;
        ring.rotation.y = tiltY;
        return { mesh: ring, targetOpacity: opacity };
      };

      const rings = [
        createRing(2.0, 0x0066ff, 0.6, Math.PI / 2, 0),
        createRing(2.4, 0xffffff, 0.25, Math.PI / 2.5, Math.PI / 8),
        createRing(2.8, 0x001b4d, 0.8, Math.PI / 3, -Math.PI / 6),
      ];

      rings.forEach(r => ringGroup.add(r.mesh));

      // Drift Particles
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const particleCount = isMobile ? 60 : 150;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 1.5 + Math.random() * 3.5;

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        const isBlue = Math.random() > 0.4;
        colors[i * 3] = isBlue ? 0.0 : 1.0;
        colors[i * 3 + 1] = isBlue ? 0.4 : 1.0;
        colors[i * 3 + 2] = isBlue ? 1.0 : 1.0;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.04,
        vertexColors: true,
        transparent: true,
        opacity: 0,
      });

      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      // Mouse Parallax variables
      let targetMouseX = 0;
      let targetMouseY = 0;
      let mouseX = 0;
      let mouseY = 0;

      const onMouseMove = (e: MouseEvent) => {
        targetMouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        targetMouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      };

      window.addEventListener("mousemove", onMouseMove);

      // Animation Loop
      const clock = new THREE.Clock();
      let animationFrameId: number;
      let bootTime = 0;

      const animate = () => {
        const delta = clock.getDelta();
        bootTime += delta;

        // 1. Time-based reveals inside Three.js
        if (bootTime < 0.5) {
          particleMat.opacity = THREE.MathUtils.lerp(particleMat.opacity, 0.8, delta * 3);
        } else if (bootTime >= 0.5 && bootTime < 2.5) {
          particleMat.opacity = THREE.MathUtils.lerp(particleMat.opacity, 0.9, delta * 2);
          sphereMat.opacity = THREE.MathUtils.lerp(sphereMat.opacity, 0.85, delta * 2);
          rings.forEach(r => {
            r.mesh.material.opacity = THREE.MathUtils.lerp(r.mesh.material.opacity, r.targetOpacity, delta * 2);
          });
        }

        // Orb breathing
        const scale = 1.0 + Math.sin(bootTime * 2.5) * 0.04;
        coreOrb.scale.set(scale, scale, scale);

        // Core rotation
        coreOrb.rotation.y += delta * 0.15;
        coreOrb.rotation.x += delta * 0.08;

        // Rings rotation
        ringGroup.rotation.y += delta * 0.2;
        ringGroup.rotation.x += delta * 0.05;

        // Particle cloud slow drift
        particleSystem.rotation.y += delta * 0.05;

        // Mouse Parallax lerp
        mouseX = THREE.MathUtils.lerp(mouseX, targetMouseX, delta * 4);
        mouseY = THREE.MathUtils.lerp(mouseY, targetMouseY, delta * 4);
        camera.position.x = mouseX * 0.8;
        camera.position.y = -mouseY * 0.8;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      // Resize handler
      const handleResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      // --- SEQUENCE TIMELINE ---
      // 1.1s Reveal Title
      timeouts.push(setTimeout(() => {
        showTitle.value = true;
      }, 1100));

      // 1.8s Reveal Subtitle
      timeouts.push(setTimeout(() => {
        showSubtitle.value = true;
      }, 1800));

      // 2.3s Activation Pulse
      timeouts.push(setTimeout(() => {
        showCoreOnline.value = true;
      }, 2300));

      // 2.5s Start transition (total 3.0s including 500ms fade duration)
      timeouts.push(setTimeout(() => {
        isTransitioning.value = true;
        emit("startTransition");
      }, 2500));

      // 3.0s Transition Complete -> Emit complete
      timeouts.push(setTimeout(() => {
        emit("complete");
      }, 3000));

      // Boot Status Lines reveals
      const logLines = [
        "[ OK ] INITIALIZING PROMETHEUS OS CORE...",
        "[ OK ] SYNCING NEURAL REASONING MATRIX...",
        "[ OK ] ESTABLISHING SECURE SOVEREIGN LINK...",
        "[ OK ] COGNITIVE VECTOR ENGINE ACTIVE...",
        "[ OK ] CORE ACTIVATION COMPLETED."
      ];

      timeouts.push(setTimeout(() => { showStatus.value = true; }, 100));

      logLines.forEach((line, index) => {
        const delay = 100 + index * 400;
        timeouts.push(setTimeout(() => {
          currentStatusLines.value.push(line);
        }, delay));
      });

      // Unmount cleanup
      onUnmounted(() => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationFrameId);
        if (renderer) {
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
        timeouts.forEach(t => clearTimeout(t));
      });

      } catch (e) {
        // WebGL or Three.js failed — gracefully skip the 3D animation
        console.warn("Prometheus SplashIntro: WebGL initialization failed, skipping 3D intro.", e);
        // Still fire transition events so the app doesn't stay stuck on black screen
        timeouts.push(setTimeout(() => {
          isTransitioning.value = true;
          emit("startTransition");
        }, 800));
        timeouts.push(setTimeout(() => {
          emit("complete");
        }, 1300));

        onUnmounted(() => {
          timeouts.forEach(t => clearTimeout(t));
        });
      }
    });

    return () => (
      <div
        className={`fixed inset-0 z-[9999] bg-[#000000] flex flex-col items-center justify-center transition-all duration-[500ms] ease-in-out select-none overflow-hidden ${
          isTransitioning.value ? "opacity-0 blur-2xl scale-105 pointer-events-none" : "opacity-100 scale-100"
        }`}
      >
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.06)_0%,transparent_70%)] pointer-events-none" />

        {/* Scan lines & Grid for sci-fi HUD vibe */}
        <div className="cinematic-grid !opacity-20" />
        <div className="scan-line-overlay !opacity-10" />

        {/* Skip button in corner */}
        <button
          onClick={skipIntro}
          className="absolute top-8 right-8 px-4 py-2 border border-white/5 hover:border-blue-500/30 bg-zinc-950/40 text-[9px] tracking-[0.25em] text-zinc-500 hover:text-white rounded-lg transition-all z-50 cursor-pointer font-orbitron active:scale-95"
        >
          SKIP BOOT SEQUENCE ➔
        </button>

        {/* 3D AI Orb Container */}
        <div className="w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] md:w-[450px] md:h-[450px] relative flex items-center justify-center">
          <div ref={orbContainerRef} className="w-full h-full" />
          
          <div className="absolute bottom-2 flex flex-col items-center gap-1.5 pointer-events-none">
            {showCoreOnline.value && (
              <div className="px-3 py-1 rounded border border-blue-500/30 bg-blue-950/40 text-[9px] font-bold text-blue-400 tracking-[0.3em] font-orbitron animate-pulse shadow-[0_0_15px_rgba(0,102,255,0.2)]">
                CORE ONLINE
              </div>
            )}
          </div>
        </div>

        {/* Cinematic Titles */}
        <div className="text-center mt-4 space-y-4 max-w-2xl px-6 relative z-10 select-none">
          <h1
            className={`text-xl sm:text-2xl md:text-5xl font-black font-orbitron uppercase tracking-wider bg-gradient-to-r from-blue-500 via-white to-blue-400 bg-clip-text text-transparent transition-all duration-[800ms] transform ${
              showTitle.value
                ? "opacity-100 translate-y-0 filter-none scale-100"
                : "opacity-0 translate-y-4 filter-[blur(6px)] scale-95"
            }`}
            style={{
              textShadow: "0 0 20px rgba(0,102,255,0.2)"
            }}
          >
            Welcome to Prometheus AI
          </h1>

          {/* Underline light streak */}
          <div className="flex justify-center">
            <div
              className={`h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent transition-all duration-[1000ms] ${
                showTitle.value ? "w-48 sm:w-64" : "w-0"
              }`}
            />
          </div>

          <p
            className={`text-[9px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.35em] text-zinc-400 font-bold uppercase transition-all duration-[800ms] delay-200 ${
              showSubtitle.value
                ? "opacity-100 filter-none scale-100"
                : "opacity-0 filter-[blur(4px)] scale-95"
            }`}
          >
            A Sakra Vision Group Project
          </p>
        </div>

        {/* Boot Terminal Log Output */}
        {showStatus.value && (
          <div className="absolute bottom-12 left-12 hidden lg:flex flex-col items-start gap-1 font-mono-tech text-[8px] text-zinc-600 select-none pointer-events-none max-w-xs">
            {currentStatusLines.value.map((line, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-bottom-1 duration-200">
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
});
