
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile, ExpertProfile } from '@/types/database/unified';
import { useAuth } from '@/contexts/auth/AuthContext';

/**
 * A hook to fetch all user-related data
 */
export const useUserDataFetcher = () => {
  const auth = useAuth();
  const { user, userProfile } = auth;
  const [favorites, setFavorites] = useState<ExpertProfile[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Use the refresh function if available, otherwise use existing profile
        let updatedProfile = userProfile;
        if (auth.refreshProfile) {
          await auth.refreshProfile();
          updatedProfile = auth.userProfile;
        }
        
        if (!updatedProfile) {
          setError('Failed to fetch user profile');
          return;
        }
        
        // Fetch favorite experts
        const { data: favoriteData, error: favoriteError } = await supabase
          .from('user_favorites')
          .select('expert_id')
          .eq('user_id', user.id);
          
        if (favoriteError) {
          console.error('Error fetching favorites:', favoriteError);
        } else if (favoriteData) {
          // Get details for each favorite expert
          const expertIds = favoriteData.map(f => f.expert_id);
          if (expertIds.length > 0) {
            // Convert expert IDs to strings for the query
            const expertIdStrings = expertIds.map(id => String(id));
            
            const { data: expertData } = await supabase
              .from('experts')
              .select('*')
              .in('id', expertIdStrings);
              
            if (expertData) {
              setFavorites(expertData as ExpertProfile[]);
            }
          }
        }
        
        // Fetch transactions
        const { data: transData, error: transError } = await supabase
          .from('user_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
          
        if (transError) {
          console.error('Error fetching transactions:', transError);
        } else {
          setTransactions(transData || []);
        }
        
        // Fetch enrolled courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('user_courses')
          .select('*')
          .eq('user_id', user.id);
          
        if (coursesError) {
          console.error('Error fetching courses:', coursesError);
        } else {
          setEnrolledCourses(coursesData || []);
        }
        
        // Fetch upcoming appointments
        const { data: appData, error: appError } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .order('appointment_date', { ascending: true });
          
        if (appError) {
          console.error('Error fetching appointments:', appError);
        } else {
          setAppointments(appData || []);
        }
        
      } catch (err) {
        console.error('Error in useUserDataFetcher:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user, userProfile, auth]);
  
  return {
    userProfile,
    favorites,
    transactions,
    enrolledCourses,
    appointments,
    loading,
    error
  };
};
