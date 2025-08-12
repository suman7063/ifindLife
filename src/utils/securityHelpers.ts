// Security helper functions for the application

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/[<>'"&]/g, (match) => {
      const htmlEntities: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return htmlEntities[match] || match;
    })
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
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

/**
 * Validate and sanitize file uploads
 */
export const validateFileUpload = (file: File, allowedTypes: string[], maxSize: number = 5 * 1024 * 1024): { isValid: boolean; error?: string } => {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size exceeds maximum allowed size' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not allowed' };
  }
  
  return { isValid: true };
};

/**
 * Sanitize URL to prevent open redirects
 */
export const sanitizeUrl = (url: string): string | null => {
  if (!url) return null;
  
  try {
    const parsed = new URL(url, window.location.origin);
    
    // Only allow same origin or explicitly allowed domains
    const allowedOrigins = [window.location.origin];
    
    if (!allowedOrigins.includes(parsed.origin)) {
      return null;
    }
    
    return parsed.toString();
  } catch {
    return null;
  }
};