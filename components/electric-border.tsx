'use client';

import React, { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
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

    let isVisible = true;
    let isPageActive = true;
    const padding = 6;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);

      canvas.width = (width + padding * 2) * dpr;
      canvas.height = (height + padding * 2) * dpr;
      canvas.style.width = `${width + padding * 2}px`;
      canvas.style.height = `${height + padding * 2}px`;
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    const handleVisibilityChange = () => {
      isPageActive = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Build base rounded rectangle perimeter points
    const generatePerimeter = (w: number, h: number, r: number) => {
      const points: { x: number; y: number; nx: number; ny: number }[] = [];
      const safeR = Math.min(r, w / 2, h / 2);
      const step = 4; // density of points

      // Top edge (left to right)
      for (let x = safeR; x <= w - safeR; x += step) {
        points.push({ x, y: 0, nx: 0, ny: -1 });
      }

      // Top-right corner
      const trCount = Math.max(4, Math.floor(((Math.PI * safeR) / 2) / step));
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
      const brCount = Math.max(4, Math.floor(((Math.PI * safeR) / 2) / step));
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
      const blCount = Math.max(4, Math.floor(((Math.PI * safeR) / 2) / step));
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
      const tlCount = Math.max(4, Math.floor(((Math.PI * safeR) / 2) / step));
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
    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isVisible || !isPageActive) return;

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
      const activeChaos = isHoveredRef.current ? chaos * 1.7 : chaos;
      const t = time * 8;

      ctx.beginPath();
      for (let i = 0; i < total; i++) {
        const p = basePoints[i];
        const progress = i / total;

        // Multi-harmonic high voltage turbulence
        const n1 = Math.sin(progress * Math.PI * 14 + t * 1.6);
        const n2 = Math.cos(progress * Math.PI * 28 - t * 2.4);
        const n3 = Math.sin(progress * Math.PI * 52 + t * 4.2);
        const jitter = (Math.random() - 0.5) * 1.2;

        const displacement = (n1 * 0.45 + n2 * 0.35 + n3 * 0.2 + jitter * 0.4) * activeChaos * 26;

        const posX = p.x + p.nx * displacement;
        const posY = p.y + p.ny * displacement;

        if (i === 0) {
          ctx.moveTo(posX, posY);
        } else {
          ctx.lineTo(posX, posY);
        }
      }
      ctx.closePath();

      // Pass 1: Outer soft electric glow
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = isCurrentActive ? 16 : 10;
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness * 2.6;
      ctx.globalAlpha = isCurrentActive ? 0.45 : 0.25;
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();

      // Pass 2: Main crisp neon arc
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.globalAlpha = isCurrentActive ? 0.95 : 0.75;
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();

      // Pass 3: White-hot core sparks
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(1, thickness * 0.4);
      ctx.globalAlpha = isCurrentActive ? 0.85 : 0.5;
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [color, speed, chaos, thickness, style.borderRadius]);

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
