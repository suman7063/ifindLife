
/**
 * Security utilities for authentication system
 */

export interface SecurityConfig {
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordMinLength: number;
  requireSpecialChars: boolean;
}

export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  passwordMinLength: 8,
  requireSpecialChars: true,
};

/**
 * Password strength validation
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
  score: number;
} => {
  const errors: string[] = [];
  let score = 0;

  // Length check
  if (password.length < DEFAULT_SECURITY_CONFIG.passwordMinLength) {
    errors.push(`Password must be at least ${DEFAULT_SECURITY_CONFIG.passwordMinLength} characters long`);
  } else {
    score += 1;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  // Number check
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  // Special character check
  if (DEFAULT_SECURITY_CONFIG.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  }

  return {
    isValid: errors.length === 0,
    errors,
    score: Math.min(score, 5)
  };
};

/**
 * Rate limiting for login attempts
 */
interface LoginAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, LoginAttempt>();

export const checkRateLimit = (identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  lockoutRemaining: number;
} => {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);

  if (!attempt) {
    return {
      allowed: true,
      remainingAttempts: DEFAULT_SECURITY_CONFIG.maxLoginAttempts,
      lockoutRemaining: 0
    };
  }

  // Check if lockout period has expired
  if (attempt.lockedUntil && now > attempt.lockedUntil) {
    loginAttempts.delete(identifier);
    return {
      allowed: true,
      remainingAttempts: DEFAULT_SECURITY_CONFIG.maxLoginAttempts,
      lockoutRemaining: 0
    };
  }

  // Check if currently locked out
  if (attempt.lockedUntil && now <= attempt.lockedUntil) {
    return {
      allowed: false,
      remainingAttempts: 0,
      lockoutRemaining: attempt.lockedUntil - now
    };
  }

  const remainingAttempts = DEFAULT_SECURITY_CONFIG.maxLoginAttempts - attempt.count;
  
  return {
    allowed: remainingAttempts > 0,
    remainingAttempts: Math.max(0, remainingAttempts),
    lockoutRemaining: 0
  };
};

export const recordLoginAttempt = (identifier: string, success: boolean): void => {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);

  if (success) {
    // Clear attempts on successful login
    loginAttempts.delete(identifier);
    return;
  }

  if (!attempt) {
    loginAttempts.set(identifier, {
      count: 1,
      lastAttempt: now
    });
    return;
  }

  const newCount = attempt.count + 1;
  
  if (newCount >= DEFAULT_SECURITY_CONFIG.maxLoginAttempts) {
    // Lock the account
    loginAttempts.set(identifier, {
      count: newCount,
      lastAttempt: now,
      lockedUntil: now + DEFAULT_SECURITY_CONFIG.lockoutDuration
    });
  } else {
    loginAttempts.set(identifier, {
      count: newCount,
      lastAttempt: now
    });
  }
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Generate secure random token
 */
export const generateSecureToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};
