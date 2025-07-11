
import React from 'react';
import IntegratedExpertBooking from './IntegratedExpertBooking';

// Define the props interface for the component
interface BookingTabProps {
  expertId: string;
  expertName: string;
  onBookingComplete?: () => void; // Make onBookingComplete optional
}

const BookingTab: React.FC<BookingTabProps> = ({ expertId, expertName, onBookingComplete = () => {} }) => {
  return (
    <div className="w-full">
      <IntegratedExpertBooking 
        expertId={expertId} 
        expertName={expertName}
        onBookingComplete={onBookingComplete}
      />
    </div>
  );
};

export default BookingTab;
