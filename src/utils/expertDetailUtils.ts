
/**
 * Ensures that an expert object has all the properties needed by ExpertDetail
 * This is a temporary solution until we standardize our types
 */
export const normalizeExpertForDetail = (expert: any) => {
  if (!expert) return null;
  
  return {
    ...expert,
    // Ensure all required properties exist with fallbacks
    average_rating: expert.average_rating || expert.rating || 0,
    reviews_count: expert.reviews_count || expert.consultations || 0,
    selected_services: expert.selected_services || [],
    // Add any other properties needed
  };
};
