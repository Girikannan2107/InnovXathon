'use client';

import React, { useEffect, useRef, useState } from 'react';
import { EVENT_CONFIG } from '@/lib/event-config';
import { formatINR, isPlaceholderUrl, trackEvent } from '@/lib/utils';
import Countdown from './countdown';
import CosmicButton from './cosmic-button';
import { Calendar, MapPin, Users, Trophy, Award, FileText, ArrowDown } from 'lucide-react';

interface HeroProps {
  onOpenGuidelines?: () => void;
  onOpenRegisterNotice?: () => void;
}

export default function Hero({ onOpenGuidelines, onOpenRegisterNotice }: HeroProps) {
  const isFormPlaceholder = isPlaceholderUrl(EVENT_CONFIG.links.googleFormUrl);
  const totalPrizeFormatted = formatINR(EVENT_CONFIG.metadata.totalPrizePool);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      targetX = (e.clientX / w - 0.5) * 8;
      targetY = (e.clientY / h - 0.5) * 5;

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setParallax({ x: targetX, y: targetY });
          rafRef.current = null;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
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
              <Trophy className="pill-icon text-[#ff6a00]" size={15} aria-hidden="true" />
              <span className="pill-text">
                <strong className="pill-value">{totalPrizeFormatted}</strong>{' '}
                <span className="pill-label">Prize Pool</span>
              </span>
            </div>

            <div className="unified-stat-pill pill-delay-2">
              <Users className="pill-icon text-[#ffb347]" size={15} aria-hidden="true" />
              <span className="pill-text">
                <strong className="pill-value">Up to 4 Members</strong>{' '}
                <span className="pill-label">/ Team</span>
              </span>
            </div>

            <div className="unified-stat-pill pill-delay-3">
              <Award className="pill-icon text-[#ff8a00]" size={15} aria-hidden="true" />
              <span className="pill-text">
                <strong className="pill-value">20 Finalist</strong>{' '}
                <span className="pill-label">Teams</span>
              </span>
            </div>

            <div className="unified-stat-pill pill-delay-4">
              <Calendar className="pill-icon text-[#ffe0b2]" size={15} aria-hidden="true" />
              <span className="pill-text">
                <strong className="pill-value">{EVENT_CONFIG.schedule.eventDateDisplay}</strong>
              </span>
            </div>

            <div className="unified-stat-pill pill-delay-5">
              <MapPin className="pill-icon text-[#ff6a00]" size={15} aria-hidden="true" />
              <span className="pill-text">
                <strong className="pill-value">KCE</strong>,{' '}
                <span className="pill-label">Coimbatore</span>
              </span>
            </div>
          </div>

          {/* 3. Mission Launch Registration Countdown */}
          <div className="unified-countdown-block">
            <Countdown />
          </div>

          {/* 4. Signature Cosmic Launch CTA + Secondary Action */}
          <div className="unified-cta-row">
            {isFormPlaceholder ? (
              <CosmicButton
                href="#register"
                onClick={handleRegisterClick}
                data-analytics="hero-register"
                variant="primary"
              >
                Register & Submit Idea
              </CosmicButton>
            ) : (
              <CosmicButton
                href={EVENT_CONFIG.links.googleFormUrl}
                isExternal={true}
                onClick={handleRegisterClick}
                data-analytics="hero-register"
                variant="primary"
              >
                Register & Submit Idea
              </CosmicButton>
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
