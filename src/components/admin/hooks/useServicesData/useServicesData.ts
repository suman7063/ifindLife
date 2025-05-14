
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ServiceCategory, ServiceCategoryUI, DbService, mapDbServiceToUi } from './types';
import { toast } from 'sonner';
import { categoryData as defaultServiceData } from '@/data/initialAdminData';

// Define default icon and color for services that don't have them
const DEFAULT_ICON = '🧠';
const DEFAULT_COLOR = 'bg-ifind-aqua/10';

export function useServicesData(
  initialServices: ServiceCategory[] = [], 
  updateCallback: (services: ServiceCategory[]) => void = () => {}
) {
  const [services, setServices] = useState<ServiceCategory[]>(initialServices);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const MAX_FETCH_ATTEMPTS = 3;

  // Load services data from the same source as public site
  useEffect(() => {
    const fetchServices = async () => {
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
              setLoading(false);
              return;
            }
          } catch (parseError) {
            console.error('Error parsing localStorage content:', parseError);
            // Continue to fetch from Supabase if localStorage parsing fails
          }
        }
        
        // If no services in localStorage, use default data or try to fetch from Supabase
        try {
          console.log('Fetching services from Supabase...');
          const { data, error } = await supabase.from('services').select('*');
          
          console.log('Supabase response:', { data, error });
          
          if (error) {
            console.error('Error fetching services:', error);
            
            // Check if the error is related to infinite recursion or RLS policies
            if (error.code === '42P17' || error.message?.includes('recursion') || error.message?.includes('policy')) {
              console.warn('Database policy error detected, falling back to default data');
              throw new Error(`Database policy error: ${error.message}`);
            }
            
            throw error;
          }
          
          if (data && data.length > 0) {
            // Map Supabase data to the expected format with type safety
            const dbServices = data as DbService[];
            const formattedServices = dbServices.map(mapDbServiceToUi);
            
            // Convert to ServiceCategory[] for compatibility
            const serviceCategories = formattedServices.map(service => ({
              id: service.id || service.title,
              name: service.name || service.title,
              title: service.title,
              description: service.description,
              href: service.href,
              icon: service.icon,
              color: service.color,
              items: []
            })) as ServiceCategory[];
            
            console.log('Formatted services:', serviceCategories);
            setServices(serviceCategories);
            updateCallback(serviceCategories);
            setFetchAttempts(0); // Reset attempts on success
          } else {
            console.log('No services found in Supabase, using default data');
            // If no data in Supabase either, use default data
            setServices(defaultServiceData);
            updateCallback(defaultServiceData);
          }
        } catch (supabaseError) {
          console.error('Supabase services fetch error:', supabaseError);
          
          // If we've reached max attempts, use default data
          if (fetchAttempts >= MAX_FETCH_ATTEMPTS - 1) {
            console.warn(`Max fetch attempts (${MAX_FETCH_ATTEMPTS}) reached, using default data`);
            setServices(defaultServiceData);
            updateCallback(defaultServiceData);
            toast.error('Could not load services from database. Using default data.');
          } else {
            // Increment fetch attempts for next try
            setFetchAttempts(prev => prev + 1);
            // Set error to allow retry
            setError(`Failed to load services data (Attempt ${fetchAttempts + 1}/${MAX_FETCH_ATTEMPTS})`);
            throw supabaseError;
          }
        }
      } catch (err: any) {
        console.error('Error loading services data:', err);
        setError(err instanceof Error ? err.message : String(err));
        
        if (fetchAttempts < MAX_FETCH_ATTEMPTS) {
          // Schedule a retry with exponential backoff
          const retryDelay = Math.min(1000 * Math.pow(2, fetchAttempts), 10000);
          console.log(`Scheduling retry in ${retryDelay}ms...`);
          
          setTimeout(() => {
            fetchServices();
          }, retryDelay);
        } else {
          // Final fallback to default data on error after all retries
          console.warn('All retry attempts failed, using default data');
          setServices(defaultServiceData);
          updateCallback(defaultServiceData);
          toast.error('Error loading services. Using default settings.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [updateCallback, fetchAttempts]);

  return {
    services,
    setServices,
    loading,
    error
  };
}
