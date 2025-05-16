
/**
 * Gets the initials from a name string
 * @param name The name to get initials from
 * @returns The initials (up to 2 characters)
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return 'U';
  
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
