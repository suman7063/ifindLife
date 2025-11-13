
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { UserProfile } from '@/types/database/unified';
import { Review, Report, Course } from '@/types/supabase/user';
import { UserTransaction } from '@/types/supabase/tables';
import { Referral } from '@/types/supabase/referral';

export const useFetchUserProfile = (userId: string | undefined, session: Session | null) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log('==== PROFILE FETCHING STARTED ====');
      console.log('Fetching user profile for:', userId);
      console.log('Session is available:', !!session);
      
      if (!userId || !session) {
        console.log('Missing userId or session, skipping fetch');
        setLoading(false);
        return;
      }

      try {
        // First, try to get user profile from 'users' table
        console.log('Attempting to fetch from users table');
        let { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        
        console.log('Users query result:', { 
          profileData: profileData ? 'Data exists' : 'No data', 
          profileError: profileError ? profileError.message : 'No error'
        });

        if (profileError || !profileData) {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (fallbackError && fallbackError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
            console.error('Error fetching from profiles table:', fallbackError);
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
            
          
          } else {
        
            
            // Attempt to create a new profile 
          
            try {
              const newProfileData = {
                id: userId,
                name: session.user?.user_metadata?.name || session.user?.email?.split('@')[0] || 'User',
                email: session.user?.email || '',
                wallet_balance: 0,
                favorite_experts: [],
                favorite_programs: [],
                referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
              };
              
              const { data: insertData, error: insertError } = await supabase
                .from('users')
                .insert([newProfileData])
                .select();
                
              if (insertError) {
                console.error('Error creating new profile:', insertError);
              } else {
               
                profileData = insertData[0];
              }
            } catch (createError) {
              console.error('Exception during profile creation:', createError);
            }
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
            referred_by: rawProfileData.referred_by || null,
            referral_code: rawProfileData.referral_code || '',
            referral_link: rawProfileData.referral_link || '',
            date_of_birth: rawProfileData.date_of_birth || null,
            gender: rawProfileData.gender || null,
            occupation: rawProfileData.occupation || null,
            preferences: rawProfileData.preferences || {},
            terms_accepted: rawProfileData.terms_accepted || false,
            privacy_accepted: rawProfileData.privacy_accepted || false,
            marketing_consent: rawProfileData.marketing_consent || false,
            
            // Convert any numeric favorite_programs to strings for consistency
            favorite_experts: (rawProfileData.favorite_experts || []) as string[],
            favorite_programs: (rawProfileData.favorite_programs || []).map((id: number | string) => String(id)),
            enrolled_courses: (rawProfileData.enrolled_courses || []) as Course[],
            transactions: (rawProfileData.transactions || []) as UserTransaction[],
            reviews: (rawProfileData.reviews || []) as Review[],
            reports: (rawProfileData.reports || []) as Report[],
            referrals: (rawProfileData.referrals || []) as any[],
            recent_activities: (rawProfileData.recent_activities || []) as any[],
            upcoming_appointments: (rawProfileData.upcoming_appointments || []) as any[]
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
