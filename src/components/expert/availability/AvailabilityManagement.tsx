import React from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import ExpertAvailabilityForm from './ExpertAvailabilityForm';
import ExpertAvailabilityList from './ExpertAvailabilityList';

const AvailabilityManagement: React.FC = () => {
  const { expert, userProfile, isLoading } = useSimpleAuth();
  
  // Use expert profile if available, otherwise fall back to user profile
  const currentUser = expert || userProfile;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">No user profile found. Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ExpertAvailabilityForm user={currentUser} />
      <ExpertAvailabilityList user={currentUser} />
    </div>
  );
};

export default AvailabilityManagement;