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
      
      // Then check if it's an expert
      const { data: expertData, error: expertError } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .maybeSingle();
        
      console.log("Fetch results:", {
        userProfile: userProfile ? "found" : "not found",
        expertData: expertData ? "found" : "not found",
      });
      
      // Determine role and session type
      const hasUserProfile = !!userProfile;
      const hasExpertProfile = !!expertData && expertData.status === 'approved';
      
      let sessionType: 'none' | 'user' | 'expert' | 'dual' = 'none';
      let role: UserRole = null;
      
      if (hasUserProfile && hasExpertProfile) {
        // Both profiles exist - this is a dual account
        sessionType = 'dual';
        
        // Get role preference from localStorage if it exists
        const savedRole = localStorage.getItem('preferredRole');
        const loginOrigin = sessionStorage.getItem('loginOrigin');
        
        console.log("Dual account detected:", { 
          savedRole, 
          loginOrigin,
          hasUserProfile, 
          hasExpertProfile 
        });
        
        // If logging in from expert page, prioritize expert role
        if (loginOrigin === 'expert') {
          role = 'expert';
          localStorage.setItem('preferredRole', 'expert');
        }
        // If logging in from user page, prioritize user role
        else if (loginOrigin === 'user') {
          role = 'user';
          localStorage.setItem('preferredRole', 'user');
        }
        // Otherwise use saved preference or default to user
        else if (savedRole === 'expert' || savedRole === 'user') {
          role = savedRole;
        } else {
          role = 'user'; // Default for dual accounts
          localStorage.setItem('preferredRole', 'user');
        }
      } else if (hasUserProfile) {
        sessionType = 'user';
        role = 'user';
      } else if (hasExpertProfile) {
        sessionType = 'expert';
        role = 'expert';
      }
      
      console.log("Role determination complete:", { 
        sessionType, 
        role,
        userProfile: hasUserProfile ? "exists" : "missing",
        expertProfile: hasExpertProfile ? "exists" : "missing",
      });
      
      // Ensure the expert profile includes the status field
      const expertProfile = expertData ? {
        ...expertData,
        status: (expertData.status || 'pending') as 'pending' | 'approved' | 'disapproved'
      } : null;
      
      // Update auth state with all user data
      setAuthState(prev => ({
        ...prev,
        userProfile,
        expertProfile,
        role,
        sessionType,
        isLoading: false,
      }));
      
      // Store session type and role in local storage to persist across page refreshes
      localStorage.setItem('sessionType', sessionType);
      if (role) localStorage.setItem('preferredRole', role);
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
