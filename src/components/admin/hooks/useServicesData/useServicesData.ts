
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { handleDatabaseError, retryOperation } from '@/utils/errorHandling';

import { categoryData as defaultServiceData } from '@/data/initialAdminData';
import { ServiceCategory, UseServicesDataOptions, UseServicesDataReturn } from './types';
import { MAX_FETCH_ATTEMPTS, BASE_RETRY_DELAY } from './constants';
import { mapDbServicesToUiFormat } from './mappers';

/**
 * Hook for managing services data with improved error handling
 */
export function useServicesData({
  initialServices = [],
  updateCallback = () => {},
  maxFetchAttempts = MAX_FETCH_ATTEMPTS
}: UseServicesDataOptions = {}): UseServicesDataReturn {
  const [services, setServices] = useState<ServiceCategory[]>(initialServices);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  
  // Load services data function with better error handling
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching services data... Attempt:', fetchAttempts + 1);

      // First check localStorage which is used by the public site
      const savedContent = localStorage.getItem('ifindlife-content');
      if (savedContent) {
        try {
          const parsedContent = JSON.parse(savedContent);
          if (parsedContent.services && parsedContent.services.length > 0) {
            console.log('Services found in localStorage:', parsedContent.services.length);
            setServices(parsedContent.services);
            updateCallback(parsedContent.services);
            return;
          }
        } catch (parseError) {
          console.error('Error parsing localStorage content:', parseError);
          // Continue to fetch from Supabase if localStorage parsing fails
        }
      }
      
      // If no services in localStorage, fetch from Supabase
      await retryOperation(async () => {
        console.log('Fetching services from Supabase...');
        const { data, error } = await supabase.from('services').select('*');
        
        console.log('Supabase response:', { data, error });
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          const formattedServices = mapDbServicesToUiFormat(data);
          
          console.log('Formatted services:', formattedServices);
          setServices(formattedServices);
          updateCallback(formattedServices);
          setFetchAttempts(0); // Reset attempts on success
        } else {
          console.log('No services found in Supabase, using default data');
          setServices(defaultServiceData);
          updateCallback(defaultServiceData);
        }
      }, maxFetchAttempts);
      
    } catch (err: any) {
      console.error('Error loading services data:', err);
      
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      
      // If we've reached max attempts, fall back to default data
      if (fetchAttempts >= maxFetchAttempts - 1) {
        console.warn(`Max fetch attempts (${maxFetchAttempts}) reached, using default data`);
        setServices(defaultServiceData);
        updateCallback(defaultServiceData);
        handleDatabaseError(err, 'Could not load services from database. Using default data.');
      } else {
        // Schedule a retry with exponential backoff
        const retryDelay = Math.min(BASE_RETRY_DELAY * Math.pow(2, fetchAttempts), 10000);
        console.log(`Scheduling retry in ${retryDelay}ms...`);
        
        setTimeout(() => {
          setFetchAttempts(prev => prev + 1);
          fetchServices();
        }, retryDelay);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchAttempts, updateCallback, maxFetchAttempts]);

  // Initial data load
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Public refresh function
  const refreshServices = useCallback(async () => {
    setFetchAttempts(0);
    await fetchServices();
  }, [fetchServices]);

  return {
    services,
    setServices,
    loading,
    error,
    refreshServices
  };
}
