import React, { useEffect, useRef, useState, useCallback } from "react";
import "./ComparelyLogoAnimation.css";

/**
 * Premium Comparely Logo Animation Component
 * Strict timing (0s - 6.8s):
 * - 0.0s - 1.0s: Scene 1 (Clean white, soft ambient glow, converging particles)
 * - 1.0s - 2.4s: Scene 2 (Large 'C' shape draws itself smoothly around center)
 * - 1.6s - 2.5s: Scene 2 (Shopping cart scales & fades in)
 * - 2.0s - 2.7s: Scene 2 (3 comparison bars appear staggered left-to-right)
 * - 2.7s - 3.4s: Scene 3 (Logo lockup settles with gentle 95% -> 100% scale + soft shadow)
 * - 3.2s - 4.2s: Scene 4 ("Comparely" brand name fades/slides in)
 * - 4.2s - 5.0s: Scene 5 ("Compare • Choose • Save" tagline reveals)
 * - 5.0s - 6.8s: Scene 6 (Final hold for 1.8s)
 */

// Easing functions
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const easeInOutCubic = (x) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const easeOutBack = (x) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
const clamp = (val, min = 0, max = 1) => Math.min(Math.max(val, min), max);

export default function ComparelyLogoAnimation({
  onComplete,
  autoPlay = true,
  standalone = false,
  showControls = true
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isFinished, setIsFinished] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);

  // Total animation duration in seconds
  const DURATION = 6.8;

  // Particle pool for intro convergence
  const particlesRef = useRef([]);

  const initParticles = useCallback((width, height) => {
    const pts = [];
    const count = 38;
    const cx = width / 2;
    const cy = height * 0.46;

    for (let i = 0; i < count; i++) {
      // Spawn around outer radius
      const angle = Math.random() * Math.PI * 2;
      const dist = 220 + Math.random() * 260;
      const isMint = Math.random() > 0.45;

      pts.push({
        startX: cx + Math.cos(angle) * dist,
        startY: cy + Math.sin(angle) * dist,
        targetX: cx + (Math.random() - 0.5) * 80,
        targetY: cy + (Math.random() - 0.5) * 80,
        size: 2.2 + Math.random() * 3.2,
        color: isMint ? "rgba(16, 185, 129," : "rgba(79, 70, 229,",
        speed: 0.7 + Math.random() * 0.6,
        alpha: 0.15 + Math.random() * 0.6,
        lifeDelay: Math.random() * 0.6
      });
    }
    particlesRef.current = pts;
  }, []);

  // Animation Loop
  const tick = useCallback(
    (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const t = Math.min(elapsed, DURATION);
      setCurrentTime(t);

      // Render subtle convergent particles on canvas during scene 1 & 2
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Only draw particles between 0s and 2.4s
        if (t < 2.4) {
          const fadeOverall = t < 1.6 ? 1 : 1 - (t - 1.6) / 0.8;
          particlesRef.current.forEach((p) => {
            if (t > p.lifeDelay) {
              const pt = clamp((t - p.lifeDelay) * p.speed, 0, 1);
              const eased = easeOutCubic(pt);
              const x = p.startX + (p.targetX - p.startX) * eased;
              const y = p.startY + (p.targetY - p.startY) * eased;
              const a = p.alpha * fadeOverall * Math.sin(pt * Math.PI);

              if (a > 0.01) {
                ctx.beginPath();
                ctx.arc(x, y, p.size * (1 - pt * 0.4), 0, Math.PI * 2);
                ctx.fillStyle = `${p.color}${a.toFixed(3)})`;
                ctx.shadowColor = p.color === "rgba(16, 185, 129," ? "#10B981" : "#4F46E5";
                ctx.shadowBlur = 6;
                ctx.fill();
                ctx.shadowBlur = 0;
              }
            }
          });
        }
      }

      if (elapsed >= DURATION) {
        setIsFinished(true);
        setIsPlaying(false);
        if (onComplete) onComplete();
        return;
      }

      if (isPlaying) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    },
    [DURATION, isPlaying, onComplete]
  );

  // Play / Pause / Reset handlers
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setIsFinished(false);
    startTimeRef.current = performance.now() - currentTime * 1000;
    animFrameRef.current = requestAnimationFrame(tick);
  }, [currentTime, tick]);

  const handleReplay = useCallback(() => {
    setCurrentTime(0);
    setIsFinished(false);
    setIsPlaying(true);
    startTimeRef.current = performance.now();
    const canvas = canvasRef.current;
    if (canvas) initParticles(canvas.width, canvas.height);
    animFrameRef.current = requestAnimationFrame(tick);
  }, [initParticles, tick]);

  const handleSkip = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setCurrentTime(DURATION);
    setIsFinished(true);
    setIsPlaying(false);
    if (onComplete) onComplete();
  }, [DURATION, onComplete]);

  // Init canvas dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    const ctx = canvas.getContext("2d");
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    initParticles(rect.width, rect.height);
  }, [initParticles]);

  // Autoplay hook
  useEffect(() => {
    if (autoPlay) {
      startTimeRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [autoPlay, tick]);

  // -------------------------------------------------------------
  // Calculate Scene States & Interpolations based on currentTime
  // -------------------------------------------------------------
  const t = currentTime;

  // Scene 1: Ambient soft shadow & glow (0s - 1.2s)
  const ambientGlowOpacity = t < 1.0 ? easeOutCubic(t / 1.0) * 0.9 : Math.max(0.2, 0.9 - (t - 1.0) * 0.4);

  // Scene 2: Large 'C' shape drawing (1.0s - 2.4s)
  // C sweeps around CCW from angle ~38deg around 284deg to 322deg
  const cProgressRaw = clamp((t - 1.0) / 1.4);
  const cProgress = easeInOutCubic(cProgressRaw);
  // Sector angle: 0 to 284 degrees
  const sweepDegrees = cProgress * 286;
  // If progress is 1, mask is fully complete
  const isCComplete = cProgress >= 1;

  // Scene 2: Shopping Cart (1.6s - 2.5s)
  const cartProgressRaw = clamp((t - 1.6) / 0.9);
  const cartScale = cartProgressRaw === 0 ? 0.7 : 0.7 + 0.3 * easeOutBack(cartProgressRaw);
  const cartOpacity = clamp((t - 1.6) / 0.45);

  // Scene 2: Comparison Bars staggered left-to-right
  // Bar 1: 2.0s - 2.45s
  const b1Raw = clamp((t - 2.0) / 0.45);
  const b1Prog = easeOutCubic(b1Raw);
  // Bar 2: 2.18s - 2.63s
  const b2Raw = clamp((t - 2.18) / 0.45);
  const b2Prog = easeOutCubic(b2Raw);
  // Bar 3: 2.36s - 2.81s
  const b3Raw = clamp((t - 2.36) / 0.45);
  const b3Prog = easeOutCubic(b3Raw);

  // Scene 3: Logo Lockup gentle scale 95% -> 100% + subtle elevation shadow (2.7s - 3.4s)
  const lockupProgressRaw = clamp((t - 2.7) / 0.7);
  const lockupScale = t < 2.7 ? 0.95 : 0.95 + 0.05 * easeOutCubic(lockupProgressRaw);
  const lockupShadowOpacity = easeOutCubic(clamp((t - 2.7) / 0.7));

  // Scene 4: "Comparely" Brand Name (3.2s - 4.2s)
  const titleProgressRaw = clamp((t - 3.2) / 0.85);
  const titleOpacity = easeOutCubic(titleProgressRaw);
  const titleTranslateY = (1 - easeOutCubic(titleProgressRaw)) * 22; // slides up from 22px

  // Scene 5: Tagline "Compare • Choose • Save" (4.2s - 5.0s)
  const taglineProgressRaw = clamp((t - 4.2) / 0.8);
  const taglineOpacity = easeOutCubic(taglineProgressRaw);
  const taglineTranslateY = (1 - easeOutCubic(taglineProgressRaw)) * 14;
  const taglineLetterSpacing = 0.08 + easeOutCubic(taglineProgressRaw) * 0.04; // 0.08em -> 0.12em

  // Dynamic SVG Mask for C Shape drawing
  // Center is at 41.5% (approx x=200, y=233 on 482x464)
  // We generate an SVG path sector that sweeps from 38deg CCW by sweepDegrees
  const generateCSectorPath = () => {
    const cx = 200;
    const cy = 233;
    const r = 320;
    // Angle in degrees from 38deg CCW (which in SVG standard clockwise space is 38 - sweepDeg)
    const startAngle = 38 * (Math.PI / 180);
    const endAngle = (38 - sweepDegrees) * (Math.PI / 180);

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    const largeArc = sweepDegrees > 180 ? 1 : 0;
    // Sweep-flag is 0 for counter-clockwise
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2} Z`;
  };

  // Sparkle leading tip of the C arc during drawing
  const getLeadingTipPos = () => {
    if (cProgressRaw <= 0.01 || cProgressRaw >= 0.99) return null;
    const cx = 200;
    const cy = 233;
    const r = 155;
    const curAngle = (38 - sweepDegrees) * (Math.PI / 180);
    return {
      x: cx + r * Math.cos(curAngle),
      y: cy + r * Math.sin(curAngle)
    };
  };

  const leadingTip = getLeadingTipPos();

  // -------------------------------------------------------------
  // Video Recording Functionality (Export 1080p 60fps WebM/MP4)
  // -------------------------------------------------------------
  const handleRecordVideo = async () => {
    if (isRecording) return;
    setIsRecording(true);
    setRecordProgress(0);

    const offscreen = document.createElement("canvas");
    offscreen.width = 1920;
    offscreen.height = 1080;
    const ctx = offscreen.getContext("2d");

    // Load layer images
    const loadImg = (src) =>
      new Promise((res) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => res(img);
        img.src = src;
      });

    const [imgC, imgCart, imgB1, imgB2, imgB3] = await Promise.all([
      loadImg("/animation/logo_c_shape.png"),
      loadImg("/animation/logo_cart.png"),
      loadImg("/animation/logo_bar1.png"),
      loadImg("/animation/logo_bar2.png"),
      loadImg("/animation/logo_bar3.png")
    ]);

    // Check media recorder support
    const stream = offscreen.captureStream(60);
    let mimeType = "video/webm;codecs=vp9";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/webm";
    }

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 8000000 // 8 Mbps high quality
    });
    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Comparely_Logo_Animation_1080p_60fps.webm";
      a.click();
      URL.revokeObjectURL(url);
      setIsRecording(false);
      setRecordProgress(0);
    };

    recorder.start();

    // Render 60fps frame by frame for DURATION seconds
    const fps = 60;
    const totalFrames = Math.round(DURATION * fps);

    for (let f = 0; f <= totalFrames; f++) {
      const simT = f / fps;
      setRecordProgress(Math.round((f / totalFrames) * 100));

      // Draw background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 1920, 1080);

      // Ambient center glow
      const ambA = simT < 1.0 ? easeOutCubic(simT / 1.0) * 0.08 : Math.max(0.02, 0.08 - (simT - 1.0) * 0.04);
      const ambRad = ctx.createRadialGradient(960, 480, 20, 960, 480, 420);
      ambRad.addColorStop(0, `rgba(79, 70, 229, ${ambA})`);
      ambRad.addColorStop(0.5, `rgba(16, 185, 129, ${ambA * 0.5})`);
      ambRad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = ambRad;
      ctx.fillRect(0, 0, 1920, 1080);

      // Lockup Transform
      ctx.save();
      const sLock = simT < 2.7 ? 0.95 : 0.95 + 0.05 * easeOutCubic(clamp((simT - 2.7) / 0.7));
      ctx.translate(960, 470);
      ctx.scale(sLock, sLock);

      // Soft shadow
      if (simT > 2.7) {
        const shA = easeOutCubic(clamp((simT - 2.7) / 0.7)) * 0.14;
        const shRad = ctx.createRadialGradient(0, 160, 10, 0, 160, 180);
        shRad.addColorStop(0, `rgba(67, 56, 202, ${shA})`);
        shRad.addColorStop(1, "rgba(67, 56, 202, 0)");
        ctx.fillStyle = shRad;
        ctx.beginPath();
        ctx.ellipse(0, 155, 140, 24, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Logo Mark (Target size 320 x 308)
      const mw = 320;
      const mh = 308;
      const mx = -mw / 2;
      const my = -mh / 2 - 45;

      // Draw C shape
      if (simT >= 1.0) {
        const simCProg = easeInOutCubic(clamp((simT - 1.0) / 1.4));
        ctx.save();
        if (simCProg < 1.0) {
          // Clip path sector
          const sweepDeg = simCProg * 286;
          const cx = mx + mw * (200 / 482);
          const cy = my + mh * (233 / 464);
          const r = 400;
          const sAngle = 38 * (Math.PI / 180);
          const eAngle = (38 - sweepDeg) * (Math.PI / 180);

          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + r * Math.cos(sAngle), cy + r * Math.sin(sAngle));
          ctx.arc(cx, cy, r, sAngle, eAngle, true);
          ctx.closePath();
          ctx.clip();
        }
        ctx.drawImage(imgC, mx, my, mw, mh);
        ctx.restore();
      }

      // Draw Shopping Cart
      if (simT >= 1.6) {
        const cartP = clamp((simT - 1.6) / 0.9);
        const sCart = cartP === 0 ? 0.7 : 0.7 + 0.3 * easeOutBack(cartP);
        const aCart = clamp((simT - 1.6) / 0.45);

        ctx.save();
        ctx.globalAlpha = aCart;
        ctx.translate(mx + mw * (233 / 482), my + mh * (240 / 464));
        ctx.scale(sCart, sCart);
        ctx.drawImage(
          imgCart,
          -mw * (233 / 482),
          -mh * (240 / 464),
          mw,
          mh
        );
        ctx.restore();
      }

      // Draw Comparison Bars
      const drawBar = (img, startTime) => {
        if (simT < startTime) return;
        const bProg = easeOutCubic(clamp((simT - startTime) / 0.45));
        ctx.save();
        ctx.globalAlpha = bProg;
        // Clip left-to-right
        ctx.beginPath();
        ctx.rect(mx, my, mw * (0.65 + 0.35 * bProg), mh);
        ctx.clip();
        ctx.drawImage(img, mx - (1 - bProg) * 20, my, mw, mh);
        ctx.restore();
      };

      drawBar(imgB1, 2.0);
      drawBar(imgB2, 2.18);
      drawBar(imgB3, 2.36);

      // Draw Brand Name "Comparely"
      if (simT >= 3.2) {
        const tProg = easeOutCubic(clamp((simT - 3.2) / 0.85));
        ctx.save();
        ctx.globalAlpha = tProg;
        ctx.font = "800 64px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const textY = my + mh + 60 + (1 - tProg) * 20;

        // Measure Compare and ly
        const textCompare = "Compare";
        const textLy = "ly";
        const w1 = ctx.measureText(textCompare).width;
        const w2 = ctx.measureText(textLy).width;
        const totalW = w1 + w2;

        ctx.fillStyle = "#0F172A";
        ctx.fillText(textCompare, -totalW / 2 + w1 / 2, textY);

        ctx.fillStyle = "#4F46E5";
        ctx.fillText(textLy, -totalW / 2 + w1 + w2 / 2, textY);
        ctx.restore();
      }

      // Draw Tagline "Compare • Choose • Save"
      if (simT >= 4.2) {
        const tagP = easeOutCubic(clamp((simT - 4.2) / 0.8));
        ctx.save();
        ctx.globalAlpha = tagP;
        ctx.font = "500 20px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const tagY = my + mh + 120 + (1 - tagP) * 12;

        // Render with colored separators
        const parts = ["COMPARE", "•", "CHOOSE", "•", "SAVE"];
        let totalTagW = 0;
        const widths = parts.map((p) => {
          const w = ctx.measureText(p + "  ").width;
          totalTagW += w;
          return w;
        });

        let curX = -totalTagW / 2;
        parts.forEach((p, idx) => {
          if (p === "•") {
            ctx.fillStyle = "#10B981";
            ctx.font = "700 22px 'Plus Jakarta Sans', sans-serif";
          } else {
            ctx.fillStyle = "#64748B";
            ctx.font = "600 20px 'Plus Jakarta Sans', sans-serif";
          }
          ctx.fillText(p, curX + widths[idx] / 2, tagY);
          curX += widths[idx];
        });
        ctx.restore();
      }

      ctx.restore();

      // Wait 1 frame delay
      await new Promise((r) => setTimeout(r, 1000 / fps));
    }

    recorder.stop();
  };

  return (
    <div
      ref={containerRef}
      className={`comparely-anim-container ${standalone ? "standalone" : ""}`}
      style={{
        width: "100%",
        height: standalone ? "100vh" : "100%",
        minHeight: standalone ? "100vh" : "620px"
      }}
    >
      {/* 16:9 Cinema Stage */}
      <div className="comparely-anim-stage">
        {/* Subtle breathing ambient glow */}
        <div
          className="comparely-ambient-glow"
          style={{ opacity: ambientGlowOpacity }}
        />

        {/* Converging Stardust Particles Canvas */}
        <canvas ref={canvasRef} className="comparely-particles-canvas" />

        {/* Master Center Lockup */}
        <div
          className="comparely-lockup"
          style={{
            transform: `scale(${lockupScale})`,
            transition: "transform 0.05s linear"
          }}
        >
          {/* Logo Mark Container (482 x 464 ratio) */}
          <div className="comparely-mark-box">
            {/* SVG Arc Mask definition for 'C' Shape */}
            <svg
              style={{ position: "absolute", width: 0, height: 0 }}
              aria-hidden="true"
            >
              <defs>
                <clipPath id="comparely-c-clip" clipPathUnits="userSpaceOnUse">
                  {isCComplete ? (
                    <rect x="0" y="0" width="482" height="464" />
                  ) : (
                    <path d={generateCSectorPath()} />
                  )}
                </clipPath>
              </defs>
            </svg>

            {/* Layer 1: Large 'C' Shape with smooth angular reveal */}
            {t >= 1.0 && (
              <img
                src="/animation/logo_c_shape.png"
                alt="Comparely C"
                className="comparely-layer"
                style={{
                  clipPath: isCComplete ? "none" : "url(#comparely-c-clip)",
                  WebkitClipPath: isCComplete ? "none" : "url(#comparely-c-clip)"
                }}
              />
            )}

            {/* Leading Sparkle Head for C Sweep */}
            {leadingTip && (
              <div
                style={{
                  position: "absolute",
                  left: `${(leadingTip.x / 482) * 100}%`,
                  top: `${(leadingTip.y / 464) * 100}%`,
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  background: "#4F46E5",
                  boxShadow: "0 0 16px 6px rgba(79, 70, 229, 0.9), 0 0 8px 2px #10B981",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  zIndex: 25
                }}
              />
            )}

            {/* Layer 2: Shopping Cart with smooth scale-and-fade */}
            {t >= 1.6 && (
              <img
                src="/animation/logo_cart.png"
                alt="Shopping Cart"
                className="comparely-layer"
                style={{
                  transform: `scale(${cartScale})`,
                  opacity: cartOpacity,
                  transformOrigin: "48% 52%"
                }}
              />
            )}

            {/* Layer 3: Comparison Bar 1 (Top mint) */}
            {t >= 2.0 && (
              <img
                src="/animation/logo_bar1.png"
                alt="Bar 1"
                className="comparely-layer"
                style={{
                  opacity: b1Prog,
                  clipPath: `inset(0 ${(1 - b1Prog) * 100}% 0 0)`,
                  WebkitClipPath: `inset(0 ${(1 - b1Prog) * 100}% 0 0)`,
                  transform: `translateX(${(1 - b1Prog) * -18}px)`
                }}
              />
            )}

            {/* Layer 4: Comparison Bar 2 (Middle mint) */}
            {t >= 2.18 && (
              <img
                src="/animation/logo_bar2.png"
                alt="Bar 2"
                className="comparely-layer"
                style={{
                  opacity: b2Prog,
                  clipPath: `inset(0 ${(1 - b2Prog) * 100}% 0 0)`,
                  WebkitClipPath: `inset(0 ${(1 - b2Prog) * 100}% 0 0)`,
                  transform: `translateX(${(1 - b2Prog) * -18}px)`
                }}
              />
            )}

            {/* Layer 5: Comparison Bar 3 (Bottom mint) */}
            {t >= 2.36 && (
              <img
                src="/animation/logo_bar3.png"
                alt="Bar 3"
                className="comparely-layer"
                style={{
                  opacity: b3Prog,
                  clipPath: `inset(0 ${(1 - b3Prog) * 100}% 0 0)`,
                  WebkitClipPath: `inset(0 ${(1 - b3Prog) * 100}% 0 0)`,
                  transform: `translateX(${(1 - b3Prog) * -18}px)`
                }}
              />
            )}

            {/* Soft Ambient Shadow beneath mark */}
            <div
              className="comparely-mark-shadow"
              style={{
                opacity: lockupShadowOpacity
              }}
            />
          </div>

          {/* Scene 4: Brand Name Typography */}
          <div
            className="comparely-text-title"
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleTranslateY}px)`
            }}
          >
            <span className="comparely-text-dark">Compare</span>
            <span className="comparely-text-indigo">ly</span>
          </div>

          {/* Scene 5: Tagline Typography */}
          <div
            className="comparely-tagline"
            style={{
              opacity: taglineOpacity,
              transform: `translateY(${taglineTranslateY}px)`,
              letterSpacing: `${taglineLetterSpacing}em`
            }}
          >
            <span>Compare</span>
            <span className="comparely-tagline-dot">•</span>
            <span>Choose</span>
            <span className="comparely-tagline-dot">•</span>
            <span>Save</span>
          </div>
        </div>

        {/* Top Control Actions (Standalone Theatre Mode Only) */}
        {showControls && standalone && (
          <div className="comparely-anim-actions">
            <button
              type="button"
              onClick={handleReplay}
              className="comparely-btn-replay"
              title="Replay 60fps logo animation"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M1 4v6h6" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Replay
            </button>

            <button
              type="button"
              onClick={handleRecordVideo}
              disabled={isRecording}
              className="comparely-btn-skip"
              style={{
                color: isRecording ? "#4F46E5" : "#0F172A",
                fontWeight: 700
              }}
              title="Export high-resolution 1920x1080 60fps video"
            >
              {isRecording ? (
                `Exporting 1080p: ${recordProgress}%`
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download 1080p Video
                </>
              )}
            </button>
          </div>
        )}

        {/* Scrubber Bar (Standalone theatre mode) */}
        {standalone && (
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "24px",
              right: "24px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              background: "rgba(255, 255, 255, 0.9)",
              padding: "8px 18px",
              borderRadius: "9999px",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
              zIndex: 50
            }}
          >
            <button
              type="button"
              onClick={isPlaying ? () => setIsPlaying(false) : handlePlay}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#4F46E5",
                fontWeight: 700,
                fontSize: "13px",
                display: "flex",
                alignItems: "center"
              }}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>

            <span style={{ fontSize: "12px", color: "#64748B", minWidth: "48px" }}>
              {t.toFixed(1)}s / {DURATION.toFixed(1)}s
            </span>

            <div
              style={{
                flex: 1,
                height: "6px",
                background: "#F1F5F9",
                borderRadius: "3px",
                overflow: "hidden",
                position: "relative"
              }}
            >
              <div
                style={{
                  width: `${(t / DURATION) * 100}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #4F46E5, #10B981)",
                  borderRadius: "3px",
                  transition: "width 0.05s linear"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "6px", fontSize: "11px", color: "#94A3B8" }}>
              <span>60 FPS</span>
              <span>•</span>
              <span>1920x1080</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
