
import React from 'react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import ExpertAvailabilityForm from './ExpertAvailabilityForm';
import ExpertAvailabilityList from './ExpertAvailabilityList';

const AvailabilityManagement: React.FC = () => {
  const { expert, userProfile, isLoading } = useSimpleAuth();
  
  // Use expert profile if available, otherwise fall back to user profile
  const currentUser = expert || userProfile;
  
  if (isLoading) {
    return <div>Loading profile...</div>;
  }
  
  if (!currentUser) {
    return <div>No profile found. Please log in.</div>;
  }
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Manage Your Availability</h2>
      <ExpertAvailabilityForm user={currentUser} />
      <ExpertAvailabilityList user={currentUser} />
    </div>
  );
};

export default AvailabilityManagement;
