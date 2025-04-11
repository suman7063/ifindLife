
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Add the cn utility function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add the formatCurrency utility function
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};
