/**
 * Client-side rate limiting utilities to prevent abuse
 */

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private blocked: Map<string, number> = new Map();

  /**
   * Check if an action is rate limited
   */
  public isRateLimited(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    
    // Check if currently blocked
    const blockUntil = this.blocked.get(key);
    if (blockUntil && now < blockUntil) {
      return true;
    }
    
    // Clean up old attempts
    const attempts = this.attempts.get(key) || [];
    const validAttempts = attempts.filter(time => now - time < config.windowMs);
    
    // Update attempts list
    this.attempts.set(key, validAttempts);
    
    // Check if limit exceeded
    if (validAttempts.length >= config.maxAttempts) {
      this.blocked.set(key, now + config.blockDurationMs);
      return true;
    }
    
    return false;
  }

  /**
   * Record an attempt
   */
  public recordAttempt(key: string): void {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    attempts.push(now);
    this.attempts.set(key, attempts);
  }

  /**
   * Get remaining time until unblocked
   */
  public getBlockedUntil(key: string): number {
    const blockUntil = this.blocked.get(key);
    if (!blockUntil) return 0;
    
    const now = Date.now();
    return Math.max(0, blockUntil - now);
  }

  /**
   * Clear all attempts for a key
   */
  public clearAttempts(key: string): void {
    this.attempts.delete(key);
    this.blocked.delete(key);
  }

  /**
   * Clean up old entries
   */
  public cleanup(): void {
    const now = Date.now();
    
    // Clean up expired blocks
    for (const [key, blockUntil] of this.blocked.entries()) {
      if (now >= blockUntil) {
        this.blocked.delete(key);
      }
    }
    
    // Clean up old attempts (older than 1 hour)
    const oneHour = 60 * 60 * 1000;
    for (const [key, attempts] of this.attempts.entries()) {
      const validAttempts = attempts.filter(time => now - time < oneHour);
      if (validAttempts.length === 0) {
        this.attempts.delete(key);
      } else {
        this.attempts.set(key, validAttempts);
      }
    }
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

// Common rate limit configurations
export const RATE_LIMITS = {
  LOGIN: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
  },
  PASSWORD_RESET: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 60 * 60 * 1000, // 1 hour
  },
  API_CALLS: {
    maxAttempts: 100,
    windowMs: 60 * 1000, // 1 minute
    blockDurationMs: 5 * 60 * 1000, // 5 minutes
  },
} as const;

// Clean up rate limiter every 30 minutes
setInterval(() => {
  rateLimiter.cleanup();
}, 30 * 60 * 1000);