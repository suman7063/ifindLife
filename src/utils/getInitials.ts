
export const getInitials = (name: string): string => {
  if (!name) return 'U';
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
