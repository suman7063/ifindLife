import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const useSupabaseExpertAuth = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signup = async (formData: any) => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
          },
        },
      });

      if (authError) {
        console.error('Authentication error:', authError);
        toast.error(authError.message);
        return false;
      }

      // Upload certificates
      const certificateUrls = [];
      if (formData.certificates && formData.certificates.length > 0) {
        for (const certificate of formData.certificates) {
          const { data: storageData, error: storageError } = await supabase.storage
            .from('expert-certificates')
            .upload(`${authData.user?.id}/${certificate.name}`, certificate, {
              cacheControl: '3600',
              upsert: false,
            });

          if (storageError) {
            console.error('Storage error:', storageError);
            toast.error('Failed to upload certificates.');
            return false;
          }

          const { data: publicUrl } = supabase.storage
            .from('expert-certificates')
            .getPublicUrl(storageData?.path || '');
          certificateUrls.push(publicUrl.publicUrl);
        }
      }

      // Create expert profile
      const { error: profileError } = await supabase.from('experts').insert([
        {
          id: authData.user?.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          specialization: formData.specialization,
          experience: formData.experience,
          bio: formData.bio,
          certificate_urls: certificateUrls,
          selected_services: formData.selectedServices,
        },
      ]);

      if (profileError) {
        console.error('Profile error:', profileError);
        toast.error('Failed to create expert profile.');
        return false;
      }

      toast.success('Signup successful!');
      router.push('/login');
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
        return false;
      }

      toast.success('Login successful!');
      router.push('/expert/dashboard');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error);
        toast.error(error.message);
        return false;
      }

      toast.success('Logout successful!');
      router.push('/expert/login');
      return true;
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getExpert = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Error fetching expert profile:', error);
        return null; // Return null instead of error
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching expert profile:', error);
      return null;
    }
  };

  return { signup, login, logout, getExpert, loading };
};
