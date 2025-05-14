import React from 'react';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';
import { withProfileTypeAdapter } from '@/components/wrappers/withProfileTypeAdapter';
import { UserProfile } from '@/types/supabase/user';

interface AppointmentsListProps {
  user?: UserProfile;
  // ... other props
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ user, ...otherProps }) => {
  const { toTypeB } = useProfileTypeAdapter();
  const adaptedUser = user ? toTypeB(user) : null;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>
      {/* Appointments listing goes here */}
    </div>
  );
};

export default withProfileTypeAdapter(AppointmentsList);
