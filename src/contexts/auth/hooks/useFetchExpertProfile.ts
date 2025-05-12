
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { ExpertProfile } from '../types';

export const useFetchExpertProfile = (userId: string | undefined, session: Session | null) => {
  const [expertProfile, setExpertProfile] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchExpertProfile = async () => {
      if (!userId || !session) {
        setLoading(false);
        return;
      }

      try {
        // Attempt to fetch expert profile from 'expert_accounts' table
        console.log(`Attempting to fetch expert profile for user ID: ${userId}`);
        
        const { data: profileData, error: profileError } = await supabase
          .from('expert_accounts')
          .select('*')
          .eq('auth_id', userId)
          .maybeSingle();

        // Handle specific error cases
        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // "No rows returned" is not a critical error, just means the user is not an expert
            console.log('No expert profile found for this user');
            setExpertProfile(null);
          } else if (profileError.code === '42P17') {
            // Handle the infinite recursion policy error - this is a server configuration issue
            console.error('Database policy error in expert_accounts table:', profileError);
            throw new Error(`Server configuration issue with expert accounts: ${profileError.message}`);
          } else {
            console.error('Error fetching expert profile:', profileError);
            throw profileError;
          }
        } else if (profileData) {
          console.log('Expert profile found:', profileData);
          
          // Ensure proper typing for the profile
          const profile: ExpertProfile = {
            id: profileData.id,
            auth_id: profileData.auth_id,
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone || null,
            address: profileData.address || null,
            city: profileData.city || null,
            state: profileData.state || null,
            country: profileData.country || null,
            bio: profileData.bio || null,
            specialization: profileData.specialization || null,
            experience: profileData.experience || null,
            status: (profileData.status as 'pending' | 'approved' | 'disapproved') || 'pending',
            profile_picture: profileData.profile_picture || null,
            certificate_urls: profileData.certificate_urls || [],
            selected_services: profileData.selected_services || [],
            verified: profileData.verified || false,
            average_rating: profileData.average_rating || 0,
            reviews_count: profileData.reviews_count || 0,
          };
          
          setExpertProfile(profile);
        }
      } catch (err) {
        console.error('Error in fetchExpertProfile:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching expert profile'));
        
        // We're setting expert profile to null even on error to prevent UI blocking
        setExpertProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExpertProfile();
  }, [userId, session]);

  return { expertProfile, loading, error };
};
