
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getServiceById = async (serviceId: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching service:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch service'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAllServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id');

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch services'));
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    getServiceById,
    getAllServices,
    loading,
    error
  };
};
