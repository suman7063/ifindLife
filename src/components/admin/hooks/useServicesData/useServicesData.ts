import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Service } from './types';
import { toast } from 'sonner';
import { safeDataTransform, dbTypeConverter } from '@/utils/supabaseUtils';

export const useServicesData = (
  initialServices: Service[] = [],
  isLoading: boolean = false,
  updateCallback: (services: Service[]) => void = () => {}
) => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [loading, setLoading] = useState(isLoading);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const MAX_FETCH_ATTEMPTS = 3;

  // Default services for fallback
  const DEFAULT_SERVICES: Service[] = [
    {
      id: 1,
      name: "Stress Management",
      description: "Techniques to cope with daily stressors and improve mental well-being.",
      rate_usd: 49.99,
      rate_inr: 3500
    },
    {
      id: 2,
      name: "Relationship Counseling",
      description: "Guidance and support to improve communication and resolve conflicts in relationships.",
      rate_usd: 79.99,
      rate_inr: 5500
    },
    {
      id: 3,
      name: "Career Coaching",
      description: "Strategies to achieve career goals, enhance professional skills, and find job satisfaction.",
      rate_usd: 59.99,
      rate_inr: 4200
    },
    {
      id: 4,
      name: "Personal Development",
      description: "Tools and insights to enhance self-awareness, build confidence, and achieve personal growth.",
      rate_usd: 39.99,
      rate_inr: 2800
    }
  ];

  // Map database service to our Service type
  const mapDatabaseServiceToService = (dbService: any): Service => {
    return {
      id: dbService.id,
      name: dbService.name || 'Unknown Service',
      description: dbService.description || '',
      rate_usd: dbService.rate_usd || 0,
      rate_inr: dbService.rate_inr || 0
    };
  };

  // Load services data from the same source as public site
  useEffect(() => {
    const fetchServices = async () => {
      // If we already have services data, don't fetch again
      if (initialServices.length > 0) {
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Fetching services data... Attempt: ${fetchAttempts + 1}`);
        
        // First check localStorage which might be used by the public site
        let parsedContent;
        try {
          const savedContent = localStorage.getItem('ifindlife-content');
          if (savedContent) {
            parsedContent = JSON.parse(savedContent);
            if (parsedContent.services && parsedContent.services.length > 0) {
              console.log('Services found in localStorage:', parsedContent.services.length);
              setServices(parsedContent.services);
              updateCallback(parsedContent.services);
              setLoading(false);
              setFetchAttempts(0); // Reset on success
              return;
            }
          }
        } catch (localStorageError) {
          console.error('Error reading from localStorage:', localStorageError);
          // Continue with Supabase fetch if localStorage fails
        }
        
        // If no services in localStorage, fetch from Supabase
        console.log('Fetching services from Supabase...');
        
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('id', { ascending: true });
          
        if (error) {
          // Check if the error is related to infinite recursion or RLS policies
          if (error.code === '42P17' || error.message?.includes('recursion') || error.message?.includes('policy')) {
            console.warn('Database policy error detected for services table, using fallback');
            throw new Error(`Database policy error: ${error.message}`);
          }
          
          console.error('Error fetching services:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          // Transform services data to match our expected format using our utility
          const formattedServices = safeDataTransform(data, (service) => 
            mapDatabaseServiceToService(dbTypeConverter(service))
          );
          
          console.log('Formatted services:', formattedServices.length);
          setServices(formattedServices);
          updateCallback(formattedServices);
          
          // Also update localStorage if needed
          if (parsedContent) {
            parsedContent.services = formattedServices;
            localStorage.setItem('ifindlife-content', JSON.stringify(parsedContent));
          }
          
          setFetchAttempts(0); // Reset on success
          toast.success(`Loaded ${formattedServices.length} services`);
        } else {
          console.warn('No service data found in the database, using default data');
          if (fetchAttempts >= MAX_FETCH_ATTEMPTS - 1) {
            setServices(DEFAULT_SERVICES);
            updateCallback(DEFAULT_SERVICES);
            toast.error('Could not load services. Using default data.');
          }
        }
      } catch (err) {
        console.error('Error loading services data:', err);
        
        if (fetchAttempts >= MAX_FETCH_ATTEMPTS - 1) {
          console.warn(`Max fetch attempts (${MAX_FETCH_ATTEMPTS}) reached, using default data`);
          setError('Failed to load services data after multiple attempts');
          setServices(DEFAULT_SERVICES);
          updateCallback(DEFAULT_SERVICES);
          toast.error('Error loading services. Using default settings.');
        } else {
          // Schedule retry
          const retryDelay = Math.min(1000 * Math.pow(2, fetchAttempts), 10000);
          console.log(`Scheduling services data retry in ${retryDelay}ms...`);
          
          setTimeout(() => {
            setFetchAttempts(prev => prev + 1);
          }, retryDelay);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [initialServices, updateCallback, fetchAttempts]);

  const createService = async (serviceData: {
    name: string;
    description: string;
    rate_usd: number;
    rate_inr: number;
  }): Promise<Service | null> => {
    try {
      console.log('Creating new service:', serviceData);
      
      // We need to get the next ID for the service
      const { data: maxIdData } = await supabase
        .from('services')
        .select('id')
        .order('id', { ascending: false })
        .limit(1)
        .single();
        
      const nextId = maxIdData ? (maxIdData.id + 1) : 1;
      
      // Now insert with the ID
      const { data, error } = await supabase
        .from('services')
        .insert({
          id: nextId,
          name: serviceData.name,
          description: serviceData.description,
          rate_usd: serviceData.rate_usd,
          rate_inr: serviceData.rate_inr
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating service:', error);
        toast.error(`Error creating service: ${error.message}`);
        return null;
      }
      
      console.log('Service created successfully:', data);
      toast.success('Service created successfully');
      
      return mapDatabaseServiceToService(data);
    } catch (error: any) {
      console.error('Error in createService:', error);
      toast.error(`Error creating service: ${error.message || 'Unknown error'}`);
      return null;
    }
  };

  const updateService = async (id: number, updates: Partial<Service>): Promise<Service | null> => {
    try {
      console.log(`Updating service with ID ${id}:`, updates);
      
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating service:', error);
        toast.error(`Error updating service: ${error.message}`);
        return null;
      }
      
      console.log('Service updated successfully:', data);
      toast.success('Service updated successfully');
      
      return mapDatabaseServiceToService(data);
    } catch (error: any) {
      console.error('Error in updateService:', error);
      toast.error(`Error updating service: ${error.message || 'Unknown error'}`);
      return null;
    }
  };

  const deleteService = async (id: number): Promise<boolean> => {
    try {
      console.log(`Deleting service with ID ${id}`);
      
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting service:', error);
        toast.error(`Error deleting service: ${error.message}`);
        return false;
      }
      
      console.log('Service deleted successfully');
      toast.success('Service deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error in deleteService:', error);
      toast.error(`Error deleting service: ${error.message || 'Unknown error'}`);
      return false;
    }
  };

  return {
    services,
    setServices,
    loading,
    error,
    createService,
    updateService,
    deleteService
  };
};
