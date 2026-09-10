'use client';

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number; // 0..1
  y: number; // 0..1
  z: number; // 0.1..1 (depth factor)
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  isAccent: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

export default function CosmicSpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;
    let isPageActive = true;
    const startTime = performance.now();
    let lastTime = performance.now();

    const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Mouse coordinates for desktop constellation and parallax
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };
    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;
    let scrollVelocity = 0;

    // Adaptive star count optimized for high frame rate
    const getStarCount = () => {
      const w = window.innerWidth;
      if (motionQuery.matches) return 40;
      if (w < 640) return 90;
      if (w < 1024) return 220;
      return 420;
    };

    let seed = 1337;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const starCount = getStarCount();
    const stars: Star[] = [];

    const starColors = [
      '#ffffff',
      '#f0f4ff',
      '#dbe5ff',
      '#ffe0b2',
      '#ff8a00',
      '#4d7cfe',
      '#b388ff'
    ];

    for (let i = 0; i < starCount; i++) {
      const z = 0.1 + rnd() * 0.9;
      const roll = rnd();
      const isAccent = roll > 0.98;
      const isBright = roll > 0.90;

      let radius = 0.4 + rnd() * 0.5;
      if (isBright) radius = 0.85 + rnd() * 0.55;
      if (isAccent) radius = 1.2 + rnd() * 0.65;

      let baseAlpha = 0.2 + rnd() * 0.5;
      if (isBright) baseAlpha = 0.6 + rnd() * 0.35;
      if (isAccent) baseAlpha = 0.85;

      let color = starColors[0];
      if (isAccent) {
        color = rnd() > 0.4 ? '#ff8a00' : '#6c4bff';
      } else if (isBright) {
        color = rnd() > 0.5 ? '#ffe0b2' : '#4d7cfe';
      }

      stars.push({
        x: rnd(),
        y: rnd(),
        z,
        radius,
        baseAlpha,
        twinkleSpeed: 0.7 + rnd() * 1.8, // 3 - 9s cycles
        twinklePhase: rnd() * Math.PI * 2,
        color,
        isAccent
      });
    }

    // Shooting stars queue - single active shooting star
    const shootingStars: ShootingStar[] = [];
    let nextShootingStarTime = performance.now() + 8000 + rnd() * 8000; // First shooting star in 8-16s

    const createShootingStar = () => {
      if (motionQuery.matches || isTouch || shootingStars.length >= 1) return;
      const angle = (Math.PI / 4) + (rnd() - 0.5) * 0.3; // Approx 45 degrees diagonal
      const startX = rnd() * width * 1.2 - width * 0.1;
      const startY = rnd() * (height * 0.5);

      shootingStars.push({
        x: startX,
        y: startY,
        length: 70 + rnd() * 90,
        speed: 12 + rnd() * 8,
        angle,
        alpha: 1.0,
        life: 0,
        maxLife: 30 + rnd() * 20,
        color: rnd() > 0.3 ? '#ffffff' : '#ff9f43'
      });
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const isMobileScreen = width < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobileScreen ? 1.0 : 1.25);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const onScroll = () => {
      const currentY = window.scrollY;
      scrollVelocity = (currentY - targetScrollY) * 0.1;
      targetScrollY = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let pointerRaf: number | null = null;
    const onPointerMove = (e: PointerEvent) => {
      if (isTouch) return;
      if (!pointerRaf) {
        pointerRaf = requestAnimationFrame(() => {
          mouse.targetX = e.clientX;
          mouse.targetY = e.clientY;
          mouse.active = true;
          pointerRaf = null;
        });
      }
    };

    const onPointerLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);

    const handleVisibilityChange = () => {
      isPageActive = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Main animation loop
    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      if (!isPageActive) return;

      lastTime = now;
      const elapsed = (now - startTime) / 1000;

      // Smooth scroll lerp
      scrollY += (targetScrollY - scrollY) * 0.1;
      scrollVelocity *= 0.92;

      // Mouse lerp
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      ctx.clearRect(0, 0, width, height);

      // Render shooting star trigger
      if (now > nextShootingStarTime) {
        createShootingStar();
        nextShootingStarTime = now + 9000 + rnd() * 12000; // Every 9 - 21s
      }

      // Collect near-mouse stars for constellation lines (Desktop only)
      const nearbyStars: { x: number; y: number; dist: number }[] = [];
      const mouseThreshold = 110;

      // Draw Starfield
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Subtle slow atmospheric drift
        if (!motionQuery.matches) {
          s.y += (0.000015 * s.z) + (scrollVelocity * 0.00002 * s.z);
          s.x += Math.sin(elapsed * 0.1 + s.twinklePhase) * 0.000005 * s.z;
          if (s.y > 1) s.y -= 1;
          if (s.y < 0) s.y += 1;
          if (s.x > 1) s.x -= 1;
          if (s.x < 0) s.x += 1;
        }

        const screenX = s.x * width;
        // Parallax scroll position
        const parallaxOffset = (scrollY * 0.06 * s.z) % height;
        let screenY = (s.y * height - parallaxOffset);
        if (screenY < 0) screenY += height;
        if (screenY > height) screenY -= height;

        // Twinkle calculation
        let alpha = s.baseAlpha;
        if (!motionQuery.matches) {
          const tw = 0.5 + 0.5 * Math.sin(elapsed * s.twinkleSpeed + s.twinklePhase);
          alpha = s.baseAlpha * (0.4 + 0.6 * tw);
        }

        // Draw star
        ctx.beginPath();
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.arc(screenX, screenY, s.radius, 0, Math.PI * 2);
        ctx.fill();

        // Accent diffraction glow for rare bright stars
        if (s.isAccent && !motionQuery.matches) {
          ctx.beginPath();
          ctx.fillStyle = s.color;
          ctx.globalAlpha = alpha * 0.3;
          ctx.arc(screenX, screenY, s.radius * 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Ultra subtle horizontal spike
          ctx.fillRect(screenX - s.radius * 4, screenY - 0.5, s.radius * 8, 1);
        }

        // Check distance to mouse for constellation line
        if (!isTouch && mouse.active && !motionQuery.matches) {
          const dx = screenX - mouse.x;
          const dy = screenY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseThreshold) {
            nearbyStars.push({ x: screenX, y: screenY, dist });
          }
        }
      }

      // Draw Desktop Constellation Lines
      if (!isTouch && nearbyStars.length >= 2 && !motionQuery.matches) {
        ctx.lineWidth = 0.75;
        for (let j = 0; j < Math.min(nearbyStars.length, 4); j++) {
          const st = nearbyStars[j];
          const lineAlpha = (1 - st.dist / mouseThreshold) * 0.22;
          ctx.strokeStyle = `rgba(255, 138, 0, ${lineAlpha})`;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(st.x, st.y);
          ctx.stroke();

          // Connect stars with each other if close
          for (let k = j + 1; k < Math.min(nearbyStars.length, 4); k++) {
            const st2 = nearbyStars[k];
            const starDist = Math.hypot(st.x - st2.x, st.y - st2.y);
            if (starDist < 120) {
              const connectAlpha = (1 - starDist / 120) * 0.15;
              ctx.strokeStyle = `rgba(108, 75, 255, ${connectAlpha})`;
              ctx.beginPath();
              ctx.moveTo(st.x, st.y);
              ctx.lineTo(st2.x, st2.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw & Update Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const m = shootingStars[i];
        m.life += 1;
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;

        const progress = m.life / m.maxLife;
        const fade = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8;
        const currentAlpha = Math.max(0, fade * m.alpha);

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.7, m.color === '#ffffff' ? 'rgba(219, 229, 255, 0.4)' : 'rgba(255, 138, 0, 0.4)');
        grad.addColorStop(1, m.color);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        // Head bright point
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.2, 0, Math.PI * 2);
        ctx.fill();

        if (m.life >= m.maxLife || m.x > width + 100 || m.y > height + 100) {
          shootingStars.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="cosmic-universe-backdrop" aria-hidden="true">
      <div className="cosmic-deep-gradient" />
      <div className="cosmic-nebula-field cosmic-nebula-hero" />
      <div className="cosmic-nebula-field cosmic-nebula-journey" />
      <div className="cosmic-nebula-field cosmic-nebula-prizes" />
      <div className="cosmic-nebula-field cosmic-nebula-horizon" />
      <canvas ref={canvasRef} className="cosmic-starfield-canvas" />
    </div>
  );
}
