import React, { useState } from 'react';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';
import { withProfileTypeAdapter } from '@/components/wrappers/withProfileTypeAdapter';
import { UserProfile } from '@/types/supabase/user';

interface ExpertAvailabilityFormProps {
  user: UserProfile;
}

const ExpertAvailabilityForm: React.FC<ExpertAvailabilityFormProps> = ({ user }) => {
  const { toTypeB } = useProfileTypeAdapter();
  const adaptedUser = toTypeB(user);
  
  // State variables
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [isRecurring, setIsRecurring] = useState<boolean>(true);
  const [untilDate, setUntilDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!selectedDays.length) {
      alert('Please select at least one day.');
      setIsLoading(false);
      return;
    }

    if (!startTime || !endTime) {
      alert('Please select a start and end time.');
      setIsLoading(false);
      return;
    }

    if (isRecurring && !untilDate) {
      alert('Please select an end date for recurring availability.');
      setIsLoading(false);
      return;
    }

    // Construct availability data
    const availabilityData = {
      expertId: adaptedUser?.id,
      days: selectedDays,
      startTime,
      endTime,
      isRecurring,
      untilDate: isRecurring ? untilDate : null,
    };

    // Here you would typically send this data to your backend
    console.log('Availability data to be submitted:', availabilityData);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Reset form
    setSelectedDays([]);
    setStartTime('09:00');
    setEndTime('17:00');
    setIsRecurring(true);
    setUntilDate('');
    setIsLoading(false);

    alert('Availability submitted successfully!');
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Days:
          </label>
          <div className="flex flex-wrap">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <label key={day} className="inline-flex items-center mr-4 mb-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600"
                  value={day}
                  checked={selectedDays.includes(day)}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedDays([...selectedDays, day]);
                    } else {
                      setSelectedDays(selectedDays.filter(d => d !== day));
                    }
                  }}
                />
                <span className="ml-2 text-gray-700">{day}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Start Time:
          </label>
          <input
            type="time"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            End Time:
          </label>
          <input
            type="time"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-indigo-600"
              checked={isRecurring}
              onChange={e => setIsRecurring(e.target.checked)}
            />
            <span className="ml-2 text-gray-700">Recurring</span>
          </label>
        </div>

        {isRecurring && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Until Date:
            </label>
            <input
              type="date"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={untilDate}
              onChange={e => setUntilDate(e.target.value)}
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Availability'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default withProfileTypeAdapter(ExpertAvailabilityForm);
