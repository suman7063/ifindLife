import { supabase } from '@/lib/supabase';
import { MessagingUser } from './types';

// Function to get user profile by ID
export async function getUserProfile(userId: string): Promise<MessagingUser | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, profile_picture')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      profile_picture: data.profile_picture,
      type: 'user'
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// Update the function that processes user search results
export async function searchUsers(query: string): Promise<MessagingUser[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  try {
    // Search in experts table
    const { data: experts, error: expertsError } = await supabase
      .from('experts')
      .select('id, name, profile_picture')
      .or(`name.ilike.%${query}%, email.ilike.%${query}%`)
      .limit(5);
      
    if (expertsError) throw expertsError;
    
    // Search in users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, profile_picture')
      .or(`name.ilike.%${query}%, email.ilike.%${query}%`)
      .limit(5);
      
    if (usersError) throw usersError;
    
    // Combine and format results
    const expertsFormatted: MessagingUser[] = experts ? experts.map(e => ({
      id: e.id,
      name: e.name,
      profile_picture: e.profile_picture,
      type: 'expert' as const
    })) : [];
    
    const usersFormatted: MessagingUser[] = users ? users.map(u => ({
      id: u.id,
      name: u.name,
      profile_picture: u.profile_picture,
      type: 'user' as const
    })) : [];
    
    return [...expertsFormatted, ...usersFormatted];
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}
