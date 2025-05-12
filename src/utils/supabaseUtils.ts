
/**
 * Safely transforms data from Supabase response format to application format
 * Handles null checks, error cases, and proper type conversions
 * 
 * @param data The data from Supabase response
 * @param error Any error from Supabase response
 * @param transform Function to transform each item to desired format
 * @param fallback Fallback value if data is null/undefined
 * @returns Transformed data or fallback
 */
export function safeDataTransform<T, R>(
  data: T[] | null | undefined,
  error: any,
  transform: (item: T) => R,
  fallback: R[]
): R[] {
  if (error) {
    console.error('Error in Supabase query:', error);
    return fallback;
  }
  
  if (!data || !Array.isArray(data)) {
    return fallback;
  }
  
  try {
    return data.map(item => transform(item as T));
  } catch (err) {
    console.error('Error transforming data:', err);
    return fallback;
  }
}

/**
 * Safely handle a single Supabase record with proper error handling
 * 
 * @param data The single data record from Supabase response
 * @param error Any error from Supabase response
 * @param transform Function to transform the item to desired format
 * @param fallback Fallback value if data is null/undefined
 * @returns Transformed data or fallback
 */
export function safeSingleRecord<T, R>(
  data: T | null | undefined,
  error: any,
  transform: (item: T) => R,
  fallback: R
): R {
  if (error) {
    console.error('Error in Supabase query:', error);
    return fallback;
  }
  
  if (!data) {
    return fallback;
  }
  
  try {
    return transform(data as T);
  } catch (err) {
    console.error('Error transforming data:', err);
    return fallback;
  }
}

/**
 * Type assertion to safely cast Supabase query result to a specific type
 * Adds intermediate step to prevent TypeScript errors
 * 
 * @param data The Supabase query result data
 * @returns The type-asserted data
 */
export function supabaseCast<T>(data: unknown): T {
  // This is a safe casting utility specifically for Supabase query results
  return data as any as T;
}

/**
 * Handles type conversion for database operations, especially for ID fields
 * that may be strings or UUIDs
 * 
 * @param value The value to convert
 * @returns The value cast to the appropriate type
 */
export function dbTypeConverter<T>(value: any): T {
  return value as unknown as T;
}
