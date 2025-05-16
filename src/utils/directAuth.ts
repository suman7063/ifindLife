
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { PendingAction } from '@/hooks/useAuthJourneyPreservation';

/**
 * Direct user login function that handles authentication and redirection
 */
export async function directUserLogin(email: string, password: string): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    console.log('Attempting direct user login for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email, 
      password
    });
    
    if (error) {
      console.error('Direct login error:', error);
      return { success: false, error };
    }
    
    if (!data.session) {
      console.error('No session returned from Supabase');
      return { success: false, error: { message: 'Authentication failed. Please try again.' } };
    }
    
    console.log('Login successful, session established');
    
    // Store session type for role determination
    localStorage.setItem('sessionType', 'user');
    
    // Success - redirection will be handled by the component
    return { success: true, data };
  } catch (err) {
    console.error('Exception during direct login:', err);
    return { success: false, error: err };
  }
}

/**
 * Checks current authentication status
 */
export async function checkAuthStatus() {
  try {
    const { data } = await supabase.auth.getSession();
    return {
      isAuthenticated: !!data.session,
      session: data.session,
      user: data.session?.user
    };
  } catch (err) {
    console.error('Auth check error:', err);
    return {
      isAuthenticated: false,
      session: null,
      user: null
    };
  }
}

/**
 * Gets the appropriate redirect URL based on session type and pending actions
 */
export function getRedirectPath(): string {
  // Check for pending actions
  const pendingActionStr = sessionStorage.getItem('pendingAction');
  if (pendingActionStr) {
    try {
      const pendingAction = JSON.parse(pendingActionStr) as PendingAction;
      sessionStorage.removeItem('pendingAction');
      
      if (pendingAction.type === 'book' && pendingAction.id) {
        return `/experts/${pendingAction.id}?book=true`;
      }
      
      if (pendingAction.type === 'call' && pendingAction.id) {
        return `/experts/${pendingAction.id}?call=true`;
      }
      
      if (pendingAction.path) {
        return pendingAction.path;
      }
    } catch (error) {
      console.error('Error handling pending action:', error);
    }
  }
  
  // Default redirects based on role
  const sessionType = localStorage.getItem('sessionType') || 'user';
  
  if (sessionType === 'expert') {
    return '/expert-dashboard';
  } else if (sessionType === 'admin') {
    return '/admin';
  } else {
    return '/user-dashboard';
  }
}
