import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExpertCardData } from '@/components/expert-card/types';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';

interface UseExpertDataProps {
  serviceId?: string;
  specialization?: string;
}

export function useExpertData({ serviceId, specialization }: UseExpertDataProps = {}) {
  const [experts, setExperts] = useState<ExpertCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawExperts, setRawExperts] = useState<any[]>([]);

  // Get auth IDs from raw experts data
  const expertAuthIds = rawExperts
    .map(e => e.auth_id)
    .filter(id => id !== null && id !== undefined);

  const { getExpertPresence } = useExpertPresence();

  // Map database expert to ExpertCardData with pricing
  const mapDbExpertToExpertCard = (dbExpert: any, servicePricing?: any): ExpertCardData => {
    const expertId = String(dbExpert.id);
    const expertAuthId = dbExpert.auth_id;
    const isApproved = dbExpert.status === 'approved';
    const presence = getExpertPresence(expertAuthId);
    
    // Calculate price based on service or default
    let price = 30; // Default price
    if (servicePricing) {
      price = servicePricing.rate_usd || servicePricing.rate_inr || price;
    }
    
    return {
      id: expertId,
      auth_id: expertAuthId,
      name: dbExpert.name || 'Unknown Expert',
      profilePicture: dbExpert.profile_picture || '',
      specialization: dbExpert.specialization || 'General Counseling',
      experience: typeof dbExpert.experience === 'string' ? parseInt(dbExpert.experience) || 0 : Number(dbExpert.experience) || 0,
      averageRating: Number(dbExpert.average_rating) || 4.5,
      reviewsCount: Number(dbExpert.reviews_count) || 0,
      price,
      verified: Boolean(dbExpert.verified),
      status: isApproved && presence?.status === 'online' ? 'online' : 'offline',
      waitTime: isApproved && presence?.isAvailable ? 'Available Now' : 'Not Available',
      dbStatus: dbExpert.status
    };
  };

  // Update experts when presence data changes
  useEffect(() => {
    if (rawExperts.length > 0) {
      const formattedExperts = rawExperts.map(expert => mapDbExpertToExpertCard(expert));
      setExperts(formattedExperts);
    }
  }, [rawExperts, getExpertPresence]);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching experts with filters:', { serviceId, specialization });
        
        let query = supabase
          .from('expert_public_profiles')
          .select('*');

        // Filter by specialization if provided
        if (specialization) {
          query = query.ilike('specialization', `%${specialization}%`);
        }

        // Filter by service if serviceId is provided
        if (serviceId) {
          const serviceIdNum = parseInt(serviceId);
          if (!isNaN(serviceIdNum)) {
            query = query.contains('selected_services', [serviceIdNum]);
          }
        }
        
        const { data: expertsData, error: expertsError } = await query;
        
        if (expertsError) {
          console.error('Error fetching experts:', expertsError);
          throw expertsError;
        }
        
        if (expertsData && expertsData.length > 0) {
          console.log(`Loaded ${expertsData.length} filtered experts`);
          setRawExperts(expertsData);
        } else {
          console.log('No experts found with filters');
          setRawExperts([]);
          setExperts([]);
        }
      } catch (err) {
        console.error('Error loading experts:', err);
        setError('Failed to load experts');
        setExperts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExperts();
  }, [serviceId, specialization]);

  const getExpertById = (expertId: string): ExpertCardData | null => {
    return experts.find(expert => expert.id === expertId || expert.auth_id === expertId) || null;
  };

  const getOnlineExperts = (): ExpertCardData[] => {
    return experts.filter(expert => expert.status === 'online');
  };

  const getOfflineExperts = (): ExpertCardData[] => {
    return experts.filter(expert => expert.status === 'offline');
  };

  return {
    experts,
    loading,
    error,
    getExpertById,
    getOnlineExperts,
    getOfflineExperts,
    refetch: () => {
      setLoading(true);
      setExperts([]);
    }
  };
}