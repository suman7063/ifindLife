
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
import { toast } from 'sonner';

const ExpertDashboard = () => {
  const { expert, loading: expertStateLoading, users } = useDashboardState();
  const navigate = useNavigate();
  const { expertProfile, isAuthenticated, isLoading, role } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Check authentication and redirect if necessary
  useEffect(() => {
    const checkAuth = async () => {
      console.log('ExpertDashboard - Auth states:', {
        expertStateLoading,
        isLoading,
        hasExpertProfile: !!expertProfile,
        isAuthenticated,
        role
      });
      
      if (!isLoading) {
        if (!isAuthenticated) {
          console.log('Not authenticated, redirecting to expert login');
          toast.error('Please log in to access the expert dashboard');
          navigate('/expert-login');
        } else if (role !== 'expert') {
          console.log('Not an expert, redirecting to user dashboard');
          toast.error('You need expert privileges to access this page');
          navigate('/user-dashboard');
        }
        
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [isAuthenticated, isLoading, expertProfile, role, navigate, expertStateLoading]);
  
  if (isLoading || expertStateLoading || isCheckingAuth) {
    return <DashboardLoader />;
  }

  if (!expertProfile || role !== 'expert') {
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
