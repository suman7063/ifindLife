
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AuthState } from '../types';
import { UserProfile } from '@/types/supabase';

export const useAuthFunctions = (
  authState: AuthState,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>,
  fetchUserData: (userId: string) => Promise<void>
) => {
  const [actionLoading, setActionLoading] = useState(false);

  // Standard user login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      console.log("Attempting login with email:", email);
      
      // Check for existing session and sign out if necessary
      const { data: existingSession } = await supabase.auth.getSession();
      if (existingSession.session) {
        console.log("Found existing session, cleaning up before login");
        await supabase.auth.signOut({ scope: 'local' });
      }
      
      // Authenticate with Supabase
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
      
      // Fetch user data immediately after login
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

  const signup = async (
    email: string, 
    password: string, 
    userData: Partial<UserProfile>,
    referralCode?: string
  ): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      console.log("Starting signup with:", { email, userData, hasReferral: !!referralCode });
      
      // Prepare metadata for signup
      const metadata = {
        name: userData.name,
        phone: userData.phone,
        country: userData.country,
        city: userData.city,
        referralCode,
      };
      
      console.log("Signup metadata:", metadata);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        }
      });

      if (error) {
        console.error("Signup error:", error);
        toast.error(error.message);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }

      if (!data.user) {
        console.error("Signup failed: No user returned");
        toast.error("Signup failed. Please try again.");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
      
      console.log("Signup successful, user created:", data.user.id);
      toast.success("Signup successful! Please check your email for verification.");
      
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return true;
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "An error occurred during signup");
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const expertLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      console.log("Expert login: Attempting with email:", email);
      
      // Check for existing session and sign out if necessary
      const { data: existingSession } = await supabase.auth.getSession();
      if (existingSession.session) {
        console.log("Expert login: Found existing session, cleaning up before login");
        await supabase.auth.signOut({ scope: 'local' });
      }
      
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Expert login error:", error);
        toast.error(error.message);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }

      if (!data.user || !data.session) {
        console.error("Expert login failed: No user or session returned");
        toast.error("Login failed. Please try again.");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
      
      console.log("Expert login: Authentication successful, checking for expert profile");
      
      const { data: expertProfile, error: expertError } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', data.user.id)
        .maybeSingle();
        
      if (expertError && expertError.code !== 'PGRST116') {
        console.error("Expert login: Error checking expert profile:", expertError);
        toast.error("Error checking expert profile");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
      
      if (!expertProfile) {
        console.error("Expert login: No expert profile found");
        toast.error("No expert account found for this user");
        
        await supabase.auth.signOut();
        setAuthState((prev) => ({ 
          ...prev, 
          isLoading: false,
          session: null,
          user: null,
          isAuthenticated: false
        }));
        return false;
      }
      
      if (expertProfile.status !== 'approved') {
        console.error(`Expert login: Status is ${expertProfile.status}`);
        
        await supabase.auth.signOut();
        
        if (expertProfile.status === 'pending') {
          toast.info('Your account is pending approval. You will be notified once approved.');
        } else {
          toast.error(`Your account has been ${expertProfile.status}. Please contact support.`);
        }
        
        setAuthState((prev) => ({ 
          ...prev, 
          isLoading: false,
          session: null,
          user: null,
          isAuthenticated: false
        }));
        return false;
      }

      console.log("Expert login: Expert profile found and approved");
      
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
    } catch (error: any) {
      console.error("Expert login error:", error);
      toast.error(error.message || "An error occurred during login");
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const expertSignup = async (registrationData: any): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      console.log("Expert signup: Starting with data:", registrationData.email);
      
      // Validate email format
      if (!/^\S+@\S+\.\S+$/.test(registrationData.email)) {
        toast.error("Please enter a valid email address");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
      
      // Check if email already exists
      const { data: existingUser, error: emailCheckError } = await supabase
        .from('expert_accounts')
        .select('email')
        .eq('email', registrationData.email)
        .maybeSingle();
        
      if (existingUser) {
        toast.error("This email is already registered as an expert");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
      
      // Create auth account
      const { data, error } = await supabase.auth.signUp({
        email: registrationData.email,
        password: registrationData.password,
        options: {
          data: {
            user_type: 'expert',
            name: registrationData.name,
          },
        }
      });
      
      if (error) {
        console.error("Expert signup: Auth error:", error);
        toast.error(error.message);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
      
      if (!data.user) {
        console.error("Expert signup: No user returned");
        toast.error("Registration failed. Please try again.");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
      
      console.log("Expert signup: Auth account created, creating expert profile");
      
      // Create expert profile entry
      const { error: profileError } = await supabase
        .from('expert_accounts')
        .insert({
          auth_id: data.user.id,
          name: registrationData.name,
          email: registrationData.email,
          status: 'pending',
          // Add other fields as needed
        });
        
      if (profileError) {
        console.error("Expert signup: Error creating profile:", profileError);
        toast.error("Error creating expert profile");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
      
      console.log("Expert signup: Expert registration successful");
      toast.success("Expert registration successful! Your account is pending approval.");
      
      // Sign out
      await supabase.auth.signOut();
      
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        session: null,
        user: null,
        isAuthenticated: false
      }));
      
      return true;
    } catch (error: any) {
      console.error("Expert signup error:", error);
      toast.error(error.message || "An error occurred during registration");
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("Logout error:", error);
        toast.error(error.message);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
      
      setAuthState((prev) => ({
        ...prev,
        session: null,
        user: null, 
        userProfile: null,
        expertProfile: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      }));
      
      toast.success("Logout successful!");
      return true;
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "An error occurred during logout");
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  return {
    login,
    signup,
    expertLogin,
    expertSignup,
    logout,
    actionLoading
  };
};
