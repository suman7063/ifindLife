import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useFetchUserProfile } from './hooks/useFetchUserProfile';
import { useFetchExpertProfile } from './hooks/useFetchExpertProfile';
import { useAuthFunctions } from './hooks/useAuthFunctions';
import { toast } from 'sonner';
import { AuthState, UserProfile, ExpertProfile, AuthContextProps, initialAuthState } from './types';
import { NewReview, NewReport } from '@/types/supabase/tables';

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  
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
      
      // Attempt to fetch expert profile first - this is critical for the expert login flow
      const { data: expertData, error: expertError } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .maybeSingle();
        
      // Check for expert profile
      if (expertData && !expertError) {
        console.log('Found expert profile:', expertData);
        
        // Type safety: ensure the status is properly typed
        const expertProfile: ExpertProfile = {
          ...expertData,
          status: expertData.status as 'pending' | 'approved' | 'disapproved'
        };
        
        setAuthState((prev) => ({
          ...prev,
          expertProfile: expertProfile,
          role: 'expert',
          isLoading: false,
          error: null,
        }));
        return;
      } else {
        console.log('No expert profile found or error:', expertError);
      }
      
      // If not expert, check for regular user profile
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (userData && !userError) {
        console.log('Found user profile:', userData);
        setAuthState((prev) => ({
          ...prev,
          userProfile: userData as UserProfile,
          role: 'user',
          isLoading: false,
          error: null,
        }));
        return;
      } else {
        console.log('No user profile found or error:', userError);
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
          error: null,
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
        error: null,
      }));
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setAuthState((prev) => ({
        ...prev,
        userProfile: null,
        expertProfile: null,
        role: null,
        isLoading: false,
        error: "Failed to fetch user data",
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
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      console.log("Attempting login with email:", email, roleOverride ? `(role override: ${roleOverride})` : '');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast.error(error.message);
        setAuthState((prev) => ({ ...prev, isLoading: false, error: error.message }));
        return false;
      }

      if (!data.user || !data.session) {
        console.error("Login failed: No user or session returned");
        toast.error("Login failed. Please try again.");
        setAuthState((prev) => ({ ...prev, isLoading: false, error: "Login failed" }));
        return false;
      }

      console.log("Login successful for user:", data.user.id);
      
      if (roleOverride === 'expert') {
        // For experts, check expert profile immediately
        const { data: expertData, error: expertError } = await supabase
          .from('expert_accounts')
          .select('*')
          .eq('auth_id', data.user.id)
          .maybeSingle();
          
        if (!expertData || expertError) {
          console.error("Expert profile not found for user:", data.user.id);
          toast.error("No expert profile found for this account");
          await supabase.auth.signOut();
          setAuthState(prev => ({
            ...prev,
            session: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: "No expert profile found"
          }));
          return false;
        }
        
        // Check if expert is approved
        if (expertData.status !== 'approved') {
          console.error(`Expert login failed: Status is ${expertData.status}`);
          await supabase.auth.signOut();
          
          if (expertData.status === 'pending') {
            toast.info("Your account is pending approval");
            window.location.href = '/expert-login?status=pending';
          } else if (expertData.status === 'disapproved') {
            toast.error("Your account has been disapproved");
            window.location.href = '/expert-login?status=disapproved';
          }
          
          return false;
        }
        
        // Type safety: ensure the status is properly typed
        const expertProfile: ExpertProfile = {
          ...expertData,
          status: expertData.status as 'pending' | 'approved' | 'disapproved'
        };
        
        // Set the expert profile and role
        setAuthState(prev => ({
          ...prev,
          session: data.session,
          user: data.user,
          expertProfile,
          role: 'expert',
          isAuthenticated: true,
          isLoading: false,
          error: null
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
      setAuthState((prev) => ({ ...prev, isLoading: false, error: error.message }));
      return false;
    }
  };

  // Implement missing profile methods
  const updateUserProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (!authState.user?.id) return false;
      
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', authState.user.id);
        
      if (error) throw error;
      
      // Update state with new profile data
      setAuthState(prev => ({
        ...prev,
        userProfile: { ...prev.userProfile, ...data } as UserProfile
      }));
      
      toast.success("Profile updated successfully");
      return true;
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
      return false;
    }
  };
  
  const updateExpertProfile = async (data: Partial<ExpertProfile>): Promise<boolean> => {
    try {
      if (!authState.user?.id || !authState.expertProfile) return false;
      
      const { error } = await supabase
        .from('expert_accounts')
        .update(data)
        .eq('auth_id', authState.user.id);
        
      if (error) throw error;
      
      // Update state with new profile data
      setAuthState(prev => ({
        ...prev,
        expertProfile: { 
          ...prev.expertProfile as ExpertProfile, 
          ...data,
          status: (data.status || prev.expertProfile?.status) as 'pending' | 'approved' | 'disapproved' 
        }
      }));
      
      toast.success("Expert profile updated successfully");
      return true;
    } catch (error: any) {
      console.error("Error updating expert profile:", error);
      toast.error(error.message || "Failed to update expert profile");
      return false;
    }
  };
  
  // Generic update profile that redirects to the appropriate function
  const updateProfile = async (data: any): Promise<boolean> => {
    if (authState.role === 'expert') {
      return updateExpertProfile(data as Partial<ExpertProfile>);
    } else {
      return updateUserProfile(data as Partial<UserProfile>);
    }
  };
  
  // Password update method
  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) throw error;
      toast.success("Password updated successfully");
      return true;
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password");
      return false;
    }
  };
  
  // Expert interaction methods
  const addToFavorites = async (expertId: number): Promise<boolean> => {
    try {
      if (!authState.user?.id) return false;
      
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: authState.user.id,
          expert_id: expertId
        });
        
      if (error) throw error;
      toast.success("Added to favorites");
      return true;
    } catch (error: any) {
      console.error("Error adding to favorites:", error);
      toast.error(error.message || "Failed to add to favorites");
      return false;
    }
  };
  
  const removeFromFavorites = async (expertId: number): Promise<boolean> => {
    try {
      if (!authState.user?.id) return false;
      
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .match({ 
          user_id: authState.user.id,
          expert_id: expertId
        });
        
      if (error) throw error;
      toast.success("Removed from favorites");
      return true;
    } catch (error: any) {
      console.error("Error removing from favorites:", error);
      toast.error(error.message || "Failed to remove from favorites");
      return false;
    }
  };
  
  const rechargeWallet = async (amount: number): Promise<boolean> => {
    try {
      if (!authState.user?.id) return false;
      
      // Instead of using RPC, directly update the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ 
          wallet_balance: (authState.userProfile?.wallet_balance || 0) + amount 
        })
        .eq('id', authState.user.id);
      
      if (error) throw error;
      
      // Update local state
      setAuthState(prev => ({
        ...prev,
        userProfile: {
          ...prev.userProfile as UserProfile,
          wallet_balance: (prev.userProfile?.wallet_balance || 0) + amount
        }
      }));
      
      toast.success(`Successfully added ${amount} to wallet`);
      return true;
    } catch (error: any) {
      console.error("Error recharging wallet:", error);
      toast.error(error.message || "Failed to recharge wallet");
      return false;
    }
  };
  
  // Review and report methods
  const addReview = async (review: NewReview): Promise<boolean> => {
    try {
      if (!authState.user?.id) return false;
      
      // Convert review to match database schema
      const { error } = await supabase
        .from('user_reviews')
        .insert({
          user_id: authState.user.id,
          expert_id: typeof review.expertId === 'string' 
            ? parseInt(review.expertId) 
            : review.expertId,
          rating: review.rating,
          comment: review.comment,
          date: new Date().toISOString(),
          verified: false
        });
        
      if (error) throw error;
      toast.success("Review added successfully");
      return true;
    } catch (error: any) {
      console.error("Error adding review:", error);
      toast.error(error.message || "Failed to add review");
      return false;
    }
  };
  
  const reportExpert = async (report: NewReport): Promise<boolean> => {
    try {
      if (!authState.user?.id) return false;
      
      // Convert report to match database schema
      const { error } = await supabase
        .from('user_reports')
        .insert({
          user_id: authState.user.id,
          expert_id: typeof report.expertId === 'string' 
            ? parseInt(report.expertId) 
            : report.expertId,
          reason: report.reason,
          details: report.details,
          date: new Date().toISOString(),
          status: 'pending'
        });
        
      if (error) throw error;
      toast.success("Report submitted successfully");
      return true;
    } catch (error: any) {
      console.error("Error submitting report:", error);
      toast.error(error.message || "Failed to submit report");
      return false;
    }
  };
  
  const hasTakenServiceFrom = async (expertId: string | number): Promise<boolean> => {
    try {
      if (!authState.user?.id) return false;
      
      const { data, error } = await supabase
        .from('user_expert_services')
        .select('id')
        .match({ 
          user_id: authState.user.id,
          expert_id: expertId,
          status: 'completed'
        })
        .limit(1);
        
      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      console.error("Error checking service history:", error);
      return false;
    }
  };
  
  const getExpertShareLink = (expertId: string | number): string => {
    return `${window.location.origin}/experts/${expertId}`;
  };
  
  const getReferralLink = (): string | null => {
    if (!authState.userProfile?.referral_code) return null;
    return `${window.location.origin}/signup?ref=${authState.userProfile.referral_code}`;
  };
  
  // Determine session type
  const sessionType = authState.userProfile && authState.expertProfile 
    ? 'dual'
    : authState.userProfile 
      ? 'user' 
      : authState.expertProfile 
        ? 'expert'
        : 'none';

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
        expertSignup,
        updateProfile,
        updateUserProfile,
        updateExpertProfile,
        updatePassword,
        addToFavorites,
        removeFromFavorites,
        rechargeWallet,
        addReview,
        reportExpert,
        hasTakenServiceFrom,
        getExpertShareLink,
        getReferralLink,
        sessionType
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
