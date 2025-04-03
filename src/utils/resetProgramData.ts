
import { supabase } from '@/lib/supabase';
import { addSamplePrograms } from './sampleProgramsData';

/**
 * Resets all program data by deleting existing programs and re-adding sample data
 */
export const resetProgramData = async (): Promise<boolean> => {
  try {
    console.log('Starting program data reset...');
    
    // Delete all existing programs
    const { error: deleteError } = await supabase
      .from('programs')
      .delete()
      .neq('id', 0); // Delete all records
      
    if (deleteError) {
      console.error('Error deleting programs:', deleteError);
      return false;
    }
    
    console.log('All existing programs deleted successfully');
    
    // Re-add sample programs for each type
    const addedWellness = await addSamplePrograms('wellness');
    const addedAcademic = await addSamplePrograms('academic');
    const addedBusiness = await addSamplePrograms('business');
    
    console.log('Program data reset completed successfully');
    console.log('Added wellness programs:', addedWellness);
    console.log('Added academic programs:', addedAcademic);
    console.log('Added business programs:', addedBusiness);
    
    return true;
  } catch (error) {
    console.error('Error resetting program data:', error);
    return false;
  }
};
