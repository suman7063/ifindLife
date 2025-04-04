
/**
 * Format a currency value with the appropriate symbol
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  // Get the currency symbol based on the currency code
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    CNY: '¥',
  };

  const symbol = currencySymbols[currency] || currency;
  
  // Format the amount
  try {
    return `${symbol}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${symbol}${amount}`;
  }
};

/**
 * Format a date string to a human-readable format
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a number with commas
 * @param num - The number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  try {
    return num.toLocaleString();
  } catch (error) {
    console.error('Error formatting number:', error);
    return num.toString();
  }
};
