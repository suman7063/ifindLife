
import { Expert } from '@/types/supabase';

/**
 * Normalizes expert data from various formats into a consistent shape
 * for the expert detail page.
 */
export const normalizeExpertForDetail = (expert: any): Expert => {
  // Ensure we have the standard properties in both camelCase and snake_case
  return {
    ...expert,
    // Ensure these properties exist for the UI components
    average_rating: expert.average_rating || 0,
    reviews_count: expert.reviews_count || 0,
    selected_services: expert.selected_services || [],
    certificate_urls: expert.certificate_urls || [],
    profile_picture: expert.profile_picture || '/placeholder.svg',
    
    // Add camelCase versions if they don't exist
    averageRating: expert.averageRating || expert.average_rating || 0,
    reviewsCount: expert.reviewsCount || expert.reviews_count || 0,
    selectedServices: expert.selectedServices || expert.selected_services || [],
    certificateUrls: expert.certificateUrls || expert.certificate_urls || [],
    profilePicture: expert.profilePicture || expert.profile_picture || '/placeholder.svg',
  };
};

/**
 * Get display ready rating string
 */
export const formatRating = (rating?: number): string => {
  if (!rating) return "No ratings yet";
  return rating.toFixed(1);
};

/**
 * Format price for display
 */
export const formatPrice = (price?: number, currency: string = "USD"): string => {
  if (!price) return "Price unavailable";
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(price);
};
