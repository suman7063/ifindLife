import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  // Detect user currency based on geolocation
  useEffect(() => {
    const detectCurrency = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_code === 'IN') {
          setUserCurrency('INR');
        } else {
          setUserCurrency('EUR');
        }
      } catch (error) {
        console.error('Error detecting currency:', error);
        setUserCurrency('EUR'); // Default to EUR
      }
    };

    detectCurrency();
  }, []);

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