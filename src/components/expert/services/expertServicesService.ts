
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

// Interface to match database table schema exactly
interface ServiceRecord {
  id: number;
  name: string | null;
  description: string | null;
  rate_usd: number | null;
  rate_inr: number | null;
}

export const fetchServices = async (): Promise<ServiceType[]> => {
  try {
    console.log('Fetching services from Supabase...');
    
    // First try to fetch from services table
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('id, name, description, rate_usd, rate_inr');
    
    if (servicesError) {
      console.error('Error fetching services from Supabase:', servicesError);
      
      // Fallback to mock data
      console.log('No services found, using mock data');
      return mockServices;
    }
    
    if (servicesData && servicesData.length > 0) {
      console.log('Services found in Supabase:', servicesData.length);
      
      // Safe type conversion and mapping
      return servicesData.map(service => ({
        id: service.id,
        name: service.name || 'Service',
        description: service.description || '',
        rateUSD: service.rate_usd || 0,
        rateINR: service.rate_inr || 0
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
