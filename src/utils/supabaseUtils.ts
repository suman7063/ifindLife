
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Type guard to check if the data is valid and not an error
 */
export function isValidData<T>(data: T | unknown): data is T {
  if (data === null || data === undefined) return false;
  if (typeof data === 'object' && 'code' in (data as any)) return false;
  return true;
}

/**
 * Safely transform Supabase data with proper error handling
 */
export function safeDataTransform<T, R>(
  data: T[] | null | undefined, 
  error: PostgrestError | null,
  transform: (item: T) => R,
  fallback: R[] = []
): R[] {
  if (error || !data || !Array.isArray(data)) {
    console.error("Supabase query error:", error || "No data returned");
    return fallback;
  }
  
  try {
    return data.map(transform);
  } catch (err) {
    console.error("Error transforming data:", err);
    return fallback;
  }
}

/**
 * Safely handle single Supabase record with proper error handling
 */
export function safeSingleRecord<T, R>(
  data: T | null | undefined,
  error: PostgrestError | null,
  transform: (item: T) => R,
  fallback: R
): R {
  if (error || !data) {
    console.error("Supabase query error:", error || "No data returned");
    return fallback;
  }
  
  try {
    return transform(data);
  } catch (err) {
    console.error("Error transforming data:", err);
    return fallback;
  }
}
