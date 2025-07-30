
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useUnifiedServices } from '@/hooks/useUnifiedServices';

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
  // Use unified services hook as the single source of truth
  const { services: unifiedServices, loading: unifiedLoading, error: unifiedError } = useUnifiedServices();
  
  const [services, setServices] = useState<ServiceCategory[]>(initialServices);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert unified services to admin format when available
  useEffect(() => {
    if (!unifiedLoading && unifiedServices.length > 0) {
      console.log('Converting unified services to admin format:', unifiedServices);
      
      const adminFormattedServices: ServiceCategory[] = unifiedServices.map(service => ({
        icon: service.icon.props?.children || '🧠', // Extract icon or default
        title: service.name,
        description: service.description,
        href: `/services/${service.slug}`,
        color: service.color.replace('bg-', 'bg-') + '/10' // Convert to admin color format
      }));

      setServices(adminFormattedServices);
      updateCallback(adminFormattedServices);
      setLoading(false);
      setError(null);
    } else if (!unifiedLoading && unifiedError) {
      console.error('Error from unified services:', unifiedError);
      setError(unifiedError);
      setLoading(false);
    } else if (!unifiedLoading && unifiedServices.length === 0) {
      console.warn('No unified services found');
      setError('No services available');
      setLoading(false);
    }
  }, [unifiedServices, unifiedLoading, unifiedError, updateCallback]);

  // Set loading state based on unified services
  useEffect(() => {
    setLoading(unifiedLoading);
  }, [unifiedLoading]);

  return {
    services,
    setServices,
    loading,
    error
  };
}
