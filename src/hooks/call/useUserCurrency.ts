import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useIPBasedPricing } from './useIPBasedPricing';

interface UserCurrencyData {
  currency: 'INR' | 'EUR';
  country: string;
  source: 'profile' | 'ip' | 'fallback';
}

export const useUserCurrency = () => {
  const { userProfile, isAuthenticated } = useAuth();
  const ipPricing = useIPBasedPricing();
  const [currencyData, setCurrencyData] = useState<UserCurrencyData>({
    currency: 'EUR',
    country: 'Unknown',
    source: 'fallback'
  });

  useEffect(() => {
    if (isAuthenticated && userProfile?.country) {
      // For logged-in users, use their signup country
      const currency = userProfile.country.toLowerCase() === 'india' || 
                      userProfile.country.toLowerCase() === 'in' ? 'INR' : 'EUR';
      
      setCurrencyData({
        currency,
        country: userProfile.country,
        source: 'profile'
      });
    } else {
      // For non-authenticated users, use IP-based detection
      setCurrencyData({
        currency: ipPricing.currency,
        country: ipPricing.country,
        source: 'ip'
      });
    }
  }, [isAuthenticated, userProfile?.country, ipPricing.currency, ipPricing.country]);

  return currencyData;
};