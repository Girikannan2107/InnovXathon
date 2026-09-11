'use client';

import { EVENT_CONFIG } from '@/lib/event-config';
import { formatINR } from '@/lib/utils';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { CheckCircle2 } from 'lucide-react';
import BorderGlow from '@/components/border-glow';

export default function Process() {
  const shortlistFee = formatINR(EVENT_CONFIG.metadata.shortlistFeePerTeam);
  const { ref, isRevealed } = useScrollReveal<HTMLElement>({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      id="process"
      className={`section-container process-section ${isRevealed ? 'section-revealed' : 'section-hidden'}`}
      aria-labelledby="process-title"
    >
      <div className="section-header">
        <span className="section-eyebrow">02 / PARTICIPANT TRAJECTORY</span>
        <h2 id="process-title" className="section-title">
          From first spark <br />
          <span className="section-title-gradient">to centre stage.</span>
        </h2>
        <p className="section-lead">
          A seamless 8-stage roadmap from initial idea submission to presenting in front of the grand jury.
        </p>
      </div>

      <div className="process-timeline-wrapper">
        <ol className="process-cards-grid">
          {EVENT_CONFIG.process.map((step, idx) => (
            <li
              key={step.stepNumber}
              className={`process-step-item ${isRevealed ? 'card-stagger-in' : ''}`}
              style={{ '--stagger-delay': `${idx * 70}ms` } as React.CSSProperties}
            >
              <BorderGlow
                edgeSensitivity={30}
                glowColor="30 100 55"
                backgroundColor="rgba(16, 18, 26, 0.92)"
                borderRadius={16}
                glowRadius={35}
                glowIntensity={1.2}
                coneSpread={28}
                colors={['#ff6b00', '#ff8126', '#ffa94d']}
                className="process-glow-card"
              >
                <div className="process-card-content">
                  <div className="step-card-top">
                    <span className="step-number-pill">
                      STEP {String(step.stepNumber).padStart(2, '0')}
                    </span>
                    {step.clarification && (
                      <span className="step-tag">{step.clarification}</span>
                    )}
                  </div>
                  <h3 className="step-card-title">{step.title}</h3>
                  <p className="step-card-desc">{step.description}</p>
                </div>
              </BorderGlow>
            </li>
          ))}
        </ol>
      </div>

      <BorderGlow
        edgeSensitivity={30}
        glowColor="145 70 50"
        backgroundColor="rgba(14, 18, 24, 0.94)"
        borderRadius={16}
        glowRadius={35}
        glowIntensity={1.0}
        coneSpread={25}
        colors={['#57c88a', '#34d399', '#6484ff']}
        className="process-callout-glow"
      >
        <div className="process-callout-banner">
          <div className="callout-icon-box">
            <CheckCircle2 size={24} className="text-[#57c88a]" aria-hidden="true" />
          </div>
          <div className="callout-text-box">
            <strong>Important Clarification on Registration & Fees:</strong>
            <p>
              Submitting your idea is 100% free. The {shortlistFee} confirmation fee is collected <em>only</em> from the 20 shortlisted teams after receiving the official selection letter, and covers the entire team (up to 4 members).
            </p>
          </div>
        </div>
      </BorderGlow>
    </section>
  );
}
