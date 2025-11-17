import { useAuth } from '@/contexts/auth/AuthContext';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useMemo, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type CurrencyCode = 'INR' | 'EUR';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

/**
 * Hook to get user's currency information based on their profile
 * Returns INR for Indian users, EUR for others
 */
export const useUserCurrency = (): CurrencyInfo => {
  const auth = useAuth();
  const simpleAuth = useSimpleAuth();
  
  // Try both auth contexts - use whichever has the profile
  // SimpleAuthContext is more likely to have the actual profile data
  const userProfile = simpleAuth?.userProfile || auth?.userProfile;
  
  const currencyInfo = useMemo(() => {
    const userCurrency = userProfile?.currency;
    const userCountry = userProfile?.country;
    
    // Determine currency based on country or stored currency
    let currencyCode: CurrencyCode = 'EUR'; // Default to EUR
    
    // Priority 1: Check country first (most reliable for Indian users)
    if (userCountry) {
      const countryLower = userCountry.toLowerCase();
      if (countryLower === 'india' || countryLower === 'in') {
        currencyCode = 'INR';
      } else {
        currencyCode = 'EUR';
      }
    }
    
    // Priority 2: If country is not set, use stored currency (but validate it)
    if (!userCountry && userCurrency) {
      const currencyUpper = userCurrency.toUpperCase();
      if (currencyUpper === 'INR') {
        currencyCode = 'INR';
      } else if (currencyUpper === 'EUR') {
        currencyCode = 'EUR';
      }
      // If currency is invalid, default to EUR
    }
    
    return {
      code: currencyCode,
      symbol: currencyCode === 'INR' ? '₹' : '€',
      name: currencyCode === 'INR' ? 'Indian Rupee' : 'Euro'
    };
  }, [userProfile?.currency, userProfile?.country]);
  
  // Update database if country says India but currency is wrong
  useEffect(() => {
    const userCountry = userProfile?.country;
    const userCurrency = userProfile?.currency;
    const userId = userProfile?.id;
    
    if (userCountry && userId) {
      const countryLower = userCountry.toLowerCase();
      if ((countryLower === 'india' || countryLower === 'in') && userCurrency !== 'INR') {
        // Update currency in database to match country
        updateUserCurrency(userId, 'INR').catch(console.error);
      }
    }
  }, [userProfile?.country, userProfile?.currency, userProfile?.id]);
  
  return currencyInfo;
};

/**
 * Get currency symbol for a given currency code
 */
export const getCurrencySymbol = (currency: string | null | undefined): string => {
  if (!currency) return '€'; // Default to EUR
  
  const currencyUpper = currency.toUpperCase();
  if (currencyUpper === 'INR') return '₹';
  if (currencyUpper === 'EUR') return '€';
  
  return '€'; // Default to EUR
};

/**
 * Get currency code based on country
 */
export const getCurrencyFromCountry = (country: string | null | undefined): CurrencyCode => {
  if (!country) return 'EUR';
  
  const countryLower = country.toLowerCase();
  if (countryLower === 'india' || countryLower === 'in') {
    return 'INR';
  }
  
  return 'EUR';
};

/**
 * Update user currency in database (helper function)
 */
async function updateUserCurrency(userId: string, currency: CurrencyCode): Promise<void> {
  try {
    await supabase
      .from('users')
      .update({ currency })
      .eq('id', userId);
  } catch (error) {
    console.error('Error updating user currency:', error);
  }
}

