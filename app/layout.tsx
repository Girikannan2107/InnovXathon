import type { Metadata, Viewport } from 'next';
import './globals.css';
import { EVENT_CONFIG } from '@/lib/event-config';

export const viewport: Viewport = {
  themeColor: '#030609',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: `${EVENT_CONFIG.metadata.name} ${EVENT_CONFIG.metadata.year} | National Student Ideathon at KCE`,
  description: `${EVENT_CONFIG.metadata.tagline} Join ${EVENT_CONFIG.metadata.name} ${EVENT_CONFIG.metadata.year}, a national-level student innovation ideathon at Karpagam College of Engineering, Coimbatore on ${EVENT_CONFIG.schedule.eventDateDisplay}. ₹50,000 prize pool.`,
  keywords: [
    'InnovXathon',
    'InnovXathon 2026',
    'INNOVXERA',
    'KCE Ideathon',
    'Karpagam College of Engineering',
    'Student Hackathon',
    'National Ideathon India',
    'Coimbatore Hackathon',
    'Innovation Competition',
    'Startup Ideathon',
  ],
  authors: [{ name: 'INNOVXERA Startup Club' }],
  creator: 'INNOVXERA Startup Club',
  publisher: 'Karpagam College of Engineering',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: EVENT_CONFIG.links.canonicalUrl,
    title: `${EVENT_CONFIG.metadata.name} 2026 | National Student Ideathon`,
    description: `${EVENT_CONFIG.metadata.tagline} ₹50,000 Prize Pool · 30 Finalist Teams · 16 October 2026 at KCE Coimbatore.`,
    siteName: 'INNOVXATHON 2026',
    images: [
      {
        url: '/brands/innovxera.png',
        width: 1200,
        height: 630,
        alt: 'INNOVXATHON 2026 Event Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${EVENT_CONFIG.metadata.name} 2026 | National Student Ideathon`,
    description: `${EVENT_CONFIG.metadata.tagline} ₹50,000 Prize Pool · 16 October 2026 at KCE Coimbatore.`,
    images: ['/brands/innovxera.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  alternates: {
    canonical: EVENT_CONFIG.links.canonicalUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${EVENT_CONFIG.metadata.name} ${EVENT_CONFIG.metadata.year}`,
    startDate: EVENT_CONFIG.schedule.eventDateISO,
    endDate: EVENT_CONFIG.schedule.eventEndDateISO,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: EVENT_CONFIG.venue.institutionName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Myleripalayam Village, Othakkal Mandapam',
        addressLocality: EVENT_CONFIG.venue.city,
        addressRegion: EVENT_CONFIG.venue.state,
        postalCode: EVENT_CONFIG.venue.postalCode,
        addressCountry: 'IN',
      },
    },
    image: ['https://innovxathon.in/brands/innovxera.png'],
    description: `${EVENT_CONFIG.metadata.tagline} National-level student innovation ideathon at KCE on ${EVENT_CONFIG.schedule.eventDateDisplay}.`,
    offers: {
      '@type': 'Offer',
      url: EVENT_CONFIG.links.canonicalUrl,
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validFrom: EVENT_CONFIG.schedule.registrationOpensISO,
    },
    organizer: {
      '@type': 'Organization',
      name: 'INNOVXERA Startup Club',
      url: 'https://innovxathon.in',
    },
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-[#030609] text-[#f1f4f7] selection:bg-cyan-900 selection:text-white min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
