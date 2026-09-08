'use client';

import { useState } from 'react';
import { EVENT_CONFIG } from '@/lib/event-config';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { Award, Sliders, ShieldCheck } from 'lucide-react';
import ElectricBorder from '@/components/electric-border';

export default function JudgingCriteria() {
  const [activeStage, setActiveStage] = useState<'prelim' | 'final'>('prelim');
  const { ref, isRevealed } = useScrollReveal<HTMLElement>({ threshold: 0.15 });

  const prelim = EVENT_CONFIG.judgingCriteria.preliminaryStage;
  const finale = EVENT_CONFIG.judgingCriteria.finalStage;

  const currentStageData = activeStage === 'prelim' ? prelim : finale;

  return (
    <section
      ref={ref}
      id="judging"
      className={`section-container judging-section ${isRevealed ? 'section-revealed' : 'section-hidden'}`}
      aria-labelledby="judging-title"
    >
      <div className="section-header">
        <span className="section-eyebrow">07 / EVALUATION STANDARDS</span>
        <h2 id="judging-title" className="section-title">
          Two rigorous stages. <br />
          <span className="section-title-gradient">100% Transparent Scoring.</span>
        </h2>
        <p className="section-lead">
          Evaluations are conducted by distinguished industry leaders and academic experts across distinct screening and finale criteria.
        </p>
      </div>

      {/* Stage Selector Tabs */}
      <div className="judging-tab-bar" role="tablist" aria-label="Evaluation Stages">
        <button
          type="button"
          role="tab"
          id="tab-prelim"
          aria-selected={activeStage === 'prelim'}
          aria-controls="panel-prelim"
          className={`judging-tab-btn ${activeStage === 'prelim' ? 'judging-tab-active' : ''}`}
          onClick={() => setActiveStage('prelim')}
        >
          <Sliders size={16} aria-hidden="true" />
          <span>Stage 1: Preliminary Screening</span>
        </button>
        <button
          type="button"
          role="tab"
          id="tab-final"
          aria-selected={activeStage === 'final'}
          aria-controls="panel-final"
          className={`judging-tab-btn ${activeStage === 'final' ? 'judging-tab-active' : ''}`}
          onClick={() => setActiveStage('final')}
        >
          <Award size={16} aria-hidden="true" />
          <span>Stage 2: Event-Day Finale</span>
        </button>
      </div>

      {/* Criteria Breakdown Grid */}
      <div
        id={`panel-${activeStage}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeStage}`}
        className="judging-panel"
      >
        <div className="panel-intro-bar">
          <h3 className="panel-stage-name">{currentStageData.stageName}</h3>
          <span className="panel-total-badge">Total: 100% Weight</span>
        </div>

        <div className="criteria-cards-grid">
          {currentStageData.criteria.map((criterion, index) => (
            <div
              key={criterion.name}
              className={`criterion-card-wrapper ${isRevealed ? 'card-stagger-in' : ''}`}
              style={{ '--stagger-delay': `${index * 80}ms` } as React.CSSProperties}
            >
              <ElectricBorder
                color={index % 2 === 0 ? '#ff6b00' : '#4e69da'}
                speed={0.4}
                chaos={0.06}
                thickness={2}
                hoverOnly={true}
                style={{ borderRadius: 14, height: '100%' }}
                className="criterion-card-electric"
              >
                <div className="criterion-card">
                  <div className="criterion-top">
                    <span className="criterion-index">0{index + 1}</span>
                    <span className="criterion-weight-tag">{criterion.weightPercent}%</span>
                  </div>
                  <h4 className="criterion-name">{criterion.name}</h4>
                  <p className="criterion-desc">{criterion.description}</p>
                  <div className="criterion-progress-track" aria-hidden="true">
                    <div
                      className="criterion-progress-fill"
                      style={{ width: isRevealed ? `${criterion.weightPercent * 3.3}%` : '0%' }}
                    />
                  </div>
                </div>
              </ElectricBorder>
            </div>
          ))}
        </div>
      </div>

      <div className="judging-integrity-note">
        <ShieldCheck size={18} className="text-[#ff6b00]" aria-hidden="true" />
        <span>
          Scoring is confidential and audited before award announcements. Jury deliberations are final and non-negotiable.
        </span>
      </div>
    </section>
  );
}
