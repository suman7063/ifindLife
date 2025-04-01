
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
  const { expert, loading: expertStateLoading, users } = useDashboardState();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuthSynchronization();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const { expert: expertAuthProfile, loading: expertAuthLoading } = useExpertAuth();
  
  const loading = expertStateLoading || expertAuthLoading;
  
  // Debug logging
  useEffect(() => {
    console.log('ExpertDashboard - Auth states:', {
      expertStateLoading,
      expertAuthLoading,
      hasExpertStateProfiile: !!expert,
      hasExpertAuthProfile: !!expertAuthProfile,
      isAuthenticated,
      hasUserProfile: !!currentUser,
      redirectAttempted
    });
  }, [expert, expertAuthProfile, expertStateLoading, expertAuthLoading, isAuthenticated, currentUser, redirectAttempted]);
  
  // If not authenticated as expert but authenticated as user, redirect to user dashboard
  useEffect(() => {
    if (!loading && !expertAuthProfile && isAuthenticated && currentUser && !redirectAttempted) {
      console.log('User authenticated but no expert profile found, redirecting to user dashboard');
      setRedirectAttempted(true);
      navigate('/user-dashboard');
    }
  }, [expertAuthProfile, loading, isAuthenticated, currentUser, redirectAttempted, navigate]);
  
  // If not authenticated at all, redirect to login
  useEffect(() => {
    if (!loading && !expertAuthProfile && !isAuthenticated && !currentUser && !redirectAttempted) {
      console.log('Not authenticated as expert or user, redirecting to expert login');
      setRedirectAttempted(true);
      navigate('/expert-login');
    }
  }, [expertAuthProfile, loading, isAuthenticated, currentUser, redirectAttempted, navigate]);
  
  if (loading) {
    return <DashboardLoader />;
  }

  if (!expertAuthProfile) {
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
