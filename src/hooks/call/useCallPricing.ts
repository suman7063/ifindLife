
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface CallPricing {
  id: string;
  duration_minutes: number;
  price_usd: number;
  price_inr: number;
  tier: string;
  active: boolean;
}

export interface UserGeolocation {
  country_code: string;
  currency: string;
}

export const useCallPricing = () => {
  const [pricingOptions, setPricingOptions] = useState<CallPricing[]>([]);
  const [userCurrency, setUserCurrency] = useState<'USD' | 'INR'>('USD');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch pricing options
  const fetchPricing = async () => {
    try {
      const { data, error } = await supabase
        .from('call_pricing')
        .select('*')
        .eq('active', true)
        .order('duration_minutes');

      if (error) throw error;
      
      console.log('Fetched pricing data:', data);
      setPricingOptions(data || []);
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
        setUserCurrency(existingGeo.currency as 'USD' | 'INR');
        return;
      }

      // If no existing data, use a simple IP-based detection
      // In production, you'd use a proper geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const geoData = await response.json();
      
      const currency = geoData.country_code === 'IN' ? 'INR' : 'USD';
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
      // Default to USD if detection fails
      setUserCurrency('USD');
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
    
    return userCurrency === 'INR' ? pricing.price_inr : pricing.price_usd;
  };

  const formatPrice = (price: number): string => {
    const symbol = userCurrency === 'INR' ? '₹' : '$';
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
