/**
 * Secure logging utility that filters sensitive data
 */

// Define sensitive keys that should never be logged
const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'key',
  'auth',
  'session',
  'email',
  'phone',
  'address',
  'ssn',
  'credit',
  'card',
  'cvv',
  'pin',
  'otp',
  'verification',
  'reset'
];

// Check if a string contains sensitive information
const containsSensitiveData = (str: string): boolean => {
  const lowerStr = str.toLowerCase();
  return SENSITIVE_KEYS.some(key => lowerStr.includes(key));
};

// Sanitize object by removing sensitive fields
const sanitizeObject = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    // Don't log strings that might contain sensitive data
    return containsSensitiveData(obj) ? '[REDACTED]' : obj;
  }
  
  if (typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.some(sensitiveKey => key.toLowerCase().includes(sensitiveKey))) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = sanitizeObject(value);
    }
  }
  
  return sanitized;
};

export const secureLogger = {
  log: (...args: any[]) => {
    if (import.meta.env.DEV) {
      const sanitizedArgs = args.map(arg => sanitizeObject(arg));
      console.log(...sanitizedArgs);
    }
  },
  
  error: (...args: any[]) => {
    if (import.meta.env.DEV) {
      const sanitizedArgs = args.map(arg => sanitizeObject(arg));
      console.error(...sanitizedArgs);
    }
  },
  
  warn: (...args: any[]) => {
    if (import.meta.env.DEV) {
      const sanitizedArgs = args.map(arg => sanitizeObject(arg));
      console.warn(...sanitizedArgs);
    }
  },
  
  info: (...args: any[]) => {
    if (import.meta.env.DEV) {
      const sanitizedArgs = args.map(arg => sanitizeObject(arg));
      console.info(...sanitizedArgs);
    }
  },
  
  debug: (...args: any[]) => {
    if (import.meta.env.DEV) {
      const sanitizedArgs = args.map(arg => sanitizeObject(arg));
      console.debug(...sanitizedArgs);
    }
  }
};