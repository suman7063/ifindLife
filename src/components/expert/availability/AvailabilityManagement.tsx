
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
        <span className="ml-2">Loading availability management...</span>
      </div>
    );
  }
  
  if (!currentUser) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-800">Profile Required</h3>
        <p className="text-yellow-700">Please complete your profile setup to manage availability.</p>
      </div>
    );
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
