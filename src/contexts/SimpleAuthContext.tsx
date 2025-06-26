
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

const SimpleAuthContext = createContext<SimpleAuthState | undefined>(undefined);

interface SimpleAuthProviderProps {
  children: ReactNode;
}

export const SimpleAuthProvider: React.FC<SimpleAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<UserType>('none');
  const [isLoading, setIsLoading] = useState(true);
  const [expert, setExpert] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  const determineUserType = async (currentUser: User | null): Promise<UserType> => {
    if (!currentUser) {
      setExpert(null);
      setUserProfile(null);
      return 'none';
    }

    try {
      console.log('SimpleAuthContext: Determining user type for:', currentUser.id);

      // Check if user is an expert first
      const { data: expertData, error: expertError } = await supabase
        .from('experts')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (!expertError && expertData) {
        console.log('SimpleAuthContext: User is an expert:', expertData.name);
        setExpert(expertData);
        setUserProfile(null);
        return 'expert';
      }

      // Check if user has a regular user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (!profileError && profileData) {
        console.log('SimpleAuthContext: User has user profile:', profileData.name);
        setUserProfile(profileData);
        setExpert(null);
        return 'user';
      }

      // If no specific profile found, create a basic user profile
      console.log('SimpleAuthContext: No profile found, creating basic user profile');
      const basicProfile = {
        id: currentUser.id,
        name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'User',
        email: currentUser.email || '',
        phone: '',
        country: '',
        city: '',
        wallet_balance: 0,
        currency: 'USD',
        profile_picture: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        referred_by: null,
        referral_code: '',
        referral_link: '',
        favorite_experts: [],
        favorite_programs: [],
        enrolled_courses: [],
        reviews: [],
        reports: [],
        transactions: [],
        referrals: []
      };
      
      setUserProfile(basicProfile);
      setExpert(null);
      return 'user';
    } catch (error) {
      console.error('SimpleAuthContext: Error determining user type:', error);
      // Default to user with basic profile
      const basicProfile = {
        id: currentUser.id,
        name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'User',
        email: currentUser.email || '',
        phone: '',
        country: '',
        city: '',
        wallet_balance: 0,
        currency: 'USD',
        profile_picture: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        referred_by: null,
        referral_code: '',
        referral_link: '',
        favorite_experts: [],
        favorite_programs: [],
        enrolled_courses: [],
        reviews: [],
        reports: [],
        transactions: [],
        referrals: []
      };
      
      setUserProfile(basicProfile);
      setExpert(null);
      return 'user';
    }
  };

  const login = async (email: string, password: string, options?: { asExpert?: boolean }): Promise<boolean> => {
    try {
      console.log('SimpleAuthContext: Attempting login for:', email, options?.asExpert ? 'as expert' : 'as user');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('SimpleAuthContext: Login error:', error);
        return false;
      }

      if (!data.user || !data.session) {
        console.error('SimpleAuthContext: No user or session returned');
        return false;
      }

      console.log('SimpleAuthContext: Login successful, determining user type...');
      
      // Set session immediately
      setSession(data.session);
      setUser(data.user);
      
      // Determine user type
      const type = await determineUserType(data.user);
      setUserType(type);
      
      // If trying to login as expert but user type is not expert, fail
      if (options?.asExpert && type !== 'expert') {
        console.error('SimpleAuthContext: User attempted expert login but is not an expert');
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setUserType('none');
        setExpert(null);
        setUserProfile(null);
        return false;
      }
      
      console.log('SimpleAuthContext: Login completed successfully as:', type);
      return true;
    } catch (error) {
      console.error('SimpleAuthContext: Login exception:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('SimpleAuthContext: Logging out...');
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setUserType('none');
      setExpert(null);
      setUserProfile(null);
      console.log('SimpleAuthContext: Logout completed');
    } catch (error) {
      console.error('SimpleAuthContext: Logout error:', error);
    }
  };

  useEffect(() => {
    console.log('SimpleAuthContext: Setting up auth state listener (singleton)...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('SimpleAuthContext: Auth state changed:', event, session ? 'Session exists' : 'No session');
        
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
      console.log('SimpleAuthContext: Initial session check:', session ? 'Session exists' : 'No session');
      
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

  const value: SimpleAuthState = {
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

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

export const useSimpleAuthContext = (): SimpleAuthState => {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuthContext must be used within a SimpleAuthProvider');
  }
  return context;
};
