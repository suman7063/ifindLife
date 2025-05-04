
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { UserProfile, Review, Report, Course, Referral } from '@/types/supabase/user';
import { UserTransaction } from '@/types/supabase/tables';

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
            // Convert profiles data to match UserProfile structure using type assertion
            profileData = {
              ...fallbackData,
              referral_code: '',
              referral_link: '',
              referred_by: '',
            } as any;
            
            // Then add missing properties
            (profileData as any).favorite_experts = [];
            (profileData as any).enrolled_courses = [];
            (profileData as any).transactions = [];
            (profileData as any).reviews = [];
            (profileData as any).reports = [];
            (profileData as any).referrals = [];
          }
        }

        if (profileData) {
          // Use type assertion to bypass TypeScript restrictions
          const rawProfileData = profileData as any;
          
          // Create the enhanced profile with proper typing
          const enhancedProfile: UserProfile = {
            id: rawProfileData.id,
            name: rawProfileData.name || '',
            email: rawProfileData.email || '',
            phone: rawProfileData.phone || '',
            country: rawProfileData.country || '',
            city: rawProfileData.city || '',
            currency: rawProfileData.currency || 'USD',
            profile_picture: rawProfileData.profile_picture || '',
            wallet_balance: rawProfileData.wallet_balance || 0,
            created_at: rawProfileData.created_at || '',
            referral_code: rawProfileData.referral_code || '',
            referred_by: rawProfileData.referred_by || '',
            referral_link: rawProfileData.referral_link || '',
            
            // Use type assertions for the array properties
            favorite_experts: (rawProfileData.favorite_experts || []) as string[],
            enrolled_courses: (rawProfileData.enrolled_courses || []) as Course[],
            transactions: (rawProfileData.transactions || []) as UserTransaction[],
            reviews: (rawProfileData.reviews || []) as Review[],
            reports: (rawProfileData.reports || []) as Report[],
            referrals: (rawProfileData.referrals || []) as Referral[]
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
