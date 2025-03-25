
import { toast } from 'sonner';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Helper function to determine currency based on country
export const getCurrencyByCountry = (country: string): string => {
  const DEFAULT_CURRENCY_MAP: Record<string, string> = {
    'India': 'INR',
    'United States': 'USD',
    'United Kingdom': 'GBP',
    'Canada': 'CAD',
    'Australia': 'AUD',
    'Germany': 'EUR',
    'France': 'EUR',
    'Japan': 'JPY',
    'China': 'CNY',
    'Brazil': 'BRL',
    // Add more as needed
  };
  
  return DEFAULT_CURRENCY_MAP[country] || 'USD';
};

// Error handling helper
export const handleAuthError = (error: any, defaultMessage: string): void => {
  const errorMessage = error.message || defaultMessage;
  toast.error(errorMessage);
  console.error(error);
};
