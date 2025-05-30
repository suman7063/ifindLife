
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const useAdminContent = () => {
  const [experts, setExperts] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataLoadedOnce, setDataLoadedOnce] = useState(false);

  // Stabilized refresh function
  const refreshData = useCallback(async () => {
    console.log('useAdminContent: Starting data refresh...');
    
    if (loading && dataLoadedOnce) {
      console.log('useAdminContent: Already loading data, skipping refresh');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Load services
      console.log('useAdminContent: Fetching services...');
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });

      if (servicesError) {
        console.error('useAdminContent: Services error:', servicesError);
        throw new Error(`Services: ${servicesError.message}`);
      }

      // Load experts (both approved and pending)
      console.log('useAdminContent: Fetching expert accounts...');
      const { data: expertsData, error: expertsError } = await supabase
        .from('expert_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (expertsError) {
        console.error('useAdminContent: Experts error:', expertsError);
        throw new Error(`Expert accounts: ${expertsError.message}`);
      }

      // Load testimonials
      console.log('useAdminContent: Fetching testimonials...');
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (testimonialsError) {
        console.error('useAdminContent: Testimonials error:', testimonialsError);
        throw new Error(`Testimonials: ${testimonialsError.message}`);
      }

      console.log('useAdminContent: Data loaded successfully:', {
        services: servicesData?.length || 0,
        experts: expertsData?.length || 0,
        testimonials: testimonialsData?.length || 0
      });

      setServices(servicesData || []);
      setExperts(expertsData || []);
      setTestimonials(testimonialsData || []);
      setDataLoadedOnce(true);

    } catch (error: any) {
      console.error('useAdminContent: Error loading data:', error);
      setError(error.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, [loading, dataLoadedOnce]);

  // Load data once on mount
  useEffect(() => {
    if (!dataLoadedOnce) {
      console.log('useAdminContent: Initial data load');
      refreshData();
    }
  }, [refreshData, dataLoadedOnce]);

  return {
    experts,
    setExperts,
    services,
    setServices,
    testimonials,
    setTestimonials,
    loading,
    error,
    refreshData
  };
};
