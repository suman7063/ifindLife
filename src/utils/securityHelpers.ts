// Security helper functions for the application

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential script tags
    .trim()
    .slice(0, 1000); // Limit length
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if user session is valid
 */
export const isSessionValid = (session: any): boolean => {
  if (!session || !session.user) return false;
  
  // Check if session is expired
  const now = Math.floor(Date.now() / 1000);
  return session.expires_at > now;
};

/**
 * Generate secure random string
 */
export const generateSecureId = (): string => {
  return crypto.randomUUID();
};