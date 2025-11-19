import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExpertPricingData {
  session_30_inr: number;
  session_30_eur: number;
  session_60_inr: number;
  session_60_eur: number;
  category: string;
}

export const useExpertProfilePricing = (expertId?: string) => {
  const [pricing, setPricing] = useState<ExpertPricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState<'INR' | 'EUR'>('INR');

  useEffect(() => {
    const fetchPricing = async () => {
      if (!expertId) return;

      try {
        setLoading(true);
        
        // First get expert data to determine category
        const { data: expertData, error: expertError } = await supabase
          .from('expert_accounts')
          .select('category')
          .eq('auth_id', expertId)
          .single();

        if (expertError) {
          console.error('Error fetching expert data:', expertError);
          return;
        }

        // Try to get expert-specific pricing first
        const { data: expertPricing, error: expertPricingError } = await supabase
          .from('expert_pricing_tiers')
          .select('*')
          .eq('expert_id', expertId)
          .single();

        if (expertPricing && !expertPricingError) {
          setPricing(expertPricing);
        } else {
          // Fallback to category-based pricing
          const { data: categoryPricing, error: categoryError } = await supabase
            .from('expert_category_duration_pricing')
            .select('*')
            .eq('category_id', expertData.category)
            .in('duration_minutes', [30, 60]);

          if (categoryError) {
            console.error('Error fetching category pricing:', categoryError);
            return;
          }

          // Transform category pricing to match expected format
          const pricing30 = categoryPricing?.find(p => p.duration_minutes === 30);
          const pricing60 = categoryPricing?.find(p => p.duration_minutes === 60);

          if (pricing30 && pricing60) {
            setPricing({
              session_30_inr: pricing30.price_inr,
              session_30_eur: pricing30.price_eur,
              session_60_inr: pricing60.price_inr,
              session_60_eur: pricing60.price_eur,
              category: expertData.category
            });
          } else {
            // Ultimate fallback to default prices
            setPricing({
              session_30_inr: 450,
              session_30_eur: 15,
              session_60_inr: 800,
              session_60_eur: 25,
              category: expertData.category || 'listening-volunteer'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching pricing:', error);
        // Fallback pricing
        setPricing({
          session_30_inr: 450,
          session_30_eur: 15,
          session_60_inr: 800,
          session_60_eur: 25,
          category: 'listening-volunteer'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, [expertId]);

  const getPrice30 = () => {
    if (!pricing) return 450;
    return userCurrency === 'INR' ? pricing.session_30_inr : pricing.session_30_eur;
  };

  const getPrice60 = () => {
    if (!pricing) return 800;
    return userCurrency === 'INR' ? pricing.session_60_inr : pricing.session_60_eur;
  };

  const formatPrice = (price: number) => {
    const symbol = userCurrency === 'INR' ? '₹' : '€';
    return `${symbol}${price}`;
  };

  return {
    pricing,
    loading,
    userCurrency,
    getPrice30,
    getPrice60,
    formatPrice
  };
};