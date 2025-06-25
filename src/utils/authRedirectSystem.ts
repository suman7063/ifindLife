
import { toast } from 'sonner';

export interface AuthRedirectData {
  returnTo: string;
  action?: 'favorite' | 'connect' | 'book' | 'enroll' | 'purchase' | 'call' | 'navigate';
  params?: Record<string, any>;
  timestamp: number;
  expertId?: string; // Changed from number to string
  expertName?: string;
  callType?: 'video' | 'voice';
  message?: string;
}

const AUTH_REDIRECT_KEY = 'authRedirect';
const REDIRECT_EXPIRY = 30 * 60 * 1000; // 30 minutes

export class AuthRedirectSystem {
  /**
   * Store the intended action before redirecting to login
   */
  static setRedirect(data: Omit<AuthRedirectData, 'timestamp'>): void {
    const redirectData: AuthRedirectData = {
      ...data,
      timestamp: Date.now()
    };
    
    console.log('AuthRedirectSystem: Storing redirect data:', redirectData);
    sessionStorage.setItem(AUTH_REDIRECT_KEY, JSON.stringify(redirectData));
  }

  /**
   * Get stored redirect data and validate it hasn't expired
   */
  static getRedirect(): AuthRedirectData | null {
    try {
      const stored = sessionStorage.getItem(AUTH_REDIRECT_KEY);
      if (!stored) return null;

      const data: AuthRedirectData = JSON.parse(stored);
      
      // Check if redirect has expired
      if (Date.now() - data.timestamp > REDIRECT_EXPIRY) {
        console.log('AuthRedirectSystem: Redirect data expired, clearing');
        this.clearRedirect();
        return null;
      }

      return data;
    } catch (error) {
      console.error('AuthRedirectSystem: Error parsing redirect data:', error);
      this.clearRedirect();
      return null;
    }
  }

  /**
   * Clear stored redirect data
   */
  static clearRedirect(): void {
    sessionStorage.removeItem(AUTH_REDIRECT_KEY);
  }

  /**
   * Handle post-login redirect and action execution
   */
  static async executeRedirect(): Promise<boolean> {
    const redirectData = this.getRedirect();
    
    if (!redirectData) {
      console.log('AuthRedirectSystem: No redirect data found');
      return false;
    }

    console.log('AuthRedirectSystem: Executing redirect:', redirectData);
    
    // Clear the redirect data first to prevent loops
    this.clearRedirect();

    // Show user feedback about what's happening
    if (redirectData.message) {
      toast.info(redirectData.message);
    } else {
      toast.info(`Returning you to complete your ${redirectData.action || 'action'}...`);
    }

    // Navigate to the intended location
    window.location.href = redirectData.returnTo;
    
    // Store action to be executed after navigation
    if (redirectData.action && redirectData.params) {
      sessionStorage.setItem('pendingAction', JSON.stringify({
        action: redirectData.action,
        params: redirectData.params,
        timestamp: Date.now()
      }));
    }

    return true;
  }

  /**
   * Convenience method for expert-related actions - updated to accept string IDs
   */
  static setExpertAction(
    expertId: string,
    expertName: string,
    action: 'favorite' | 'connect' | 'book' | 'call',
    additionalParams?: Record<string, any>
  ): void {
    const currentPath = window.location.pathname + window.location.search;
    
    this.setRedirect({
      returnTo: currentPath,
      action,
      params: {
        expertId,
        expertName,
        ...additionalParams
      },
      expertId,
      expertName,
      message: `Please login to ${action} ${expertName}`
    });
  }

  /**
   * Convenience method for call actions - updated to accept string IDs
   */
  static setCallAction(
    expertId: string,
    expertName: string,
    callType: 'video' | 'voice'
  ): void {
    const currentPath = window.location.pathname + window.location.search;
    
    this.setRedirect({
      returnTo: currentPath,
      action: 'call',
      params: {
        expertId,
        expertName,
        callType
      },
      expertId,
      expertName,
      callType,
      message: `Please login to start ${callType} call with ${expertName}`
    });
  }

  /**
   * Get pending action after page navigation
   */
  static getPendingAction(): any {
    try {
      const pending = sessionStorage.getItem('pendingAction');
      if (!pending) return null;

      const data = JSON.parse(pending);
      
      // Check if action hasn't expired (5 minutes)
      if (Date.now() - data.timestamp > 5 * 60 * 1000) {
        sessionStorage.removeItem('pendingAction');
        return null;
      }

      // Clear immediately after reading
      sessionStorage.removeItem('pendingAction');
      return data;
    } catch (error) {
      console.error('AuthRedirectSystem: Error parsing pending action:', error);
      sessionStorage.removeItem('pendingAction');
      return null;
    }
  }
}

export default AuthRedirectSystem;
