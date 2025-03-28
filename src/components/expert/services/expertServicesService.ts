
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

// Define a type for service data from Supabase to avoid deep type instantiation
interface ServiceDBRecord {
  id: number;
  name: string;
  description?: string;
  rate_usd?: number;
  rate_inr?: number;
  title?: string;
}

export const fetchServices = async (): Promise<ServiceType[]> => {
  try {
    console.log('Fetching services from Supabase...');
    
    // First try to fetch from services table (admin configured services)
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('id, name, description, rate_usd, rate_inr');
    
    if (servicesError) {
      console.error('Error fetching services from Supabase:', servicesError);
      
      // Try an alternative approach to fetch home categories
      try {
        const { data: homeServices, error: homeServicesError } = await supabase
          .from('services')
          .select('id, name, title, description, rate_usd, rate_inr')
          .eq('type', 'home_category');
          
        if (!homeServicesError && homeServices && homeServices.length > 0) {
          console.log('Found home services/categories:', homeServices.length);
          
          // Use a safer approach: first convert to unknown, then to our type
          return (homeServices as unknown as ServiceDBRecord[]).map((service) => ({
            id: service.id,
            name: service.name || service.title || 'Service',
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
      
      // Use the same safer conversion approach here
      return (servicesData as unknown as ServiceDBRecord[]).map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
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
