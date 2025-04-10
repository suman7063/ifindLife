import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase/userProfile';
import { toast } from 'sonner';
import { UserAuthContextType } from './auth/UserAuthContext';
import { getPublicUrl } from '@/utils/storage';

// Create the context with a default empty object
export const UserAuthContext = createContext<UserAuthContextType>({} as UserAuthContextType);

// Custom hook to use the auth context
export const useUserAuth = (): UserAuthContextType => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

// Provider component
export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileNotFound, setProfileNotFound] = useState(false);

  useEffect(() => {
    const getInitialSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
        
        if (session?.user) {
          // Fetch user profile here
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            setProfileNotFound(true);
          } else {
            setCurrentUser(profileData as UserProfile);
            setProfileNotFound(false);
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
        
        if (session?.user) {
          // Fetch user profile here
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            setProfileNotFound(true);
          } else {
            setCurrentUser(profileData as UserProfile);
            setProfileNotFound(false);
          }
        } else {
          setCurrentUser(null);
          setProfileNotFound(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateProfilePicture = async (file: File): Promise<string | null> => {
    if (!user) {
      toast.error('You must be logged in to update your profile picture');
      return null;
    }

    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast.error('Error uploading profile picture');
        return null;
      }

      // Get the public URL safely using a utility function
      const publicUrl = getPublicUrl('avatars', filePath);

      // Update the user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_picture: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating profile with new picture:', updateError);
        toast.error('Error updating profile');
        return null;
      }

      // Update the local state
      setCurrentUser((prev) => prev ? { ...prev, profile_picture: publicUrl } : null);
      toast.success('Profile picture updated');
      
      return publicUrl;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  };

  return (
    <UserAuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        authLoading: loading,
        loading,
        user,
        login: async () => false,
        signup: async () => false,
        logout: async () => false,
        updateProfile: async () => false,
        updatePassword: async () => false,
        updateProfilePicture,
        profileNotFound
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};
