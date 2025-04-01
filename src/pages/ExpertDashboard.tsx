
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
import useDashboardState from '@/components/expert/hooks/useDashboardState';
import { useNavigate } from 'react-router-dom';
import { useExpertAuth } from '@/hooks/expert-auth';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';

const ExpertDashboard = () => {
  const { expert, loading, users } = useDashboardState();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuthSynchronization();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  
  // If user is authenticated but not expert, redirect to user dashboard
  useEffect(() => {
    if (!loading && !expert && isAuthenticated && currentUser && !redirectAttempted) {
      console.log('User authenticated but not expert, redirecting to user dashboard');
      setRedirectAttempted(true);
      navigate('/user-dashboard');
    }
  }, [expert, loading, isAuthenticated, currentUser, redirectAttempted, navigate]);
  
  if (loading) {
    return <DashboardLoader />;
  }

  if (!expert) {
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
