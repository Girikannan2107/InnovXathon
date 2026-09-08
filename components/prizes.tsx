'use client';

import { useState, useEffect } from 'react';
import { EVENT_CONFIG } from '@/lib/event-config';
import { formatINR } from '@/lib/utils';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { Trophy, Medal, Award, Sparkles, CheckCircle2 } from 'lucide-react';

function AnimatedPrizeAmount({ targetAmount, isTriggered }: { targetAmount: number; isTriggered: boolean }) {
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    if (!isTriggered) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayAmount(targetAmount);
      return;
    }

    let start: number | null = null;
    const duration = 1000;
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy size={32} className="text-[#ff6b00]" aria-hidden="true" />;
      case 2:
        return <Medal size={32} className="text-[#6484ff]" aria-hidden="true" />;
      case 3:
        return <Award size={32} className="text-[#a3541d]" aria-hidden="true" />;
      default:
        return <Award size={32} className="text-[#ff6b00]" aria-hidden="true" />;
    }
  };

  const getRankCardClass = (rank: number) => {
    switch (rank) {
      case 1:
        return 'prize-card-first';
      case 2:
        return 'prize-card-second';
      case 3:
        return 'prize-card-third';
      default:
        return '';
    }
  };

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
          <span className="section-title-gradient">Grand Prize Pool: {totalPrize}</span>
        </h2>
        <p className="section-lead">
          Pioneering solutions merit grand recognition. Cash awards, prestigious trophies, and merit credentials for the standout innovators.
        </p>
      </div>

      <div className="prizes-podium-grid">
        {EVENT_CONFIG.prizes.items.map((prize, idx) => {
          const isFirst = prize.rank === 1;
          const podiumClass = getRankCardClass(prize.rank);

          return (
            <article
              key={prize.rank}
              className={`prize-card ${podiumClass} ${isRevealed ? 'card-stagger-in' : ''}`}
              style={{ '--stagger-delay': `${idx * 100}ms` } as React.CSSProperties}
            >
              {isFirst && (
                <div className="prize-top-crown">
                  <Sparkles size={14} className="text-[#07070d]" aria-hidden="true" />
                  <span>FIRST PLACE CHAMPION</span>
                </div>
              )}

              <div className="prize-card-header">
                <div className="prize-icon-circle">
                  {getRankIcon(prize.rank)}
                </div>
                <span className="prize-rank-number">0{prize.rank} /</span>
              </div>

              <div className="prize-amount-block">
                <span className="prize-currency-symbol">INR</span>
                <AnimatedPrizeAmount targetAmount={prize.amount} isTriggered={isRevealed} />
              </div>

              <h3 className="prize-position-title">{prize.position.toUpperCase()}</h3>
              <p className="prize-per-team-tag">{prize.perTeam ? 'Awarded per winning team' : 'Per participant'}</p>
              <p className="prize-description-text">{prize.label}</p>
            </article>
          );
        })}
      </div>

      <div className="prizes-footer-note">
        <CheckCircle2 size={16} className="text-[#ff6b00]" aria-hidden="true" />
        <span>
          {EVENT_CONFIG.prizes.currencyNote} In addition, all finalist teams receive official Certificates of Participation.
        </span>
      </div>
    </section>
  );
}
