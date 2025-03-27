
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ExpertProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string;
  bio?: string;
  certificate_urls?: string[];
  profile_picture?: string;
  selected_services?: number[];
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  status?: string;
  created_at?: string;
}

export const useExpertAuth = () => {
  const [expert, setExpert] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();

  // Function to fetch expert profile from supabase
  const fetchExpertProfile = async (userId: string) => {
    try {
      console.log("Fetching expert profile for user ID:", userId);
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .single();

      if (error) {
        console.error('Error fetching expert profile:', error);
        return null;
      }

      if (!data) {
        console.log('No expert profile found for this user');
        return null;
      }

      console.log('Expert profile retrieved:', data);
      return data as ExpertProfile;
    } catch (error) {
      console.error('Exception in fetchExpertProfile:', error);
      return null;
    }
  };

  // Initialize authentication and fetch expert profile
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session ? 'Has session' : 'No session');
            
            if (!session) {
              setExpert(null);
              setLoading(false);
              return;
            }

            const expertProfile = await fetchExpertProfile(session.user.id);
            setExpert(expertProfile);
            setLoading(false);
          }
        );

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('Found existing session, fetching expert profile');
          const expertProfile = await fetchExpertProfile(session.user.id);
          setExpert(expertProfile);
        }
        
        setLoading(false);
        setAuthInitialized(true);

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing expert auth:', error);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return false;
      }

      if (!data.session) {
        toast.error('No session created');
        setLoading(false);
        return false;
      }

      const expertProfile = await fetchExpertProfile(data.user.id);
      
      if (!expertProfile) {
        toast.error('No expert profile found. Please register as an expert.');
        await supabase.auth.signOut();
        setLoading(false);
        return false;
      }
      
      setExpert(expertProfile);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setExpert(null);
      toast.success('Logged out successfully');
      navigate('/expert-login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    } finally {
      setLoading(false);
    }
  };

  // Register function that creates both auth user and expert profile
  const register = async (expertData: {
    name: string,
    email: string,
    password: string,
    phone?: string,
    address?: string,
    city?: string,
    state?: string,
    country?: string,
    specialization?: string,
    experience?: string,
    bio?: string,
    certificate_urls?: string[],
    selected_services?: number[]
  }): Promise<boolean> => {
    setLoading(true);
    
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: expertData.email,
        password: expertData.password,
        options: {
          data: {
            name: expertData.name,
            role: 'expert'
          }
        }
      });

      if (authError) {
        toast.error(authError.message);
        setLoading(false);
        return false;
      }

      if (!authData.user) {
        toast.error('Failed to create user');
        setLoading(false);
        return false;
      }

      // 2. Create expert profile
      const { error: profileError } = await supabase
        .from('expert_accounts')
        .insert({
          auth_id: authData.user.id,
          name: expertData.name,
          email: expertData.email,
          phone: expertData.phone,
          address: expertData.address,
          city: expertData.city,
          state: expertData.state,
          country: expertData.country,
          specialization: expertData.specialization,
          experience: expertData.experience,
          bio: expertData.bio,
          certificate_urls: expertData.certificate_urls || [],
          selected_services: expertData.selected_services || []
        });

      if (profileError) {
        console.error('Error creating expert profile:', profileError);
        // Try to clean up the auth user since profile creation failed
        await supabase.auth.signOut();
        toast.error('Failed to create expert profile');
        setLoading(false);
        return false;
      }

      toast.success('Registration successful! Please check your email for verification.');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred during registration');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update expert profile
  const updateProfile = async (profileData: Partial<ExpertProfile>): Promise<boolean> => {
    if (!expert) {
      toast.error('You must be logged in to update your profile');
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('expert_accounts')
        .update(profileData)
        .eq('id', expert.id);

      if (error) {
        toast.error('Failed to update profile: ' + error.message);
        return false;
      }

      // Refresh the expert data
      const { data } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('id', expert.id)
        .single();

      if (data) {
        setExpert(data as ExpertProfile);
      }

      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to upload certificate
  const uploadCertificate = async (file: File): Promise<string | null> => {
    if (!expert) {
      toast.error('You must be logged in to upload certificates');
      return null;
    }

    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error('No active session found');
        return null;
      }

      const userId = session.session.user.id;
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { error, data } = await supabase.storage
        .from('expert-certificates')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        toast.error('Failed to upload certificate: ' + error.message);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('expert-certificates')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Update expert profile with new certificate URL
      const currentUrls = expert.certificate_urls || [];
      const { error: updateError } = await supabase
        .from('expert_accounts')
        .update({
          certificate_urls: [...currentUrls, publicUrl]
        })
        .eq('id', expert.id);

      if (updateError) {
        toast.error('Failed to update profile with certificate: ' + updateError.message);
        return null;
      }

      // Refresh the expert data
      const { data: expertData } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('id', expert.id)
        .single();

      if (expertData) {
        setExpert(expertData as ExpertProfile);
      }

      toast.success('Certificate uploaded successfully');
      return publicUrl;
    } catch (error) {
      console.error('Error uploading certificate:', error);
      toast.error('An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to remove certificate
  const removeCertificate = async (certificateUrl: string): Promise<boolean> => {
    if (!expert) {
      toast.error('You must be logged in to remove certificates');
      return false;
    }

    setLoading(true);
    try {
      // Get the file path from the URL
      const fullUrl = new URL(certificateUrl);
      const path = fullUrl.pathname.split('/').slice(2).join('/');

      // Remove from storage
      const { error: storageError } = await supabase.storage
        .from('expert-certificates')
        .remove([path]);

      // Even if there's an error removing from storage (file might not exist),
      // we should still update the profile
      if (storageError) {
        console.warn('Warning: Failed to remove file from storage:', storageError);
      }

      // Update expert profile to remove the certificate URL
      const currentUrls = expert.certificate_urls || [];
      const updatedUrls = currentUrls.filter(url => url !== certificateUrl);

      const { error: updateError } = await supabase
        .from('expert_accounts')
        .update({
          certificate_urls: updatedUrls
        })
        .eq('id', expert.id);

      if (updateError) {
        toast.error('Failed to update profile: ' + updateError.message);
        return false;
      }

      // Refresh the expert data
      const { data } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('id', expert.id)
        .single();

      if (data) {
        setExpert(data as ExpertProfile);
      }

      toast.success('Certificate removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing certificate:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    expert,
    loading,
    login,
    logout,
    register,
    updateProfile,
    uploadCertificate,
    removeCertificate,
    authInitialized
  };
};
