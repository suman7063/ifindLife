
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/expert/dashboard/DashboardLayout';
import DashboardLoader from '@/components/expert/dashboard/DashboardLoader';
import UnauthorizedView from '@/components/expert/dashboard/UnauthorizedView';
import AppointmentsTab from '@/components/expert/dashboard/AppointmentsTab';
import EarningsTab from '@/components/expert/dashboard/EarningsTab';
import SettingsTab from '@/components/expert/dashboard/SettingsTab';
import ExpertProfileEdit from '@/components/expert/ExpertProfileEdit';
import UserReports from '@/components/expert/UserReports';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

const ExpertDashboard = () => {
  const navigate = useNavigate();
  const { isLoading, expertProfile, isAuthenticated, role } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  
  // Debug logging
  useEffect(() => {
    console.log('ExpertDashboard - Auth states:', {
      authLoading: isLoading,
      hasExpertProfile: !!expertProfile,
      isAuthenticated,
      role
    });
  }, [expertProfile, isLoading, isAuthenticated, role]);
  
  // If not authenticated at all, redirect to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to expert login');
      toast.error('Please log in to access the expert dashboard');
      navigate('/expert-login');
      return;
    }
    
    // If authenticated but not as expert, redirect to appropriate dashboard
    if (!isLoading && isAuthenticated && role !== 'expert') {
      console.log('Authenticated but not as expert, redirecting');
      toast.error('You do not have expert privileges');
      if (role === 'user') {
        navigate('/user-dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isLoading, isAuthenticated, role, navigate]);
  
  if (isLoading) {
    return <DashboardLoader />;
  }

  if (!expertProfile) {
    return <UnauthorizedView />;
  }

  return (
    <DashboardLayout>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8 md:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="reports">User Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ExpertProfileEdit />
        </TabsContent>
        
        <TabsContent value="appointments">
          <AppointmentsTab />
        </TabsContent>
        
        <TabsContent value="earnings">
          <EarningsTab />
        </TabsContent>
        
        <TabsContent value="reports">
          <UserReports users={users} />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ExpertDashboard;
