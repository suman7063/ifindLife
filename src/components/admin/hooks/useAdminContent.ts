
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export const useAdminContent = () => {
  const [experts, setExperts] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataLoadedOnce, setDataLoadedOnce] = useState(false);
  
  // Circuit breaker to prevent infinite loops
  const errorCountRef = useRef(0);
  const lastErrorTimeRef = useRef(0);
  const MAX_ERRORS = 3;
  const ERROR_RESET_TIME = 30000; // 30 seconds

  // Stabilized refresh function with circuit breaker
  const refreshData = useCallback(async () => {
    console.log('useAdminContent: Starting data refresh...');
    
    // Circuit breaker logic
    const now = Date.now();
    if (now - lastErrorTimeRef.current > ERROR_RESET_TIME) {
      errorCountRef.current = 0;
    }
    
    if (errorCountRef.current >= MAX_ERRORS) {
      console.log('useAdminContent: Circuit breaker triggered, too many errors');
      setError('Too many errors occurred. Please refresh the page manually.');
      setLoading(false);
      return;
    }
    
    if (loading && dataLoadedOnce) {
      console.log('useAdminContent: Already loading data, skipping refresh');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Load services with simplified query (no RLS issues now)
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
      
      // Reset error count on successful load
      errorCountRef.current = 0;

    } catch (error: any) {
      console.error('useAdminContent: Error loading data:', error);
      errorCountRef.current += 1;
      lastErrorTimeRef.current = Date.now();
      setError(error.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, [loading, dataLoadedOnce]); // Removed unnecessary dependencies

  // Load data once on mount - with dependency array fixed
  useEffect(() => {
    if (!dataLoadedOnce && errorCountRef.current < MAX_ERRORS) {
      console.log('useAdminContent: Initial data load');
      refreshData();
    }
  }, [dataLoadedOnce]); // Only depend on dataLoadedOnce, not refreshData

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
