
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useExpertRegistrationStatus = () => {
  const ensureExpertAccountStatus = useCallback(async (expertData: any) => {
    try {
      console.log('useExpertRegistrationStatus: Ensuring expert account has proper status');
      
      // Create expert profile with guaranteed pending status
      const expertProfileData = {
        auth_id: expertData.auth_id,
        email: expertData.email,
        status: 'pending', // Ensure this is always set for admin visibility
        verified: false,
        name: expertData.name || '',
        phone: expertData.phone || '',
        address: expertData.address || '',
        city: expertData.city || '',
        state: expertData.state || '',
        country: expertData.country || '',
        specialization: expertData.specialization || '',
        experience: expertData.experience || '',
        bio: expertData.bio || '',
        profile_picture: expertData.profile_picture || '',
        selected_services: expertData.selected_services || [],
        created_at: new Date().toISOString(),
        average_rating: 0,
        reviews_count: 0
      };

      console.log('useExpertRegistrationStatus: Creating expert account with data:', expertProfileData);

      const { data, error } = await supabase
        .from('expert_accounts')
        .insert(expertProfileData)
        .select()
        .single();

      if (error) {
        console.error('useExpertRegistrationStatus: Expert profile creation error:', error);
        throw error;
      }

      console.log('useExpertRegistrationStatus: Expert account created successfully:', data);
      return data;
    } catch (error) {
      console.error('useExpertRegistrationStatus: Error ensuring expert account status:', error);
      throw error;
    }
  }, []);

  return { ensureExpertAccountStatus };
};
