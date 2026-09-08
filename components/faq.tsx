'use client';

import { useState } from 'react';
import { EVENT_CONFIG } from '@/lib/event-config';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]); // First item open by default
  const { ref, isRevealed } = useScrollReveal<HTMLElement>({ threshold: 0.15 });

  const toggleFAQ = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section
      ref={ref}
      id="faq"
      className={`section-container faq-section ${isRevealed ? 'section-revealed' : 'section-hidden'}`}
      aria-labelledby="faq-title"
    >
      <div className="section-header">
        <span className="section-eyebrow">08 / FREQUENTLY ASKED QUESTIONS</span>
        <h2 id="faq-title" className="section-title">
          Everything clear. <br />
          <span className="section-title-gradient">No ambiguities.</span>
        </h2>
        <p className="section-lead">
          Find comprehensive answers about registration fees, team composition, AI tools, documents, and event day logistics.
        </p>
      </div>

      <div className="faq-accordion-wrapper" aria-label="FAQ Accordion">
        {EVENT_CONFIG.faqs.map((faq, index) => {
          const isOpen = openIndexes.includes(index);
          const questionId = `faq-q-${index}`;
          const answerId = `faq-a-${index}`;

          return (
            <div
              key={index}
              className={`faq-accordion-item ${isOpen ? 'faq-item-open' : ''} ${isRevealed ? 'card-stagger-in' : ''}`}
              style={{ '--stagger-delay': `${index * 50}ms` } as React.CSSProperties}
            >
              <h3>
                <button
                  type="button"
                  id={questionId}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  className="faq-trigger-btn"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <span className="faq-icon-holder" aria-hidden="true">
                    <ChevronDown
                      size={20}
                      className={`faq-chevron ${isOpen ? 'faq-chevron-rotated' : ''}`}
                    />
                  </span>
                </button>
              </h3>
              <div
                id={answerId}
                aria-labelledby={questionId}
                className={`faq-answer-panel ${isOpen ? 'faq-panel-expanded' : 'faq-panel-collapsed'}`}
              >
                <div className="faq-answer-inner">
                  <p className="faq-answer-text">{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
