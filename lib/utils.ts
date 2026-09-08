import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats numbers into Indian Rupee representation (e.g. ₹50,000).
 */
export function formatINR(amount: number): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}

/**
 * Checks if a given URL is a placeholder or not yet verified.
 */
export function isPlaceholderUrl(url?: string | null): boolean {
  if (!url) return true;
  const trimmed = url.trim();
  return (
    trimmed === '' ||
    trimmed === '#' ||
    trimmed.startsWith('REPLACE_WITH_') ||
    trimmed.includes('example.com')
  );
}

/**
 * Safe client-side analytics event dispatcher (privacy-friendly, no cookies/PII).
 */
export function trackEvent(
  action: string,
  category: string = 'engagement',
  label?: string
): void {
  if (typeof window !== 'undefined') {
    // Development logging and optional window.gtag compatibility
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics Event] ${category} -> ${action}${label ? ` (${label})` : ''}`);
    }
    const win = window as unknown as {
      gtag?: (command: string, action: string, params: Record<string, unknown>) => void;
    };
    if (typeof win.gtag === 'function') {
      win.gtag('event', action, {
        event_category: category,
        event_label: label,
      });
    }
  }
}
