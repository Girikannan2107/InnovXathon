'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

interface CosmicButtonProps {
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  variant?: 'primary' | 'header' | 'compact';
  className?: string;
  isExternal?: boolean;
  showIcon?: boolean;
  'data-analytics'?: string;
}

export default function CosmicButton({
  href,
  onClick,
  children = 'Register & Submit Idea',
  variant = 'primary',
  className = '',
  isExternal = false,
  showIcon = true,
  'data-analytics': dataAnalytics,
}: CosmicButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0, textX: 0, textY: 0 });

  // Desktop Magnetic Attraction
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      const magnetRadius = 90;

      if (dist < magnetRadius) {
        const pull = 1 - dist / magnetRadius;
        const deltaX = (e.clientX - centerX) * pull * 0.18;
        const deltaY = (e.clientY - centerY) * pull * 0.18;
        setMagneticOffset({
          x: deltaX,
          y: deltaY,
          textX: deltaX * 0.45,
          textY: deltaY * 0.45,
        });
      } else {
        setMagneticOffset({ x: 0, y: 0, textX: 0, textY: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement & HTMLButtonElement>) => {
    if (isLaunching) return;

    // Trigger visual launch sequence
    setIsLaunching(true);

    if (onClick) {
      onClick(e);
    }

    // If it's a real external navigation or internal link without default prevented
    if (href && !e.defaultPrevented) {
      if (isExternal) {
        e.preventDefault();
        setTimeout(() => {
          window.open(href, '_blank', 'noopener,noreferrer');
          setIsLaunching(false);
        }, 420);
      } else {
        e.preventDefault();
        setTimeout(() => {
          const targetId = href.replace('#', '');
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.location.href = href;
          }
          setIsLaunching(false);
        }, 360);
      }
    } else {
      setTimeout(() => setIsLaunching(false), 500);
    }
  };

  const isHeader = variant === 'header';
  const isCompact = variant === 'compact';

  // 6 deterministic star particle positions
  const particles = [
    { top: '-6px', left: '18%', delay: '0s', size: 3 },
    { top: '-10px', left: '68%', delay: '0.8s', size: 2.5 },
    { top: '48%', left: '-8px', delay: '1.4s', size: 3 },
    { top: '42%', right: '-8px', delay: '0.4s', size: 2.5 },
    { bottom: '-6px', left: '32%', delay: '1.9s', size: 2 },
    { bottom: '-8px', left: '78%', delay: '1.1s', size: 3.5 },
  ];

  const content = (
    <>
      {/* Light streak sweep effect on hover */}
      <span className="cosmic-btn-streak" aria-hidden="true" />

      {/* Warp burst flash on click */}
      <span className={`cosmic-btn-warp-pulse ${isLaunching ? 'warp-active' : ''}`} aria-hidden="true" />

      {/* Inner button content */}
      <span
        className="cosmic-btn-inner"
        style={{
          transform: `translate3d(${magneticOffset.textX}px, ${magneticOffset.textY}px, 0)`,
        }}
      >
        {showIcon && <Sparkles size={isHeader ? 14 : 17} className="cosmic-btn-sparkle" aria-hidden="true" />}
        <span className="cosmic-btn-text">{children}</span>
        {isExternal ? (
          <ExternalLink size={isHeader ? 13 : 16} className="cosmic-btn-arrow" aria-hidden="true" />
        ) : (
          <span className="cosmic-btn-arrow" aria-hidden="true">
            →
          </span>
        )}
      </span>
    </>
  );

  return (
    <div
      ref={containerRef}
      className={`cosmic-button-wrapper ${variant}-btn-wrapper ${className} ${
        isHovered ? 'cosmic-hovered' : ''
      } ${isLaunching ? 'cosmic-launching' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMagneticOffset({ x: 0, y: 0, textX: 0, textY: 0 });
      }}
      style={{
        transform: `translate3d(${magneticOffset.x}px, ${magneticOffset.y}px, 0)`,
      }}
    >
      {/* Ambient background energy aura */}
      <div className="cosmic-btn-aura" aria-hidden="true" />

      {/* Orbit Track & Travelling Particle */}
      <div className="cosmic-btn-orbit" aria-hidden="true">
        <div className="cosmic-orbit-particle" />
      </div>

      {/* Micro Stardust Particles around Button */}
      {!isHeader && (
        <div className="cosmic-btn-particles" aria-hidden="true">
          {particles.map((p, idx) => (
            <span
              key={idx}
              className="cosmic-btn-star"
              style={{
                top: p.top,
                bottom: p.bottom,
                left: p.left,
                right: p.right,
                animationDelay: p.delay,
                width: `${p.size}px`,
                height: `${p.size}px`,
              }}
            />
          ))}
        </div>
      )}

      {href ? (
        <a
          ref={buttonRef}
          href={href}
          onClick={handleClick}
          className={`cosmic-btn-element btn-cosmic-${variant}`}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          data-analytics={dataAnalytics}
        >
          {content}
        </a>
      ) : (
        <button
          ref={buttonRef}
          type="button"
          onClick={handleClick}
          className={`cosmic-btn-element btn-cosmic-${variant}`}
          data-analytics={dataAnalytics}
        >
          {content}
        </button>
      )}
    </div>
  );
}
