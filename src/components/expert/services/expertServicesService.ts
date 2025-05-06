
import { supabase } from '@/lib/supabase';
import { ServiceType } from '../types';

/**
 * Fetch all services from the services table
 */
export async function fetchServices(): Promise<ServiceType[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
    
    return data as ServiceType[];
  } catch (error) {
    console.error('Failed to fetch services:', error);
    throw error;
  }
}

/**
 * Fetch services by IDs
 */
export async function fetchServicesByIds(serviceIds: number[]): Promise<ServiceType[]> {
  if (!serviceIds || serviceIds.length === 0) {
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .in('id', serviceIds);
    
    if (error) {
      console.error('Error fetching services by ids:', error);
      throw error;
    }
    
    return data as ServiceType[];
  } catch (error) {
    console.error('Failed to fetch services by ids:', error);
    throw error;
  }
}

/**
 * Fetch a service by ID
 */
export async function fetchServiceById(serviceId: number): Promise<ServiceType | null> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching service by id:', error);
      throw error;
    }
    
    return data as ServiceType;
  } catch (error) {
    console.error('Failed to fetch service by id:', error);
    throw error;
  }
}
