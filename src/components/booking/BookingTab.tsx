
import React from 'react';
import StreamlinedBooking from './StreamlinedBooking';

// Define the props interface for the component
interface BookingTabProps {
  expertId: string;
  expertName: string;
  onBookingComplete?: () => void; // Make onBookingComplete optional
}

const BookingTab: React.FC<BookingTabProps> = ({ expertId, expertName, onBookingComplete = () => {} }) => {
  return (
    <div className="w-full">
      <StreamlinedBooking 
        expertId={expertId} 
        expertName={expertName}
        onBookingComplete={onBookingComplete}
      />
    </div>
  );
};

export default BookingTab;
