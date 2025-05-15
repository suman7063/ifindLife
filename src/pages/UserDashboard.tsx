
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProfileSettings from '@/components/user/dashboard/ProfileSettings';
import EnrolledPrograms from '@/components/dashboard/EnrolledPrograms';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import FavoriteExperts from '@/components/dashboard/FavoriteExperts';
import RecentActivities from '@/components/dashboard/RecentActivities';
import WalletSummary from '@/components/dashboard/WalletSummary';
import { toast } from 'sonner';
import { Container } from '@/components/ui/container';
import { Helmet } from 'react-helmet-async';

const UserDashboard: React.FC = () => {
  const { isAuthenticated, isLoading, userProfile } = useAuth();
  const navigate = useNavigate();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !redirectAttempted) {
      setRedirectAttempted(true);
      toast.error('Please log in to access your dashboard');
      navigate('/user-login');
    }
  }, [isAuthenticated, isLoading, navigate, redirectAttempted]);
  
  if (isLoading) {
    return (
      <Container className="min-h-screen py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </Container>
    );
  }
  
  if (!isAuthenticated || !userProfile) {
    return null;
  }
  
  return (
    <>
      <Helmet>
        <title>User Dashboard | IFindLife</title>
      </Helmet>
      
      <DashboardLayout>
        <div className="container p-4 mx-auto">
          <h1 className="text-3xl font-bold mb-6">Welcome, {userProfile.name}</h1>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WalletSummary />
                <UpcomingAppointments limit={3} />
                <RecentActivities />
              </div>
            </TabsContent>
            
            <TabsContent value="appointments">
              <UpcomingAppointments />
            </TabsContent>
            
            <TabsContent value="favorites">
              <FavoriteExperts />
            </TabsContent>
            
            <TabsContent value="programs">
              <EnrolledPrograms />
            </TabsContent>
            
            <TabsContent value="wallet">
              <WalletSummary showTransactions />
            </TabsContent>
            
            <TabsContent value="settings">
              {userProfile && <ProfileSettings user={userProfile} />}
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
};

export default UserDashboard;
