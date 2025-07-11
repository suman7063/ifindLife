
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SessionManager from './sessions/SessionManager';
import AvailabilityManagement from '@/components/expert/availability/AvailabilityManagement';
import BookingCalendar from './schedule/BookingCalendar';
import GoogleCalendarIntegration from './schedule/GoogleCalendarIntegration';

const SchedulePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Schedule & Sessions</h1>
        <p className="text-muted-foreground">
          Manage your availability, appointments, and sessions
        </p>
      </div>
      
      <Tabs defaultValue="availability" className="w-full">
        <TabsList>
          <TabsTrigger value="availability">Availability Management</TabsTrigger>
          <TabsTrigger value="sessions">Session Management</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="availability">
          <div className="space-y-6">
            <AvailabilityManagement />
            <GoogleCalendarIntegration />
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          <SessionManager />
        </TabsContent>

        <TabsContent value="calendar">
          <BookingCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchedulePage;
