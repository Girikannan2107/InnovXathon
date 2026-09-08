'use client';

import { EVENT_CONFIG } from '@/lib/event-config';
import { formatINR } from '@/lib/utils';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { Users, Trophy, MapPin, Sparkles, ShieldCheck, CreditCard, School, Layers } from 'lucide-react';
import BorderGlow from '@/components/border-glow';

export default function KeyFacts() {
  const totalPrize = formatINR(EVENT_CONFIG.metadata.totalPrizePool);
  const shortlistFee = formatINR(EVENT_CONFIG.metadata.shortlistFeePerTeam);
  const { ref, isRevealed } = useScrollReveal<HTMLElement>({ threshold: 0.15 });

  const facts = [
    {
      icon: School,
      title: 'Open to All Colleges',
      description: 'Bona fide undergraduate and postgraduate students from any recognized university across India.',
      badge: 'Pan-India',
    },
    {
      icon: Users,
      title: 'Strict 4-Member Teams',
      description: 'Every team must consist of exactly 4 student members. Cross-department and cross-college teams permitted.',
      badge: '4 Students / Team',
    },
    {
      icon: Trophy,
      title: `${totalPrize} Prize Pool`,
      description: 'Substantial awards for Winner (₹25,000), Runner-Up (₹15,000), and Second Runner-Up (₹10,000).',
      badge: 'Cash + Trophies',
    },
    {
      icon: Layers,
      title: '30 Finalist Teams',
      description: 'Top 30 teams from preliminary evaluation earn direct entry to pitch on stage at KCE.',
      badge: 'Top 30 Selected',
    },
    {
      icon: MapPin,
      title: 'Offline Event at KCE',
      description: `${EVENT_CONFIG.schedule.eventDateDisplay} at Karpagam College of Engineering, Coimbatore. Reporting time 9:00 AM IST.`,
      badge: 'In-Person Ideathon',
    },
    {
      icon: CreditCard,
      title: 'Pay Only If Shortlisted',
      description: `Initial application is ₹0 Free. The ${shortlistFee} fee applies strictly to the 30 shortlisted teams after selection.`,
      badge: 'Free Application',
    },
    {
      icon: Sparkles,
      title: 'Ethical AI Transparency',
      description: 'AI tooling is welcomed for research and prototyping, provided all usage is transparently disclosed.',
      badge: 'AI Policy',
    },
    {
      icon: ShieldCheck,
      title: '100% IP Retained',
      description: 'Participants maintain full, exclusive ownership of all code, intellectual property, and pitch materials.',
      badge: 'Full Ownership',
    },
  ];

  return (
    <section
      ref={ref}
      className={`section-container key-facts-section ${isRevealed ? 'section-revealed' : 'section-hidden'}`}
      aria-labelledby="key-facts-title"
    >
      <div className="section-header">
        <span className="section-eyebrow">01 / ESSENTIAL HIGHLIGHTS</span>
        <h2 id="key-facts-title" className="section-title">
          Built for student visionaries. <br />
          <span className="section-title-gradient">Everything you need to know.</span>
        </h2>
        <p className="section-lead">
          INNOVXATHON 2026 is designed to empower college creators, researchers, and engineers. Here are the core parameters at a glance.
        </p>
      </div>

      <div className="facts-grid">
        {facts.map((fact, idx) => {
          const Icon = fact.icon;
          return (
            <div
              key={fact.title}
              className={`fact-card-wrapper ${isRevealed ? 'card-stagger-in' : ''}`}
              style={{ '--stagger-delay': `${idx * 60}ms` } as React.CSSProperties}
            >
              <BorderGlow
                edgeSensitivity={30}
                glowColor="30 100 55"
                backgroundColor="rgba(16, 18, 26, 0.92)"
                borderRadius={16}
                glowRadius={35}
                glowIntensity={1.2}
                coneSpread={28}
                colors={['#ff6b00', '#ff8126', '#ffa94d']}
                className="fact-glow-card"
              >
                <article className="fact-card-content">
                  <div className="fact-card-header">
                    <div className="fact-icon-bubble">
                      <Icon size={22} className="text-[#ff6b00]" aria-hidden="true" />
                    </div>
                    <span className="fact-badge">{fact.badge}</span>
                  </div>
                  <h3 className="fact-title">{fact.title}</h3>
                  <p className="fact-description">{fact.description}</p>
                </article>
              </BorderGlow>
            </div>
          );
        })}
      </div>
    </section>
  );
}
