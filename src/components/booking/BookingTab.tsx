
import React from 'react';
import EnhancedStreamlinedBooking from './EnhancedStreamlinedBooking';

// Define the props interface for the component
interface BookingTabProps {
  expertId: string;
  expertName: string;
  onBookingComplete?: () => void; // Make onBookingComplete optional
}

const BookingTab: React.FC<BookingTabProps> = ({ expertId, expertName, onBookingComplete = () => {} }) => {
  return (
    <div className="w-full">
      <EnhancedStreamlinedBooking 
        expertId={expertId} 
        expertName={expertName}
        onBookingComplete={onBookingComplete}
      />
    </div>
  );
};

export default BookingTab;
