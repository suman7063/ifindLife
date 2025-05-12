
/**
 * Utility functions for handling Supabase data
 */

/**
 * Normalizes an ID to a string consistently
 * This helps with comparing IDs that might be numbers or strings
 */
export function normalizeId(id: string | number | null | undefined): string {
  if (id === null || id === undefined) {
    return '';
  }
  return String(id);
}

/**
 * Safely converts an ID that might be a string to a number
 * Returns null if conversion is not possible
 */
export function toNumberId(id: string | number | null | undefined): number | null {
  if (id === null || id === undefined || id === '') {
    return null;
  }
  
  const num = Number(id);
  return isNaN(num) ? null : num;
}

/**
 * Map database object keys from snake_case to camelCase
 */
export function snakeToCamel(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    // Convert key from snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = obj[key];
  });
  
  return result;
}

/**
 * Map database object keys from camelCase to snake_case
 */
export function camelToSnake(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    // Convert key from camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, (_, letter) => `_${letter.toLowerCase()}`);
    result[snakeKey] = obj[key];
  });
  
  return result;
}

/**
 * Merges two objects, with the second object's properties taking precedence
 */
export function mergeObjects<T>(obj1: Partial<T>, obj2: Partial<T>): T {
  return { ...obj1, ...obj2 } as T;
}
