
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { UserProfile } from '@/types/supabase/user';

export const useFetchUserProfile = (userId: string | undefined, session: Session | null) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId || !session) {
        setLoading(false);
        return;
      }

      try {
        // First, try to get user profile from 'users' table
        let { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError || !profileData) {
          // If no profile found in 'users' table, try 'profiles' table
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (fallbackError && fallbackError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
            throw fallbackError;
          }

          if (fallbackData) {
            // Convert profiles data to match UserProfile structure
            profileData = {
              ...fallbackData,
              referral_code: '',
              referral_link: '',
              referred_by: '',
              favorite_experts: [],
              enrolled_courses: [],
              transactions: [],
              reviews: [],
              reports: [],
              referrals: []
            };
          }
        }

        if (profileData) {
          // Add default empty values for any missing fields
          const enhancedProfile: UserProfile = {
            id: profileData.id,
            name: profileData.name || '',
            email: profileData.email || '',
            phone: profileData.phone || '',
            country: profileData.country || '',
            city: profileData.city || '',
            currency: profileData.currency || 'USD',
            profile_picture: profileData.profile_picture || '',
            wallet_balance: profileData.wallet_balance || 0,
            created_at: profileData.created_at || '',
            referral_code: profileData.referral_code || '',
            referred_by: profileData.referred_by || '',
            referral_link: profileData.referral_link || '',
            favorite_experts: profileData.favorite_experts || [],
            enrolled_courses: profileData.enrolled_courses || [],
            transactions: profileData.transactions || [],
            reviews: profileData.reviews || [],
            reports: profileData.reports || [],
            referrals: profileData.referrals || []
          };
          
          setUserProfile(enhancedProfile);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, session]);

  return { userProfile, loading, error };
};
