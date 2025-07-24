
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface CallPricing {
  id: string;
  category: string;
  duration_minutes: number;
  price_eur: number;
  price_inr: number;
  active: boolean;
}

// Keep for backward compatibility
export interface CategoryPricing extends CallPricing {}

export interface UserGeolocation {
  country_code: string;
  currency: string;
}

export const useCallPricing = (expertCategory?: string) => {
  const [pricingOptions, setPricingOptions] = useState<CategoryPricing[]>([]);
  const [userCurrency, setUserCurrency] = useState<'INR' | 'EUR'>('EUR');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch pricing options based on expert category
  const fetchPricing = async () => {
    try {
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

      if (error) throw error;
      
      console.log('Fetched category pricing data for', expertCategory, ':', data);
      setPricingOptions(data || []);
    } catch (error) {
      console.error('Error fetching pricing:', error);
      toast.error('Failed to load pricing options');
    }
  };

  // Detect user currency based on geolocation
  const detectUserCurrency = async () => {
    try {
      // Simple IP-based detection
      const response = await fetch('https://ipapi.co/json/');
      const geoData = await response.json();
      
      // Currency detection: INR for India, EUR for rest of world
      let currency: 'INR' | 'EUR' = 'EUR';
      if (geoData.country_code === 'IN') {
        currency = 'INR';
      }
      setUserCurrency(currency);
    } catch (error) {
      console.error('Error detecting currency:', error);
      // Default to EUR if detection fails
      setUserCurrency('EUR');
    }
  };

  useEffect(() => {
    const initializePricing = async () => {
      setIsLoading(true);
      await Promise.all([fetchPricing(), detectUserCurrency()]);
      setIsLoading(false);
    };

    initializePricing();
  }, [expertCategory]);

  const getPriceForDuration = (durationMinutes: number): number => {
    const pricing = pricingOptions.find(p => p.duration_minutes === durationMinutes);
    if (!pricing) return 0;
    
    return userCurrency === 'INR' ? pricing.price_inr : pricing.price_eur;
  };

  const formatPrice = (price: number): string => {
    const symbol = userCurrency === 'INR' ? '₹' : '€';
    return `${symbol}${price.toFixed(2)}`;
  };

  return {
    pricingOptions,
    userCurrency,
    isLoading,
    getPriceForDuration,
    formatPrice,
    refreshPricing: fetchPricing
  };
};
