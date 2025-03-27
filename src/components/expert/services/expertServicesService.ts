
import { supabase } from '@/lib/supabase';
import { ServiceType } from '../types';

export const fetchServices = async (): Promise<ServiceType[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*');
    
    if (error) {
      console.error("Error fetching services:", error);
      return createSampleServices();
    }
    
    if (data && data.length > 0) {
      return data.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        rateUSD: service.rate_usd,
        rateINR: service.rate_inr,
      }));
    } else {
      console.warn("No services found in database");
      return createSampleServices();
    }
  } catch (e) {
    console.error("Error fetching services", e);
    return createSampleServices();
  }
};

export const createSampleServices = (): ServiceType[] => {
  return [
    {
      id: 1,
      name: "Therapy Session",
      description: "One-on-one therapy session to discuss mental health concerns",
      rateUSD: 40,
      rateINR: 3200,
    },
    {
      id: 2,
      name: "Anxiety Management",
      description: "Learn techniques to manage anxiety and stress",
      rateUSD: 35,
      rateINR: 2800,
    },
    {
      id: 3,
      name: "Depression Counseling",
      description: "Support and guidance for managing depression",
      rateUSD: 45,
      rateINR: 3600,
    },
    {
      id: 4,
      name: "Relationship Counseling",
      description: "Guidance for improving personal relationships",
      rateUSD: 50,
      rateINR: 4000,
    }
  ];
};
