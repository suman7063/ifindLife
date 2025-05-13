
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
