
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SessionManager from './sessions/SessionManager';

const SchedulePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Schedule & Sessions</h1>
        <p className="text-muted-foreground">
          Manage your availability, appointments, and sessions
        </p>
      </div>
      
      <Tabs defaultValue="sessions" className="w-full">
        <TabsList>
          <TabsTrigger value="sessions">Session Management</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions">
          <SessionManager />
        </TabsContent>

        <TabsContent value="availability">
          <div className="text-center py-12 text-gray-500">
            <h3 className="text-lg font-medium mb-2">Availability Management</h3>
            <p>Set your available hours and time slots</p>
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <div className="text-center py-12 text-gray-500">
            <h3 className="text-lg font-medium mb-2">Calendar View</h3>
            <p>View all your appointments in calendar format</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchedulePage;
