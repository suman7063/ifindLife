// Import the correct router package based on the framework
import { useNavigate } from 'react-router-dom'; // Using react-router instead of next
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Expert } from '@/types/expert';

export const useSupabaseExpertAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getExpert = async (email: string): Promise<Expert | null> => {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) {
        console.error('Error fetching expert:', error);
        return null;
      }
      
      return data as Expert;
    } catch (error) {
      console.error('Error in getExpert:', error);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // First check if the expert exists
      const expert = await getExpert(email);
      
      if (!expert) {
        toast.error('Expert not found with this email');
        return false;
      }
      
      // For now, use a simple check against localStorage
      // In a real app, you would integrate with Auth
      const experts = JSON.parse(localStorage.getItem('ifindlife-experts') || '[]');
      const matchingExpert = experts.find((e: any) => 
        e.email === email && e.password === password
      );
      
      if (matchingExpert) {
        // Store expert info in localStorage
        localStorage.setItem('ifindlife-expert-email', email);
        toast.success('Login successful');
        navigate('/expert-dashboard');
        return true;
      } else {
        toast.error('Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    // Remove expert info from localStorage
    localStorage.removeItem('ifindlife-expert-email');
    navigate('/expert-login');
    toast.success('Logged out successfully');
  };

  return {
    login,
    logout,
    loading
  };
};
