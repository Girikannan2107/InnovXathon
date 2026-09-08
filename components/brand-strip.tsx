import { EVENT_CONFIG } from '@/lib/event-config';

export default function BrandStrip() {
  const organizer = EVENT_CONFIG.organizersAndSponsors.find((item) => item.role === 'Organized by');
  const partners = EVENT_CONFIG.organizersAndSponsors.filter((item) => item.role !== 'Organized by');

  return (
    <section className="brand-strip-section" aria-label="Event Organizers and Partners">
      <div className="brand-strip-inner">
        {/* Organizer Column */}
        {organizer && (
          <div className="brand-group organizer-group">
            <span className="brand-group-label">{organizer.role.toUpperCase()}</span>
            <div className="brand-card">
              <div className="brand-logo-frame">
                <img
                  src={organizer.logoPath}
                  alt={organizer.alt}
                  width={organizer.width}
                  height={organizer.height}
                  className="brand-logo-img"
                  loading="lazy"
                />
              </div>
              <span className="brand-caption">{organizer.name}</span>
            </div>
          </div>
        )}

        <div className="brand-divider" aria-hidden="true" />

        {/* Partners & Sponsors Column */}
        <div className="brand-group partners-group">
          <span className="brand-group-label">INSTITUTIONAL & INDUSTRY PARTNERS</span>
          <div className="partners-grid">
            {partners.map((partner) => (
              <div key={partner.name} className="brand-card">
                <div className="brand-logo-frame">
                  <img
                    src={partner.logoPath}
                    alt={partner.alt}
                    width={partner.width}
                    height={partner.height}
                    className="brand-logo-img"
                    loading="lazy"
                  />
                </div>
                <div className="brand-meta">
                  <span className="brand-caption">{partner.name}</span>
                  <span className="brand-sub-role">{partner.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
