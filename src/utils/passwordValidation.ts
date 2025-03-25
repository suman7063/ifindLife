
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
  
  // Length check
  if (password.length < 8) {
    feedback.push("Password should be at least 8 characters long");
  } else {
    score += 1;
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
  if (!/[\W_]/.test(password)) {
    feedback.push("Password should contain at least one special character");
  } else {
    score += 1;
  }
  
  return {
    score: score,
    feedback: feedback.join(", ") || "Password is strong",
    isValid: score >= 3
  };
};
