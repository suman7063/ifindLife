
import { useState, useEffect } from 'react';
import { useExpertAuth } from '@/hooks/useExpertAuth';

const useDashboardState = () => {
  const { currentExpert, isLoading } = useExpertAuth();
  const [expert, setExpert] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        setExpert(currentExpert);
        // This would normally fetch data from the API
        setUsers([
          { id: '1', name: 'Test User 1', email: 'user1@example.com' },
          { id: '2', name: 'Test User 2', email: 'user2@example.com' },
        ]);
        setAppointments([]);
        setEarnings(0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentExpert) {
      fetchDashboardData();
    } else {
      setLoading(isLoading);
    }
  }, [currentExpert, isLoading]);

  return {
    expert,
    users,
    appointments,
    earnings,
    loading
  };
};

export default useDashboardState;
