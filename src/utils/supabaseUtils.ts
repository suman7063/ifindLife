
/**
 * Utility functions for working with Supabase data
 */

/**
 * Normalize ID to string format for consistent database operations
 * @param id ID that could be string or number
 * @returns String representation of the ID
 */
export function normalizeId(id: string | number | undefined): string {
  if (id === undefined) return '';
  return String(id);
}

/**
 * Safely convert snake_case property names to camelCase
 * Used to maintain consistent property access across the application
 * @param snakeCase Snake case string (e.g., "first_name")
 * @returns Camel case string (e.g., "firstName")
 */
export function snakeToCamel(snakeCase: string): string {
  return snakeCase.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * Convert an object with snake_case keys to camelCase keys
 * @param obj Object with snake_case keys
 * @returns Object with camelCase keys
 */
export function convertToCamelCase<T>(obj: Record<string, any>): T {
  if (!obj) return {} as T;
  
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    const camelKey = snakeToCamel(key);
    result[camelKey] = obj[key];
  });
  
  return result as T;
}
