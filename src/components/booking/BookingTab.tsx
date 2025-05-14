
import React from 'react';
import ExpertBookingCalendar from './ExpertBookingCalendar';
import { withExpertBookingAdapter } from './withBookingAdapter';

// Define the props interface for the component
interface BookingTabProps {
  expertId: string;
  expertName: string;
  onBookingComplete: () => void;
}

const BookingTab: React.FC<BookingTabProps> = ({ expertId, expertName, onBookingComplete }) => {
  // Wrap the ExpertBookingCalendar with the adapter
  const AdaptedBookingCalendar = withExpertBookingAdapter(ExpertBookingCalendar);
  
  return (
    <div className="w-full p-4">
      <AdaptedBookingCalendar 
        expertId={expertId} 
        expertName={expertName}
        onBookingComplete={onBookingComplete}
      />
    </div>
  );
};

export default BookingTab;
