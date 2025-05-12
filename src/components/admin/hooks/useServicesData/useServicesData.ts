
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ServiceCategory, ServiceItem, DbService } from './types';
import { toast } from 'sonner';
import { categoryData as defaultServiceData } from '@/data/initialAdminData';
import { safeDataTransform, dbTypeConverter } from '@/utils/supabaseUtils';
import { ensureStringId } from '@/utils/idConverters';

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
              
              // Convert the localStorage data to match ServiceCategory type
              const formattedServices: ServiceCategory[] = parsedContent.services.map((service: any) => ({
                id: ensureStringId(service.id || ''),
                name: service.title || '',
                items: service.items || [],
                title: service.title || '',
                description: service.description || '',
                href: service.href || '',
                icon: service.icon || DEFAULT_ICON,
                color: service.color || DEFAULT_COLOR
              }));
              
              setServices(formattedServices);
              updateCallback(formattedServices);
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
            const formattedServices: ServiceCategory[] = data.map((service: DbService) => ({
              id: ensureStringId(service.id),
              name: service.name,
              items: [], // Required property
              title: service.name,
              description: service.description || '',
              href: `/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`,
              icon: service.icon || DEFAULT_ICON, // Default icon if none in database
              color: service.color || DEFAULT_COLOR // Default color if none in database
            }));
            
            console.log('Formatted services:', formattedServices);
            setServices(formattedServices);
            updateCallback(formattedServices);
            setFetchAttempts(0); // Reset attempts on success
          } else {
            console.log('No services found in Supabase, using default data');
            
            // Format default data to match ServiceCategory type
            const formattedDefaultData: ServiceCategory[] = defaultServiceData.map((service: any) => ({
              id: ensureStringId(service.id || ''),
              name: service.title || '',
              items: service.items || [],
              title: service.title || '',
              description: service.description || '',
              href: service.href || '',
              icon: service.icon || DEFAULT_ICON,
              color: service.color || DEFAULT_COLOR
            }));
            
            setServices(formattedDefaultData);
            updateCallback(formattedDefaultData);
          }
        } catch (supabaseError) {
          console.error('Supabase services fetch error:', supabaseError);
          
          // If we've reached max attempts, use default data
          if (fetchAttempts >= MAX_FETCH_ATTEMPTS - 1) {
            console.warn(`Max fetch attempts (${MAX_FETCH_ATTEMPTS}) reached, using default data`);
            
            // Format default data to match ServiceCategory type
            const formattedDefaultData: ServiceCategory[] = defaultServiceData.map((service: any) => ({
              id: ensureStringId(service.id || ''),
              name: service.title || '',
              items: service.items || [],
              title: service.title || '',
              description: service.description || '',
              href: service.href || '',
              icon: service.icon || DEFAULT_ICON,
              color: service.color || DEFAULT_COLOR
            }));
            
            setServices(formattedDefaultData);
            updateCallback(formattedDefaultData);
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
          
          // Format default data to match ServiceCategory type
          const formattedDefaultData: ServiceCategory[] = defaultServiceData.map((service: any) => ({
            id: ensureStringId(service.id || ''),
            name: service.title || '',
            items: service.items || [],
            title: service.title || '',
            description: service.description || '',
            href: service.href || '',
            icon: service.icon || DEFAULT_ICON,
            color: service.color || DEFAULT_COLOR
          }));
          
          setServices(formattedDefaultData);
          updateCallback(formattedDefaultData);
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
