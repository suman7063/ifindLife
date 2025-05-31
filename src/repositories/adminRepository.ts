
import { supabase } from '@/lib/supabase';
import { AdminProfile } from '@/types/database/unified';

export const adminRepository = {
  async getAdminByAuthId(authId: string): Promise<AdminProfile | null> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', authId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching admin by auth ID:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        auth_id: data.id,
        email: '', // Admin email would come from auth.users
        role: data.role,
        created_at: data.created_at
      };
    } catch (error) {
      console.error('Error in getAdminByAuthId:', error);
      return null;
    }
  },

  async updateAdmin(adminId: string, updates: Partial<AdminProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({
          role: updates.role,
        })
        .eq('id', adminId);

      if (error) {
        console.error('Error updating admin:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateAdmin:', error);
      return false;
    }
  }
};
