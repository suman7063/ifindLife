
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';

const AppointmentsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Appointments</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>View and manage your upcoming client sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted p-8 text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No upcoming appointments</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You have no scheduled appointments at this time.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsTab;
