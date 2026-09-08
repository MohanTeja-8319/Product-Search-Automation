import React, { useEffect, useRef } from "react";

export default function ParticleBackground({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    // Mouse tracker
    const mouse = {
      x: null,
      y: null,
      radius: 140,
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    // Burst of sparkles on click
    const burstParticles = [];
    const handleClick = (e) => {
      const burstCount = 16;
      for (let i = 0; i < burstCount; i++) {
        const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5);
        const speed = Math.random() * 3 + 2;
        burstParticles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 2 + 1,
          alpha: 1,
          color: ["#a78bfa", "#38bdf8", "#f472b6", "#fbbf24", "#ffffff"][
            Math.floor(Math.random() * 5)
          ],
          life: 1,
          decay: Math.random() * 0.02 + 0.015,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("click", handleClick);

    // Particle Palette
    const colors = [
      "rgba(167, 139, 250, ", // Violet / purple
      "rgba(96, 165, 250, ",  // Sky blue
      "rgba(192, 132, 252, ", // Purple light
      "rgba(56, 189, 248, ",  // Cyan
      "rgba(244, 114, 182, ", // Pink accent
      "rgba(255, 255, 255, ", // Bright white stars
    ];

    let particles = [];
    const getParticleCount = () => {
      const area = width * height;
      if (width < 640) return 45;
      if (width < 1024) return 75;
      return Math.min(130, Math.floor(area / 14000));
    };

    const initParticles = () => {
      particles = [];
      const count = getParticleCount();
      for (let i = 0; i < count; i++) {
        const sizeTier = Math.random();
        let radius = 1;
        if (sizeTier > 0.85) {
          radius = Math.random() * 1.5 + 1.8; // Larger glow node
        } else if (sizeTier > 0.5) {
          radius = Math.random() * 0.8 + 1.1; // Medium sparkle
        } else {
          radius = Math.random() * 0.6 + 0.6; // Tiny star dust
        }

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.65,
          vy: (Math.random() - 0.5) * 0.65,
          radius: radius,
          baseAlpha: Math.random() * 0.5 + 0.35,
          alpha: Math.random() * 0.5 + 0.35,
          alphaSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
          colorBase: colors[Math.floor(Math.random() * colors.length)],
          glowing: sizeTier > 0.75,
        });
      }
    };

    initParticles();

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and update regular particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries smoothly
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Twinkle effect (alpha oscillation)
        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.85 || p.alpha < 0.2) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            // Gentle attraction and cursor connection
            const force = (mouse.radius - dist) / mouse.radius;
            p.x += (dx / dist) * force * 0.8;
            p.y += (dy / dist) * force * 0.8;

            // Draw line to mouse
            const mouseLineAlpha = (1 - dist / mouse.radius) * 0.3;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(167, 139, 250, ${mouseLineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connect nearby particles (constellation network)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 95;

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(147, 130, 245, ${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorBase}${p.alpha})`;

        if (p.glowing) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = `${p.colorBase}0.8)`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // Render click burst particles
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const bp = burstParticles[i];
        bp.x += bp.vx;
        bp.y += bp.vy;
        bp.vx *= 0.94;
        bp.vy *= 0.94;
        bp.life -= bp.decay;

        if (bp.life <= 0) {
          burstParticles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(bp.x, bp.y, bp.radius * bp.life, 0, Math.PI * 2);
        ctx.fillStyle = bp.color;
        ctx.globalAlpha = Math.max(0, bp.life);
        ctx.shadowBlur = 10;
        ctx.shadowColor = bp.color;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {/* Dynamic ambient glowing light blobs in background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '8s', animationDelay: '1s' }} />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '7s', animationDelay: '2s' }} />
      
      {/* Canvas rendering tiny particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
      />
    </div>
  );
}
