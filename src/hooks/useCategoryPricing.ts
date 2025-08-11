import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CategoryPricing {
  id: string;
  category: string;
  duration_minutes: number;
  price_usd: number;
  price_inr: number;
  active: boolean;
}

interface UserGeolocation {
  country_code: string;
  currency: string;
}

export function useCategoryPricing(expertCategory?: string) {
  const [pricingOptions, setPricingOptions] = useState<CategoryPricing[]>([]);
  const [userCurrency, setUserCurrency] = useState<'USD' | 'INR'>('USD');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch pricing options based on expert category
  const fetchPricing = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('expert_category_pricing')
        .select('*')
        .eq('active', true)
        .order('duration_minutes', { ascending: true });

      // Filter by expert category if provided
      if (expertCategory) {
        query = query.eq('category', expertCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching category pricing:', error);
        return;
      }

      setPricingOptions(data || []);
    } catch (error) {
      console.error('Error in fetchPricing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Detect user currency based on browser timezone/locale (no external calls)
  const detectUserCurrency = async () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const isIndiaTz = tz.includes('Asia/Kolkata') || tz.includes('Asia/Calcutta') || tz.includes('Kolkata') || tz.includes('Calcutta');

      const locales = [navigator.language, ...(navigator.languages || [])].filter(Boolean) as string[];
      const lc = locales.join(' ').toLowerCase();
      const isIndiaLocale = lc.includes('en-in') || lc.includes('hi') || lc.includes('te') || lc.includes('ta') || lc.includes('bn') || lc.includes('gu') || lc.includes('mr') || lc.includes('kn') || lc.includes('ml') || lc.includes('pa');

      const currency = (isIndiaTz || isIndiaLocale) ? 'INR' : 'USD';
      setUserCurrency(currency);
    } catch (error) {
      console.error('Error detecting currency via timezone/locale:', error);
      setUserCurrency('USD'); // Default fallback
    }
  };

  useEffect(() => {
    fetchPricing();
    detectUserCurrency();
  }, [expertCategory]);

  // Get price for specific duration
  const getPriceForDuration = (durationMinutes: number): number => {
    const option = pricingOptions.find(p => p.duration_minutes === durationMinutes);
    if (!option) return 0;
    
    return userCurrency === 'INR' ? option.price_inr : option.price_usd;
  };

  // Format price with currency symbol
  const formatPrice = (price: number): string => {
    const symbol = userCurrency === 'INR' ? '₹' : '$';
    return `${symbol}${price}`;
  };

  // Get all available durations for this category
  const getAvailableDurations = (): number[] => {
    return pricingOptions.map(p => p.duration_minutes);
  };

  return {
    pricingOptions,
    userCurrency,
    isLoading,
    getPriceForDuration,
    formatPrice,
    getAvailableDurations,
    refreshPricing: fetchPricing
  };
}