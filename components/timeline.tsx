'use client';

import { EVENT_CONFIG } from '@/lib/event-config';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { CheckCircle, Clock, CalendarDays } from 'lucide-react';
import ElectricBorder from '@/components/electric-border';

export default function Timeline() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      id="timeline"
      className={`section-container timeline-section ${isRevealed ? 'section-revealed' : 'section-hidden'}`}
      aria-labelledby="timeline-title"
    >
      <div className="section-header">
        <span className="section-eyebrow">03 / IMPORTANT MILESTONES</span>
        <h2 id="timeline-title" className="section-title">
          Key Dates & <br />
          <span className="section-title-gradient">Action Deadlines.</span>
        </h2>
        <p className="section-lead">
          Keep track of critical submission windows, review milestones, and event day timings.
        </p>
      </div>

      <div className="timeline-horizontal-grid">
        {EVENT_CONFIG.timeline.map((item, idx) => {
          const isCompleted = item.status === 'completed';
          const isCurrent = item.status === 'current';
          const isUpcoming = item.status === 'upcoming';
          const isEven = idx % 2 === 0;

          const cardColor = isCurrent
            ? '#ff6b00'
            : isCompleted
            ? '#57c88a'
            : isEven
            ? '#ff8126'
            : '#6484ff';

          return (
            <div
              key={item.id}
              className={`timeline-card-wrapper ${isRevealed ? 'card-stagger-in' : ''}`}
              style={{ '--stagger-delay': `${idx * 120}ms` } as React.CSSProperties}
            >
              <ElectricBorder
                color={cardColor}
                speed={0.4}
                chaos={0.06}
                thickness={2}
                hoverOnly={true}
                active={isCurrent}
                style={{ borderRadius: 14, height: '100%' }}
                className="timeline-card-electric"
              >
                <article
                  className={`timeline-card ${
                    isCurrent
                      ? 'timeline-card-current'
                      : isCompleted
                      ? 'timeline-card-completed'
                      : 'timeline-card-upcoming'
                  } ${isEven ? 'timeline-card-orange' : 'timeline-card-blue'}`}
                >
                  <div className="timeline-card-header">
                    <span className="timeline-step-badge">STAGE {item.step}</span>
                    {isCurrent && (
                      <span className="timeline-status-pill status-active">
                        <span className="status-pulse" aria-hidden="true" />
                        Active Now
                      </span>
                    )}
                    {isCompleted && (
                      <span className="timeline-status-pill status-completed">
                        <CheckCircle size={12} aria-hidden="true" />
                        Completed
                      </span>
                    )}
                    {isUpcoming && (
                      <span className="timeline-status-pill status-upcoming">
                        <Clock size={12} aria-hidden="true" />
                        Upcoming
                      </span>
                    )}
                  </div>

                  <div className="timeline-date-box">
                    <CalendarDays
                      size={18}
                      className={isEven ? 'text-[#ff6b00]' : 'text-[#6484ff]'}
                      aria-hidden="true"
                    />
                    <time dateTime={item.dateISO} className="timeline-date-text">
                      {item.dateDisplay}
                    </time>
                  </div>

                  <h3 className="timeline-card-title">{item.title}</h3>

                  <div className="timeline-detail-block">
                    <span className="timeline-label">Participant Action:</span>
                    <p className="timeline-action-text">{item.participantAction}</p>
                  </div>

                  <div className="timeline-detail-block">
                    <span className="timeline-label">Next Outcome:</span>
                    <p className="timeline-result-text">{item.resultOrNext}</p>
                  </div>
                </article>
              </ElectricBorder>
            </div>
          );
        })}
      </div>
    </section>
  );
}
