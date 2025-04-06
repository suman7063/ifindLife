
import { useState, useEffect } from 'react';
import { useExpertAuth } from '@/hooks/useExpertAuth';
import { fetchServices } from '../services/expertServicesService';
import { ServiceType } from '../types';

const useDashboardState = () => {
  const { currentExpert, loading } = useExpertAuth();
  const expert = currentExpert; // Map to the properties expected
  
  const [services, setServices] = useState<ServiceType[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any[]>([]);
  
  useEffect(() => {
    const loadServices = async () => {
      const servicesData = await fetchServices();
      setServices(servicesData);
    };
    
    loadServices();
    
    // In a real app, these would be API calls
    // For now, we'll use mock data
    setUsers([
      { id: 1, name: 'John Doe', email: 'john@example.com', lastSession: '2023-05-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', lastSession: '2023-05-10' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', lastSession: '2023-05-05' },
    ]);
    
    setAppointments([
      { id: 1, user: 'John Doe', date: '2023-05-20', time: '10:00 AM', status: 'confirmed' },
      { id: 2, user: 'Jane Smith', date: '2023-05-22', time: '2:00 PM', status: 'pending' },
      { id: 3, user: 'Bob Johnson', date: '2023-05-25', time: '11:30 AM', status: 'confirmed' },
    ]);
    
    setEarnings([
      { id: 1, user: 'John Doe', amount: 50, date: '2023-05-15', service: 'Therapy Session' },
      { id: 2, user: 'Jane Smith', amount: 35, date: '2023-05-10', service: 'Anxiety Management' },
      { id: 3, user: 'Bob Johnson', amount: 45, date: '2023-05-05', service: 'Depression Counseling' },
    ]);
  }, []);
  
  return {
    expert,
    loading,
    services,
    users,
    appointments,
    earnings
  };
};

export default useDashboardState;
