
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
    
    // Force redirect with a slight delay to ensure session is fully established
    setTimeout(() => {
      // Check for pending actions first
      const pendingActionStr = sessionStorage.getItem('pendingAction');
      if (pendingActionStr) {
        try {
          const pendingAction = JSON.parse(pendingActionStr);
          sessionStorage.removeItem('pendingAction');
          
          if (pendingAction.type === 'book' && pendingAction.id) {
            console.log('Force redirecting to booking page:', pendingAction.id);
            window.location.href = `/experts/${pendingAction.id}?book=true`;
            return;
          }
          
          if (pendingAction.type === 'call' && pendingAction.id) {
            console.log('Force redirecting to call page:', pendingAction.id);
            window.location.href = `/experts/${pendingAction.id}?call=true`;
            return;
          }
          
          if (pendingAction.path) {
            console.log('Force redirecting to path:', pendingAction.path);
            window.location.href = pendingAction.path;
            return;
          }
        } catch (error) {
          console.error('Error handling pending action, redirecting to dashboard:', error);
        }
      }
      
      // Default redirect to user dashboard
      console.log('Force redirecting to user dashboard');
      window.location.href = '/user-dashboard';
    }, 100);
    
    return { success: true, data };
  } catch (err) {
    console.error('Exception during direct login:', err);
    return { success: false, error: err };
  }
}

export function redirectAfterLogin(role?: string) {
  console.log('Redirecting after login, role:', role);
  
  // Check for pending actions that need to be handled
  const pendingActionStr = sessionStorage.getItem('pendingAction');
  
  if (pendingActionStr) {
    try {
      const pendingAction = JSON.parse(pendingActionStr);
      sessionStorage.removeItem('pendingAction');
      
      if (pendingAction.type === 'book' && pendingAction.id) {
        console.log('Redirecting to booking page with expert ID:', pendingAction.id);
        window.location.href = `/experts/${pendingAction.id}?book=true`;
        return;
      }
      
      if (pendingAction.type === 'call' && pendingAction.id) {
        console.log('Redirecting to call page with expert ID:', pendingAction.id);
        window.location.href = `/experts/${pendingAction.id}?call=true`;
        return;
      }
      
      if (pendingAction.path) {
        console.log('Redirecting to pending action path:', pendingAction.path);
        window.location.href = pendingAction.path;
        return;
      }
    } catch (error) {
      console.error('Error handling pending action:', error);
    }
  }
  
  // Default redirects based on role - FIXED PATHS TO MATCH ROUTE CONFIGURATION
  console.log('No pending actions, using default redirect for role:', role);
  if (role === 'expert') {
    // Using direct URL assignment for more reliable redirect
    window.location.href = '/expert-dashboard';
  } else if (role === 'admin') {
    // Using direct URL assignment for more reliable redirect
    window.location.href = '/admin';
  } else {
    // Using direct URL assignment for more reliable redirect
    window.location.href = '/user-dashboard';
  }
}

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
