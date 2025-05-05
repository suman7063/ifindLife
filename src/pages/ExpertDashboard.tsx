
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
import { useAuth } from '@/contexts/auth/AuthContext';

const ExpertDashboard = () => {
  const { expert, loading: expertStateLoading, users } = useDashboardState();
  const navigate = useNavigate();
  const { isLoading, expertProfile, isAuthenticated } = useAuth();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  
  const loading = expertStateLoading || isLoading;
  
  // Debug logging
  useEffect(() => {
    console.log('ExpertDashboard - Auth states:', {
      expertStateLoading,
      authLoading: isLoading,
      hasExpertStateProfile: !!expert,
      hasExpertAuthProfile: !!expertProfile,
      isAuthenticated,
      redirectAttempted
    });
  }, [expert, expertProfile, expertStateLoading, isLoading, isAuthenticated, redirectAttempted]);
  
  // If not authenticated at all, redirect to login
  useEffect(() => {
    if (!loading && !expertProfile && !isAuthenticated && !redirectAttempted) {
      console.log('Not authenticated, redirecting to expert login');
      setRedirectAttempted(true);
      navigate('/expert-login');
    }
  }, [expertProfile, loading, isAuthenticated, redirectAttempted, navigate]);
  
  if (loading) {
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
