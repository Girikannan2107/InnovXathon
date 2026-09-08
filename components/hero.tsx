'use client';

import React, { useEffect, useRef, useState } from 'react';
import { EVENT_CONFIG } from '@/lib/event-config';
import { formatINR, isPlaceholderUrl, trackEvent } from '@/lib/utils';
import Countdown from './countdown';
import { Calendar, MapPin, Users, Trophy, Award, ExternalLink, FileText, Sparkles, ArrowDown } from 'lucide-react';

interface HeroProps {
  onOpenGuidelines?: () => void;
  onOpenRegisterNotice?: () => void;
}

function StarfieldAndAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;
    let isVisible = true;
    let isPageActive = true;
    let startTime = 0;

    const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
    const isMobile = window.innerWidth < 768;

    const starCount = motionQuery.matches ? 12 : isMobile ? 20 : 45;
    const emberCount = motionQuery.matches ? 0 : isMobile ? 8 : 18;

    let seed = 42;
    const pseudoRandom = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const stars = Array.from({ length: starCount }, () => ({
      x: pseudoRandom(),
      y: pseudoRandom() * 0.75,
      radius: 0.5 + pseudoRandom() * 0.9,
      baseAlpha: 0.12 + pseudoRandom() * 0.45,
      speed: 0.5 + pseudoRandom() * 1.0,
      phase: pseudoRandom() * Math.PI * 2,
    }));

    const embers = Array.from({ length: emberCount }, () => ({
      x: 0.35 + pseudoRandom() * 0.3,
      y: 0.25 + pseudoRandom() * 0.65,
      radius: 0.8 + pseudoRandom() * 1.4,
      speedY: 0.00015 + pseudoRandom() * 0.00025,
      speedX: (pseudoRandom() - 0.5) * 0.0001,
      baseAlpha: 0.2 + pseudoRandom() * 0.55,
      phase: pseudoRandom() * Math.PI * 2,
      color: pseudoRandom() > 0.4 ? '#ff7a00' : '#ffc45c',
    }));

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !startTime) startTime = performance.now();
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(canvas);

    const handleVisibilityChange = () => {
      isPageActive = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      if (!isVisible || !isPageActive) return;

      ctx.clearRect(0, 0, width, height);
      const elapsed = motionQuery.matches ? 0 : (now - startTime) / 1000;

      // Draw subtle twinkling stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const pulse = motionQuery.matches ? 1 : 0.75 + 0.25 * Math.sin(elapsed * s.speed + s.phase);
        const alpha = s.baseAlpha * pulse;

        ctx.beginPath();
        ctx.fillStyle = `rgba(220, 235, 255, ${alpha})`;
        ctx.arc(s.x * width, s.y * height, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw subtle warm embers
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        if (!motionQuery.matches) {
          e.y -= e.speedY;
          e.x += e.speedX + Math.sin(elapsed * 0.8 + e.phase) * 0.00008;
          if (e.y < 0.1) {
            e.y = 0.85;
            e.x = 0.35 + Math.random() * 0.3;
          }
        }

        const pulse = motionQuery.matches ? 1 : 0.65 + 0.35 * Math.sin(elapsed * 2 + e.phase);
        const alpha = e.baseAlpha * pulse;

        ctx.beginPath();
        ctx.fillStyle = e.color;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = '#ff7a00';
        ctx.shadowBlur = 4;
        ctx.arc(e.x * width, e.y * height, e.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.shadowBlur = 0;
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="unified-atmosphere-canvas" aria-hidden="true" />;
}

export default function Hero({ onOpenGuidelines, onOpenRegisterNotice }: HeroProps) {
  const isFormPlaceholder = isPlaceholderUrl(EVENT_CONFIG.links.googleFormUrl);
  const totalPrizeFormatted = formatINR(EVENT_CONFIG.metadata.totalPrizePool);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      const nx = (e.clientX / w - 0.5) * 2;
      const ny = (e.clientY / h - 0.5) * 2;
      setParallax({
        x: nx * 5,
        y: ny * 3,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleRegisterClick = (e: React.MouseEvent) => {
    trackEvent('hero_register_click', 'conversion');
    if (isFormPlaceholder) {
      e.preventDefault();
      if (onOpenRegisterNotice) {
        onOpenRegisterNotice();
      } else {
        const regSection = document.getElementById('register');
        regSection?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleGuidelinesClick = (e: React.MouseEvent) => {
    trackEvent('hero_guidelines_click', 'engagement');
    e.preventDefault();
    if (onOpenGuidelines) {
      onOpenGuidelines();
    } else {
      const guidelinesEl = document.getElementById('guidelines');
      guidelinesEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="overview" className="unified-hero-section" aria-labelledby="hero-main-title">
      <StarfieldAndAtmosphere />

      {/* Screen Reader Semantic Title */}
      <h1 id="hero-main-title" className="sr-only">
        INNOVXATHON 2026 — National Student Ideathon at KCE
      </h1>

      <div className="hero-cinematic-stage">
        {/* Horizontally Expanded Hero Artwork Merging into Background */}
        <div
          className="hero-artwork-canvas-wrapper"
          style={{
            transform: `translate3d(calc(-50% + ${parallax.x}px), ${parallax.y}px, 0)`
          }}
          aria-hidden="true"
        >
          <div className="hero-artwork-glow" />
          <img
            src="/assets/innovxathon-beacon-x-hero.png"
            alt="INNOVXATHON 2026. A student stands before a monumental illuminated orange X."
            width="1600"
            height="900"
            className="hero-artwork-full-img"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        {/* Content Overlaid Directly on the Lower Runway of the Image */}
        <div className="hero-floor-overlay-content">
          {/* Floating Glass Statistic Pills */}
          <div className="unified-stats-row" aria-label="Key event statistics">
            <div className="unified-stat-pill pill-delay-1">
              <Trophy className="pill-icon text-[#ff6b00]" size={15} aria-hidden="true" />
              <span className="pill-text">
                <strong className="pill-value">{totalPrizeFormatted}</strong>{' '}
                <span className="pill-label">Prize Pool</span>
              </span>
            </div>

            <div className="unified-stat-pill pill-delay-2">
              <Users className="pill-icon text-[#ffa94d]" size={15} aria-hidden="true" />
              <span className="pill-text">
                <strong className="pill-value">4 Members</strong>{' '}
                <span className="pill-label">/ Team</span>
              </span>
            </div>

            <div className="unified-stat-pill pill-delay-3">
              <Award className="pill-icon text-[#ff8126]" size={15} aria-hidden="true" />
              <span className="pill-text">
                <strong className="pill-value">30 Finalist</strong>{' '}
                <span className="pill-label">Teams</span>
              </span>
            </div>

            <div className="unified-stat-pill pill-delay-4">
              <Calendar className="pill-icon text-[#ffb84d]" size={15} aria-hidden="true" />
              <span className="pill-text">
                <strong className="pill-value">{EVENT_CONFIG.schedule.eventDateDisplay}</strong>
              </span>
            </div>

            <div className="unified-stat-pill pill-delay-5">
              <MapPin className="pill-icon text-[#ff6b00]" size={15} aria-hidden="true" />
              <span className="pill-text">
                <strong className="pill-value">KCE</strong>,{' '}
                <span className="pill-label">Coimbatore</span>
              </span>
            </div>
          </div>

          {/* 3. Compact Registration Countdown */}
          <div className="unified-countdown-block">
            <Countdown />
          </div>

          {/* 4. Primary + Secondary CTA Area */}
          <div className="unified-cta-row">
            {isFormPlaceholder ? (
              <a
                href="#register"
                className="btn-primary-glow unified-btn-primary"
                onClick={handleRegisterClick}
                data-analytics="hero-register"
              >
                <Sparkles size={17} aria-hidden="true" />
                <span>Register & Submit Idea</span>
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            ) : (
              <a
                href={EVENT_CONFIG.links.googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-glow unified-btn-primary"
                onClick={handleRegisterClick}
                data-analytics="hero-register"
              >
                <Sparkles size={17} aria-hidden="true" />
                <span>Register & Submit Idea</span>
                <ExternalLink size={17} aria-hidden="true" />
              </a>
            )}

            <a
              href="#guidelines"
              className="btn-secondary-outline unified-btn-secondary"
              onClick={handleGuidelinesClick}
              data-analytics="hero-guidelines"
            >
              <FileText size={17} aria-hidden="true" />
              <span>View Guidelines</span>
            </a>
          </div>

          {/* 5. Event Reporting / Venue Micro-Info */}
          <div className="unified-micro-info">
            <div className="micro-item">
              <Calendar size={13} aria-hidden="true" className="text-zinc-400" />
              <span>
                {EVENT_CONFIG.schedule.eventDateDisplay} · Reporting at {EVENT_CONFIG.schedule.reportingTimeDisplay}
              </span>
            </div>

            <a href="#process" className="micro-scroll-link" aria-label="Explore the event journey">
              <span>Explore the Journey</span>
              <ArrowDown size={13} aria-hidden="true" />
            </a>

            <div className="micro-item">
              <MapPin size={13} aria-hidden="true" className="text-zinc-400" />
              <span>KCE Coimbatore · Offline</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
