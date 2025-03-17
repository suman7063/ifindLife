
import { useState, useEffect } from 'react';
import { supabase, from } from '@/lib/supabase';
import { toast } from 'sonner';
import { Expert } from '@/types/supabase';

export const useSupabaseExpertAuth = () => {
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        setLoading(true);
        
        // Get the current session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData?.session) {
          setExpert(null);
          return;
        }
        
        // Get the expert from the database
        const { data, error } = await from('experts')
          .select('*')
          .eq('email', sessionData.session.user.email)
          .single();
        
        if (error) {
          // Check if it's a not found error versus a server error
          if (error.code === 'PGRST116') {
            // This is "No rows returned" error - the expert doesn't exist
            console.log("Expert not found in database");
            setExpert(null);
          } else {
            // Handle other errors
            console.error("Error fetching expert:", error.message || "Unknown error");
            toast.error(`Error fetching expert profile: ${error.message || "Unknown error"}`);
          }
          return;
        }
        
        setExpert(data as Expert);
        
      } catch (error: any) {
        console.error('Error checking expert auth:', error);
        toast.error(error.message || 'Error checking expert authentication');
      } finally {
        setLoading(false);
      }
    };

    fetchExpert();

    // Listen for changes to auth state
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setExpert(null);
      } else {
        fetchExpert();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setExpert(null);
      toast.success('Successfully logged out');
      return true;
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error(error.message || 'Error logging out');
      return false;
    }
  };

  return { expert, loading, logout };
};
