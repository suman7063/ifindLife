
import { ServiceType } from '../types';
import { supabase } from '@/lib/supabase';

// Simulated data for local development as a fallback
const mockServices: ServiceType[] = [
  {
    id: 1,
    name: 'Therapy Session',
    description: 'One-on-one therapy session focused on mental wellness',
    rateUSD: 50,
    rateINR: 3500
  },
  {
    id: 2,
    name: 'Consultation',
    description: 'Initial consultation to assess needs and create a treatment plan',
    rateUSD: 35,
    rateINR: 2500
  },
  {
    id: 3,
    name: 'Group Session',
    description: 'Guided group therapy sessions for shared experiences',
    rateUSD: 25,
    rateINR: 1800
  }
];

export const fetchServices = async (): Promise<ServiceType[]> => {
  try {
    console.log('Fetching services from Supabase...');
    
    // First try to fetch from services table (admin configured services)
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('*');
    
    if (servicesError) {
      console.error('Error fetching services from Supabase:', servicesError);
      
      // Try to fetch from categories/services from homepage as a fallback
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');
      
      if (categoriesError || !categoriesData || categoriesData.length === 0) {
        console.log('No services or categories found, using mock data');
        return mockServices;
      }
      
      // Map the categories data to service format
      return categoriesData.map((category: any, index) => ({
        id: category.id || index + 1,
        name: category.title || category.name,
        description: category.description,
        rateUSD: category.rate_usd || 50,
        rateINR: category.rate_inr || 3500
      }));
    }
    
    if (servicesData && servicesData.length > 0) {
      console.log('Services found in Supabase:', servicesData.length);
      // Map the backend field names to our frontend field names if needed
      return servicesData.map((service: any) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        rateUSD: service.rate_usd || service.rateUSD || 0,
        rateINR: service.rate_inr || service.rateINR || 0
      }));
    }
    
    // If no data from Supabase, use mock data
    console.log('No services found in Supabase, using mock data');
    return mockServices;
  } catch (error) {
    console.error('Exception fetching services:', error);
    console.log('Falling back to mock data due to exception');
    return mockServices; // Fallback to mock data in case of error
  }
};
