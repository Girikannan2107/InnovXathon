'use client';

import { useState, useEffect } from 'react';
import { EVENT_CONFIG } from '@/lib/event-config';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

interface CountdownProps {
  targetDateISO?: string;
  label?: string;
  className?: string;
}

function DigitSlot({ value, label }: { value: string; label: string }) {
  return (
    <div className="countdown-item">
      <div className="countdown-digit-slot">
        <span key={value} className="countdown-value countdown-digit-anim">
          {value}
        </span>
      </div>
      <span className="countdown-label">{label}</span>
    </div>
  );
}

export default function Countdown({
  targetDateISO = EVENT_CONFIG.schedule.registrationClosesISO,
  label = 'Registration Deadline Countdown',
  className = '',
}: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = (): TimeLeft => {
      const targetTime = new Date(targetDateISO).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0 || isNaN(difference)) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateISO]);

  if (!mounted) {
    // SSR Hydration-safe initial placeholder
    return (
      <div className={`countdown-container ${className}`} aria-hidden="true">
        <div className="countdown-grid">
          {['Days', 'Hours', 'Mins', 'Secs'].map((unit) => (
            <div key={unit} className="countdown-item">
              <span className="countdown-value">--</span>
              <span className="countdown-label">{unit}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <output className={`countdown-container countdown-expired block ${className}`}>
        <span className="expired-badge">Registration Status</span>
        <strong className="expired-text">Registration Closed</strong>
        <p className="expired-sub">Stay tuned for the shortlist announcement on 12 Oct 2026.</p>
      </output>
    );
  }

  const daysStr = String(timeLeft.days).padStart(2, '0');
  const hoursStr = String(timeLeft.hours).padStart(2, '0');
  const minsStr = String(timeLeft.minutes).padStart(2, '0');
  const secsStr = String(timeLeft.seconds).padStart(2, '0');

  const screenReaderSummary = `${timeLeft.days} days, ${timeLeft.hours} hours, and ${timeLeft.minutes} minutes until registration deadline.`;

  return (
    <div className={`countdown-container ${className}`} aria-label={label}>
      <span className="sr-only" aria-live="polite">
        {screenReaderSummary}
      </span>
      <div className="countdown-header">
        <span className="countdown-pulse" aria-hidden="true" />
        <span className="countdown-title">REGISTRATION CLOSES IN</span>
      </div>
      <div className="countdown-grid" aria-hidden="true">
        <DigitSlot value={daysStr} label="Days" />
        <span className="countdown-separator">:</span>
        <DigitSlot value={hoursStr} label="Hours" />
        <span className="countdown-separator">:</span>
        <DigitSlot value={minsStr} label="Mins" />
        <span className="countdown-separator">:</span>
        <DigitSlot value={secsStr} label="Secs" />
      </div>
    </div>
  );
}
