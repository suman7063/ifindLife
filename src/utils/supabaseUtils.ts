
/**
 * Utilities for working with Supabase data and handling type conversions
 */

/**
 * Safely transform data from Supabase query results to expected types
 * @param data The data returned from a Supabase query
 * @param transformer A function to transform each item in the data array
 * @returns An array of transformed items or an empty array if data is null/undefined
 */
export function safeDataTransform<T, R>(data: T[] | null | undefined, transformer: (item: T) => R): R[] {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  return data.map(item => transformer(item));
}

/**
 * Safely handle a single record from Supabase query results
 * @param data The data returned from a Supabase query
 * @param transformer A function to transform the item
 * @returns The transformed item or null if data is null/undefined
 */
export function safeSingleRecord<T, R>(data: T | null | undefined, transformer: (item: T) => R): R | null {
  if (!data) {
    return null;
  }
  
  return transformer(data);
}

/**
 * Convert a Supabase database record to a specific type
 * This uses type assertion to bypass TypeScript errors from Supabase query results
 * @param record The database record from Supabase
 * @returns The same record but with the specific type
 */
export function dbTypeConverter<T extends Record<string, any>>(record: any): T {
  return record as unknown as T;
}
