
/**
 * Extracts initials from a name string
 * @param name The full name to extract initials from
 * @returns A string containing initials (up to 2 characters)
 */
export function getInitials(name?: string): string {
  if (!name) return '?';
  
  const names = name.trim().split(' ');
  
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}
