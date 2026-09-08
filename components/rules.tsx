'use client';

import { EVENT_CONFIG } from '@/lib/event-config';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { Sparkles, CheckCircle2, AlertTriangle, Users, BookOpen, Scale, FileCode2 } from 'lucide-react';

export default function Rules() {
  const rules = EVENT_CONFIG.rulesAndEligibility;
  const { ref, isRevealed } = useScrollReveal<HTMLElement>({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      id="rules"
      className={`section-container rules-section ${isRevealed ? 'section-revealed' : 'section-hidden'}`}
      aria-labelledby="rules-title"
    >
      <div className="section-header">
        <span className="section-eyebrow">05 / INTEGRITY & ELIGIBILITY</span>
        <h2 id="rules-title" className="section-title">
          Bring your team. <br />
          <span className="section-title-gradient">Own your thinking.</span>
        </h2>
        <p className="section-lead">
          Clear, equitable guidelines ensuring fair competition, academic honesty, and transparent innovation.
        </p>
      </div>

      {/* Prominent AI Policy Banner */}
      <div className="ai-policy-banner">
        <div className="ai-policy-icon">
          <Sparkles size={28} className="text-[#ff6b00]" aria-hidden="true" />
        </div>
        <div className="ai-policy-content">
          <h3 className="ai-policy-title">Official AI Tool Usage Policy</h3>
          <p className="ai-policy-quote">
            &ldquo;Participants may use AI tools, but they must clearly disclose where and how AI was used.&rdquo;
          </p>
          <p className="ai-policy-sub">
            {rules.aiUsagePolicy}
          </p>
        </div>
      </div>

      {/* Structured Eligibility & Governance Cards */}
      <div className="rules-cards-grid">
        <article
          className={`rule-card ${isRevealed ? 'card-stagger-in' : ''}`}
          style={{ '--stagger-delay': '0ms' } as React.CSSProperties}
        >
          <div className="rule-card-header">
            <Users size={22} className="text-[#6484ff]" aria-hidden="true" />
            <h3 className="rule-card-title">Team Structure</h3>
          </div>
          <p className="rule-card-text">{rules.teamSizeRequirement}</p>
          <ul className="rule-check-list">
            <li><CheckCircle2 size={15} className="text-[#57c88a]" aria-hidden="true" /> Cross-department teams permitted</li>
            <li><CheckCircle2 size={15} className="text-[#57c88a]" aria-hidden="true" /> Cross-college collaborations allowed</li>
            <li><CheckCircle2 size={15} className="text-[#57c88a]" aria-hidden="true" /> Single submission per team via team leader</li>
          </ul>
        </article>

        <article
          className={`rule-card ${isRevealed ? 'card-stagger-in' : ''}`}
          style={{ '--stagger-delay': '80ms' } as React.CSSProperties}
        >
          <div className="rule-card-header">
            <BookOpen size={22} className="text-[#ff8126]" aria-hidden="true" />
            <h3 className="rule-card-title">Eligibility & Credentials</h3>
          </div>
          <p className="rule-card-text">{rules.institutionEligibility}</p>
          <ul className="rule-check-list">
            <li><CheckCircle2 size={15} className="text-[#57c88a]" aria-hidden="true" /> UG & PG students from any discipline</li>
            <li><CheckCircle2 size={15} className="text-[#57c88a]" aria-hidden="true" /> Physical College ID card mandatory at entry</li>
            <li><CheckCircle2 size={15} className="text-[#57c88a]" aria-hidden="true" /> Faculty mentor is optional</li>
          </ul>
        </article>

        <article
          className={`rule-card ${isRevealed ? 'card-stagger-in' : ''}`}
          style={{ '--stagger-delay': '160ms' } as React.CSSProperties}
        >
          <div className="rule-card-header">
            <FileCode2 size={22} className="text-[#ff6b00]" aria-hidden="true" />
            <h3 className="rule-card-title">Originality & Plagiarism</h3>
          </div>
          <p className="rule-card-text">{rules.plagiarismPolicy}</p>
          <ul className="rule-check-list">
            <li><CheckCircle2 size={15} className="text-[#57c88a]" aria-hidden="true" /> Zero tolerance for copying existing products</li>
            <li><CheckCircle2 size={15} className="text-[#57c88a]" aria-hidden="true" /> Independent intellectual effort required</li>
            <li><CheckCircle2 size={15} className="text-[#57c88a]" aria-hidden="true" /> Documented codebase & design files required</li>
          </ul>
        </article>

        <article
          className={`rule-card ${isRevealed ? 'card-stagger-in' : ''}`}
          style={{ '--stagger-delay': '240ms' } as React.CSSProperties}
        >
          <div className="rule-card-header">
            <Scale size={22} className="text-[#6484ff]" aria-hidden="true" />
            <h3 className="rule-card-title">Jury Governance</h3>
          </div>
          <p className="rule-card-text">{rules.juryDecisionPolicy}</p>
          <ul className="rule-check-list">
            <li><CheckCircle2 size={15} className="text-[#57c88a]" aria-hidden="true" /> Multi-criteria weighted scoring</li>
            <li><CheckCircle2 size={15} className="text-[#57c88a]" aria-hidden="true" /> Independent industry & academic judges</li>
            <li><CheckCircle2 size={15} className="text-[#57c88a]" aria-hidden="true" /> Final scores audited before announcement</li>
          </ul>
        </article>
      </div>

      {/* Disqualification Conditions Alert Box */}
      <div className="disqualification-box">
        <div className="disqualification-header">
          <AlertTriangle size={20} className="text-[#ff8126]" aria-hidden="true" />
          <h4 className="disqualification-title">Conditions for Disqualification</h4>
        </div>
        <ul className="disqualification-list">
          {rules.disqualificationConditions.map((cond, idx) => (
            <li key={idx}>{cond}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
