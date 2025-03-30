
import React from 'react';
import { useUserAuth } from '@/hooks/user-auth';
import { useAppointments } from '@/hooks/useAppointments';
import AvailabilityCard from './AvailabilityCard';
import EmptyAvailabilityState from './EmptyAvailabilityState';

const ExpertAvailabilityList: React.FC = () => {
  const { currentUser } = useUserAuth();
  const { availabilities, fetchAvailabilities, deleteAvailability, loading } = useAppointments(currentUser);
  
  const handleDeleteAvailability = async (availabilityId: string) => {
    await deleteAvailability(availabilityId);
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Availability Periods</h2>
      
      {loading ? (
        <p>Loading availability...</p>
      ) : availabilities.length === 0 ? (
        <EmptyAvailabilityState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {availabilities.map((availability) => (
            <AvailabilityCard 
              key={availability.id} 
              availability={availability} 
              onDelete={handleDeleteAvailability} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertAvailabilityList;
