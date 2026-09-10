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
      className={`rules-section ${isRevealed ? 'section-revealed' : 'section-hidden'}`}
      aria-labelledby="rules-title"
    >
      <div className="rules-container">
        <header className="rules-header">
          <span className="rules-eyebrow">05 / INTEGRITY & ELIGIBILITY</span>
          <h2 id="rules-title" className="rules-title">
            Bring your team. <br />
            <span className="section-title-gradient">Own your thinking.</span>
          </h2>
          <p className="rules-lead">
            Clear, equitable guidelines ensuring fair competition, academic honesty, and transparent innovation.
          </p>
        </header>

        {/* Structured Eligibility & Governance Cards */}
        <div className="rules-cards-grid">
          <article
            className={`rule-card ${isRevealed ? 'card-stagger-in' : ''}`}
            style={{ '--stagger-delay': '0ms' } as React.CSSProperties}
          >
            <div className="rule-card-header">
              <Users size={24} className="text-[#6484ff]" aria-hidden="true" />
              <h3 className="rule-card-title">Team Structure</h3>
            </div>
            <p className="rule-card-text">{rules.teamSizeRequirement}</p>
            <ul className="rule-check-list">
              <li>
                <CheckCircle2 size={16} className="text-[#57c88a] rule-check-icon" aria-hidden="true" />
                <span>Cross-department teams permitted</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-[#57c88a] rule-check-icon" aria-hidden="true" />
                <span>Cross-college collaborations allowed</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-[#57c88a] rule-check-icon" aria-hidden="true" />
                <span>Single submission per team via team leader</span>
              </li>
            </ul>
          </article>

          <article
            className={`rule-card ${isRevealed ? 'card-stagger-in' : ''}`}
            style={{ '--stagger-delay': '80ms' } as React.CSSProperties}
          >
            <div className="rule-card-header">
              <BookOpen size={24} className="text-[#ff8126]" aria-hidden="true" />
              <h3 className="rule-card-title">Eligibility & Credentials</h3>
            </div>
            <p className="rule-card-text">{rules.institutionEligibility}</p>
            <ul className="rule-check-list">
              <li>
                <CheckCircle2 size={16} className="text-[#57c88a] rule-check-icon" aria-hidden="true" />
                <span>UG & PG students from any discipline</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-[#57c88a] rule-check-icon" aria-hidden="true" />
                <span>Physical College ID card mandatory at entry</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-[#57c88a] rule-check-icon" aria-hidden="true" />
                <span>Faculty mentor is optional</span>
              </li>
            </ul>
          </article>

          <article
            className={`rule-card ${isRevealed ? 'card-stagger-in' : ''}`}
            style={{ '--stagger-delay': '160ms' } as React.CSSProperties}
          >
            <div className="rule-card-header">
              <FileCode2 size={24} className="text-[#ff6b00]" aria-hidden="true" />
              <h3 className="rule-card-title">Originality & Plagiarism</h3>
            </div>
            <p className="rule-card-text">{rules.plagiarismPolicy}</p>
            <ul className="rule-check-list">
              <li>
                <CheckCircle2 size={16} className="text-[#57c88a] rule-check-icon" aria-hidden="true" />
                <span>Zero tolerance for copying existing products</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-[#57c88a] rule-check-icon" aria-hidden="true" />
                <span>Independent intellectual effort required</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-[#57c88a] rule-check-icon" aria-hidden="true" />
                <span>Documented codebase & design files required</span>
              </li>
            </ul>
          </article>

          <article
            className={`rule-card ${isRevealed ? 'card-stagger-in' : ''}`}
            style={{ '--stagger-delay': '240ms' } as React.CSSProperties}
          >
            <div className="rule-card-header">
              <Scale size={24} className="text-[#6484ff]" aria-hidden="true" />
              <h3 className="rule-card-title">Jury Governance</h3>
            </div>
            <p className="rule-card-text">{rules.juryDecisionPolicy}</p>
            <ul className="rule-check-list">
              <li>
                <CheckCircle2 size={16} className="text-[#57c88a] rule-check-icon" aria-hidden="true" />
                <span>Multi-criteria weighted scoring</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-[#57c88a] rule-check-icon" aria-hidden="true" />
                <span>Independent industry & academic judges</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-[#57c88a] rule-check-icon" aria-hidden="true" />
                <span>Final scores audited before announcement</span>
              </li>
            </ul>
          </article>
        </div>

        {/* Prominent AI Policy Banner */}
        <div className="ai-policy-banner">
          <div className="ai-policy-icon">
            <Sparkles size={20} className="text-[#ff6b00]" aria-hidden="true" />
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
      </div>
    </section>
  );
}

