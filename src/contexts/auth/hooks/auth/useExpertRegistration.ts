
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
      console.log('Starting expert registration for:', email);
      
      // First create the user account with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Expert registration auth error:', error);
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        console.log('Auth user created with ID:', data.user.id);
        
        // Create expert profile with the auth user id
        const expertProfileData: Partial<ExpertProfile> = {
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
          specialties: expertData.specialties || [],
          experience: typeof expertData.experience === 'number' 
            ? String(expertData.experience) 
            : (expertData.experience || ''),
          experience_years: typeof expertData.experience === 'number' 
            ? expertData.experience 
            : (expertData.experience_years || 0),
          bio: expertData.bio || '',
          certificate_urls: expertData.certificate_urls || [],
          certifications: expertData.certifications || [],
          profile_picture: expertData.profile_picture || '',
          selected_services: expertData.selected_services || [],
          hourly_rate: expertData.hourly_rate || 0,
          currency: expertData.currency || 'USD',
          languages: expertData.languages || ['English']
        };

        const { error: profileError } = await supabase
          .from('expert_accounts')
          .insert(expertProfileData);

        if (profileError) {
          console.error('Expert profile creation error:', profileError);
          toast.error(`Failed to create expert profile: ${profileError.message}`);
          return false;
        }

        console.log('Expert profile created successfully');
      }

      localStorage.setItem('sessionType', 'expert');
      toast.success('Expert account created successfully! Your profile is pending approval.');
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
