
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

/**
 * Safely transform database data to application format
 * @param data Data from database
 * @param transform Optional transform function to apply
 * @returns Transformed data or empty array if null
 */
export function safeDataTransform<T, R = T>(
  data: T[] | null, 
  transform?: (item: T) => R
): R[] {
  if (!data) return [];
  if (!transform) return data as unknown as R[];
  return data.map(transform);
}

/**
 * Safely handle a single record from database
 * @param data Data from database query
 * @param fallback Optional fallback value if data is null
 * @returns The data or fallback value
 */
export function safeSingleRecord<T>(data: T | null, fallback: T | null = null): T | null {
  return data || fallback;
}

/**
 * Convert database types to appropriate JavaScript types
 * @param data Data from database
 * @returns Data with appropriate JavaScript types
 */
export function dbTypeConverter<T>(data: any): T {
  if (!data) return {} as T;
  
  // Convert specific types as needed
  // This is a basic implementation, extend as required
  return data as T;
}
