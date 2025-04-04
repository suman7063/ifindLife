
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const runMigrations = async () => {
  try {
    // Start running migrations
    toast.info('Starting data migration to Supabase...');
    
    // Example migration
    const result = await migrateLocalStorage();
    
    if (result) {
      toast.success('Data successfully migrated to Supabase!');
      return true;
    } else {
      toast.error('Migration failed. See console for details.');
      return false;
    }
  } catch (error) {
    console.error('Error during migration:', error);
    toast.error('Migration failed with error. See console for details.');
    return false;
  }
};

// Example migration function
const migrateLocalStorage = async () => {
  try {
    // Get data from localStorage
    const programsData = localStorage.getItem('ifindlife-programs');
    
    if (!programsData) {
      console.log('No programs data found in localStorage');
      return true;
    }
    
    // Parse the data
    const programs = JSON.parse(programsData);
    
    // Check if we already have data in Supabase
    const { data: existingPrograms } = await supabase
      .from('programs')
      .select('id')
      .limit(1);
      
    if (existingPrograms && existingPrograms.length > 0) {
      console.log('Programs already exist in Supabase, skipping migration');
      return true;
    }
    
    // Insert the data into Supabase
    const { error } = await supabase
      .from('programs')
      .insert(programs);
      
    if (error) {
      console.error('Error migrating programs:', error);
      return false;
    }
    
    console.log('Programs successfully migrated to Supabase');
    return true;
  } catch (error) {
    console.error('Error in migrateLocalStorage:', error);
    return false;
  }
};
