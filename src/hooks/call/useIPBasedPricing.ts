import { useState, useEffect } from 'react';

interface PricingData {
  currency: 'INR' | 'EUR';
  country: string;
  detected: boolean;
}

const STORAGE_KEY = 'ifl_ip_pricing_v1';

export const useIPBasedPricing = () => {
  const [pricing, setPricing] = useState<PricingData>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) return JSON.parse(cached) as PricingData;
    } catch {}
    return {
      currency: 'EUR',
      country: 'Unknown',
      detected: false
    };
  });

  useEffect(() => {
    const withTimeout = async (p: Promise<Response>, ms = 2000) => {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), ms);
      try {
        const res = await fetch(await (await p).url, { signal: ctrl.signal });
        clearTimeout(t);
        return res;
      } catch (e) {
        clearTimeout(t);
        throw e;
      }
    };

    const detectLocation = async () => {
      // If we already have a detected value, avoid re-fetching
      if (pricing.detected) return;

      try {
        // 1) Try ipapi
        try {
          const res = await withTimeout(fetch('https://ipapi.co/json/'));
          if (res.ok) {
            const data = await res.json();
            if (data?.country_code) {
              const currency = data.country_code === 'IN' ? 'INR' : 'EUR';
              const next = { currency, country: data.country_name || data.country_code, detected: true } as PricingData;
              setPricing(next);
              try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
              return;
            }
          }
        } catch {}

        // 2) Try ipwho.is
        try {
          const res2 = await withTimeout(fetch('https://ipwho.is/'));
          if (res2.ok) {
            const data2 = await res2.json();
            if (data2?.country_code) {
              const currency = data2.country_code === 'IN' ? 'INR' : 'EUR';
              const next = { currency, country: data2.country || data2.country_code, detected: true } as PricingData;
              setPricing(next);
              try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
              return;
            }
          }
        } catch {}

        // 3) Locale fallback
        const isIndia = (navigator.language || '').toLowerCase().includes('-in') || (Intl && 'DateTimeFormat' in Intl && (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase().includes('kolkata'));
        const next = { currency: isIndia ? 'INR' as const : 'EUR' as const, country: isIndia ? 'India' : 'Unknown', detected: false };
        setPricing(next);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      } catch {
        // Silent fallback
        const next = { currency: 'EUR' as const, country: 'Unknown', detected: false };
        setPricing(next);
      }
    };

    detectLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return pricing;
};