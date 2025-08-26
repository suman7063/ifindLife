import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  console.log('🔧 useExpertPricing: Hook initialized with expertId:', expertId);
  const [pricing, setPricing] = useState<ExpertPricing | null>(null);
  const [userCurrency, setUserCurrency] = useState<'INR' | 'EUR'>('EUR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch expert pricing
  const fetchExpertPricing = async (authId: string) => {
    if (!authId) {
      console.log('useExpertPricing: No authId provided');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('useExpertPricing: Fetching pricing for auth_id:', authId);

      // First get the actual expert account ID from auth_id
      const { data: expertAccount, error: expertError } = await supabase
        .from('expert_accounts')
        .select('id')
        .eq('auth_id', authId)
        .maybeSingle();

      if (expertError) {
        console.error('useExpertPricing: Error fetching expert account:', expertError);
        throw expertError;
      }

      if (!expertAccount) {
        console.error('useExpertPricing: No expert account found for auth_id:', authId);
        // Set fallback pricing when expert account not found
        const fallbackPricing = {
          id: 'fallback',
          expert_id: authId, // Use auth_id as fallback
          category: 'standard',
          session_30_inr: 450,  // ₹450 for 30 min
          session_30_eur: 25,   // €25 for 30 min
          session_60_inr: 800,  // ₹800 for 60 min
          session_60_eur: 40,   // €40 for 60 min
          price_per_min_inr: 15,  // ₹15 per minute
          price_per_min_eur: 0.83 // €0.83 per minute
        };
        console.log('useExpertPricing: Setting fallback pricing:', fallbackPricing);
        setPricing(fallbackPricing);
        return;
      }

      console.log('useExpertPricing: Found expert account:', expertAccount);

      // Then get pricing using the expert account ID
      const { data, error: pricingError } = await supabase
        .from('expert_pricing_tiers')
        .select('*')
        .eq('expert_id', expertAccount.id)
        .single();

      if (pricingError) {
        console.log('useExpertPricing: No pricing found for expert, using defaults for account:', expertAccount.id);
        // Set default pricing if none exists - using user specified rates
        const defaultPricing = {
          id: 'default',
          expert_id: expertAccount.id,
          category: 'standard',
          session_30_inr: 450,  // ₹450 for 30 min (user specified)
          session_30_eur: 25,   // €25 for 30 min (user specified)
          session_60_inr: 800,  // ₹800 for 60 min (user specified)
          session_60_eur: 40,   // €40 for 60 min (user specified)
          price_per_min_inr: 15,  // ₹15 per minute (450/30)
          price_per_min_eur: 0.83 // €0.83 per minute (25/30)
        };
        console.log('useExpertPricing: Setting default pricing:', defaultPricing);
        setPricing(defaultPricing);
        return;
      }

      console.log('useExpertPricing: Pricing loaded:', data);
      setPricing(data);
    } catch (err: any) {
      console.error('useExpertPricing: Error fetching expert pricing:', err);
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
    console.log('🔧 useExpertPricing: useEffect triggered with expertId:', expertId);
    const initializePricing = async () => {
      if (expertId) {
        console.log('🔧 useExpertPricing: Starting initialization for expertId:', expertId);
        setLoading(true);
        await Promise.all([fetchExpertPricing(expertId), detectUserCurrency()]);
        setLoading(false);
        console.log('🔧 useExpertPricing: Initialization complete, current pricing:', pricing);
      } else {
        console.log('🔧 useExpertPricing: No expertId provided, skipping initialization');
      }
    };

    initializePricing();
  }, [expertId]);

  // Get price for 30-minute session
  const getSlotPrice = (): number => {
    console.log('🔧 useExpertPricing: getSlotPrice called, pricing:', pricing, 'userCurrency:', userCurrency);
    if (!pricing) {
      console.log('🔧 useExpertPricing: No pricing available, returning 0');
      return 0;
    }
    
    const price = userCurrency === 'INR' ? pricing.session_30_inr : pricing.session_30_eur;
    console.log('🔧 useExpertPricing: Slot price calculated:', price);
    return price;
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