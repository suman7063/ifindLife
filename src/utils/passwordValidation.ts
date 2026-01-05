import { z } from 'zod';

/**
 * Common password validation schema for Zod
 * Requires: minimum 8 characters, at least one letter, one number, and one special character
 */
export const passwordSchema = z.string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .refine(val => /[A-Za-z]/.test(val), { message: 'Password must contain at least one letter' })
  .refine(val => /[0-9]/.test(val), { message: 'Password must contain at least one number' })
  .refine(val => /[^A-Za-z0-9]/.test(val), { message: 'Password must contain at least one special character' });

/**
 * Validates password strength and returns score and feedback
 * Uses the same validation rules as passwordSchema for consistency
 */
export const validatePasswordStrength = (password: string) => {
  if (!password) {
    return {
      score: 0,
      feedback: "Password is required",
      isValid: false
    };
  }

  let score = 0;
  const feedback: string[] = [];
  
  // Length check (matches passwordSchema)
  if (password.length < 8) {
    feedback.push("Password should be at least 8 characters long");
  } else {
    score += 1;
  }
  
  // Contains letter (matches passwordSchema - any letter, uppercase or lowercase)
  if (!/[A-Za-z]/.test(password)) {
    feedback.push("Password should contain at least one letter");
  } else {
    score += 1;
  }
  
  // Contains number (matches passwordSchema)
  if (!/[0-9]/.test(password)) {
    feedback.push("Password should contain at least one number");
  } else {
    score += 1;
  }
  
  // Contains special character (matches passwordSchema)
  if (!/[^A-Za-z0-9]/.test(password)) {
    feedback.push("Password should contain at least one special character");
  } else {
    score += 1;
  }
  
  return {
    score: score,
    feedback: feedback.join(", ") || "Password is strong",
    isValid: score >= 4 // All 4 requirements must be met
  };
};
