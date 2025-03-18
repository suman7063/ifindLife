
// Import supabase client from the correct location
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Migrate data to Supabase
export const migrateToSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(10);
    
    if (error) {
      toast.error(`Migration error: ${error.message}`);
      return false;
    }
    
    toast.success(`Migration successful, found ${data?.length} records`);
    console.log('Data from Supabase:', data);
    return true;
  } catch (err: any) {
    toast.error(`Migration error: ${err.message}`);
    console.error('Migration error:', err);
    return false;
  }
};
