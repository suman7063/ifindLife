
/**
 * Utility functions for handling ID conversions between string and number types
 */

/**
 * Ensures that an ID is always returned as a string
 * @param id ID that could be either a string or number
 * @returns String representation of the ID
 */
export function ensureStringId(id: string | number | undefined | null): string {
  if (id === undefined || id === null) {
    return '';
  }
  return String(id);
}

/**
 * Ensures that an ID is always returned as a number
 * @param id ID that could be either a string or number
 * @returns Number representation of the ID
 */
export function ensureNumberId(id: string | number | undefined | null): number {
  if (id === undefined || id === null) {
    return 0;
  }
  if (typeof id === 'string') {
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return id;
}

/**
 * Ensures that an array of IDs is always returned as strings
 * @param ids Array of IDs that could be either strings or numbers
 * @returns Array of string IDs
 */
export function ensureStringIdArray(ids: (string | number)[] | null | undefined): string[] {
  if (!ids) return [];
  return ids.map(id => String(id));
}

/**
 * Ensures that an array of IDs is always returned as numbers
 * @param ids Array of IDs that could be either strings or numbers
 * @returns Array of number IDs
 */
export function ensureNumberIdArray(ids: (string | number)[] | null | undefined): number[] {
  if (!ids) return [];
  return ids.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
}

// Alternative names if needed elsewhere
export const toStringId = ensureStringId;
export const toNumberId = ensureNumberId;
