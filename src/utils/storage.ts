
import { supabase } from '@/lib/supabase';

/**
 * Safely gets a public URL for a file in Supabase Storage
 * 
 * @param bucket - The storage bucket name
 * @param filePath - The path to the file within the bucket
 * @returns The public URL of the file
 */
export const getPublicUrl = (bucket: string, filePath: string): string => {
  // Use the public method to get the URL
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
    
  return data.publicUrl;
};
