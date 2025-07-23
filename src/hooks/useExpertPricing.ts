import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ExpertPricing {
  id: string;
  expert_id: string;
  category: string;
  session_30_inr: number;
  session_30_eur: number;
  session_60_inr: number;
  session_60_eur: number;
  price_per_min_inr: number;
  price_per_min_eur: number;
}

export interface UserGeolocation {
  country_code: string;
  currency: string;
}

export const useExpertPricing = (expertId?: string) => {
  const [pricing, setPricing] = useState<ExpertPricing | null>(null);
  const [userCurrency, setUserCurrency] = useState<'INR' | 'EUR'>('EUR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch expert pricing
  const fetchExpertPricing = async (id: string) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data, error: pricingError } = await supabase
        .from('expert_pricing_tiers')
        .select('*')
        .eq('expert_id', id)
        .single();

      if (pricingError) throw pricingError;

      setPricing(data);
    } catch (err: any) {
      console.error('Error fetching expert pricing:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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
      if (expertId) {
        setLoading(true);
        await Promise.all([fetchExpertPricing(expertId), detectUserCurrency()]);
        setLoading(false);
      }
    };

    initializePricing();
  }, [expertId]);

  // Get price for 30-minute session
  const getSlotPrice = (): number => {
    if (!pricing) return 0;
    
    return userCurrency === 'INR' ? pricing.session_30_inr : pricing.session_30_eur;
  };

  // Calculate total price for multiple slots with correct currency
  const calculateTotalPrice = (numberOfSlots: number): number => {
    const pricePerSlot = getSlotPrice();
    return pricePerSlot * numberOfSlots;
  };

  // Convert price to target currency if needed
  const convertPrice = (price: number, fromCurrency: 'INR' | 'EUR', toCurrency: 'INR' | 'EUR'): number => {
    if (fromCurrency === toCurrency) return price;
    
    // Simple conversion - in production, use real exchange rates
    if (fromCurrency === 'EUR' && toCurrency === 'INR') {
      return price * 85; // Approximate rate
    } else if (fromCurrency === 'INR' && toCurrency === 'EUR') {
      return price / 85;
    }
    return price;
  };

  // Format price with currency symbol
  const formatPrice = (price: number): string => {
    const symbol = userCurrency === 'INR' ? '₹' : '€';
    return `${symbol}${price.toFixed(2)}`;
  };

  return {
    pricing,
    userCurrency,
    loading,
    error,
    getSlotPrice,
    calculateTotalPrice,
    convertPrice,
    formatPrice,
    refetch: () => expertId && fetchExpertPricing(expertId)
  };
};