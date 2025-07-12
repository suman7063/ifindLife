
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface CallPricing {
  id: string;
  duration_minutes: number;
  price_inr: number;
  price_eur: number;
  tier: string;
  active: boolean;
}

export interface UserGeolocation {
  country_code: string;
  currency: string;
}

export const useCallPricing = (expertCategory?: string) => {
  const [pricingOptions, setPricingOptions] = useState<CallPricing[]>([]);
  const [userCurrency, setUserCurrency] = useState<'INR' | 'EUR'>('EUR');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch pricing options with expert category filtering
  const fetchPricing = async () => {
    try {
      const { data, error } = await supabase
        .from('call_pricing')
        .select('*')
        .eq('active', true)
        .order('duration_minutes');

      if (error) throw error;
      
      // Filter durations based on expert category
      let filteredData = data || [];
      
      if (expertCategory === 'listening-volunteer') {
        // Listening volunteers can only offer 5 and 10 minute sessions
        filteredData = filteredData.filter(pricing => 
          pricing.duration_minutes === 5 || pricing.duration_minutes === 10
        );
      } else if (expertCategory === 'listening-expert') {
        // Listening experts can offer 5, 10, and 30 minute sessions
        filteredData = filteredData.filter(pricing => 
          pricing.duration_minutes === 5 || pricing.duration_minutes === 10 || pricing.duration_minutes === 30
        );
      }
      // For other categories (listening-coach, mindfulness-expert), show all durations
      
      console.log('Fetched pricing data for category', expertCategory, ':', filteredData);
      setPricingOptions(filteredData);
    } catch (error) {
      console.error('Error fetching pricing:', error);
      toast.error('Failed to load pricing options');
    }
  };

  // Detect user currency based on geolocation
  const detectUserCurrency = async () => {
    try {
      // First check if we already have geolocation data for this user
      const { data: existingGeo } = await supabase
        .from('user_geolocations')
        .select('currency')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .order('detected_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingGeo?.currency) {
        setUserCurrency(existingGeo.currency as 'INR' | 'EUR');
        return;
      }

      // If no existing data, use a simple IP-based detection
      // In production, you'd use a proper geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const geoData = await response.json();
      
      // Currency detection: INR for India, EUR for rest of world
      let currency: 'INR' | 'EUR' = 'EUR';
      if (geoData.country_code === 'IN') {
        currency = 'INR';
      }
      setUserCurrency(currency);

      // Store geolocation data
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        await supabase.from('user_geolocations').insert({
          user_id: user.id,
          country_code: geoData.country_code,
          country_name: geoData.country_name,
          currency: currency
        });
      }
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
  }, []);

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
