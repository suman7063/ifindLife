
import { ServiceType } from '../types';
import { supabase } from '@/lib/supabase';

// Simulated data for local development
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
    // First try to fetch from Supabase
    const { data, error } = await supabase
      .from('services')
      .select('*');
    
    if (error) {
      console.error('Error fetching services from Supabase:', error);
      console.log('Falling back to mock data');
      return mockServices;
    }
    
    if (data && data.length > 0) {
      // Map the backend field names to our frontend field names if needed
      return data.map((service: any) => ({
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
