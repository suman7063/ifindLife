
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Define the context type
type AuthContextProps = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  role: 'user' | 'expert' | 'admin' | null;
  expertProfile: any;
  userProfile: any;
  error: string | null;
  sessionType?: 'none' | 'user' | 'expert' | 'dual';
  login: (email: string, password: string, roleOverride?: string) => Promise<boolean>;
  logout: () => Promise<boolean>; // Changed return type
  expertSignup?: (data: any) => Promise<boolean>;
  signup?: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  updateUserProfile?: (data: any) => Promise<boolean>;
  updatePassword?: (password: string) => Promise<boolean>;
  addToFavorites?: (expertId: number) => Promise<boolean>;
  removeFromFavorites?: (expertId: number) => Promise<boolean>;
  rechargeWallet?: (amount: number) => Promise<boolean>;
  addReview?: (review: any) => Promise<boolean>;
  reportExpert?: (report: any) => Promise<boolean>;
  hasTakenServiceFrom?: (expertId: string | number) => Promise<boolean>;
  getExpertShareLink?: (expertId: string | number) => string;
  getReferralLink?: () => string | null;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  role: null,
  expertProfile: null,
  userProfile: null,
  error: null,
  login: async () => false,
  logout: async () => false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// The context provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<'user' | 'expert' | 'admin' | null>(null);
  const [expertProfile, setExpertProfile] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<'none' | 'user' | 'expert' | 'dual'>('none');

  // Function to check and set role based on user profiles
  const checkAndSetRole = async (userId: string) => {
    try {
      // Fetch expert profile
      const { data: expertData, error: expertError } = await supabase
        .from('expert_accounts') // Changed from expert_profiles to match the actual table name
        .select('*')
        .eq('auth_id', userId) // Changed from user_id to auth_id based on schema
        .single();

      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('profiles') // Changed from user_profiles to match the actual table name
        .select('*')
        .eq('id', userId)
        .single();

      if (expertError && !expertData) {
        console.warn("No expert profile found:", expertError);
      }

      if (userError && !userData) {
        console.warn("No user profile found:", userError);
      }

      // Determine role based on profile existence
      if (expertData) {
        setRole('expert');
        setExpertProfile(expertData);
        setUserProfile(null);
        setSessionType(userData ? 'dual' : 'expert');
      } else if (userData) {
        setRole('user');
        setUserProfile(userData);
        setExpertProfile(null);
        setSessionType('user');
      } else {
        setRole(null);
        setExpertProfile(null);
        setUserProfile(null);
        setSessionType('none');
        console.warn("No profiles found for this user.");
      }
    } catch (error: any) {
      console.error("Error fetching profiles:", error);
      setError(error?.message || "Error fetching user profiles");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial authentication check
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        if (session?.user) {
          setUser(session.user);
          checkAndSetRole(session.user.id);
        } else {
          setUser(null);
          setRole(null);
          setExpertProfile(null);
          setUserProfile(null);
          setSessionType('none');
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setRole(null);
        setExpertProfile(null);
        setUserProfile(null);
        setSessionType('none');
        setIsLoading(false);
      }
    });

    // Unsubscribe from the auth state change listener when the component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string, roleOverride?: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Login error:", error);
        setError(error.message);
        return false;
      }

      if (data?.user?.id) {
        setUser(data.user);
        if (roleOverride) {
          setRole(roleOverride as 'user' | 'expert' | 'admin');
          if (roleOverride === 'expert') {
            const { data: expertData, error: expertError } = await supabase
              .from('expert_accounts') // Changed from expert_profiles to match the actual table
              .select('*')
              .eq('auth_id', data.user.id) // Changed from user_id to auth_id
              .single();
            if (expertData) {
              setExpertProfile(expertData);
              setUserProfile(null);
            } else {
              console.error("Error fetching expert profile:", expertError);
              setError(expertError?.message || "Failed to fetch expert profile");
              setIsLoading(false);
              return false;
            }
          } else if (roleOverride === 'user') {
            const { data: userData, error: userError } = await supabase
              .from('profiles') // Changed from user_profiles to match the actual table
              .select('*')
              .eq('id', data.user.id)
              .single();
            if (userData) {
              setUserProfile(userData);
              setExpertProfile(null);
            } else {
              console.error("Error fetching user profile:", userError);
              setError(userError?.message || "Failed to fetch user profile");
              setIsLoading(false);
              return false;
            }
          }
        } else {
          await checkAndSetRole(data.user.id);
        }
      }
      setIsLoading(false);
      setError(null);
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error?.message || "An unexpected error occurred during login");
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        setError(error.message);
        return false; // Return false on failure
      } else {
        setUser(null);
        setRole(null);
        setExpertProfile(null);
        setUserProfile(null);
        setSessionType('none');
      }
      setIsLoading(false);
      setError(null);
      return true; // Return true on success
    } catch (error: any) {
      console.error("Logout error:", error);
      setError(error?.message || "An error occurred during logout");
      return false; // Return false on exception
    } finally {
      setIsLoading(false);
    }
  };

  // Mock implementations for other required methods
  const signup = async (email: string, password: string, userData: any, referralCode?: string) => {
    // Implementation placeholder
    return true;
  };

  const updateUserProfile = async (data: any) => {
    // Implementation placeholder
    return true;
  };

  const updatePassword = async (password: string) => {
    // Implementation placeholder
    return true;
  };

  const addToFavorites = async (expertId: number) => {
    // Implementation placeholder
    return true;
  };

  const removeFromFavorites = async (expertId: number) => {
    // Implementation placeholder
    return true;
  };

  const rechargeWallet = async (amount: number) => {
    // Implementation placeholder
    return true;
  };

  const addReview = async (review: any) => {
    // Implementation placeholder
    return true;
  };

  const reportExpert = async (report: any) => {
    // Implementation placeholder
    return true;
  };

  const hasTakenServiceFrom = async (expertId: string | number) => {
    // Implementation placeholder
    return true;
  };

  const getExpertShareLink = (expertId: string | number) => {
    // Implementation placeholder
    return '';
  };

  const getReferralLink = () => {
    // Implementation placeholder
    return null;
  };

  // Provider value
  const value: AuthContextProps = {
    isAuthenticated: !!user,
    isLoading,
    user,
    role,
    expertProfile,
    userProfile,
    error,
    sessionType,
    login,
    logout,
    signup,
    updateUserProfile,
    updatePassword,
    addToFavorites,
    removeFromFavorites,
    rechargeWallet,
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
