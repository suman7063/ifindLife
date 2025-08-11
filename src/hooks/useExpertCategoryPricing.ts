import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';

interface ExpertCategoryPricing {
  id: string;
  category_id: string;
  duration_minutes: number;
  price_inr: number;
  price_eur: number;
  created_at: string;
}

export function useExpertCategoryPricing(category?: string) {
  const [pricing, setPricing] = useState<ExpertCategoryPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState<'INR' | 'EUR'>('EUR');
  const { userProfile, isAuthenticated } = useAuth();

  // Detect user currency based on auth profile or browser heuristics (no external calls)
  useEffect(() => {
    try {
      const profileCountry: string | undefined = isAuthenticated ? userProfile?.country : undefined;
      const isIndiaFromProfile = Boolean(profileCountry && (
        profileCountry.toLowerCase() === 'india' || profileCountry.toLowerCase() === 'in'
      ));

      if (isIndiaFromProfile) {
        setUserCurrency('INR');
        return;
      }

      // Anonymous users: timezone/locale detection
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const isIndiaTz = tz.includes('Asia/Kolkata') || tz.includes('Asia/Calcutta') || tz.includes('Kolkata') || tz.includes('Calcutta');

      const locales = [navigator.language, ...(navigator.languages || [])].filter(Boolean) as string[];
      const lc = locales.join(' ').toLowerCase();
      const isIndiaLocale = lc.includes('en-in') || lc.includes('hi') || lc.includes('te') || lc.includes('ta') || lc.includes('bn') || lc.includes('gu') || lc.includes('mr') || lc.includes('kn') || lc.includes('ml') || lc.includes('pa');

      setUserCurrency(isIndiaTz || isIndiaLocale ? 'INR' : 'EUR');
    } catch (error) {
      console.error('Currency detection error:', error);
      setUserCurrency('EUR'); // Safe fallback
    }
  }, [isAuthenticated, userProfile?.country]);

  // Fetch category pricing
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('expert_category_duration_pricing')
          .select('*');
        
        if (category) {
          query = query.eq('category_id', category);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching category pricing:', error);
          return;
        }
        
        setPricing(data || []);
      } catch (error) {
        console.error('Error fetching category pricing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, [category]);

  // Get price for a specific duration (defaults to 30 minutes)
  const getPrice = (durationMinutes: number = 30): number => {
    const priceData = pricing.find(p => p.duration_minutes === durationMinutes);
    if (!priceData) {
      // Return default price if no pricing found
      return userCurrency === 'INR' ? 30 : 5;
    }
    
    return userCurrency === 'INR' ? priceData.price_inr : priceData.price_eur;
  };

  // Format price with currency symbol
  const formatPrice = (price: number): string => {
    const symbol = userCurrency === 'INR' ? '₹' : '€';
    return `${symbol}${price}`;
  };

  // Get formatted price for display
  const getFormattedPrice = (durationMinutes: number = 30): string => {
    const price = getPrice(durationMinutes);
    return formatPrice(price);
  };

  return {
    pricing,
    loading,
    userCurrency,
    getPrice,
    formatPrice,
    getFormattedPrice
  };
}