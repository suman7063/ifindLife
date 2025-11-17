
/**
 * Format a number as currency
 * Supports INR (₹) and EUR (€) with proper formatting
 */
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  try {
    const currencyUpper = currency.toUpperCase();
    
    // For INR, use Indian locale
    if (currencyUpper === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(amount);
    }
    
    // For EUR, use European locale
    if (currencyUpper === 'EUR') {
      return new Intl.NumberFormat('en-EU', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    }
    
    // Fallback to default formatting
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyUpper,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    // Fallback: use symbol manually
    const symbol = currencyUpper === 'INR' ? '₹' : currencyUpper === 'EUR' ? '€' : currencyUpper;
    return `${symbol}${amount.toFixed(2)}`;
  }
};

/**
 * Format currency with symbol (simpler version)
 */
export const formatCurrencyWithSymbol = (amount: number, currency: string = 'EUR'): string => {
  const currencyUpper = currency.toUpperCase();
  const symbol = currencyUpper === 'INR' ? '₹' : currencyUpper === 'EUR' ? '€' : currencyUpper;
  
  // For INR, don't show decimals if it's a whole number
  if (currencyUpper === 'INR' && amount % 1 === 0) {
    return `${symbol}${amount.toFixed(0)}`;
  }
  
  return `${symbol}${amount.toFixed(2)}`;
};

/**
 * Format a date string
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a time string
 */
export const formatTime = (timeString: string): string => {
  try {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};
