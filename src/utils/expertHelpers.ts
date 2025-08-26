/**
 * Helper utilities for expert-related operations
 */

import { ExpertProfile } from '@/types/supabase/expert';

/**
 * Get the standardized expert ID for presence operations
 * Always prefers auth_id over id for consistency
 */
export const getExpertPresenceKey = (expert: ExpertProfile | any): string => {
  if (!expert) return '';
  
  // Always prefer auth_id for presence operations
  return expert.auth_id || expert.id || '';
};

/**
 * Check if an expert has a valid presence key
 */
export const hasValidPresenceKey = (expert: ExpertProfile | any): boolean => {
  const key = getExpertPresenceKey(expert);
  return key.length > 0;
};