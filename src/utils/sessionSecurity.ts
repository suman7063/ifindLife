import { supabase } from '@/lib/supabase';
import { secureStorage } from './secureStorage';
import { secureLogger } from './secureLogger';

/**
 * Enhanced session security utilities
 */

export interface SessionSecurityConfig {
  maxIdleTime: number; // in milliseconds
  maxSessionDuration: number; // in milliseconds
  checkInterval: number; // in milliseconds
}

const DEFAULT_CONFIG: SessionSecurityConfig = {
  maxIdleTime: 30 * 60 * 1000, // 30 minutes
  maxSessionDuration: 8 * 60 * 60 * 1000, // 8 hours
  checkInterval: 5 * 60 * 1000, // 5 minutes
};

class SessionSecurityManager {
  private lastActivity: number = Date.now();
  private sessionStart: number = Date.now();
  private config: SessionSecurityConfig;
  private intervalId: NodeJS.Timeout | null = null;
  private activityEvents: string[] = [
    'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'
  ];

  constructor(config: Partial<SessionSecurityConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initializeActivityTracking();
    this.startSecurityCheck();
  }

  private initializeActivityTracking(): void {
    this.activityEvents.forEach(event => {
      document.addEventListener(event, this.updateActivity.bind(this), { passive: true });
    });
  }

  private updateActivity(): void {
    this.lastActivity = Date.now();
  }

  private async checkSessionSecurity(): Promise<void> {
    const now = Date.now();
    
    // Check if session has been idle too long
    if (now - this.lastActivity > this.config.maxIdleTime) {
      await this.handleSessionTimeout('idle');
      return;
    }
    
    // Check if session has exceeded maximum duration
    if (now - this.sessionStart > this.config.maxSessionDuration) {
      await this.handleSessionTimeout('duration');
      return;
    }
    
    // Verify session is still valid with Supabase
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        await this.handleSessionTimeout('invalid');
      }
    } catch (error) {
      secureLogger.error('Session security check failed:', error);
      await this.handleSessionTimeout('error');
    }
  }

  private async handleSessionTimeout(reason: 'idle' | 'duration' | 'invalid' | 'error'): Promise<void> {
    this.cleanup();
    
    // Clear secure storage
    secureStorage.clearSecureStorage();
    localStorage.removeItem('sessionType');
    sessionStorage.clear();
    
    // Sign out from Supabase
    try {
      await supabase.auth.signOut();
    } catch (error) {
      secureLogger.error('Error during forced logout:', error);
    }
    
    // Redirect to login with reason
    const redirectUrl = new URL('/login', window.location.origin);
    redirectUrl.searchParams.set('reason', reason);
    window.location.href = redirectUrl.toString();
  }

  private startSecurityCheck(): void {
    this.intervalId = setInterval(() => {
      this.checkSessionSecurity();
    }, this.config.checkInterval);
  }

  public refreshSession(): void {
    this.sessionStart = Date.now();
    this.lastActivity = Date.now();
  }

  public cleanup(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.activityEvents.forEach(event => {
      document.removeEventListener(event, this.updateActivity.bind(this));
    });
  }

  public getSessionInfo(): { 
    idleTime: number; 
    sessionDuration: number; 
    timeUntilIdleTimeout: number;
    timeUntilSessionTimeout: number;
  } {
    const now = Date.now();
    return {
      idleTime: now - this.lastActivity,
      sessionDuration: now - this.sessionStart,
      timeUntilIdleTimeout: Math.max(0, this.config.maxIdleTime - (now - this.lastActivity)),
      timeUntilSessionTimeout: Math.max(0, this.config.maxSessionDuration - (now - this.sessionStart))
    };
  }
}

export const sessionSecurity = new SessionSecurityManager();

/**
 * Hook to use session security in React components
 */
export const useSessionSecurity = (config?: Partial<SessionSecurityConfig>) => {
  return new SessionSecurityManager(config);
};