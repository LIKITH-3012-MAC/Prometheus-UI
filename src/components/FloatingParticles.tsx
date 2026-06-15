import { defineComponent, onMounted, onUnmounted, ref } from "vue";

export default defineComponent({
  name: "FloatingParticles",
  setup() {
    const canvasRef = ref<HTMLCanvasElement | null>(null);

    onMounted(() => {
      const canvas = canvasRef.value;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let animationFrameId: number;
      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      const colors = ["#0066FF", "#009DFF", "#FFFFFF", "#EAF2FF"];
      const particles = Array.from({ length: 15 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.06,
        speedY: (Math.random() - 0.5) * 0.06,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.2 + 0.05,
        fadeSpeed: Math.random() * 0.002 + 0.0005,
        fadeDir: 1,
      }));

      const resize = () => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      };

      window.addEventListener("resize", resize);

      const draw = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p) => {
          p.x += p.speedX;
          p.y += p.speedY;

          if (p.x < 0 || p.x > width) p.speedX *= -1;
          if (p.y < 0 || p.y > height) p.speedY *= -1;

          p.alpha += p.fadeSpeed * p.fadeDir;
          if (p.alpha > 0.55) {
            p.fadeDir = -1;
          } else if (p.alpha < 0.1) {
            p.fadeDir = 1;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          if (p.size > 1.8) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
          }
          ctx.fill();
          ctx.restore();
        });

        animationFrameId = requestAnimationFrame(draw);
      };

      draw();

      onUnmounted(() => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationFrameId);
      });
    });

    return () => (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />
    );
  },
});
