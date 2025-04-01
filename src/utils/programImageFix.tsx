
import { supabase } from '@/lib/supabase';

/**
 * This utility function fixes broken image URLs in the programs database
 * It specifically targets the Trauma Recovery and Depression Recovery programs
 */
export const fixProgramImages = async () => {
  try {
    // Fix Trauma Recovery program image
    await supabase
      .from('programs')
      .update({ 
        image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' 
      })
      .eq('title', 'Trauma Recovery & Growth');
      
    // Fix Depression Recovery program image
    await supabase
      .from('programs')
      .update({ 
        image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' 
      })
      .eq('title', 'Depression Recovery Path');
      
    console.log('Program images fixed successfully');
    return true;
  } catch (error) {
    console.error('Error fixing program images:', error);
    return false;
  }
};
