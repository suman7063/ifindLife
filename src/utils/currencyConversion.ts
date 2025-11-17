/**
 * Currency conversion utilities
 * Centralized conversion rates to ensure consistency across the application
 */

// Exchange rate: 1 EUR = 90 INR (approximate, update as needed)
export const EUR_TO_INR_RATE = 90;
export const INR_TO_EUR_RATE = 1 / EUR_TO_INR_RATE;

/**
 * Convert EUR to INR
 */
export const convertEURToINR = (eurAmount: number): number => {
  return Math.round(eurAmount * EUR_TO_INR_RATE);
};

/**
 * Convert INR to EUR
 */
export const convertINRToEUR = (inrAmount: number): number => {
  return Math.round((inrAmount * INR_TO_EUR_RATE) * 100) / 100; // Round to 2 decimal places
};

/**
 * Convert amount from one currency to another
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: 'INR' | 'EUR',
  toCurrency: 'INR' | 'EUR'
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  if (fromCurrency === 'EUR' && toCurrency === 'INR') {
    return convertEURToINR(amount);
  } else if (fromCurrency === 'INR' && toCurrency === 'EUR') {
    return convertINRToEUR(amount);
  }
  
  return amount;
};

