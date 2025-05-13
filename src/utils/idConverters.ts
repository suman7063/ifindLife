
/**
 * Ensures that an array of IDs is converted to strings
 * This helps with compatibility where IDs might be stored as numbers but need to be strings
 */
export function ensureStringIdArray(ids: any[]): string[] {
  if (!Array.isArray(ids)) {
    return [];
  }
  
  return ids.map(id => String(id));
}

/**
 * Converts a single ID to string format
 * Ensures consistent ID handling throughout the application
 */
export function ensureStringId(id: string | number | null | undefined): string | null {
  if (id === null || id === undefined) {
    return null;
  }
  return String(id);
}
