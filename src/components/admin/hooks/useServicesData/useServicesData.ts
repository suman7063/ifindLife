
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { mapDbServiceToServiceItem, mapDbServices, generateRandomId } from './mappers';
import { ServiceCategory, ServiceItem, DbService } from './types';
import { DEFAULT_CATEGORIES } from './constants';
import { safeDataTransform, dbTypeConverter } from '@/utils/supabaseUtils';

export const useServicesData = (
  initialServices: ServiceCategory[] = [],
  updateCallback: (services: ServiceCategory[]) => void = () => {}
) => {
  const [services, setServices] = useState<ServiceCategory[]>(initialServices);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch services data from Supabase
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching services from Supabase...');
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id');
      
      if (error) {
        throw error;
      }
      
      console.log(`Retrieved ${data?.length || 0} services from database`);
      
      if (data && data.length > 0) {
        // Transform database services into our application format using the mapper
        const transformedData = safeDataTransform(data, (service) => 
          dbTypeConverter<DbService>(service)
        );
        
        const serviceCategoriesData = mapDbServices(transformedData);
        setServices(serviceCategoriesData);
        updateCallback(serviceCategoriesData);
        
        console.log('Services data successfully processed');
      } else {
        console.log('No services found, using default data');
        setServices(DEFAULT_CATEGORIES);
        updateCallback(DEFAULT_CATEGORIES);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err instanceof Error ? err.message : 'Unknown error fetching services');
      
      // Fallback to defaults if error
      setServices(DEFAULT_CATEGORIES);
      updateCallback(DEFAULT_CATEGORIES);
    } finally {
      setLoading(false);
    }
  }, [updateCallback]);
  
  // Add a new service
  const addService = async (serviceData: Partial<DbService>): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Insert new service into database
      const { data, error } = await supabase
        .from('services')
        .insert({
          name: serviceData.name || 'New Service',
          description: serviceData.description || '',
          rate_usd: serviceData.rate_usd || 0,
          rate_inr: serviceData.rate_inr || 0
        })
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Get the new service in our format
        const newService = mapDbServiceToServiceItem(dbTypeConverter<DbService>(data[0]));
        
        // Find which category to add it to or create new category
        let foundCategory = false;
        const updatedServices = services.map(category => {
          if (category.name === 'Other Services') {
            foundCategory = true;
            return {
              ...category,
              items: [...category.items, newService]
            };
          }
          return category;
        });
        
        // If no "Other Services" category exists, create one
        if (!foundCategory) {
          updatedServices.push({
            name: 'Other Services',
            id: 'other-services',
            items: [newService]
          });
        }
        
        setServices(updatedServices);
        updateCallback(updatedServices);
        toast.success('Service created successfully');
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error adding service:', err);
      toast.error('Failed to add service');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Update an existing service
  const updateService = async (serviceId: string, updatedData: Partial<DbService>): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Update service in database
      const { error } = await supabase
        .from('services')
        .update({
          name: updatedData.name,
          description: updatedData.description,
          rate_usd: updatedData.rate_usd,
          rate_inr: updatedData.rate_inr
        })
        .eq('id', serviceId);
      
      if (error) throw error;
      
      // Update service in local state
      const updatedServices = services.map(category => ({
        ...category,
        items: category.items.map(item => 
          item.id === serviceId
            ? {
                ...item,
                title: updatedData.name || item.title,
                description: updatedData.description || item.description
              }
            : item
        )
      }));
      
      setServices(updatedServices);
      updateCallback(updatedServices);
      toast.success('Service updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating service:', err);
      toast.error('Failed to update service');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a service
  const deleteService = async (serviceId: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Delete service from database
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);
      
      if (error) throw error;
      
      // Remove service from local state
      const updatedServices = services.map(category => ({
        ...category,
        items: category.items.filter(item => item.id !== serviceId)
      })).filter(category => category.items.length > 0);
      
      setServices(updatedServices);
      updateCallback(updatedServices);
      toast.success('Service deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting service:', err);
      toast.error('Failed to delete service');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load services data on component mount if needed
  useEffect(() => {
    if (initialServices.length === 0) {
      fetchServices();
    }
  }, [initialServices, fetchServices]);

  return {
    services,
    setServices,
    loading,
    error,
    fetchServices,
    addService,
    updateService,
    deleteService
  };
};
