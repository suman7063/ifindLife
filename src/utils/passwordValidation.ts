
/**
 * Common weak passwords to check against
 */
const weakPasswords = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890'
];

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
  
  // Check against common weak passwords
  if (weakPasswords.includes(password.toLowerCase())) {
    return {
      score: 0,
      feedback: "Password is too common. Please choose a different password.",
      isValid: false
    };
  }
  
  // Length check (increased minimum)
  if (password.length < 12) {
    feedback.push("Password should be at least 12 characters long");
  } else if (password.length >= 12) {
    score += 1;
    if (password.length >= 16) {
      score += 1; // Bonus for longer passwords
    }
  }
  
  // Contains uppercase letter
  if (!/[A-Z]/.test(password)) {
    feedback.push("Password should contain at least one uppercase letter");
  } else {
    score += 1;
  }
  
  // Contains lowercase letter
  if (!/[a-z]/.test(password)) {
    feedback.push("Password should contain at least one lowercase letter");
  } else {
    score += 1;
  }
  
  // Contains number
  if (!/[0-9]/.test(password)) {
    feedback.push("Password should contain at least one number");
  } else {
    score += 1;
  }
  
  // Contains special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push("Password should contain at least one special character");
  } else {
    score += 1;
  }
  
  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    feedback.push("Avoid repeating the same character multiple times");
    score = Math.max(0, score - 1);
  }
  
  // Check for sequential characters
  if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)) {
    feedback.push("Avoid sequential characters or numbers");
    score = Math.max(0, score - 1);
  }
  
  return {
    score: Math.min(score, 5), // Cap at 5
    feedback: feedback.join(", ") || "Password is strong",
    isValid: score >= 4 // Increased requirement
  };
};
