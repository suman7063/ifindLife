
import React from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import ExpertAvailabilityForm from './ExpertAvailabilityForm';
import ExpertAvailabilityList from './ExpertAvailabilityList';
import { withProfileTypeAdapter } from '@/components/wrappers/withProfileTypeAdapter';

const AvailabilityManagement: React.FC = () => {
  const { userProfile } = useAuth();
  
  if (!userProfile) {
    return <div>Loading profile...</div>;
  }
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Manage Your Availability</h2>
      <ExpertAvailabilityForm user={userProfile} />
      <ExpertAvailabilityList user={userProfile} />
    </div>
  );
};

export default withProfileTypeAdapter(AvailabilityManagement);
