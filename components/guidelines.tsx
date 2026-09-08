'use client';

import { EVENT_CONFIG } from '@/lib/event-config';
import { isPlaceholderUrl, trackEvent } from '@/lib/utils';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import {
  FileText,
  Presentation,
  Download,
  Clock,
  Laptop,
  CheckCircle2,
  FileCheck,
  HelpCircle,
} from 'lucide-react';

export default function Guidelines() {
  const isTemplatePlaceholder = isPlaceholderUrl(EVENT_CONFIG.links.slideTemplateUrl);
  const isDocPlaceholder = isPlaceholderUrl(EVENT_CONFIG.links.guidelinesDocUrl);
  const { ref, isRevealed } = useScrollReveal<HTMLElement>({ threshold: 0.15 });

  const handleTemplateClick = (e: React.MouseEvent) => {
    trackEvent('download_template_click', 'engagement');
    if (isTemplatePlaceholder) {
      e.preventDefault();
      alert('The official slide presentation template will be published here once finalized by the organizing committee.');
    }
  };

  const handleDocClick = (e: React.MouseEvent) => {
    trackEvent('view_guidelines_doc_click', 'engagement');
    if (isDocPlaceholder) {
      e.preventDefault();
      alert('The comprehensive PDF handbook is being finalized and will be linked here shortly.');
    }
  };

  return (
    <section
      ref={ref}
      id="guidelines"
      className={`section-container guidelines-section ${isRevealed ? 'section-revealed' : 'section-hidden'}`}
      aria-labelledby="guidelines-title"
    >
      <div className="section-header">
        <span className="section-eyebrow">06 / SUBMISSION & PRESENTATION GUIDE</span>
        <h2 id="guidelines-title" className="section-title">
          Deck specs, submission format, <br />
          <span className="section-title-gradient">& pitch expectations.</span>
        </h2>
        <p className="section-lead">
          Ensure your submission adheres to the standardized formatting and timing guidelines to maximize your evaluation score.
        </p>
      </div>

      <div className="guidelines-split-grid">
        {/* Left Column: Idea Submission Requirements (Google Form) */}
        <div className={`guideline-panel ${isRevealed ? 'card-stagger-in' : ''}`} style={{ '--stagger-delay': '0ms' } as React.CSSProperties}>
          <div className="panel-header">
            <FileCheck size={24} className="text-[#ff6b00]" aria-hidden="true" />
            <h3 className="panel-title">1. Online Submission Requirements</h3>
          </div>
          <p className="panel-sub">{EVENT_CONFIG.submissionRequirements.singleFormNotice}</p>

          <div className="panel-field-list">
            <h4 className="field-group-title">Information Collected in Google Form:</h4>
            <ul className="field-checklist">
              {EVENT_CONFIG.submissionRequirements.formSubmissionIncludes.map((item, idx) => (
                <li key={idx}>
                  <CheckCircle2 size={16} className="text-[#6484ff] flex-shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="file-specs-badge">
            <strong>Permitted Formats:</strong> PDF or Google Slides link (Max {EVENT_CONFIG.submissionRequirements.maxFileSizeMb}MB)
          </div>
        </div>

        {/* Right Column: Presentation & Pitch Day Specs */}
        <div className={`guideline-panel ${isRevealed ? 'card-stagger-in' : ''}`} style={{ '--stagger-delay': '120ms' } as React.CSSProperties}>
          <div className="panel-header">
            <Presentation size={24} className="text-[#6484ff]" aria-hidden="true" />
            <h3 className="panel-title">2. Grand Finale Pitch Guidelines</h3>
          </div>
          <p className="panel-sub">On-stage delivery guidelines for the 30 shortlisted teams presenting at KCE.</p>

          <div className="timing-spec-grid">
            <div className="spec-card">
              <Clock size={20} className="text-[#ff6b00]" aria-hidden="true" />
              <div className="spec-meta">
                <strong>{EVENT_CONFIG.presentationGuidelines.pitchDurationMinutes} Mins Pitch</strong>
                <span>Presentation Time</span>
              </div>
            </div>
            <div className="spec-card">
              <HelpCircle size={20} className="text-[#6484ff]" aria-hidden="true" />
              <div className="spec-meta">
                <strong>{EVENT_CONFIG.presentationGuidelines.qaDurationMinutes} Mins Q&A</strong>
                <span>Jury Cross-Examination</span>
              </div>
            </div>
            <div className="spec-card">
              <FileText size={20} className="text-[#b8bdca]" aria-hidden="true" />
              <div className="spec-meta">
                <strong>Max {EVENT_CONFIG.presentationGuidelines.maxSlides} Slides</strong>
                <span>Concise Pitch Deck</span>
              </div>
            </div>
            <div className="spec-card">
              <Laptop size={20} className="text-[#6484ff]" aria-hidden="true" />
              <div className="spec-meta">
                <strong>1 Team Laptop</strong>
                <span>HDMI Projectors Provided</span>
              </div>
            </div>
          </div>

          <div className="panel-info-callout">
            <strong>Prototype / Demo Advice:</strong>
            <p>{EVENT_CONFIG.presentationGuidelines.prototypeRequirement}</p>
          </div>

          {/* Action CTAs for Templates and Docs */}
          <div className="guideline-actions">
            <a
              href={isTemplatePlaceholder ? '#' : EVENT_CONFIG.links.slideTemplateUrl}
              onClick={handleTemplateClick}
              className={`btn-action-outline ${isTemplatePlaceholder ? 'btn-placeholder' : ''}`}
              target={isTemplatePlaceholder ? undefined : '_blank'}
              rel="noopener noreferrer"
            >
              <Download size={16} aria-hidden="true" />
              <span>{isTemplatePlaceholder ? 'Download Slide Template (TBA)' : 'Download Slide Template'}</span>
            </a>

            <a
              href={isDocPlaceholder ? '#' : EVENT_CONFIG.links.guidelinesDocUrl}
              onClick={handleDocClick}
              className={`btn-action-outline ${isDocPlaceholder ? 'btn-placeholder' : ''}`}
              target={isDocPlaceholder ? undefined : '_blank'}
              rel="noopener noreferrer"
            >
              <FileText size={16} aria-hidden="true" />
              <span>{isDocPlaceholder ? 'Full Guidelines PDF (TBA)' : 'Official Guidelines PDF'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
