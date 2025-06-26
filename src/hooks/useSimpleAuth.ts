
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type UserType = 'user' | 'expert' | 'none';

export interface SimpleAuthState {
  user: User | null;
  session: Session | null;
  userType: UserType;
  isLoading: boolean;
  isAuthenticated: boolean;
  expert: any | null;
  userProfile: any | null;
  login: (email: string, password: string, options?: { asExpert?: boolean }) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useSimpleAuth = (): SimpleAuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<UserType>('none');
  const [isLoading, setIsLoading] = useState(true);
  const [expert, setExpert] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  const determineUserType = async (currentUser: User | null): Promise<UserType> => {
    if (!currentUser) return 'none';

    try {
      // Check if user is an expert
      const { data: expertData } = await supabase
        .from('experts')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (expertData) {
        setExpert(expertData);
        return 'expert';
      }

      // Check if user has a regular user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (profileData) {
        setUserProfile(profileData);
        return 'user';
      }

      // Default to user if no specific profile found
      return 'user';
    } catch (error) {
      console.error('Error determining user type:', error);
      return 'user'; // Default fallback
    }
  };

  const login = async (email: string, password: string, options?: { asExpert?: boolean }): Promise<boolean> => {
    try {
      console.log('SimpleAuth: Attempting login for:', email, options?.asExpert ? 'as expert' : 'as user');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('SimpleAuth: Login error:', error);
        return false;
      }

      if (!data.user || !data.session) {
        console.error('SimpleAuth: No user or session returned');
        return false;
      }

      console.log('SimpleAuth: Login successful, determining user type...');
      
      // Set session immediately
      setSession(data.session);
      setUser(data.user);
      
      // Determine user type
      const type = await determineUserType(data.user);
      setUserType(type);
      
      // If trying to login as expert but user type is not expert, fail
      if (options?.asExpert && type !== 'expert') {
        console.error('SimpleAuth: User attempted expert login but is not an expert');
        await supabase.auth.signOut();
        return false;
      }
      
      // If trying to login as user but user type is expert, allow it
      // (experts can access user areas)
      
      console.log('SimpleAuth: Login completed successfully as:', type);
      return true;
    } catch (error) {
      console.error('SimpleAuth: Login exception:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('SimpleAuth: Logging out...');
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setUserType('none');
      setExpert(null);
      setUserProfile(null);
      console.log('SimpleAuth: Logout completed');
    } catch (error) {
      console.error('SimpleAuth: Logout error:', error);
    }
  };

  useEffect(() => {
    console.log('SimpleAuth: Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('SimpleAuth: Auth state changed:', event, session ? 'Session exists' : 'No session');
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          const type = await determineUserType(session.user);
          setUserType(type);
        } else {
          setUserType('none');
          setExpert(null);
          setUserProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('SimpleAuth: Initial session check:', session ? 'Session exists' : 'No session');
      
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        const type = await determineUserType(session.user);
        setUserType(type);
      } else {
        setUserType('none');
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    userType,
    isLoading,
    isAuthenticated: !!user,
    expert,
    userProfile,
    login,
    logout
  };
};
