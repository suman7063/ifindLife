
import React from 'react';
import { Card } from '@/components/ui/card';

const AppointmentsTab: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
      <p className="text-muted-foreground">
        You have no upcoming appointments.
      </p>
    </Card>
  );
};

export default AppointmentsTab;
