'use client';

import { EVENT_CONFIG } from '@/lib/event-config';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { Trophy, Clock, Sparkles } from 'lucide-react';

export default function Results() {
  const results = EVENT_CONFIG.results;
  const { ref, isRevealed } = useScrollReveal<HTMLElement>({ threshold: 0.15 });

  if (!results.isPublished) {
    return (
      <section
        ref={ref}
        className={`section-container results-section ${isRevealed ? 'section-revealed' : 'section-hidden'}`}
        aria-labelledby="results-title"
      >
        <div className="section-header text-center">
          <span className="section-eyebrow">10 / AWARDS & RESULTS</span>
          <h2 id="results-title" className="section-title">
            The winning solutions <br />
            <span className="section-title-gradient">will be enshrined here.</span>
          </h2>
        </div>

        <div className={`results-pending-card ${isRevealed ? 'card-stagger-in' : ''}`}>
          <div className="results-icon-bubble">
            <Trophy size={36} className="text-[#ff6b00]" aria-hidden="true" />
          </div>
          <h3 className="results-pending-heading">Results Awaiting Grand Finale</h3>
          <p className="results-pending-desc">
            Grand jury scores will be consolidated and announced live at the award ceremony. Verified winning teams and project summaries will be published immediately following the valedictory session.
          </p>
          <div className="results-schedule-pill">
            <Clock size={16} className="text-[#6484ff]" aria-hidden="true" />
            <span>Expected Publication: <strong>{results.expectedPublishDateTime}</strong></span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className={`section-container results-section ${isRevealed ? 'section-revealed' : 'section-hidden'}`}
      aria-labelledby="results-title"
    >
      <div className="section-header">
        <span className="section-eyebrow">10 / OFFICIAL WINNERS</span>
        <h2 id="results-title" className="section-title">
          Celebrating the Champions of <br />
          <span className="section-title-gradient">INNOVXATHON 2026</span>
        </h2>
      </div>

      <div className="winners-grid">
        {results.winners.map((winner, idx) => (
          <article
            key={idx}
            className={`winner-card ${isRevealed ? 'card-stagger-in' : ''}`}
            style={{ '--stagger-delay': `${idx * 100}ms` } as React.CSSProperties}
          >
            <div className="winner-award-badge">
              <Sparkles size={14} className="text-[#ff6b00]" aria-hidden="true" />
              <span>{winner.award}</span>
            </div>
            <h3 className="winner-team-name">{winner.teamName}</h3>
            <p className="winner-college">{winner.college}</p>
            <h4 className="winner-idea-title">{winner.ideaTitle}</h4>
            <p className="winner-summary">{winner.projectSummary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
