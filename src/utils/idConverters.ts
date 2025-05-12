
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

/**
 * Converts a possible array of numbers to an array of strings
 * @param ids - Array of IDs that could be numbers or strings
 * @returns Array of string IDs
 */
export const ensureStringIdArray = (ids: (string | number)[] | null | undefined): string[] => {
  if (!ids || !Array.isArray(ids)) {
    return [];
  }
  return ids.map(id => ensureStringId(id));
};

/**
 * Converts a possible array of strings to an array of numbers
 * @param ids - Array of IDs that could be numbers or strings
 * @returns Array of number IDs, filtering out any that couldn't be converted
 */
export const ensureNumberIdArray = (ids: (string | number)[] | null | undefined): number[] => {
  if (!ids || !Array.isArray(ids)) {
    return [];
  }
  
  return ids
    .map(id => {
      const num = Number(id);
      return isNaN(num) ? null : num;
    })
    .filter((id): id is number => id !== null);
};
