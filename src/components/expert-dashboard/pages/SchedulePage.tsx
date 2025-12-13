
import React, { useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import SessionManager from './sessions/SessionManager';
import AvailabilityManagement from '@/components/expert/availability/AvailabilityManagement';
import BookingCalendar from './schedule/BookingCalendar';
import GoogleCalendarIntegration from './schedule/GoogleCalendarIntegration';

const SchedulePage: React.FC = () => {
  const formRef = useRef<HTMLDivElement>(null);

  const handleCreateAvailability = () => {
    // Scroll to the form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Trigger form submission
      const form = formRef.current.querySelector('form');
      if (form) {
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton && !submitButton.disabled) {
          submitButton.click();
        }
      }
    } else {
      // Fallback: find form by selector
      const form = document.querySelector('#availability-form');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton && !submitButton.disabled) {
          submitButton.click();
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">Schedule & Sessions</h1>
          <p className="text-muted-foreground">
            Manage your availability, appointments, and sessions
          </p>
         
        </div>
        <Button 
          onClick={handleCreateAvailability}
          className="bg-primary hover:bg-primary/90 whitespace-nowrap"
          size="lg"
        >
          Manage Slot Availability
        </Button>
      </div>
      
      <Tabs defaultValue="availability" className="w-full">
        <TabsList>
          <TabsTrigger value="availability">Availability Management</TabsTrigger>
          <TabsTrigger value="sessions">Session Management</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="availability">
          <div className="space-y-6" ref={formRef}>
            <AvailabilityManagement />
            {/* <GoogleCalendarIntegration /> */}
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
