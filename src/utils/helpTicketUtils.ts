
import { supabase } from '@/lib/supabase';

// Ensure that the help_uploads bucket exists
export const ensureHelpUploadsBucketExists = async () => {
  try {
    // Check if bucket exists
    const { data: buckets, error: bucketError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketError) {
      throw new Error(`Error checking buckets: ${bucketError.message}`);
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'help_uploads');
    
    // Create bucket if it doesn't exist
    if (!bucketExists) {
      const { error: createError } = await supabase
        .storage
        .createBucket('help_uploads', {
          public: false, // Set to private
          fileSizeLimit: 5242880, // 5MB limit
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        });
      
      if (createError) {
        throw new Error(`Error creating help_uploads bucket: ${createError.message}`);
      }
      
      console.log('Created help_uploads bucket');
      
      // Set up RLS policy for the bucket
      // Note: This would typically be done through SQL migrations
    }
    
    return true;
  } catch (error) {
    console.error('Failed to ensure help_uploads bucket exists:', error);
    return false;
  }
};

// Generate a unique ticket ID
export const generateTicketId = () => {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `HELP-${year}-${randomPart}`;
};

// Format help ticket data for display
export const formatHelpTicketDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid date';
  }
};
