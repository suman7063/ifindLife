
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';

// Define props that work with both profile types
interface ExpertBookingCalendarProps {
  expertId: string;
  expertName: string;
  onBookingComplete: () => void;
}

const ExpertBookingCalendar: React.FC<ExpertBookingCalendarProps> = ({ 
  expertId, 
  expertName,
  onBookingComplete 
}) => {
  const { userProfile } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [bookingDetails, setBookingDetails] = useState({
    sessionType: 'video',
    notes: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      // Format date for API
      const formattedDate = date.toISOString().split('T')[0];
      
      // Mock API call - replace with actual API call
      setTimeout(() => {
        // Mock response
        const mockSlots = [
          '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
        ];
        setAvailableSlots(mockSlots);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching available slots:', err);
      setError('Failed to load available time slots. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (bookingStep === 1 && !selectedSlot) {
      setError('Please select a time slot');
      return;
    }
    setError(null);
    setBookingStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setBookingStep(prev => prev - 1);
  };

  const handleSubmitBooking = async () => {
    if (!selectedDate || !selectedSlot) {
      setError('Please select a date and time');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Format date and time for API
      const bookingDate = selectedDate.toISOString().split('T')[0];
      
      // Mock API call - replace with actual booking API call
      setTimeout(() => {
        setSuccess(true);
        setIsLoading(false);
        // Call the onBookingComplete callback
        onBookingComplete();
      }, 1500);
    } catch (err) {
      console.error('Error submitting booking:', err);
      setError('Failed to book appointment. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Book with {expertName}</h2>
      
      {success ? (
        <div className="text-center py-8">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
          <p className="mb-4">Your appointment has been scheduled successfully.</p>
          <button 
            onClick={() => setSuccess(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Book Another Session
          </button>
        </div>
      ) : (
        <div>
          {bookingStep === 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Step 1: Select Date & Time</h3>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Date</label>
                <input 
                  type="date"
                  className="w-full p-2 border rounded"
                  onChange={(e) => handleDateChange(e.target.value ? new Date(e.target.value) : null)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              {isLoading && <p className="text-gray-500">Loading available slots...</p>}
              
              {selectedDate && availableSlots.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Select Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => handleSlotSelect(slot)}
                        className={`p-2 border rounded ${selectedSlot === slot ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedDate && availableSlots.length === 0 && !isLoading && (
                <p className="text-amber-600 mb-4">No available slots for this date. Please select another date.</p>
              )}
            </div>
          )}
          
          {bookingStep === 2 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Step 2: Session Details</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Session Type</label>
                <select
                  name="sessionType"
                  value={bookingDetails.sessionType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="video">Video Call</option>
                  <option value="audio">Audio Call</option>
                  <option value="chat">Chat</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={bookingDetails.notes}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="Any specific topics you'd like to discuss?"
                />
              </div>
              
              <div className="mb-4 p-4 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">Booking Summary</h4>
                <p><span className="font-medium">Expert:</span> {expertName}</p>
                <p><span className="font-medium">Date:</span> {selectedDate?.toLocaleDateString()}</p>
                <p><span className="font-medium">Time:</span> {selectedSlot}</p>
                <p><span className="font-medium">Session Type:</span> {bookingDetails.sessionType}</p>
              </div>
            </div>
          )}
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <div className="flex justify-between mt-6">
            {bookingStep > 1 && (
              <button
                onClick={handlePrevStep}
                className="px-4 py-2 border rounded hover:bg-gray-50"
                disabled={isLoading}
              >
                Back
              </button>
            )}
            
            {bookingStep < 2 ? (
              <button
                onClick={handleNextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={!selectedSlot || isLoading}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitBooking}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Confirm Booking'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertBookingCalendar;
