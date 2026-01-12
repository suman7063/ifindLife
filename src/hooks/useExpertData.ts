import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExpertCardData } from '@/components/expert-card/types';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';
import { requiresAdminAssignment } from '@/constants/serviceTypes';

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
    const expertAuthId = dbExpert.auth_id;
    const expertId = String(expertAuthId); // Use auth_id as id for backward compatibility
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
      status: isApproved && presence?.status === 'available' ? 'online' : 'offline',
      waitTime: isApproved && presence?.isAvailable ? 'Available Now' : 'Not Available',
      dbStatus: dbExpert.status,
      pricing_set: Boolean(dbExpert.pricing_set),
      availability_set: Boolean(dbExpert.availability_set)
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
        
        const { data, error } = await supabase
          .rpc('get_approved_experts');

        if (error) {
          console.error('Error fetching experts:', error);
          throw error;
        }

        let filteredData = data || [];

        // Apply filters in JavaScript since we're using RPC
        if (specialization) {
          filteredData = filteredData.filter(expert => 
            expert.specialization?.toLowerCase().includes(specialization.toLowerCase())
          );
        }

        if (serviceId) {
          // Get the actual UUID service ID from database
          // serviceId can be either a slug (e.g., "mindful-listening") or UUID
          let actualServiceId: string | null = null;
          
          // Check if it's already a UUID
          const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (uuidPattern.test(serviceId)) {
            actualServiceId = serviceId;
          } else {
            // Map slug to service name, then find UUID
            const slugToNameMap: Record<string, string> = {
              'mindful-listening': 'Heart2Heart Listening',
              'listening-with-guidance': 'Listening with Guidance',
              'therapy-sessions': 'Therapy Sessions',
              'guided-meditations': 'Guided Meditations',
              'offline-retreats': 'Offline Retreats',
              'life-coaching': 'Life Coaching'
            };
            
            const serviceName = slugToNameMap[serviceId] || serviceId;
            
            // Find service by exact name
            const { data: serviceData } = await supabase
              .from('services')
              .select('id')
              .eq('name', serviceName)
              .limit(1)
              .single();
            
            if (serviceData) {
              actualServiceId = serviceData.id;
            }
          }
          
          if (actualServiceId) {
            // First, check the service type to determine which table to use
            const { data: serviceInfo, error: serviceInfoError } = await supabase
              .from('services')
              .select('service_type')
              .eq('id', actualServiceId)
              .single();
            
            if (serviceInfoError) {
              console.error('Error fetching service info:', serviceInfoError);
              // If service not found, return empty array (no experts for this service)
              filteredData = [];
            } else {
              // Type assertion needed as service_type may not be in generated types yet
              const serviceType = (serviceInfo as any)?.service_type as string | null | undefined;
              const isAdminAssigned = requiresAdminAssignment(serviceType);
              
              const expertIds = filteredData.map(e => e.auth_id).filter(Boolean) as string[];
              if (expertIds.length > 0) {
                let expertIdsWithService: Set<string>;
                
                if (isAdminAssigned) {
                  // For admin-assigned services (retreats, premium, exclusive), use admin_expert_service_assignments
                  const { data: assignments, error: assignmentsError } = await supabase
                    .from('admin_expert_service_assignments')
                    .select('expert_id')
                    .in('expert_id', expertIds)
                    .eq('service_id', actualServiceId)
                    .eq('is_active', true);
                  
                  if (assignmentsError) {
                    console.error('Error fetching admin assignments:', assignmentsError);
                    expertIdsWithService = new Set();
                  } else {
                    expertIdsWithService = new Set(assignments?.map(a => a.expert_id) || []);
                  }
                } else {
                  // For regular services, use expert_service_specializations
                  const { data: specializations, error: specializationsError } = await supabase
                    .from('expert_service_specializations')
                    .select('expert_id')
                    .in('expert_id', expertIds)
                    .eq('service_id', actualServiceId)
                    .eq('is_available', true);
                  
                  if (specializationsError) {
                    console.error('Error fetching specializations:', specializationsError);
                    expertIdsWithService = new Set();
                  } else {
                    expertIdsWithService = new Set(specializations?.map(s => s.expert_id) || []);
                  }
                }
                
                filteredData = filteredData.filter(expert => 
                  expert.auth_id && expertIdsWithService.has(expert.auth_id)
                );
              } else {
                filteredData = [];
              }
            }
          } else {
            // If serviceId was provided but actualServiceId not found, return empty array
            // This ensures we don't show all experts when a specific service was requested
            console.warn('Service ID not found for serviceId:', serviceId);
            filteredData = [];
          }
        }

        console.log(`Loaded ${filteredData.length} filtered experts`);
        setRawExperts(filteredData);
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
    return experts.find(expert => expert.auth_id === expertId) || null;
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