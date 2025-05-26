
import { supabase } from '@/lib/supabase';
import { addSamplePrograms } from './sampleProgramsData';

export const resetProgramData = async () => {
  try {
    console.log('Starting program data cleanup...');
    
    // First, remove any Super Human programs that might be incorrectly categorized as business
    const { error: cleanupError } = await supabase
      .from('programs')
      .delete()
      .eq('programType', 'business')
      .eq('category', 'super-human');
    
    if (cleanupError) {
      console.error('Error cleaning up misplaced programs:', cleanupError);
    } else {
      console.log('Cleaned up misplaced Super Human programs from business category');
    }
    
    // Reset and add fresh program data
    console.log('Adding fresh program data...');
    
    await addSamplePrograms('wellness');
    await addSamplePrograms('business');
    await addSamplePrograms('academic');
    
    console.log('Program data reset completed successfully');
    return true;
  } catch (error) {
    console.error('Error resetting program data:', error);
    return false;
  }
};
