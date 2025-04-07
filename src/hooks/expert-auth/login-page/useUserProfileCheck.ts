
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';

export const useUserProfileCheck = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkUserLogin = async () => {
      setIsCheckingUser(true);
      
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .maybeSingle();
            
          if (profileData && !error) {
            console.log('User profile found during expert login check:', profileData);
            setUserProfile(profileData as UserProfile);
          } else {
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error checking user login:', error);
        setUserProfile(null);
      } finally {
        setIsCheckingUser(false);
      }
    };
    
    checkUserLogin();
  }, []);

  return { userProfile, isCheckingUser };
};
