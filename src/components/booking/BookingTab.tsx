
import React from 'react';
import ExpertBookingCalendar from './ExpertBookingCalendar';

// Define the props interface for the component
interface BookingTabProps {
  expertId: string;
  expertName: string;
  onBookingComplete?: () => void; // Make onBookingComplete optional
}

const BookingTab: React.FC<BookingTabProps> = ({ expertId, expertName, onBookingComplete = () => {} }) => {
  return (
    <div className="w-full p-4">
      <ExpertBookingCalendar 
        expertId={expertId} 
        expertName={expertName}
        onBookingComplete={onBookingComplete}
      />
    </div>
  );
};

export default BookingTab;
