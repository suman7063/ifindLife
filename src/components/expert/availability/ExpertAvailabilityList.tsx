
import React, { useState, useEffect } from 'react';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';
import { withProfileTypeAdapter } from '@/components/wrappers/withProfileTypeAdapter';
import { UserProfile } from '@/types/supabase/user';
import { useAuth } from '@/contexts/auth/AuthContext';
import EmptyAvailabilityState from './EmptyAvailabilityState';
import AvailabilityCard from './AvailabilityCard';

interface ExpertAvailabilityListProps {
  user: UserProfile;
}

const ExpertAvailabilityList: React.FC<ExpertAvailabilityListProps> = ({ user }) => {
  const { toTypeB } = useProfileTypeAdapter();
  const adaptedUser = toTypeB(user);
  
  const { userProfile } = useAuth();
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAvailabilities();
  }, [userProfile]);
  
  const fetchAvailabilities = async () => {
    setLoading(true);
    // Simulate API call to fetch availabilities
    setTimeout(() => {
      const mockAvailabilities = [
        {
          id: '1',
          expert_id: user.id,
          start_date: '2025-05-15',
          end_date: '2025-06-15',
          availability_type: 'recurring',
          timeSlots: [
            { day_of_week: 1, start_time: '09:00', end_time: '12:00' },
            { day_of_week: 3, start_time: '14:00', end_time: '18:00' }
          ]
        }
      ];
      setAvailabilities(mockAvailabilities);
      setLoading(false);
    }, 1000);
  };
  
  const deleteAvailability = async (availabilityId: string) => {
    // Simulate API call to delete availability
    setLoading(true);
    setTimeout(() => {
      const updatedAvailabilities = availabilities.filter(
        availability => availability.id !== availabilityId
      );
      setAvailabilities(updatedAvailabilities);
      setLoading(false);
    }, 500);
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
              onDelete={deleteAvailability} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default withProfileTypeAdapter(ExpertAvailabilityList);
