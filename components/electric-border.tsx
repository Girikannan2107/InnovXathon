'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import './electric-border.css';

export interface ElectricBorderProps {
  color?: string;
  speed?: number;
  chaos?: number;
  thickness?: number;
  hoverOnly?: boolean;
  active?: boolean;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}

export default function ElectricBorder({
  color = '#ff6b00',
  speed = 0.4,
  chaos = 0.06,
  thickness = 2,
  hoverOnly = false,
  active = false,
  style = {},
  className = '',
  children
}: ElectricBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(isHovered);
  isHoveredRef.current = isHovered;
  const activeRef = useRef(active);
  activeRef.current = active;
  const animIdRef = useRef<number>(0);
  const isLoopingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    // Parse border radius from style or computed style
    let borderRadius = 16;
    if (style.borderRadius) {
      if (typeof style.borderRadius === 'number') {
        borderRadius = style.borderRadius;
      } else if (typeof style.borderRadius === 'string') {
        const parsed = parseFloat(style.borderRadius);
        if (!isNaN(parsed)) borderRadius = parsed;
      }
    }

    let isVisible = false;
    let isPageActive = document.visibilityState === 'visible';
    const padding = 6;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);

      canvas.width = Math.floor((width + padding * 2) * dpr);
      canvas.height = Math.floor((height + padding * 2) * dpr);
      canvas.style.width = `${width + padding * 2}px`;
      canvas.style.height = `${height + padding * 2}px`;
    };

    updateSize();

    // Build base rounded rectangle perimeter points
    const generatePerimeter = (w: number, h: number, r: number) => {
      const points: { x: number; y: number; nx: number; ny: number }[] = [];
      const safeR = Math.min(r, w / 2, h / 2);
      const step = 6; // optimized density of points

      // Top edge (left to right)
      for (let x = safeR; x <= w - safeR; x += step) {
        points.push({ x, y: 0, nx: 0, ny: -1 });
      }

      // Top-right corner
      const trCount = Math.max(3, Math.floor(((Math.PI * safeR) / 2) / step));
      for (let i = 0; i <= trCount; i++) {
        const a = -Math.PI / 2 + (Math.PI / 2) * (i / trCount);
        points.push({
          x: w - safeR + Math.cos(a) * safeR,
          y: safeR + Math.sin(a) * safeR,
          nx: Math.cos(a),
          ny: Math.sin(a)
        });
      }

      // Right edge (top to bottom)
      for (let y = safeR; y <= h - safeR; y += step) {
        points.push({ x: w, y, nx: 1, ny: 0 });
      }

      // Bottom-right corner
      const brCount = Math.max(3, Math.floor(((Math.PI * safeR) / 2) / step));
      for (let i = 0; i <= brCount; i++) {
        const a = 0 + (Math.PI / 2) * (i / brCount);
        points.push({
          x: w - safeR + Math.cos(a) * safeR,
          y: h - safeR + Math.sin(a) * safeR,
          nx: Math.cos(a),
          ny: Math.sin(a)
        });
      }

      // Bottom edge (right to left)
      for (let x = w - safeR; x >= safeR; x -= step) {
        points.push({ x, y: h, nx: 0, ny: 1 });
      }

      // Bottom-left corner
      const blCount = Math.max(3, Math.floor(((Math.PI * safeR) / 2) / step));
      for (let i = 0; i <= blCount; i++) {
        const a = Math.PI / 2 + (Math.PI / 2) * (i / blCount);
        points.push({
          x: safeR + Math.cos(a) * safeR,
          y: h - safeR + Math.sin(a) * safeR,
          nx: Math.cos(a),
          ny: Math.sin(a)
        });
      }

      // Left edge (bottom to top)
      for (let y = h - safeR; y >= safeR; y -= step) {
        points.push({ x: 0, y, nx: -1, ny: 0 });
      }

      // Top-left corner
      const tlCount = Math.max(3, Math.floor(((Math.PI * safeR) / 2) / step));
      for (let i = 0; i <= tlCount; i++) {
        const a = Math.PI + (Math.PI / 2) * (i / tlCount);
        points.push({
          x: safeR + Math.cos(a) * safeR,
          y: safeR + Math.sin(a) * safeR,
          nx: Math.cos(a),
          ny: Math.sin(a)
        });
      }

      return points;
    };

    let time = 0;
    const shouldAnimate = () => {
      if (!isVisible || !isPageActive || prefersReducedMotion) return false;
      if (hoverOnly && !isHoveredRef.current && !activeRef.current) return false;
      return true;
    };

    const drawFrame = () => {
      time += 0.016 * speed;
      if (width === 0 || height === 0) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.translate(padding, padding);

      const basePoints = generatePerimeter(width, height, borderRadius);
      const total = basePoints.length;
      if (total < 3) {
        ctx.restore();
        return;
      }

      const isCurrentActive = isHoveredRef.current || activeRef.current;
      const activeChaos = isHoveredRef.current ? chaos * 1.5 : chaos;
      const t = time * 7;

      ctx.beginPath();
      for (let i = 0; i < total; i++) {
        const p = basePoints[i];
        const progress = i / total;

        const n1 = Math.sin(progress * Math.PI * 12 + t * 1.5);
        const n2 = Math.cos(progress * Math.PI * 24 - t * 2.2);
        const jitter = (Math.random() - 0.5) * 1.0;

        const displacement = (n1 * 0.5 + n2 * 0.35 + jitter * 0.3) * activeChaos * 22;

        const posX = p.x + p.nx * displacement;
        const posY = p.y + p.ny * displacement;

        if (i === 0) {
          ctx.moveTo(posX, posY);
        } else {
          ctx.lineTo(posX, posY);
        }
      }
      ctx.closePath();

      // Outer soft electric glow
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = isCurrentActive ? 14 : 8;
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness * 2.2;
      ctx.globalAlpha = isCurrentActive ? 0.4 : 0.2;
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();

      // Main crisp neon arc
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = 3;
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.globalAlpha = isCurrentActive ? 0.95 : 0.7;
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();

      // White-hot core sparks
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(1, thickness * 0.35);
      ctx.globalAlpha = isCurrentActive ? 0.8 : 0.45;
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    };

    const loop = () => {
      if (!shouldAnimate()) {
        isLoopingRef.current = false;
        if (hoverOnly && !isHoveredRef.current && !activeRef.current) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        return;
      }
      drawFrame();
      animIdRef.current = requestAnimationFrame(loop);
    };

    const startLoopIfNeeded = () => {
      if (shouldAnimate() && !isLoopingRef.current) {
        isLoopingRef.current = true;
        animIdRef.current = requestAnimationFrame(loop);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
      if (!hoverOnly || isHoveredRef.current || activeRef.current) {
        drawFrame();
      }
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startLoopIfNeeded();
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    const handleVisibilityChange = () => {
      isPageActive = document.visibilityState === 'visible';
      if (isPageActive) {
        startLoopIfNeeded();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    startLoopIfNeeded();

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      isLoopingRef.current = false;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [color, speed, chaos, thickness, style.borderRadius, hoverOnly, isHovered, active]);

  const canvasClass = `electric-border-canvas ${hoverOnly ? 'hover-only' : ''} ${
    isHovered ? 'is-hovered' : ''
  } ${active ? 'is-active' : ''}`.trim();

  return (
    <div
      ref={containerRef}
      className={`electric-border-wrapper ${className}`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas ref={canvasRef} className={canvasClass} aria-hidden="true" />
      <div className="electric-border-inner">{children}</div>
    </div>
  );
}
