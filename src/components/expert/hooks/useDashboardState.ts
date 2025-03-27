
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpertAuth } from './useExpertAuth';
import { toast } from 'sonner';
import type { UserBasic } from '@/types/user';

export const useDashboardState = () => {
  const { expert, loading } = useExpertAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserBasic[]>([]);
  
  useEffect(() => {
    // Check if user is authenticated
    if (!loading && !expert) {
      toast.error('Please log in to access the expert dashboard');
      navigate('/expert-login');
      return;
    }
    
    // Load users from localStorage for reporting functionality
    const storedUsers = localStorage.getItem('ifindlife-users');
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (e) {
        console.error("Error loading users:", e);
      }
    }
  }, [expert, loading, navigate]);

  return {
    expert,
    loading,
    users: users.map(user => ({
      id: user.id,
      name: user.name
    }))
  };
};

export default useDashboardState;
