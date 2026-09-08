'use client';

import { useEffect, useRef, useState } from 'react';
import { EVENT_CONFIG } from '@/lib/event-config';
import { X, ShieldCheck, Lock, FileCode, Users, HelpCircle, Scale } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'ip' | 'conduct' | 'ai' | 'cancellation' | 'grievance';
}

export default function LegalModal({
  isOpen,
  onClose,
  defaultTab = 'privacy',
}: LegalModalProps) {
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const activeTab = selectedTab ?? defaultTab;
  const modalRef = useRef<HTMLDialogElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setSelectedTab(null);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const legal = EVENT_CONFIG.legal;

  return (
    <div className="legal-modal-backdrop" role="presentation">
      <button
        type="button"
        className="fixed inset-0 w-full h-full bg-black/75 backdrop-blur-sm -z-10 cursor-default"
        onClick={handleClose}
        aria-label="Close modal overlay"
      />
      <dialog
        ref={modalRef}
        className="legal-modal-dialog"
        aria-labelledby="legal-modal-title"
        open
      >
        <div className="legal-modal-header">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-[#ff6b00]" size={22} aria-hidden="true" />
            <h2 id="legal-modal-title" className="legal-modal-title">
              Legal, Privacy & Governance
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="legal-modal-close-btn"
            onClick={handleClose}
            aria-label="Close legal information modal"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="legal-modal-body">
          {/* Navigation Tabs */}
          <div className="legal-tabs-list" role="tablist" aria-label="Legal policies">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'privacy'}
              className={`legal-tab-item ${activeTab === 'privacy' ? 'legal-tab-item-active' : ''}`}
              onClick={() => setSelectedTab('privacy')}
            >
              <Lock size={15} aria-hidden="true" />
              <span>Privacy Notice</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'ip'}
              className={`legal-tab-item ${activeTab === 'ip' ? 'legal-tab-item-active' : ''}`}
              onClick={() => setSelectedTab('ip')}
            >
              <FileCode size={15} aria-hidden="true" />
              <span>IP Ownership</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'conduct'}
              className={`legal-tab-item ${activeTab === 'conduct' ? 'legal-tab-item-active' : ''}`}
              onClick={() => setSelectedTab('conduct')}
            >
              <Users size={15} aria-hidden="true" />
              <span>Code of Conduct</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'ai'}
              className={`legal-tab-item ${activeTab === 'ai' ? 'legal-tab-item-active' : ''}`}
              onClick={() => setSelectedTab('ai')}
            >
              <Scale size={15} aria-hidden="true" />
              <span>AI Disclosure</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'grievance'}
              className={`legal-tab-item ${activeTab === 'grievance' ? 'legal-tab-item-active' : ''}`}
              onClick={() => setSelectedTab('grievance')}
            >
              <HelpCircle size={15} aria-hidden="true" />
              <span>Grievance Channel</span>
            </button>
          </div>

          {/* Content Pane */}
          <div className="legal-content-pane">
            {activeTab === 'privacy' && (
              <div>
                <h3 className="policy-heading">Participant Privacy & Data Protection</h3>
                <p className="policy-paragraph">{legal.privacyNotice}</p>
                <h4 className="policy-subheading">Photo & Video Media Consent</h4>
                <p className="policy-paragraph">
                  By attending the on-campus finale at Karpagam College of Engineering, participants grant permission for the organizing committee to capture photography and video recordings of stage pitches for promotional, academic, and archive documentation.
                </p>
              </div>
            )}

            {activeTab === 'ip' && (
              <div>
                <h3 className="policy-heading">Intellectual Property (IP) Rights</h3>
                <p className="policy-paragraph">{legal.ipOwnershipPolicy}</p>
                <div className="policy-highlight-box">
                  <strong>Key Guarantee:</strong> Neither INNOVXERA nor Karpagam College of Engineering claims any equity, licensing, or commercial rights to projects developed or submitted by participants.
                </div>
              </div>
            )}

            {activeTab === 'conduct' && (
              <div>
                <h3 className="policy-heading">Community Code of Conduct</h3>
                <p className="policy-paragraph">{legal.codeOfConduct}</p>
                <h4 className="policy-subheading">Campus Discipline & ID Verification</h4>
                <p className="policy-paragraph">
                  All visiting participants must adhere strictly to campus decorum, safety regulations, and wear official college identification at all times.
                </p>
              </div>
            )}

            {activeTab === 'ai' && (
              <div>
                <h3 className="policy-heading">Generative AI Tool Usage Declaration</h3>
                <p className="policy-paragraph">{legal.aiDisclosurePolicy}</p>
                <p className="policy-paragraph">
                  All shortlisted teams will be required to provide a written declaration acknowledging any AI tools (e.g., ChatGPT, Claude, GitHub Copilot, Midjourney) utilized during idea formulation, architecture design, or slide presentation design.
                </p>
              </div>
            )}

            {activeTab === 'grievance' && (
              <div>
                <h3 className="policy-heading">Grievance Redressal & Support</h3>
                <p className="policy-paragraph">{legal.grievanceChannel}</p>
                <div className="policy-highlight-box">
                  <strong>Direct Escalation:</strong> Email <a href={`mailto:${EVENT_CONFIG.contacts.primaryEmail}`} className="underline text-[#6484ff]">{EVENT_CONFIG.contacts.primaryEmail}</a> with all relevant team details and supporting documentation.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="legal-modal-footer">
          <button type="button" className="btn-secondary-outline" onClick={handleClose}>
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
}
