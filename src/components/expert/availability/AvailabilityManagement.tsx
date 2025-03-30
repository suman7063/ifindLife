
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExpertAvailabilityForm from './ExpertAvailabilityForm';
import ExpertAvailabilityList from './ExpertAvailabilityList';
import AppointmentsList from '../dashboard/AppointmentsList';
import { useUserAuth } from '@/hooks/user-auth';

const AvailabilityManagement = () => {
  const [activeTab, setActiveTab] = useState('current');
  const { currentUser } = useUserAuth();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Availability Management</h1>
      </div>
      
      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Availability</TabsTrigger>
          <TabsTrigger value="set">Set Availability</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="mt-6">
          <ExpertAvailabilityList />
        </TabsContent>
        
        <TabsContent value="set" className="mt-6">
          <ExpertAvailabilityForm />
        </TabsContent>
        
        <TabsContent value="appointments" className="mt-6">
          <AppointmentsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AvailabilityManagement;
