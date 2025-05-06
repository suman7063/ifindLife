
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState, initialAuthState, UserRole } from '../types';

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "Session exists" : "No session");
        
        setAuthState((prev) => ({
          ...prev,
          session,
          user: session?.user || null,
          isAuthenticated: !!session?.user,
          isLoading: event === 'INITIAL_SESSION' ? prev.isLoading : false,
        }));
        
        if (session?.user) {
          console.log("Auth state changed with user, fetching profile");
          // Use setTimeout to avoid potential Supabase auth deadlock
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          console.log("Auth state changed without user, clearing profiles");
          setAuthState((prev) => ({
            ...prev,
            userProfile: null,
            expertProfile: null,
            role: null,
            isLoading: false,
          }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session exists" : "No session");
      
      if (!session) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
        }));
        return;
      }
      
      // If session exists, fetch user data
      console.log("Session exists, fetching user data for:", session.user.id);
      fetchUserData(session.user.id);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchUserData = async (userId: string) => {
    try {
      console.log("Fetching user data for:", userId);
      
      // First check if this is a user
      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (userProfile) {
        console.log("Found user profile:", userProfile.id);
        setAuthState((prev) => ({
          ...prev,
          userProfile,
          expertProfile: null,
          role: userProfile.email === 'admin@ifindlife.com' ? 'admin' : 'user',
          isLoading: false,
        }));
        return;
      } else {
        console.log("No user profile found, checking for expert");
      }
      
      // Then check if it's an expert
      const { data: expertData, error: expertError } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .maybeSingle();
        
      if (expertData) {
        console.log("Found expert profile:", expertData.id);
        
        // Ensure the status is properly typed
        const expertProfile = {
          ...expertData,
          status: (expertData.status || 'pending') as 'pending' | 'approved' | 'disapproved'
        };
        
        setAuthState((prev) => ({
          ...prev,
          userProfile: null,
          expertProfile,
          role: 'expert',
          isLoading: false,
        }));
        return;
      }
      
      console.log("User authenticated but no profile found");
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const checkUserRole = async (): Promise<UserRole> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (userProfile) {
        return userProfile.email === 'admin@ifindlife.com' ? 'admin' : 'user';
      }

      const { data: expertProfile } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', session.user.id)
        .maybeSingle();

      if (expertProfile) {
        return 'expert';
      }

      return null;
    } catch (error) {
      console.error("Error checking user role:", error);
      return null;
    }
  };
  
  return {
    authState,
    setAuthState,
    checkUserRole,
    fetchUserData
  };
};
