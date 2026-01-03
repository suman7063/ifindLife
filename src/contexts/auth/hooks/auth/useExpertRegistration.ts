
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ExpertProfile } from '@/types/database/unified';

export const useExpertRegistration = (onActionComplete: () => void) => {
  const registerExpert = useCallback(async (
    email: string, 
    password: string, 
    expertData: Partial<ExpertProfile>
  ): Promise<boolean> => {
    try {
      // First create the user account with Supabase Auth (with email verification)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth-callback?type=expert`,
          data: {
            user_type: 'expert',
            name: expertData.name || '',
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        // Convert experience to string if it's a number
        const experience = typeof expertData.experience === 'number' 
          ? String(expertData.experience) 
          : expertData.experience || '';

        // Create expert profile with the auth user id
        const expertProfileData = {
          auth_id: data.user.id,
          email,
          status: 'pending',
          verified: false,
          name: expertData.name || '',
          phone: expertData.phone || '',
          address: expertData.address || '',
          city: expertData.city || '',
          state: expertData.state || '',
          country: expertData.country || '',
          specialization: expertData.specialization || '',
          experience,
          bio: expertData.bio || '',
          profile_picture: expertData.profile_picture || '',
          selected_services: expertData.selected_services || [],
          category: expertData.category || 'listening-expert' // Default category
        };

        const { error: profileError } = await supabase
          .from('expert_accounts')
          .insert(expertProfileData);

        if (profileError) {
          console.error('Expert profile creation error:', profileError);
          toast.error(`Failed to create expert profile: ${profileError.message}`);
          return false;
        }

        // Note: Welcome email will be sent when onboarding is completed, not during registration
      }

      // Important: Sign out immediately after registration since experts need approval
      await supabase.auth.signOut();

      localStorage.setItem('sessionType', 'expert');
      toast.success('Expert account created successfully! Please verify your email, then wait for admin approval before logging in.');
      onActionComplete();
      return true;
    } catch (error) {
      console.error('Expert registration error:', error);
      toast.error('Failed to create expert account. Please try again.');
      return false;
    }
  }, [onActionComplete]);

  return { registerExpert };
};
