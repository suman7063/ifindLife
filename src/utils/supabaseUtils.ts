
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
 * Ensures an ID is converted to a string
 * @param id - The ID to convert (can be string or number)
 * @returns The ID as a string
 */
export function ensureStringId(id: string | number | null | undefined): string {
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
 * Safely transforms database records to application types
 * Prevents errors if the data is null or undefined
 */
export function safeDataTransform<T, R>(
  data: T[] | null | undefined,
  transformer: (item: T) => R
): R[] {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  return data
    .filter(item => item !== null && item !== undefined)
    .map(item => transformer(item));
}

/**
 * Safely handles a single record from the database
 * Returns null if the data is missing or invalid
 */
export function safeSingleRecord<T, R>(
  data: T | null | undefined,
  transformer: (item: T) => R
): R | null {
  if (!data) {
    return null;
  }
  
  try {
    return transformer(data);
  } catch (error) {
    console.error('Error transforming single record:', error);
    return null;
  }
}

/**
 * Converts database types to make them consistent for the application
 * Handles null/undefined values and converts string numbers to actual numbers
 */
export function dbTypeConverter<T extends Record<string, any>>(data: Record<string, any>): T {
  if (!data) {
    return {} as T;
  }
  
  const result: Record<string, any> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    // Convert string numbers to actual numbers where appropriate
    if (typeof value === 'string' && !isNaN(Number(value)) && key.endsWith('_id')) {
      result[key] = Number(value);
    } else {
      result[key] = value;
    }
  });
  
  return result as T;
}

/**
 * Validates if data exists and is not null/undefined
 */
export function isValidData<T>(data: T | null | undefined): data is T {
  return data !== null && data !== undefined;
}
