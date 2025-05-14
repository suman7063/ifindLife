
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/types/database/unified';

/**
 * Repository for expert profile data access
 * Follows the repository pattern for consistent data access
 */
export class ExpertRepository {
  /**
   * Get expert profile by ID
   * @param id Expert ID
   * @returns ExpertProfile or null if not found
   */
  async getExpert(id: string): Promise<ExpertProfile | null> {
    if (!id) return null;
    
    try {
      // First try the expert_accounts table (primary source)
      const { data: expertData, error: expertError } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (expertData) return expertData as ExpertProfile;
      
      // Fallback to experts table if not in expert_accounts table
      const { data: legacyExpertData, error: legacyError } = await supabase
        .from('experts')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      return legacyExpertData as ExpertProfile;
    } catch (error) {
      console.error('Error fetching expert:', error);
      return null;
    }
  }
  
  /**
   * Get expert profile by auth ID
   * @param authId User auth ID
   * @returns ExpertProfile or null if not found
   */
  async getExpertByAuthId(authId: string): Promise<ExpertProfile | null> {
    if (!authId) return null;
    
    try {
      const { data: expertData, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', authId)
        .maybeSingle();
        
      return expertData as ExpertProfile;
    } catch (error) {
      console.error('Error fetching expert by auth ID:', error);
      return null;
    }
  }
  
  /**
   * Update expert profile
   * @param id Expert ID
   * @param updates Partial expert profile with updates
   * @returns Success status
   */
  async updateExpert(id: string, updates: Partial<ExpertProfile>): Promise<boolean> {
    if (!id) return false;
    
    try {
      // First check which table has the expert's profile
      const { data: expertData } = await supabase
        .from('expert_accounts')
        .select('id')
        .eq('id', id)
        .maybeSingle();

      const table = expertData ? 'expert_accounts' : 'experts';
      
      // Update the appropriate table
      const { error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id);
        
      return !error;
    } catch (error) {
      console.error('Error updating expert:', error);
      return false;
    }
  }
  
  /**
   * Get expert by email
   * @param email Expert email address
   * @returns ExpertProfile or null if not found
   */
  async getExpertByEmail(email: string): Promise<ExpertProfile | null> {
    if (!email) return null;
    
    try {
      // Check expert_accounts first
      const { data: expertData } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('email', email)
        .maybeSingle();
        
      if (expertData) return expertData as ExpertProfile;
      
      // Fallback to experts table
      const { data: legacyData } = await supabase
        .from('experts')
        .select('*')
        .eq('email', email)
        .maybeSingle();
        
      return legacyData as ExpertProfile;
    } catch (error) {
      console.error('Error fetching expert by email:', error);
      return null;
    }
  }
}

// Export a singleton instance
export const expertRepository = new ExpertRepository();
