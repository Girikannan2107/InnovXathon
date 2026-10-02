'use client';

import { useState, useEffect } from 'react';
import { EVENT_CONFIG } from '@/lib/event-config';
import { formatINR } from '@/lib/utils';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import BorderGlow from '@/components/border-glow';

function AnimatedPrizeAmount({ targetAmount, isTriggered }: { targetAmount: number; isTriggered: boolean }) {
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    if (!isTriggered) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const timer = setTimeout(() => setDisplayAmount(targetAmount), 0);
      return () => clearTimeout(timer);
    }

    let start: number | null = null;
    const duration = 1200;
    let animId = 0;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayAmount(Math.round(eased * targetAmount));

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setDisplayAmount(targetAmount);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isTriggered, targetAmount]);

  return <strong className="prize-amount-value">{formatINR(displayAmount)}</strong>;
}

export default function Prizes() {
  const totalPrize = formatINR(EVENT_CONFIG.prizes.totalPoolAmount);
  const { ref, isRevealed } = useScrollReveal<HTMLElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      id="prizes"
      className={`section-container prizes-section ${isRevealed ? 'section-revealed' : 'section-hidden'}`}
      aria-labelledby="prizes-title"
    >
      <div className="section-header">
        <span className="section-eyebrow">04 / RECOGNITION & HONORS</span>
        <h2 id="prizes-title" className="section-title">
          Make your mark. <br />
          <span className="section-title-gradient">Attractive Prizes Worth {totalPrize}</span>
        </h2>
        <p className="section-lead">
          Pioneering solutions merit grand recognition. Standout student innovators will be awarded cash prizes, prestigious trophies, and official certificates.
        </p>
      </div>

      {/* Centralized Single Featured Prize Presentation Card */}
      <div className="prize-central-container">
        <div className={`prize-central-wrapper ${isRevealed ? 'card-stagger-in' : ''}`}>
          <BorderGlow
            edgeSensitivity={35}
            glowColor="30 100 55"
            backgroundColor="rgba(16, 18, 28, 0.94)"
            borderRadius={22}
            glowRadius={45}
            glowIntensity={1.4}
            coneSpread={30}
            colors={['#ff6b00', '#ff8126', '#ffa94d', '#6484ff']}
            className="prize-glow-card"
          >
            <article className="prize-card prize-card-featured">
              <div className="prize-top-crown">
                <Sparkles size={14} className="text-[#07070d]" aria-hidden="true" />
                <span>GRAND INNOVATION POOL</span>
              </div>

              <div className="prize-card-header">
                <div className="prize-icon-circle prize-icon-featured">
                  <Trophy size={36} className="text-[#ff6b00]" aria-hidden="true" />
                </div>
              </div>

              <span className="prize-featured-eyebrow">TOTAL PRIZE POOL</span>

              <div className="prize-amount-block">
                <span className="prize-currency-symbol">INR</span>
                <AnimatedPrizeAmount targetAmount={EVENT_CONFIG.prizes.totalPoolAmount} isTriggered={isRevealed} />
              </div>

              <h3 className="prize-position-title">ATTRACTIVE PRIZES WORTH {totalPrize.toUpperCase()}</h3>
              <p className="prize-per-team-tag">Cash Awards · Prestigious Trophies · Certificates</p>
              <p className="prize-description-text">
                Awarded to standout innovation teams presenting at the Grand Finale on {EVENT_CONFIG.schedule.eventDateDisplay} at Karpagam College of Engineering.
              </p>
            </article>
          </BorderGlow>
        </div>
      </div>

      <div className="prizes-footer-note">
        <CheckCircle2 size={16} className="text-[#ff6b00]" aria-hidden="true" />
        <span>
          {EVENT_CONFIG.prizes.currencyNote}
        </span>
      </div>
    </section>
  );
}
