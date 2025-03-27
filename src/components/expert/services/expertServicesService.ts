
import { ServiceType } from '../types';

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
    // For local development without a backend, return mock data
    if (process.env.NODE_ENV === 'development') {
      return mockServices;
    }
    
    // If connected to a real backend, fetch data
    const response = await fetch('/api/services');
    
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    
    const services = await response.json();
    
    // Map the backend field names to our frontend field names
    return services.map((service: any) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      rateUSD: service.rate_usd,
      rateINR: service.rate_inr
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    return mockServices; // Fallback to mock data in case of error
  }
};
