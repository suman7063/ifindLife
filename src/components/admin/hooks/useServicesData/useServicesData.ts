
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ServiceCategory, ServiceItem, DbService } from './types';
import { toast } from 'sonner';
import { normalizeId, toNumberId } from '@/utils/supabaseUtils';

const useServicesData = () => {
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [flatServices, setFlatServices] = useState<DbService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all services from the database
  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) {
        throw new Error(`Error fetching services: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No services data returned');
      }
      
      // Convert data to our format with normalized IDs
      const formattedServices = data.map(service => ({
        ...service,
        id: normalizeId(service.id) // Ensure ID is a string for consistency
      }));

      setFlatServices(formattedServices);
      
      // Group services by categories (for UI display)
      const categorizedServices = groupServicesByCategory(formattedServices);
      setServices(categorizedServices);
      
      return { services: categorizedServices, flatServices: formattedServices };
    } catch (err: any) {
      console.error('Error in fetchServices:', err);
      setError(err.message);
      toast.error(`Failed to load services: ${err.message}`);
      return { services: [], flatServices: [] };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Group services into categories
  const groupServicesByCategory = (services: DbService[]): ServiceCategory[] => {
    // Example categorization - customize based on your needs
    const mentalHealthCategory: ServiceCategory = {
      id: 'mental_health',
      name: 'Mental Health',
      items: []
    };
    
    const wellnessCategory: ServiceCategory = {
      id: 'wellness',
      name: 'Wellness',
      items: []
    };
    
    const otherCategory: ServiceCategory = {
      id: 'other',
      name: 'Other Services',
      items: []
    };
    
    services.forEach(service => {
      const serviceItem: ServiceItem = {
        id: normalizeId(service.id),
        title: service.name,
        description: service.description || '',
        href: `/services/${service.id}`,
        icon: 'sparkles',
        color: 'bg-indigo-500'
      };
      
      // Simple categorization logic - replace with your own
      const name = service.name.toLowerCase();
      
      if (name.includes('therapy') || name.includes('counseling')) {
        mentalHealthCategory.items.push(serviceItem);
      } else if (name.includes('wellness') || name.includes('yoga')) {
        wellnessCategory.items.push(serviceItem);
      } else {
        otherCategory.items.push(serviceItem);
      }
    });
    
    // Only return categories with items
    return [mentalHealthCategory, wellnessCategory, otherCategory]
      .filter(category => category.items.length > 0);
  };
  
  // Add a new service
  const addService = useCallback(async (service: Omit<DbService, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert({
          name: service.name,
          description: service.description,
          rate_usd: service.rate_usd,
          rate_inr: service.rate_inr
        })
        .select();
      
      if (error) {
        throw new Error(`Error adding service: ${error.message}`);
      }
      
      // Refresh services to get the updated list
      await fetchServices();
      
      toast.success('Service added successfully');
      return { success: true, data };
    } catch (err: any) {
      console.error('Error in addService:', err);
      toast.error(`Failed to add service: ${err.message}`);
      return { success: false, error: err.message };
    }
  }, [fetchServices]);
  
  // Update an existing service
  const updateService = useCallback(async (service: DbService) => {
    try {
      // Ensure ID is properly handled as a number for database operations
      const serviceId = toNumberId(service.id);
      
      if (serviceId === null) {
        throw new Error('Invalid service ID');
      }
      
      const { error } = await supabase
        .from('services')
        .update({
          name: service.name,
          description: service.description,
          rate_usd: service.rate_usd,
          rate_inr: service.rate_inr
        })
        .eq('id', serviceId);
      
      if (error) {
        throw new Error(`Error updating service: ${error.message}`);
      }
      
      // Refresh services to get the updated list
      await fetchServices();
      
      toast.success('Service updated successfully');
      return { success: true };
    } catch (err: any) {
      console.error('Error in updateService:', err);
      toast.error(`Failed to update service: ${err.message}`);
      return { success: false, error: err.message };
    }
  }, [fetchServices]);
  
  // Delete a service
  const deleteService = useCallback(async (serviceId: string | number) => {
    try {
      // Ensure ID is properly handled as a number for database operations
      const id = toNumberId(serviceId);
      
      if (id === null) {
        throw new Error('Invalid service ID');
      }
      
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(`Error deleting service: ${error.message}`);
      }
      
      // Refresh services to get the updated list
      await fetchServices();
      
      toast.success('Service deleted successfully');
      return { success: true };
    } catch (err: any) {
      console.error('Error in deleteService:', err);
      toast.error(`Failed to delete service: ${err.message}`);
      return { success: false, error: err.message };
    }
  }, [fetchServices]);

  // Load services on component mount
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    flatServices,
    isLoading,
    error,
    fetchServices,
    addService,
    updateService,
    deleteService
  };
};

export default useServicesData;
