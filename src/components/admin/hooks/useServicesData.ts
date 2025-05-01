
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Import default data without JSX elements
import { categoryData as defaultServiceData } from '@/data/initialAdminData';

export interface ServiceCategory {
  icon: string;
  title: string;
  description: string;
  href: string;
  color: string;
}

// Interface for the database service object
interface DbService {
  id: number;
  name: string;
  description: string;
  rate_usd: number;
  rate_inr: number;
  icon?: string; // Make optional since it might not exist in the database
  color?: string; // Make optional since it might not exist in the database
}

export function useServicesData(
  initialServices: ServiceCategory[] = [], 
  updateCallback: (services: ServiceCategory[]) => void = () => {}
) {
  const [services, setServices] = useState<ServiceCategory[]>(initialServices);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const MAX_FETCH_ATTEMPTS = 3;

  // Define default icon and color for services that don't have them
  const DEFAULT_ICON = '🧠';
  const DEFAULT_COLOR = 'bg-ifind-aqua/10';

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
            // Map Supabase data to the expected format, providing defaults for missing fields
            const formattedServices = data.map((service: DbService) => ({
              // Use string icons (emoji) instead of React Elements
              icon: service.icon || DEFAULT_ICON, // Default icon if none in database
              title: service.name,
              description: service.description || '',
              href: `/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`,
              color: service.color || DEFAULT_COLOR // Default color if none in database
            }));
            
            console.log('Formatted services:', formattedServices);
            setServices(formattedServices);
            updateCallback(formattedServices);
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
        setError('Failed to load services data');
        
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
  }, [updateCallback]);

  return {
    services,
    setServices,
    loading,
    error
  };
}
