
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { categoryData as defaultCategoryData } from '@/data/homePageData';
import { toast } from 'sonner';

export interface ServiceCategory {
  icon: string;
  title: string;
  description: string;
  href: string;
  color: string;
}

export function useServicesData(
  initialServices: ServiceCategory[] = [], 
  updateCallback: (services: ServiceCategory[]) => void = () => {}
) {
  const [services, setServices] = useState<ServiceCategory[]>(initialServices);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load services data from the same source as public site
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First check localStorage which is used by the public site
        const savedContent = localStorage.getItem('ifindlife-content');
        if (savedContent) {
          const parsedContent = JSON.parse(savedContent);
          if (parsedContent.services && parsedContent.services.length > 0) {
            setServices(parsedContent.services);
            updateCallback(parsedContent.services);
            setLoading(false);
            return;
          }
        }
        
        // If no services in localStorage, use default data or try to fetch from Supabase
        const { data, error } = await supabase.from('services').select('*');
        
        if (error) {
          console.error('Error fetching services:', error);
          // If Supabase fetch fails, use default data
          setServices(defaultCategoryData);
          updateCallback(defaultCategoryData);
          return;
        }
        
        if (data && data.length > 0) {
          // Map Supabase data to the expected format if needed
          const formattedServices = data.map(service => ({
            icon: service.icon || '🧠', // Default icon if none
            title: service.name,
            description: service.description,
            href: `/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`,
            color: service.color || 'bg-ifind-aqua/10'
          }));
          
          setServices(formattedServices);
          updateCallback(formattedServices);
        } else {
          // If no data in Supabase either, use default data
          setServices(defaultCategoryData);
          updateCallback(defaultCategoryData);
        }
      } catch (err) {
        console.error('Error loading services data:', err);
        setError('Failed to load services data');
        toast.error('Failed to load services data');
        
        // Fallback to default data on error
        setServices(defaultCategoryData);
        updateCallback(defaultCategoryData);
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
