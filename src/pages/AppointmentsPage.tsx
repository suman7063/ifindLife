import React from 'react';
import AppointmentList from '@/components/appointments/AppointmentList';

const AppointmentsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <AppointmentList />
    </div>
  );
};

export default AppointmentsPage;