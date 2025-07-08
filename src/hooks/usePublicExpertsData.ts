import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ExpertCardData } from '@/components/expert-card/types';
import { useRealExpertPresence } from './useRealExpertPresence';

export function usePublicExpertsData() {
  const [experts, setExperts] = useState<ExpertCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getExpertStatus, getExpertAvailability } = useRealExpertPresence();

  // Map database expert to ExpertCardData
  const mapDbExpertToExpertCard = (dbExpert: any): ExpertCardData => {
    const expertId = String(dbExpert.id);
    const expertAuthId = dbExpert.auth_id;
    const isApproved = dbExpert.status === 'approved';
    const expertStatus = getExpertStatus(expertAuthId);
    const availability = getExpertAvailability(expertAuthId);
    
    return {
      id: expertId,
      auth_id: expertAuthId,
      name: dbExpert.name || 'Unknown Expert',
      profilePicture: dbExpert.profile_picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop',
      specialization: dbExpert.specialization || 'General Counseling',
      experience: typeof dbExpert.experience === 'string' ? parseInt(dbExpert.experience) || 0 : Number(dbExpert.experience) || 0,
      averageRating: Number(dbExpert.average_rating) || 4.5,
      reviewsCount: Number(dbExpert.reviews_count) || 0,
      price: 30, // Default price - this should come from services or expert pricing in the future
      verified: Boolean(dbExpert.verified),
      status: isApproved && expertStatus === 'online' ? 'online' : 'offline',
      waitTime: isApproved && availability === 'available' ? 'Available Now' : 
                isApproved && availability === 'busy' ? 'Busy' :
                isApproved && availability === 'away' ? 'Away' : 'Not Available',
      dbStatus: dbExpert.status
    };
  };

  useEffect(() => {
    const fetchApprovedExperts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching approved experts from database...');
        
        // Fetch only approved experts from expert_accounts table
        const { data: expertsData, error: expertsError } = await supabase
          .from('expert_accounts')
          .select('*')
          .eq('status', 'approved'); // Only approved experts
        
        if (expertsError) {
          console.error('Error fetching experts:', expertsError);
          throw expertsError;
        }
        
        if (expertsData && expertsData.length > 0) {
          const formattedExperts = expertsData.map(mapDbExpertToExpertCard);
          console.log(`Loaded ${formattedExperts.length} approved experts`);
          setExperts(formattedExperts);
        } else {
          console.log('No approved experts found');
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
    
    fetchApprovedExperts();
  }, []);

  return {
    experts,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      // Re-run the effect by updating a dependency
    }
  };
}