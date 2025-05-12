
/**
 * Utility functions for converting ID types between string and number
 */

/**
 * Ensures an ID is converted to a string
 * @param id - The ID to convert (can be string or number)
 * @returns The ID as a string
 */
export const ensureStringId = (id: string | number | null | undefined): string => {
  if (id === null || id === undefined) {
    return '';
  }
  return String(id);
};

/**
 * Ensures an ID is converted to a number
 * @param id - The ID to convert (can be string or number)
 * @returns The ID as a number, or null if conversion fails
 */
export const ensureNumberId = (id: string | number | null | undefined): number | null => {
  if (id === null || id === undefined || id === '') {
    return null;
  }
  
  const num = Number(id);
  return isNaN(num) ? null : num;
};
