'use client';

import { EVENT_CONFIG } from '@/lib/event-config';
import { ArrowUp, Shield, Scale, Lock, FileCode } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (tab: 'privacy' | 'ip' | 'conduct' | 'ai' | 'cancellation' | 'grievance') => void;
}

export default function Footer({ onOpenLegal }: FooterProps) {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-top-grid">
        {/* Brand Column */}
        <div className="footer-brand-col">
          <a
            href="#overview"
            className="footer-brand"
            onClick={scrollToTop}
            aria-label="INNOVXATHON 2026 - Scroll to top"
          >
            <span className="brand-title">INNOVXATHON</span>
            <sup className="brand-sup">’26</sup>
          </a>
          <p className="footer-tagline">{EVENT_CONFIG.metadata.tagline}</p>
          <p className="footer-credit">
            AN INNOVXERA INITIATIVE · KARPAGAM COLLEGE OF ENGINEERING (AUTONOMOUS)
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="footer-nav-col">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-links-list">
            <li><a href="#overview">Event Overview</a></li>
            <li><a href="#timeline">Important Dates</a></li>
            <li><a href="#process">Participant Roadmap</a></li>
            <li><a href="#prizes">Prize Breakdown</a></li>
            <li><a href="#rules">Eligibility & AI Rules</a></li>
            <li><a href="#guidelines">Deck & Pitch Specs</a></li>
            <li><a href="#faq">Frequently Asked Questions</a></li>
            <li><a href="#contact">Venue Coordinates</a></li>
          </ul>
        </div>

        {/* Legal & Trust Policies */}
        <div className="footer-nav-col">
          <h4 className="footer-heading">Trust & Governance</h4>
          <ul className="footer-links-list">
            <li>
              <button
                type="button"
                className="footer-policy-btn"
                onClick={() => onOpenLegal('privacy')}
              >
                <Lock size={14} aria-hidden="true" />
                <span>Privacy & Media Policy</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-policy-btn"
                onClick={() => onOpenLegal('ip')}
              >
                <FileCode size={14} aria-hidden="true" />
                <span>100% IP Ownership Guarantee</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-policy-btn"
                onClick={() => onOpenLegal('conduct')}
              >
                <Shield size={14} aria-hidden="true" />
                <span>Code of Conduct</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-policy-btn"
                onClick={() => onOpenLegal('ai')}
              >
                <Scale size={14} aria-hidden="true" />
                <span>Responsible AI Policy</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-policy-btn"
                onClick={() => onOpenLegal('grievance')}
              >
                <span>Grievance Escalation</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p className="footer-copy">
          © 2026 INNOVXERA. All rights reserved. Built for national student innovators.
        </p>
        <a
          href="#overview"
          onClick={scrollToTop}
          className="footer-back-to-top"
          aria-label="Back to the top of page"
        >
          <span>Back to the stars</span>
          <ArrowUp size={16} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
