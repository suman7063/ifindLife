
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { adaptUserProfile } from './userProfileAdapter';
import { UserProfile } from '@/types/database/unified';

/**
 * Fetches user profile data from the database
 * Tries both users and profiles tables
 */
export async function fetchUserProfile(
  user: User | { id: string }
): Promise<UserProfile | null> {
  if (!user || !user.id) {
    console.error('Cannot fetch profile: No user ID provided');
    return null;
  }

  try {
    // First try the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    
    if (userData) {
      return adaptUserProfile(userData);
    }
    
    // If not found in users, try the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    
    if (profileData) {
      return adaptUserProfile(profileData);
    }
    
    // No profile found in either table
    console.log('No user profile found for ID:', user.id);
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
