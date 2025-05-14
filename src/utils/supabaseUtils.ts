
/**
 * Normalizes an ID to ensure consistent string format
 * @param id The ID to normalize
 * @returns Normalized string ID
 */
export const normalizeId = (id: string | number): string => {
  return String(id).trim();
};

/**
 * Checks if a value is a valid UUID
 * @param value Value to check
 * @returns Boolean indicating if value is a valid UUID
 */
export const isUUID = (value: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

/**
 * Safely transforms database records with error handling
 * @param data The data to transform
 * @param transform Optional transform function
 * @returns Transformed data or empty array on error
 */
export const safeDataTransform = <T, R = T>(data: T[] | null, transform?: (item: T) => R): R[] => {
  if (!data) return [];
  try {
    return transform ? data.map(transform) : data as unknown as R[];
  } catch (error) {
    console.error('Error transforming data:', error);
    return [];
  }
};

/**
 * Converts database types to appropriate frontend types
 * @param value The value to convert
 * @returns Converted value
 */
export const dbTypeConverter = <T>(value: any): T => {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return value;
  }
  
  // Convert boolean strings to actual booleans
  if (value === 'true') return true as unknown as T;
  if (value === 'false') return false as unknown as T;
  
  // Convert numeric strings to numbers if they look like numbers
  if (typeof value === 'string' && !isNaN(Number(value)) && !isNaN(parseFloat(value))) {
    return Number(value) as unknown as T;
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(item => dbTypeConverter(item)) as unknown as T;
  }
  
  // Handle objects
  if (typeof value === 'object') {
    const result: any = {};
    for (const key in value) {
      result[key] = dbTypeConverter(value[key]);
    }
    return result as T;
  }
  
  return value as T;
};

/**
 * Safely extracts a single record with error handling
 * @param response The response from Supabase
 * @returns Single record or null on error
 */
export const safeSingleRecord = <T>(response: { data: T | null, error: any }): T | null => {
  if (response.error) {
    console.error('Error fetching record:', response.error);
    return null;
  }
  return response.data;
};
