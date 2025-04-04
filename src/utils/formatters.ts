
/**
 * Format a number as currency
 * @param amount The amount to format
 * @param currency The currency code (USD, INR, etc)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  // Default to USD if no currency provided
  const currencyCode = currency || 'USD';
  
  // Handle common currencies
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    // Fallback if the currency is not supported
    console.error(`Error formatting currency ${currencyCode}:`, error);
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
};

/**
 * Format a date string to a readable format
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};
