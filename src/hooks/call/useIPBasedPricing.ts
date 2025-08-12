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
    const detectLocation = async () => {
      try {
        // Try to detect user location via IP
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_code) {
          const currency = data.country_code === 'IN' ? 'INR' : 'EUR';
          setPricing({
            currency,
            country: data.country_name || data.country_code,
            detected: true
          });
          
          console.log('IP-based pricing detection:', {
            country: data.country_name,
            countryCode: data.country_code,
            currency
          });
        } else {
          throw new Error('No country data from IP API');
        }
      } catch (error) {
        console.error('Failed to detect location, using EUR fallback:', error);
        setPricing({
          currency: 'EUR',
          country: 'Unknown',
          detected: false
        });
      }
    };

    detectLocation();
  }, []);

  return pricing;
};