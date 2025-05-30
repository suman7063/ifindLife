
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
  const refreshData = useCallback(async (forceRefresh = false) => {
    console.log('useAdminContent: Starting data refresh...', { forceRefresh });
    
    // Circuit breaker logic - but allow force refresh
    const now = Date.now();
    if (now - lastErrorTimeRef.current > ERROR_RESET_TIME) {
      errorCountRef.current = 0;
    }
    
    if (!forceRefresh && errorCountRef.current >= MAX_ERRORS) {
      console.log('useAdminContent: Circuit breaker triggered, too many errors');
      setError('Too many errors occurred. Please refresh the page manually.');
      setLoading(false);
      return;
    }
    
    if (!forceRefresh && loading && dataLoadedOnce) {
      console.log('useAdminContent: Already loading data, skipping refresh');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Load services first (most reliable)
      console.log('useAdminContent: Fetching services...');
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });

      if (servicesError) {
        console.error('useAdminContent: Services error:', servicesError);
        throw new Error(`Services: ${servicesError.message}`);
      }

      // Load expert accounts (RLS disabled for easier access)
      console.log('useAdminContent: Fetching expert accounts...');
      const { data: expertsData, error: expertsError } = await supabase
        .from('expert_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (expertsError) {
        console.error('useAdminContent: Expert accounts error:', expertsError);
        console.warn('useAdminContent: Could not fetch expert accounts, continuing with empty array');
        // Continue without throwing error
      }

      // Load testimonials
      console.log('useAdminContent: Fetching testimonials...');
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (testimonialsError) {
        console.error('useAdminContent: Testimonials error:', testimonialsError);
        console.warn('useAdminContent: Could not fetch testimonials, continuing with empty array');
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
  }, [loading, dataLoadedOnce]);

  // Load data once on mount
  useEffect(() => {
    if (!dataLoadedOnce && errorCountRef.current < MAX_ERRORS) {
      console.log('useAdminContent: Initial data load');
      refreshData();
    }
  }, [dataLoadedOnce]);

  // Force refresh function for manual refresh
  const forceRefresh = useCallback(() => {
    console.log('useAdminContent: Force refresh requested');
    setDataLoadedOnce(false);
    errorCountRef.current = 0; // Reset error count
    refreshData(true);
  }, [refreshData]);

  return {
    experts,
    setExperts,
    services,
    setServices,
    testimonials,
    setTestimonials,
    loading,
    error,
    refreshData,
    forceRefresh
  };
};
