
import React, { useState } from 'react';
import { useUserAuth } from '@/hooks/user-auth';
import ExpertBookingCalendar from './ExpertBookingCalendar';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface BookingTabProps {
  expert: {
    id: number;
    name: string;
  };
}

const BookingTab: React.FC<BookingTabProps> = ({ expert }) => {
  const { currentUser, isAuthenticated } = useUserAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  const handleBookingComplete = () => {
    setShowBookingForm(false);
  };
  
  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">Login Required</h3>
        <p className="text-muted-foreground mb-4">
          Please login to book an appointment with {expert.name}.
        </p>
        <Button>Login to Book</Button>
      </div>
    );
  }
  
  if (!showBookingForm) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Book a Session with {expert.name}</h3>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Schedule a one-on-one session based on the expert's availability. 
          Choose from available dates and time slots.
        </p>
        <Button onClick={() => setShowBookingForm(true)}>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <ExpertBookingCalendar 
        expertId={expert.id.toString()} 
        expertName={expert.name}
        onBookingComplete={handleBookingComplete}
      />
    </div>
  );
};

export default BookingTab;
