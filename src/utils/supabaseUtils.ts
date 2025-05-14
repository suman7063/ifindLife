
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
