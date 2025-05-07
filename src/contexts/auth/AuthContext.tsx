
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
  logout: () => Promise<boolean>;
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
      console.log(`Checking roles for user ID: ${userId}`);
      
      // Fetch expert profile with error handling
      let expertData = null;
      let expertError = null;
      
      try {
        const response = await supabase
          .from('expert_accounts') // Correct table name
          .select('*')
          .eq('auth_id', userId) // Correct field name
          .single();
        
        expertData = response.data;
        expertError = response.error;
      } catch (err: any) {
        console.error("Error fetching expert profile:", err);
        expertError = { message: err.message || "Failed to fetch expert profile" };
      }

      // Fetch user profile with error handling
      let userData = null;
      let userError = null;
      
      try {
        const response = await supabase
          .from('profiles') // Correct table name
          .select('*')
          .eq('id', userId)
          .single();
        
        userData = response.data;
        userError = response.error;
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        userError = { message: err.message || "Failed to fetch user profile" };
      }

      console.log("Expert profile check:", expertData ? "Found" : "Not found", expertError?.message || "No error");
      console.log("User profile check:", userData ? "Found" : "Not found", userError?.message || "No error");

      // Determine role based on profile existence
      if (expertData) {
        console.log("Setting role to EXPERT");
        setRole('expert');
        setExpertProfile(expertData);
        setUserProfile(userData || null);
        setSessionType(userData ? 'dual' : 'expert');
      } else if (userData) {
        console.log("Setting role to USER");
        setRole('user');
        setUserProfile(userData);
        setExpertProfile(null);
        setSessionType('user');
      } else {
        console.log("No profiles found, setting role to NULL");
        setRole(null);
        setExpertProfile(null);
        setUserProfile(null);
        setSessionType('none');
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
      console.log(`Auth state changed: ${event}`, session ? "Session exists" : "No session");
      
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        if (session?.user) {
          console.log("Setting user from session");
          setUser(session.user);
          checkAndSetRole(session.user.id);
        } else {
          console.log("No user in session, clearing state");
          setUser(null);
          setRole(null);
          setExpertProfile(null);
          setUserProfile(null);
          setSessionType('none');
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, clearing state");
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
      console.log(`Attempting login with email: ${email}`, roleOverride ? `(role override: ${roleOverride})` : "");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        setError(error.message);
        setIsLoading(false);
        return false;
      }

      if (data?.user?.id) {
        setUser(data.user);
        
        if (roleOverride === 'expert') {
          console.log("Expert role override specified, checking for expert profile");
          
          try {
            const { data: expertData, error: expertError } = await supabase
              .from('expert_accounts') // Correct table name
              .select('*')
              .eq('auth_id', data.user.id) // Correct field name
              .single();
              
            if (expertData) {
              console.log("Expert profile found:", expertData.name);
              setRole('expert');
              setExpertProfile(expertData);
              setUserProfile(null);
              setSessionType('expert');
              setError(null);
              setIsLoading(false);
              return true;
            } else {
              console.error("Expert profile not found:", expertError);
              setError(expertError?.message || "Failed to fetch expert profile");
              setIsLoading(false);
              
              // Sign out since this isn't a valid expert
              await supabase.auth.signOut();
              return false;
            }
          } catch (err: any) {
            console.error("Error fetching expert profile:", err);
            setError(err?.message || "Error fetching expert profile");
            setIsLoading(false);
            
            // Sign out on error
            await supabase.auth.signOut();
            return false;
          }
        } else if (roleOverride === 'user') {
          console.log("User role override specified, checking for user profile");
          
          try {
            const { data: userData, error: userError } = await supabase
              .from('profiles') // Correct table name
              .select('*')
              .eq('id', data.user.id)
              .single();
              
            if (userData) {
              console.log("User profile found:", userData.name || userData.email);
              setRole('user');
              setUserProfile(userData);
              setExpertProfile(null);
              setSessionType('user');
              setError(null);
              setIsLoading(false);
              return true;
            } else {
              console.error("User profile not found:", userError);
              setError(userError?.message || "Failed to fetch user profile");
              setIsLoading(false);
              return false;
            }
          } catch (err: any) {
            console.error("Error fetching user profile:", err);
            setError(err?.message || "Error fetching user profile");
            setIsLoading(false);
            return false;
          }
        } else {
          console.log("No role override specified, checking both profiles");
          await checkAndSetRole(data.user.id);
          setError(null);
          return true;
        }
      }
      
      setIsLoading(false);
      return false;
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error?.message || "An unexpected error occurred during login");
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      console.log("Logging out user");
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        setError(error.message);
        setIsLoading(false);
        return false;
      } else {
        console.log("Logout successful, clearing state");
        setUser(null);
        setRole(null);
        setExpertProfile(null);
        setUserProfile(null);
        setSessionType('none');
      }
      
      setIsLoading(false);
      setError(null);
      return true;
    } catch (error: any) {
      console.error("Logout error:", error);
      setError(error?.message || "An error occurred during logout");
      setIsLoading(false);
      return false;
    }
  };

  // Implement other missing functions
  const signup = async (email: string, password: string, userData: any, referralCode?: string) => {
    console.log("Signup called with:", email, userData, referralCode ? `Referral: ${referralCode}` : "");
    // Placeholder implementation
    return true;
  };

  const updateUserProfile = async (data: any) => {
    console.log("Update user profile called with:", data);
    // Placeholder implementation
    return true;
  };

  const updatePassword = async (password: string) => {
    console.log("Update password called");
    // Placeholder implementation
    return true;
  };

  const addToFavorites = async (expertId: number) => {
    console.log(`Add to favorites: ${expertId}`);
    // Placeholder implementation
    return true;
  };

  const removeFromFavorites = async (expertId: number) => {
    console.log(`Remove from favorites: ${expertId}`);
    // Placeholder implementation
    return true;
  };

  const rechargeWallet = async (amount: number) => {
    console.log(`Recharge wallet: ${amount}`);
    // Placeholder implementation
    return true;
  };

  const addReview = async (review: any) => {
    console.log("Add review:", review);
    // Placeholder implementation
    return true;
  };

  const reportExpert = async (report: any) => {
    console.log("Report expert:", report);
    // Placeholder implementation
    return true;
  };

  const hasTakenServiceFrom = async (expertId: string | number) => {
    console.log(`Check if taken service from expert ${expertId}`);
    // Placeholder implementation
    return true;
  };

  const getExpertShareLink = (expertId: string | number) => {
    console.log(`Get expert share link: ${expertId}`);
    // Placeholder implementation
    return '';
  };

  const getReferralLink = () => {
    console.log("Get referral link");
    // Placeholder implementation
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
