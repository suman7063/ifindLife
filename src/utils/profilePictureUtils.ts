import { supabase } from '@/integrations/supabase/client';

/**
 * Converts a profile picture path or URL to a full public URL
 * If it's already a URL, returns it as is
 * If it's a path, converts it to a full URL using Supabase storage
 * 
 * @param profilePicture - Can be a full URL or just a path (e.g., "user-id-profile.jpg" or UUID)
 * @returns Full public URL to the profile picture
 */
export function getProfilePictureUrl(profilePicture: string | null | undefined): string {
  if (!profilePicture || profilePicture.trim() === '') {
    return '';
  }

  // If it's already a full URL (starts with http:// or https://), return as is
  if (profilePicture.startsWith('http://') || profilePicture.startsWith('https://')) {
    return profilePicture;
  }

  // If it's a path (UUID or filename), convert it to a full URL
  // Remove any leading slashes
  const cleanPath = profilePicture.startsWith('/') ? profilePicture.slice(1) : profilePicture;
  
  // Get public URL from Supabase storage
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(cleanPath);

  const publicUrl = data?.publicUrl || '';
  
  // Log for debugging if conversion happens
  if (publicUrl && !profilePicture.startsWith('http')) {
    console.log('🔄 Converted profile picture path to URL:', {
      original: profilePicture,
      converted: publicUrl
    });
  }

  return publicUrl;
}

/**
 * Gets the Supabase project URL for storage
 * This is used as a fallback if getPublicUrl doesn't work
 */
export function getSupabaseStorageUrl(): string {
  // Get from environment or use default pattern
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/avatars`;
  }
  
  // Fallback: try to extract from any existing URL in the codebase
  // This is a common Supabase URL pattern
  return '';
}

