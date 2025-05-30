
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AuthState {
  user: any;
  admin: any;
  expert: any;
  isLoading: boolean;
  sessionType: 'user' | 'admin' | 'expert' | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (type: string, credentials: any) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const authReducer = (state: AuthState, action: any): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        sessionType: action.payload ? 'user' : null,
        isLoading: false,
        isAuthenticated: !!action.payload
      };
    case 'SET_ADMIN':
      return { 
        ...state, 
        admin: action.payload, 
        sessionType: action.payload ? 'admin' : null,
        isLoading: false,
        isAuthenticated: !!action.payload
      };
    case 'SET_EXPERT':
      return { 
        ...state, 
        expert: action.payload, 
        sessionType: action.payload ? 'expert' : null,
        isLoading: false,
        isAuthenticated: !!action.payload
      };
    case 'LOGOUT':
      return { 
        user: null, 
        admin: null, 
        expert: null, 
        isLoading: false, 
        sessionType: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
};

// Helper functions for auth checking
async function checkUserAuth() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('auth_id', session.user.id)
      .single();
    
    if (profile) {
      return { ...session.user, profile };
    }
    return null;
  } catch (error) {
    console.error('User auth check failed:', error);
    return null;
  }
}

async function checkAdminAuth() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    // Check if user has admin role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('auth_id', session.user.id)
      .eq('role', 'admin')
      .single();
    
    if (profile) {
      return { ...session.user, profile };
    }
    return null;
  } catch (error) {
    console.error('Admin auth check failed:', error);
    return null;
  }
}

async function checkExpertAuth() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    const { data: expert } = await supabase
      .from('expert_accounts')
      .select('*')
      .eq('auth_id', session.user.id)
      .eq('status', 'approved')
      .single();
    
    if (expert) {
      return { ...session.user, expert };
    }
    return null;
  } catch (error) {
    console.error('Expert auth check failed:', error);
    return null;
  }
}

async function performLogin(type: string, credentials: any) {
  const { email, password, asExpert } = credentials;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    if (!data.session) throw new Error('No session created');
    
    // Set session type preference
    localStorage.setItem('sessionType', type);
    localStorage.setItem('preferredRole', type);
    
    // Check which type of account this is
    if (type === 'expert' || asExpert) {
      const expert = await checkExpertAuth();
      if (expert) return expert;
    }
    
    if (type === 'admin') {
      const admin = await checkAdminAuth();
      if (admin) return admin;
    }
    
    // Default to user
    const user = await checkUserAuth();
    return user;
    
  } catch (error) {
    console.error(`${type} login failed:`, error);
    throw error;
  }
}

export const UnifiedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    admin: null,
    expert: null,
    isLoading: true,
    sessionType: null,
    isAuthenticated: false
  });

  // Single auth check on mount - prevents infinite loops
  useEffect(() => {
    let mounted = true;
    
    const checkAuth = async () => {
      try {
        console.log('UnifiedAuth: Starting auth check');
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Get preferred session type
        const preferredType = localStorage.getItem('sessionType') || 
                             localStorage.getItem('preferredRole');
        
        // Check auth types based on preference
        let authResult = null;
        
        if (preferredType === 'expert') {
          authResult = await checkExpertAuth();
          if (authResult && mounted) {
            dispatch({ type: 'SET_EXPERT', payload: authResult });
            console.log('UnifiedAuth: Expert auth found');
            return;
          }
        }
        
        if (preferredType === 'admin') {
          authResult = await checkAdminAuth();
          if (authResult && mounted) {
            dispatch({ type: 'SET_ADMIN', payload: authResult });
            console.log('UnifiedAuth: Admin auth found');
            return;
          }
        }
        
        // Fallback to user auth
        authResult = await checkUserAuth();
        if (authResult && mounted) {
          dispatch({ type: 'SET_USER', payload: authResult });
          console.log('UnifiedAuth: User auth found');
          return;
        }
        
        // No auth found
        if (mounted) {
          dispatch({ type: 'SET_LOADING', payload: false });
          console.log('UnifiedAuth: No authentication found');
        }
        
      } catch (error) {
        console.error('UnifiedAuth: Auth check failed:', error);
        if (mounted) {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('UnifiedAuth: Auth state changed:', event);
        if (event === 'SIGNED_OUT') {
          dispatch({ type: 'LOGOUT' });
        } else if (event === 'SIGNED_IN' && session) {
          // Re-check auth after sign in
          checkAuth();
        }
      }
    );

    checkAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (type: string, credentials: any): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log(`UnifiedAuth: Attempting ${type} login`);
      
      const result = await performLogin(type, credentials);
      
      if (result) {
        dispatch({ type: `SET_${type.toUpperCase()}`, payload: result });
        console.log(`UnifiedAuth: ${type} login successful`);
        return true;
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
      
    } catch (error) {
      console.error(`UnifiedAuth: ${type} login failed:`, error);
      dispatch({ type: 'SET_LOADING', payload: false });
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('UnifiedAuth: Logging out');
      await supabase.auth.signOut();
      localStorage.removeItem('sessionType');
      localStorage.removeItem('preferredRole');
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('UnifiedAuth: Logout failed:', error);
      toast.error('Logout failed');
    }
  };

  const contextValue = {
    ...state,
    login,
    logout
  };

  console.log('UnifiedAuth: Current state:', {
    isLoading: state.isLoading,
    sessionType: state.sessionType,
    isAuthenticated: state.isAuthenticated
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUnifiedAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUnifiedAuth must be used within UnifiedAuthProvider');
  }
  return context;
};
