'use client';

import { useState, useEffect, useRef } from 'react';
import { EVENT_CONFIG } from '@/lib/event-config';
import { isPlaceholderUrl, trackEvent } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import PillNav from '@/components/pill-nav';
import CosmicButton from '@/components/cosmic-button';

interface HeaderProps {
  onOpenGuidelines?: () => void;
  onOpenRegisterModal?: () => void;
}

export default function Header({ onOpenGuidelines: _onOpenGuidelines, onOpenRegisterModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { name: 'Overview', href: '#overview' },
    { name: 'Process', href: '#process' },
    { name: 'Timeline', href: '#timeline' },
    { name: 'Prizes', href: '#prizes' },
    { name: 'Rules', href: '#rules' },
    { name: 'Guidelines', href: '#guidelines' },
    { name: 'Judging', href: '#judging' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Venue & Contact', href: '#contact' },
  ];

  const [scrollProgress, setScrollProgress] = useState(0);

  // Sticky header background transition and top progress indicator on scroll
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = totalHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / totalHeight)) : 0;
          setScrollProgress(progress);
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to highlight current active section
  useEffect(() => {
    const sectionIds = ['overview', 'process', 'timeline', 'prizes', 'rules', 'guidelines', 'judging', 'faq', 'contact'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // Mobile menu keyboard trap and escape key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!mobileMenuOpen) return;

      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }

      if (e.key === 'Tab' && mobileMenuRef.current) {
        const focusableElements = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleRegisterClick = (e: React.MouseEvent) => {
    trackEvent('header_register_click', 'conversion');
    if (isPlaceholderUrl(EVENT_CONFIG.links.googleFormUrl)) {
      e.preventDefault();
      if (onOpenRegisterModal) {
        onOpenRegisterModal();
      } else {
        const regSection = document.getElementById('register');
        regSection?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isFormPlaceholder = isPlaceholderUrl(EVENT_CONFIG.links.googleFormUrl);

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <header
        className={`site-header ${isScrolled ? 'site-header-scrolled' : ''}`}
        role="banner"
      >
        <div
          className="header-scroll-progress"
          aria-hidden="true"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
        <div className="header-inner">
          <a
            href="#overview"
            className="brand-logo"
            aria-label="INNOVXATHON 2026 - Back to top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span className="brand-title">INNOVXERA</span>
            <small className="brand-subtitle">PRESENTS INNOVXATHON ’26</small>
          </a>

          {/* Desktop PillNav Navigation */}
          <div className="header-nav-wrapper">
            <PillNav
              items={navLinks.map((l) => ({ label: l.name, href: l.href }))}
              activeHref={`#${activeSection}`}
              baseColor="#ff6b00"
              pillColor="rgba(17, 22, 45, 0.92)"
              hoveredPillTextColor="#07070d"
              pillTextColor="#e2e8f0"
              ease="power3.easeOut"
              initialLoadAnimation={true}
              onItemClick={(href, e) => {
                e.preventDefault();
                handleNavClick(href);
              }}
            />
          </div>

          {/* Header Action CTA */}
          <div className="header-actions">
            {isFormPlaceholder ? (
              <CosmicButton
                href="#register"
                variant="header"
                onClick={handleRegisterClick}
                data-analytics="header-register"
              >
                Register Now
              </CosmicButton>
            ) : (
              <CosmicButton
                href={EVENT_CONFIG.links.googleFormUrl}
                variant="header"
                isExternal={true}
                onClick={handleRegisterClick}
                data-analytics="header-register"
              >
                Register Now
              </CosmicButton>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              ref={menuButtonRef}
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Mobile Navigation Drawer */}
      <dialog
        id="mobile-navigation"
        ref={mobileMenuRef}
        className={`mobile-drawer ${mobileMenuOpen ? 'mobile-drawer-open' : ''}`}
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        aria-hidden={!mobileMenuOpen}
        open={mobileMenuOpen}
      >
        <button
          type="button"
          className="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close navigation overlay"
        />
        <div className="mobile-drawer-panel">
          <div className="mobile-drawer-header">
            <span className="brand-title">INNOVXATHON ’26</span>
            <button
              type="button"
              className="mobile-drawer-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          <nav className="mobile-nav-links" aria-label="Mobile Navigation Links">
            {navLinks.map((link) => {
              const targetId = link.href.replace('#', '');
              const isActive = activeSection === targetId;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="active-dot" aria-hidden="true" />}
                </a>
              );
            })}
          </nav>

          <div className="mobile-drawer-footer">
            {isFormPlaceholder ? (
              <CosmicButton
                href="#register"
                variant="primary"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleRegisterClick(e);
                }}
              >
                Register & Submit Idea
              </CosmicButton>
            ) : (
              <CosmicButton
                href={EVENT_CONFIG.links.googleFormUrl}
                variant="primary"
                isExternal={true}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleRegisterClick(e);
                }}
              >
                Register & Submit Idea
              </CosmicButton>
            )}
            <p className="mobile-drawer-note">
              16 Oct 2026 · KCE Coimbatore · Up to 4 Members / Team
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
