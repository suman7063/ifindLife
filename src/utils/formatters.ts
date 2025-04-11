
// Utility functions for formatting data

/**
 * Format a date string to a more readable format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a currency value
 */
export const formatCurrency = (
  amount: number | undefined, 
  currency: string = 'USD'
): string => {
  if (amount === undefined) return '$0.00';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  });
  
  return formatter.format(amount);
};

/**
 * Format a time string (HH:MM) to a more readable format
 */
export const formatTime = (timeString: string): string => {
  if (!timeString) return 'N/A';
  
  // Check if the timeString is in HH:MM format
  const match = timeString.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!match) return timeString;
  
  const hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  
  return `${hour12}:${minutes} ${period}`;
};
