
/**
 * ID conversion utilities for converting between string and number IDs
 */

/**
 * Ensures an ID is converted to a string format
 */
export function ensureStringId(id: string | number | undefined | null): string {
  if (id === undefined || id === null) {
    return '';
  }
  return String(id);
}

/**
 * Ensures an ID is converted to a number format
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

// Alternative names if needed elsewhere
export const toStringId = ensureStringId;
export const toNumberId = ensureNumberId;
