import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useFetchUserProfile } from './hooks/useFetchUserProfile';
import { useFetchExpertProfile } from './hooks/useFetchExpertProfile';
import { useAuthFunctions } from './hooks/useAuthFunctions';
import { toast } from 'sonner';
import { AuthState, UserProfile } from './types';

interface AuthContextProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  expertProfile: any | null;
  role: 'user' | 'expert' | 'admin' | null;
  login: (email: string, password: string, roleOverride?: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: Partial<UserProfile>, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  expertSignup: (data: any) => Promise<boolean>;
  expertLogin: (email: string, password: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    userProfile: null,
    expertProfile: null,
    role: null,
    isAuthenticated: false,
    isLoading: true,
  });
  
  console.log('Setting up auth state listener');
  
  // Set up auth listener on component mount
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? "Session exists" : "No session");
        
        // Update the session and user state
        setAuthState((prev) => ({
          ...prev,
          session: session,
          user: session?.user || null,
          isAuthenticated: !!session,
        }));
        
        // Clear profiles if no session/user
        if (!session || !session.user) {
          console.log('Auth state changed without user, clearing profiles');
          setAuthState((prev) => ({
            ...prev, 
            userProfile: null, 
            expertProfile: null, 
            role: null,
            isLoading: false,
          }));
          return;
        }
        
        // Otherwise fetch profile data
        await fetchUserData(session.user.id);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session exists" : "No session");
      
      // Update the session and user state
      setAuthState((prev) => ({
        ...prev,
        session: session,
        user: session?.user || null,
        isAuthenticated: !!session,
      }));
      
      // Fetch user data if there's a session
      if (session && session.user) {
        fetchUserData(session.user.id);
      } else {
        // No session, set loading to false
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Function to fetch user data after login
  const fetchUserData = async (userId: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      console.log('Fetching user data for ID:', userId);
      
      // Attempt to fetch expert profile first
      const { data: expertData, error: expertError } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .maybeSingle();
        
      // Check for expert profile
      if (expertData && !expertError) {
        console.log('Found expert profile:', expertData);
        setAuthState((prev) => ({
          ...prev,
          expertProfile: expertData,
          role: 'expert',
          isLoading: false,
        }));
        return;
      }
      
      // If not expert, check for regular user profile
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (userData && !userError) {
        console.log('Found user profile:', userId);
        setAuthState((prev) => ({
          ...prev,
          userProfile: userData,
          role: 'user',
          isLoading: false,
        }));
        return;
      }
      
      // If no profile found, check for admin role
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (adminData && !adminError) {
        console.log('Found admin user:', adminData);
        setAuthState((prev) => ({
          ...prev,
          role: 'admin',
          isLoading: false,
        }));
        return;
      }
      
      // If no profile found at all
      console.log('No profile found for user:', userId);
      setAuthState((prev) => ({
        ...prev,
        userProfile: null,
        expertProfile: null,
        role: null,
        isLoading: false,
      }));
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setAuthState((prev) => ({
        ...prev,
        userProfile: null,
        expertProfile: null,
        role: null,
        isLoading: false,
      }));
    }
  };
  
  // Import auth functions with the fetchUserData function
  const { login: baseLogin, signup, logout, expertLogin, expertSignup } = useAuthFunctions(
    authState,
    setAuthState,
    fetchUserData
  );
  
  // Enhanced login function that allows role override
  const login = async (email: string, password: string, roleOverride?: string): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      console.log("Attempting login with email:", email, roleOverride ? `(role override: ${roleOverride})` : '');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast.error(error.message);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }

      if (!data.user || !data.session) {
        console.error("Login failed: No user or session returned");
        toast.error("Login failed. Please try again.");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }

      console.log("Login successful for user:", data.user.id);
      
      if (roleOverride === 'expert') {
        // For experts, check expert profile immediately
        const { data: expertProfile, error: expertError } = await supabase
          .from('expert_accounts')
          .select('*')
          .eq('auth_id', data.user.id)
          .maybeSingle();
          
        if (!expertProfile || expertError) {
          console.error("Expert profile not found for user:", data.user.id);
          toast.error("No expert profile found for this account");
          await supabase.auth.signOut();
          setAuthState(prev => ({
            ...prev,
            session: null,
            user: null,
            isAuthenticated: false,
            isLoading: false
          }));
          return false;
        }
        
        // Set the expert profile and role
        setAuthState(prev => ({
          ...prev,
          session: data.session,
          user: data.user,
          expertProfile,
          role: 'expert',
          isAuthenticated: true,
          isLoading: false
        }));
        
        toast.success("Expert login successful!");
        return true;
      }
      
      // For regular login, fetch all data
      try {
        await fetchUserData(data.user.id);
      } catch (fetchError) {
        console.error("Error fetching user data after login:", fetchError);
        // Continue with login even if fetch fails
      }
      
      toast.success("Login successful!");
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "An error occurred during login");
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading: authState.isLoading,
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        session: authState.session,
        userProfile: authState.userProfile,
        expertProfile: authState.expertProfile,
        role: authState.role,
        login,
        signup,
        logout,
        expertLogin,
        expertSignup
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
