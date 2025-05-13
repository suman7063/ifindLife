
/**
 * Ensures that the provided ID is a string
 * @param id The ID to convert to a string
 * @returns The ID as a string
 */
export const ensureStringId = (id: string | number): string => {
  return typeof id === 'number' ? id.toString() : id;
};

/**
 * Converts an array of IDs to strings
 * @param ids Array of IDs to convert to strings
 * @returns Array of string IDs
 */
export const ensureStringIdArray = (ids: (string | number)[]): string[] => {
  return ids.map(id => ensureStringId(id));
};
