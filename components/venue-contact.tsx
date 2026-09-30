'use client';

import { EVENT_CONFIG } from '@/lib/event-config';
import { useScrollReveal } from '@/lib/use-scroll-reveal';
import { MapPin, Mail, Phone, ExternalLink, Navigation, Clock, Building2, User } from 'lucide-react';

export default function VenueContact() {
  const venue = EVENT_CONFIG.venue;
  const contacts = EVENT_CONFIG.contacts;
  const { ref, isRevealed } = useScrollReveal<HTMLElement>({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      id="venue"
      className={`section-container venue-contact-section ${isRevealed ? 'section-revealed' : 'section-hidden'}`}
      aria-labelledby="venue-title"
    >
      <div id="contact" className="sr-only" aria-hidden="true" />
      <div className="section-header">
        <span className="section-eyebrow">09 / THE COORDINATES & REACH</span>
        <h2 id="venue-title" className="section-title">
          Meet us at KCE. <br />
          <span className="section-title-gradient">Coimbatore, Tamil Nadu.</span>
        </h2>
        <p className="section-lead">
          Connect with the official event coordinators and navigate directly to the campus venue.
        </p>
      </div>

      <div className="venue-cards-grid">
        {/* Venue Information Card */}
        <div
          className={`venue-card ${isRevealed ? 'card-stagger-in' : ''}`}
          style={{ '--stagger-delay': '0ms' } as React.CSSProperties}
        >
          <div className="venue-card-header">
            <div className="venue-icon-circle">
              <Building2 size={24} className="text-[#ff6b00]" aria-hidden="true" />
            </div>
            <div>
              <h3 className="venue-name">{venue.institutionName}</h3>
              <p className="venue-hall">{venue.hallOrBuilding}</p>
            </div>
          </div>

          <div className="venue-address-block">
            <MapPin size={18} className="text-[#ff6b00] flex-shrink-0" aria-hidden="true" />
            <address className="venue-address-text">{venue.fullAddress}</address>
          </div>

          <div className="venue-reporting-block">
            <Clock size={18} className="text-[#6484ff] flex-shrink-0" aria-hidden="true" />
            <span>Grand Finale & Reporting: <strong>{EVENT_CONFIG.schedule.eventDateDisplay} at {EVENT_CONFIG.schedule.reportingTimeDisplay}</strong></span>
          </div>

          <p className="venue-travel-notes">{venue.travelNotes}</p>

          <div className="venue-action-buttons">
            <a
              href={venue.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-glow btn-venue-maps"
            >
              <Navigation size={16} aria-hidden="true" />
              <span>Open in Google Maps</span>
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Contact Coordinates Card */}
        <div
          className={`venue-card contact-card ${isRevealed ? 'card-stagger-in' : ''}`}
          style={{ '--stagger-delay': '120ms' } as React.CSSProperties}
        >
          <div className="venue-card-header">
            <div className="venue-icon-circle">
              <Phone size={24} className="text-[#6484ff]" aria-hidden="true" />
            </div>
            <div>
              <h3 className="venue-name">Event Coordinators</h3>
              <p className="venue-hall">INNOVXERA Student Organizing Committee</p>
            </div>
          </div>

          {/* Coordinators Grid (Side-by-side on desktop, vertical on mobile) */}
          <div className="coordinators-grid" aria-label="Event Coordinators Contact Details">
            {contacts.coordinators.map((coord) => (
              <a
                key={coord.name}
                href={coord.telHref}
                className="coordinator-card-item contact-item-link"
                aria-label={`Call ${coord.name} at ${coord.phone}`}
              >
                <div className="contact-item-icon">
                  <User size={18} className="text-[#ff6b00]" aria-hidden="true" />
                </div>
                <div className="contact-item-details">
                  <span className="contact-label">{coord.name}</span>
                  <strong className="contact-value">{coord.phone}</strong>
                </div>
              </a>
            ))}
          </div>

          {/* Official Email */}
          <div className="contact-methods-list">
            <a href={`mailto:${contacts.primaryEmail}`} className="contact-item-link" aria-label={`Email ${contacts.primaryEmail}`}>
              <div className="contact-item-icon">
                <Mail size={18} className="text-[#6484ff]" aria-hidden="true" />
              </div>
              <div className="contact-item-details">
                <span className="contact-label">Official Inquiries & Support</span>
                <strong className="contact-value">{contacts.primaryEmail}</strong>
              </div>
            </a>
          </div>

          <div className="emergency-support-notice">
            <p>
              Helpline active Monday to Saturday, 9:00 AM – 6:00 PM IST. For immediate dispute escalation, write directly with subject tag <code>[INNOVXATHON-QUERY]</code>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
