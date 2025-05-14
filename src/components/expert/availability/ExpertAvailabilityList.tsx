import React from 'react';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';
import { withProfileTypeAdapter } from '@/components/wrappers/withProfileTypeAdapter';
import { UserProfile } from '@/types/supabase/user';

interface ExpertAvailabilityListProps {
  user: UserProfile;
}

const ExpertAvailabilityList: React.FC<ExpertAvailabilityListProps> = ({ user }) => {
  const { toTypeB } = useProfileTypeAdapter();
  const adaptedUser = toTypeB(user);
  
  const { currentUser } = useUserAuth();
  const { availabilities, fetchAvailabilities, deleteAvailability, loading } = useAppointments(currentUser);
  
  const handleDeleteAvailability = async (availabilityId: string) => {
    await deleteAvailability(availabilityId);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Your Availability Schedule</h3>
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

export default withProfileTypeAdapter(ExpertAvailabilityList);
