
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
      
      // Since we can't use .from("categories") directly, use a more generic approach
      // that works with the existing schema
      try {
        // Try to look for categories in another table that might be storing
        // the admin-configured categories from the home page
        const { data: homeServices, error: homeServicesError } = await supabase
          .from('services')
          .select('*')
          .eq('type', 'home_category');
          
        if (!homeServicesError && homeServices && homeServices.length > 0) {
          console.log('Found home services/categories:', homeServices.length);
          return homeServices.map((service: any) => ({
            id: service.id,
            name: service.name || service.title,
            description: service.description,
            rateUSD: service.rate_usd || 50,
            rateINR: service.rate_inr || 3500
          }));
        }
      } catch (homeError) {
        console.error('Error fetching home categories:', homeError);
      }
      
      console.log('No services found, using mock data');
      return mockServices;
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
