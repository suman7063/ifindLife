
import React, { useState } from 'react';
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

const ExpertDashboard = () => {
  const { expert, loading, users } = useDashboardState();
  
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
