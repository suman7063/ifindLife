import { useState, useEffect } from 'react';

interface PricingData {
  currency: 'INR' | 'EUR';
  country: string;
  detected: boolean;
}

export const useIPBasedPricing = () => {
  const [pricing, setPricing] = useState<PricingData>({
    currency: 'EUR', // Default fallback
    country: 'Unknown',
    detected: false
  });

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const isIndiaTz = tz.includes('Asia/Kolkata') || tz.includes('Asia/Calcutta') || tz.includes('Kolkata') || tz.includes('Calcutta');

      const locales = [navigator.language, ...(navigator.languages || [])].filter(Boolean) as string[];
      const lc = locales.join(' ').toLowerCase();
      const isIndiaLocale = lc.includes('en-in') || lc.includes('hi') || lc.includes('te') || lc.includes('ta') || lc.includes('bn') || lc.includes('gu') || lc.includes('mr') || lc.includes('kn') || lc.includes('ml') || lc.includes('pa');

      const isIndia = isIndiaTz || isIndiaLocale;

      setPricing({
        currency: isIndia ? 'INR' : 'EUR',
        country: isIndia ? 'India' : 'Unknown',
        detected: true
      });
    } catch (error) {
      console.error('Failed to detect location (timezone/locale), using EUR fallback:', error);
      setPricing({
        currency: 'EUR',
        country: 'Unknown',
        detected: false
      });
    }
  }, []);

  return pricing;
};