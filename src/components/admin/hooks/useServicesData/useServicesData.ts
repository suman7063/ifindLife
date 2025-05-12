
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { mapDbServices, generateRandomId } from './mappers';
import { ServiceCategory, ServiceItem } from './types';
import { DEFAULT_CATEGORIES } from './constants';
import { safeDataTransform, dbTypeConverter } from '@/utils/supabaseUtils';

// Define the shape of a service from the database
export interface DbService {
  id: number;
  name: string;
  description?: string;
  rate_usd: number;
  rate_inr: number;
}

export function useServicesData(
  initialServices: ServiceCategory[] = [],
  updateCallback: (services: ServiceCategory[]) => void = () => {}
) {
  const [services, setServices] = useState<ServiceCategory[]>(initialServices);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load services data from Supabase
  useEffect(() => {
    // If we already have services data, don't fetch again
    if (initialServices.length > 0) {
      return;
    }
    
    const fetchServices = async () => {
      try {
        setLoading(true);
        
        // Try to fetch services from Supabase
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*');
          
        if (servicesError) {
          console.error('Error fetching services:', servicesError);
          throw servicesError;
        }
        
        if (servicesData && servicesData.length > 0) {
          // Convert Supabase data to our app format
          const dbServices = safeDataTransform(servicesData, (service) => 
            dbTypeConverter<DbService>(service)
          );
            
          // Map services to our category/item structure
          const categorizedServices = mapDbServices(dbServices);
          
          setServices(categorizedServices);
          updateCallback(categorizedServices);
        } else {
          console.log('No services found, using default data');
          setServices(DEFAULT_CATEGORIES);
          updateCallback(DEFAULT_CATEGORIES);
        }
      } catch (err) {
        console.error('Error loading services:', err);
        setError(err instanceof Error ? err.message : 'Unknown error loading services');
        
        // Fallback to default services
        setServices(DEFAULT_CATEGORIES);
        updateCallback(DEFAULT_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [initialServices, updateCallback]);

  // Add a new service item to a category
  const addService = (categoryId: string, service: Omit<ServiceItem, 'id'>) => {
    const newService = {
      ...service,
      id: generateRandomId()
    };
    
    const updatedServices = services.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: [...category.items, newService]
        };
      }
      return category;
    });
    
    setServices(updatedServices);
    updateCallback(updatedServices);
  };

  // Update an existing service
  const updateService = (categoryId: string, serviceId: string, updatedService: Partial<ServiceItem>) => {
    const updatedServices = services.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => {
            if (item.id === serviceId) {
              return { ...item, ...updatedService };
            }
            return item;
          })
        };
      }
      return category;
    });
    
    setServices(updatedServices);
    updateCallback(updatedServices);
  };

  // Remove a service
  const removeService = (categoryId: string, serviceId: string) => {
    const updatedServices = services.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.filter(item => item.id !== serviceId)
        };
      }
      return category;
    });
    
    setServices(updatedServices);
    updateCallback(updatedServices);
  };

  return {
    services,
    setServices,
    loading,
    error,
    actions: {
      addService,
      updateService,
      removeService
    }
  };
}
