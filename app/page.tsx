'use client';

import { useState } from 'react';
import Header from '@/components/header';
import Hero from '@/components/hero';
import BrandStrip from '@/components/brand-strip';
import KeyFacts from '@/components/key-facts';
import Process from '@/components/process';
import Timeline from '@/components/timeline';
import Prizes from '@/components/prizes';
import Rules from '@/components/rules';
import Guidelines from '@/components/guidelines';
import JudgingCriteria from '@/components/judging-criteria';
import FAQ from '@/components/faq';
import VenueContact from '@/components/venue-contact';
import Results from '@/components/results';
import Footer from '@/components/footer';
import LegalModal from '@/components/legal-modal';
import ParticleRegister from '@/app/particle-register';
import CosmicSpaceBackground from '@/components/cosmic-space-background';
import { EVENT_CONFIG } from '@/lib/event-config';
import { isPlaceholderUrl, trackEvent } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export default function Home() {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'ip' | 'conduct' | 'ai' | 'cancellation' | 'grievance'>('privacy');
  const [registerNoticeOpen, setRegisterNoticeOpen] = useState(false);

  const isFormPlaceholder = isPlaceholderUrl(EVENT_CONFIG.links.googleFormUrl);

  const handleOpenLegal = (tab: 'privacy' | 'ip' | 'conduct' | 'ai' | 'cancellation' | 'grievance') => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  const handleRegisterTrigger = () => {
    trackEvent('register_section_click', 'conversion');
    if (isFormPlaceholder) {
      setRegisterNoticeOpen(true);
    } else {
      window.open(EVENT_CONFIG.links.googleFormUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <CosmicSpaceBackground />

      <Header
        onOpenGuidelines={() => {
          const el = document.getElementById('guidelines');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenRegisterModal={() => setRegisterNoticeOpen(true)}
      />

      <main id="main-content">
        <Hero
          onOpenGuidelines={() => {
            const el = document.getElementById('guidelines');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenRegisterNotice={() => setRegisterNoticeOpen(true)}
        />

        <BrandStrip />

        <KeyFacts />

        <Process />

        <Timeline />

        <Prizes />

        <Rules />

        <Guidelines />

        <JudgingCriteria />

        {/* Final High-Conversion Registration Callout Section */}
        <section id="register" className="section-container registration-section" aria-labelledby="reg-callout-title">
          <div className="section-header text-center">
            <span className="section-eyebrow">YOUR NEXT BIG IDEA BELONGS HERE</span>
            <h2 id="reg-callout-title" className="section-title">
              Ready to make <br />
              <span className="section-title-gradient">something matter?</span>
            </h2>
            <p className="section-lead">
              Four minds. One bold idea. An entirely new trajectory of possibilities.
            </p>
          </div>

          <div className="registration-interactive-box">
            <ParticleRegister onRegister={handleRegisterTrigger} />

            <div className="reg-meta-badges">
              <span className="reg-badge-item">
                {EVENT_CONFIG.schedule.registrationOpensDisplay} — {EVENT_CONFIG.schedule.registrationClosesDisplay}
              </span>
              <span className="reg-badge-item">
                ₹500 / Shortlisted Team (Free Initial Submission)
              </span>
            </div>

            {/* Status output notice if link is in placeholder mode */}
            {registerNoticeOpen && (
              <output className="reg-placeholder-alert block">
                <AlertCircle size={20} className="text-cyan-400 flex-shrink-0" aria-hidden="true" />
                <div className="text-left">
                  <strong>Registration Link Notice:</strong>
                  <p>
                    The official Google Form for INNOVXATHON 2026 will be activated for public submissions on <strong>10 September 2026</strong>. Bookmark this page or contact the organizing committee at <a href={`mailto:${EVENT_CONFIG.contacts.primaryEmail}`} className="underline">{EVENT_CONFIG.contacts.primaryEmail}</a> for early inquiries.
                  </p>
                </div>
              </output>
            )}
          </div>
        </section>

        <FAQ />

        <VenueContact />

        <Results />
      </main>

      <Footer onOpenLegal={handleOpenLegal} />

      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        defaultTab={legalTab}
      />
    </>
  );
}
