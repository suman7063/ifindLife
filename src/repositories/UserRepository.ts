
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/database/unified';

/**
 * Repository for user profile data access
 * Follows the repository pattern for consistent data access
 */
export class UserRepository {
  /**
   * Get user profile by ID
   * @param id User ID
   * @returns UserProfile or null if not found
   */
  async getUser(id: string): Promise<UserProfile | null> {
    if (!id) return null;
    
    try {
      // First try the users table (primary source)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (userData) return userData as UserProfile;
      
      // Fallback to profiles table if not in users table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      return profileData as UserProfile;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }
  
  /**
   * Update user profile
   * @param id User ID
   * @param updates Partial user profile with updates
   * @returns Success status
   */
  async updateUser(id: string, updates: Partial<UserProfile>): Promise<boolean> {
    if (!id) return false;
    
    try {
      // First check which table has the user's profile
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('id', id)
        .maybeSingle();

      const table = userData ? 'users' : 'profiles';
      
      // Update the appropriate table
      const { error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id);
        
      return !error;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }
  
  /**
   * Get user's wallet balance
   * @param id User ID
   * @returns Current wallet balance or 0
   */
  async getWalletBalance(id: string): Promise<number> {
    if (!id) return 0;
    
    try {
      // Try users table first
      const { data: userData } = await supabase
        .from('users')
        .select('wallet_balance')
        .eq('id', id)
        .maybeSingle();
        
      if (userData && userData.wallet_balance !== undefined) {
        return userData.wallet_balance;
      }
      
      // Fallback to profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', id)
        .maybeSingle();
        
      return profileData?.wallet_balance || 0;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      return 0;
    }
  }
  
  /**
   * Update user's wallet balance
   * @param id User ID
   * @param amount New balance amount
   * @returns Success status
   */
  async updateWalletBalance(id: string, amount: number): Promise<boolean> {
    if (!id) return false;
    
    try {
      // Check which table has the user
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('id', id)
        .maybeSingle();
        
      const table = userData ? 'users' : 'profiles';
      
      // Update the appropriate table
      const { error } = await supabase
        .from(table)
        .update({ wallet_balance: amount })
        .eq('id', id);
        
      return !error;
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const userRepository = new UserRepository();
