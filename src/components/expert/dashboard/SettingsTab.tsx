
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AvailabilityManagement from '../availability/AvailabilityManagement';

const SettingsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <Tabs defaultValue="availability" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="availability" className="flex-1">Appointment Settings</TabsTrigger>
          <TabsTrigger value="account" className="flex-1">Account Settings</TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="availability" className="mt-6">
          <AvailabilityManagement />
        </TabsContent>
        
        <TabsContent value="account" className="mt-6">
          <div className="p-4 bg-muted rounded-md">
            <p className="text-muted-foreground">Account settings will be implemented in a future update.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <div className="p-4 bg-muted rounded-md">
            <p className="text-muted-foreground">Notification settings will be implemented in a future update.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTab;
