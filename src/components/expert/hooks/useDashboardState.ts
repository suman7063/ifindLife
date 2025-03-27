
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpertAuth } from '@/hooks/useExpertAuth';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { UserBasic } from '@/types/user';

export const useDashboardState = () => {
  const { expert, loading } = useExpertAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserBasic[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    if (!loading && !expert) {
      toast.error('Please log in to access the expert dashboard');
      navigate('/expert-login');
      return;
    }
    
    // Load users from database for reporting functionality
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const { data, error } = await supabase
          .from('users')
          .select('id, name')
          .order('name', { ascending: true });
        
        if (error) {
          console.error("Error loading users:", error);
          return;
        }
        
        if (data) {
          setUsers(data as UserBasic[]);
        }
      } catch (e) {
        console.error("Error loading users:", e);
      } finally {
        setLoadingUsers(false);
      }
    };
    
    if (expert) {
      fetchUsers();
    }
  }, [expert, loading, navigate]);

  return {
    expert,
    loading: loading || loadingUsers,
    users
  };
};

export default useDashboardState;
