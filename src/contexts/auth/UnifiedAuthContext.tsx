
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { User, AuthState, UserRole, AdminUser } from '../../types/auth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Initial auth state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  currentUser: null,
  sessionType: 'none',
  error: null
};

// Auth context type
interface AuthContextType extends AuthState {
  login: (email: string, password: string, type?: 'user' | 'expert' | 'admin') => Promise<boolean>;
  logout: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

// Actions for our reducer
type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; sessionType: 'user' | 'expert' | 'admin' } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_CLEAR_ERROR' };

// Reducer to handle auth state
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        currentUser: action.payload.user,
        sessionType: action.payload.sessionType,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        currentUser: null,
        sessionType: 'none',
        error: action.payload
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        currentUser: null,
        sessionType: 'none',
        error: null
      };
    case 'AUTH_CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Admin credentials for the supported admin login
const ADMIN_CREDENTIALS = {
  'iflsuperadmin': { 
    password: 'Freesoul@99IFL', 
    role: 'super_admin',
    permissions: {
      canManageUsers: true,
      canManageExperts: true,
      canManageContent: true,
      canViewAnalytics: true,
      canManageServices: true,
      canManagePrograms: true,
      canDeleteContent: true,
      canApproveExperts: true,
      canManageBlog: true,
      canManageTestimonials: true
    }
  }
};

// Create the context
const UnifiedAuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const UnifiedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: 'AUTH_LOADING' });
        
        // Check for admin session in localStorage first (fallback)
        const adminSession = localStorage.getItem('admin_session');
        if (adminSession) {
          try {
            const adminUser = JSON.parse(adminSession);
            // Validate admin session format
            if (adminUser && adminUser.role && (adminUser.role === 'admin' || adminUser.role === 'super_admin')) {
              console.log('Found valid admin session in localStorage');
              dispatch({
                type: 'AUTH_SUCCESS',
                payload: {
                  user: adminUser,
                  sessionType: 'admin'
                }
              });
              return;
            }
          } catch (e) {
            console.error('Error parsing admin session:', e);
            localStorage.removeItem('admin_session');
          }
        }
        
        // Check Supabase session for regular and expert users
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Supabase session error:', error);
          dispatch({ type: 'AUTH_FAILURE', payload: error.message });
          return;
        }
        
        if (data?.session) {
          console.log('Found valid Supabase session');
          const userMetadata = data.session.user.user_metadata || {};
          
          // Determine session type from metadata
          const sessionType = userMetadata.role === 'expert' ? 'expert' : 'user';
          
          // Get the appropriate user profile
          if (sessionType === 'expert') {
            // Get expert profile
            // For now, we'll just create a mock expert user
            const expertUser: User = {
              id: data.session.user.id,
              email: data.session.user.email || '',
              role: 'expert',
              createdAt: data.session.user.created_at || new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              expertProfile: {
                specializations: userMetadata.specializations || [],
                bio: userMetadata.bio || '',
                rating: userMetadata.rating,
                verificationStatus: userMetadata.verification_status || 'pending'
              }
            };
            
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: expertUser,
                sessionType: 'expert'
              }
            });
          } else {
            // Get regular user profile
            // For now, we'll just create a mock user
            const regularUser: User = {
              id: data.session.user.id,
              email: data.session.user.email || '',
              role: 'user',
              createdAt: data.session.user.created_at || new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              profile: {
                name: userMetadata.name,
                avatar: userMetadata.avatar
              }
            };
            
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: regularUser,
                sessionType: 'user'
              }
            });
          }
        } else {
          console.log('No active session found');
          dispatch({ type: 'AUTH_FAILURE', payload: 'No active session' });
        }
      } catch (err: any) {
        console.error('Auth check error:', err);
        dispatch({ type: 'AUTH_FAILURE', payload: err.message || 'Failed to check authentication' });
      }
    };
    
    checkAuth();
    
    // Subscribe to auth changes from Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
          const userMetadata = session.user.user_metadata || {};
          const sessionType = userMetadata.role === 'expert' ? 'expert' : 'user';
          
          // For now, we'll just create mock users based on the session type
          if (sessionType === 'expert') {
            const expertUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              role: 'expert',
              createdAt: session.user.created_at || new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              expertProfile: {
                specializations: userMetadata.specializations || [],
                bio: userMetadata.bio || '',
                rating: userMetadata.rating,
                verificationStatus: userMetadata.verification_status || 'pending'
              }
            };
            
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: expertUser,
                sessionType: 'expert'
              }
            });
          } else {
            const regularUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              role: 'user',
              createdAt: session.user.created_at || new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              profile: {
                name: userMetadata.name,
                avatar: userMetadata.avatar
              }
            };
            
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: regularUser,
                sessionType: 'user'
              }
            });
          }
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function that handles all three types of users
  const login = useCallback(async (
    email: string, 
    password: string, 
    type: 'user' | 'expert' | 'admin' = 'user'
  ): Promise<boolean> => {
    dispatch({ type: 'AUTH_LOADING' });
    
    try {
      // Special handling for admin login
      if (type === 'admin') {
        console.log('Attempting admin login for:', email);
        
        // Check if it's the allowed admin account
        const username = email.toLowerCase();
        
        // Check against known admin credentials
        if (ADMIN_CREDENTIALS[username] && ADMIN_CREDENTIALS[username].password === password) {
          console.log('Admin credentials verified for:', username);
          
          // Create admin user object
          const adminUser: AdminUser = {
            id: `admin-${Date.now()}`,
            email: `${username}@ifindlife.com`,
            username: username,
            role: ADMIN_CREDENTIALS[username].role as 'admin' | 'super_admin',
            permissions: ADMIN_CREDENTIALS[username].permissions,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          
          // Store in localStorage for persistence
          localStorage.setItem('admin_session', JSON.stringify(adminUser));
          
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: adminUser,
              sessionType: 'admin'
            }
          });
          
          toast.success(`Welcome, ${username}!`);
          return true;
        } else {
          console.log('Admin login failed: Invalid credentials');
          dispatch({ type: 'AUTH_FAILURE', payload: 'Invalid admin credentials' });
          toast.error('Invalid admin credentials');
          return false;
        }
      } else if (type === 'expert') {
        // Expert login via Supabase
        console.log('Attempting expert login for:', email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          console.error('Expert login error:', error);
          dispatch({ type: 'AUTH_FAILURE', payload: error.message });
          toast.error(error.message);
          return false;
        }
        
        // Set expert metadata
        await supabase.auth.updateUser({
          data: { role: 'expert' }
        });
        
        // Success will be handled by the auth state change listener
        toast.success('Expert login successful!');
        return true;
      } else {
        // Regular user login via Supabase
        console.log('Attempting user login for:', email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          console.error('User login error:', error);
          dispatch({ type: 'AUTH_FAILURE', payload: error.message });
          toast.error(error.message);
          return false;
        }
        
        // Set user role metadata
        await supabase.auth.updateUser({
          data: { role: 'user' }
        });
        
        // Success will be handled by the auth state change listener
        toast.success('Login successful!');
        return true;
      }
    } catch (err: any) {
      console.error('Login error:', err);
      dispatch({ type: 'AUTH_FAILURE', payload: err.message || 'Login failed' });
      toast.error(err.message || 'Login failed');
      return false;
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<boolean> => {
    try {
      // Clear localStorage admin session
      localStorage.removeItem('admin_session');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error('Error during logout');
        return false;
      }
      
      // Update state immediately
      dispatch({ type: 'AUTH_LOGOUT' });
      toast.success('Successfully logged out');
      return true;
    } catch (err: any) {
      console.error('Logout error:', err);
      toast.error(err.message || 'Error during logout');
      
      // Still clear state even if logout fails
      dispatch({ type: 'AUTH_LOGOUT' });
      return false;
    }
  }, []);

  // Refresh user profile
  const refreshUser = useCallback(async (): Promise<void> => {
    // Placeholder for refreshing user data
    if (state.currentUser && state.sessionType !== 'none') {
      console.log('Refreshing user profile');
      // In a real implementation, we would fetch the latest user data
    }
  }, [state.currentUser, state.sessionType]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
  }, []);

  // Context value
  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshUser,
    clearError
  };

  return <UnifiedAuthContext.Provider value={value}>{children}</UnifiedAuthContext.Provider>;
};

// Auth hook
export const useUnifiedAuth = (): AuthContextType => {
  const context = useContext(UnifiedAuthContext);
  if (context === undefined) {
    throw new Error('useUnifiedAuth must be used within a UnifiedAuthProvider');
  }
  return context;
};
