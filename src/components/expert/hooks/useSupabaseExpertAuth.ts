
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { ExpertFormData, ReportUserType } from '../types';

type ExpertAuthReturnType = {
  expert: ExpertFormData | null;
  loading: boolean;
  reportUser: (report: Omit<ReportUserType, 'id' | 'date' | 'status'>) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const useSupabaseExpertAuth = (): ExpertAuthReturnType => {
  const [expert, setExpert] = useState<ExpertFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const expertEmail = localStorage.getItem('ifindlife-expert-email');
        
        if (!expertEmail) {
          // Only navigate to login if we're on a protected route
          if (window.location.pathname.includes('expert-dashboard')) {
            navigate('/expert-login');
          }
          setLoading(false);
          return;
        }
        
        // Fetch expert data from Supabase
        const { data, error } = await supabase
          .from('experts')
          .select('*')
          .eq('email', expertEmail)
          .single();
        
        if (error || !data) {
          console.error('Error fetching expert data:', error);
          toast.error('Error loading your data. Please login again.');
          localStorage.removeItem('ifindlife-expert-email');
          if (window.location.pathname.includes('expert-dashboard')) {
            navigate('/expert-login');
          }
        } else {
          // Transform Supabase data to match ExpertFormData structure
          const expertData: ExpertFormData = {
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
            confirmPassword: data.password, // Not stored in DB but needed for the type
            address: data.address,
            city: data.city,
            state: data.state,
            country: data.country,
            specialization: data.specialization,
            experience: data.experience,
            certificates: [], // Actual files aren't stored
            certificateUrls: data.certificate_urls || [],
            bio: data.bio,
            selectedServices: data.selected_services,
            acceptedTerms: true, // Not stored in DB but needed for the type
            profilePicture: data.profile_picture || undefined,
            reportedUsers: [] // Will be loaded separately if needed
          };
          
          setExpert(expertData);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check if the expert exists with the provided credentials
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('email', email)
        .eq('password', password) // In a production app, you'd use Supabase Auth instead
        .single();
      
      if (error || !data) {
        toast.error('Invalid email or password');
        return false;
      }
      
      // Store the expert's email in localStorage for session management
      localStorage.setItem('ifindlife-expert-email', email);
      
      // Transform Supabase data to match ExpertFormData structure
      const expertData: ExpertFormData = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.password, // Not stored in DB but needed for the type
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        specialization: data.specialization,
        experience: data.experience,
        certificates: [], // Actual files aren't stored
        certificateUrls: data.certificate_urls || [],
        bio: data.bio,
        selectedServices: data.selected_services,
        acceptedTerms: true, // Not stored in DB but needed for the type
        profilePicture: data.profile_picture || undefined,
        reportedUsers: [] // Will be loaded separately if needed
      };
      
      setExpert(expertData);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('ifindlife-expert-email');
    setExpert(null);
    navigate('/expert-login');
    toast.success('Logged out successfully');
  };

  const reportUser = async (reportData: Omit<ReportUserType, 'id' | 'date' | 'status'>): Promise<void> => {
    if (!expert) {
      toast.error('You must be logged in to report a user');
      return;
    }

    try {
      const newReport = {
        expert_id: expert.id,
        user_id: reportData.userId,
        user_name: reportData.userName,
        reason: reportData.reason,
        details: reportData.details,
        date: new Date().toISOString(),
        status: 'pending'
      };

      const { error } = await supabase
        .from('expert_reports')
        .insert(newReport);
      
      if (error) {
        throw error;
      }
      
      toast.success('User reported successfully');
    } catch (error) {
      console.error('Error reporting user:', error);
      toast.error('Failed to report user. Please try again.');
    }
  };

  return { expert, loading, reportUser, login, logout };
};
