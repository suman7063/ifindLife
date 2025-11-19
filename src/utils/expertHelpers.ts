/**
 * Helper utilities for expert-related operations
 */

import { ExpertProfile } from '@/types/supabase/expert';

/**
 * Get the standardized expert ID for presence operations
 * Database only has auth_id column, so we use auth_id directly
 */
export const getExpertPresenceKey = (expert: ExpertProfile | any): string => {
  if (!expert) return '';
  
  // Database doesn't have id column - only use auth_id
  return expert.auth_id || '';
};

/**
 * Get expert identifier - always use auth_id since database doesn't have id column
 */
export const getExpertIdentifier = (expert: ExpertProfile | any): string => {
  if (!expert) return '';
  return expert.auth_id || '';
};

/**
 * Check if an expert has a valid presence key
 */
export const hasValidPresenceKey = (expert: ExpertProfile | any): boolean => {
  const key = getExpertPresenceKey(expert);
  return key.length > 0;
};