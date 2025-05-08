
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import ExpertBookingCalendar from './ExpertBookingCalendar';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookingTabProps {
  expert: {
    id: number;
    name: string;
  };
}

const BookingTab: React.FC<BookingTabProps> = ({ expert }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const navigate = useNavigate();
  
  // Check authentication status when component mounts
  useEffect(() => {
    console.log("BookingTab - Auth state:", { isAuthenticated, isLoading });
  }, [isAuthenticated, isLoading]);
  
  const handleBookingComplete = () => {
    setShowBookingForm(false);
  };
  
  const handleLoginClick = () => {
    // Store the current location to redirect back after login
    sessionStorage.setItem('pendingAction', JSON.stringify({
      type: 'book',
      id: expert.id,
      path: window.location.pathname,
      scrollPosition: window.scrollY
    }));
    
    navigate('/login');
  };
  
  // Show login required message if not authenticated
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">Login Required</h3>
        <p className="text-muted-foreground mb-4">
          Please login to book an appointment with {expert.name}.
        </p>
        <Button onClick={handleLoginClick}>Login to Book</Button>
      </div>
    );
  }
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">Checking authentication...</h3>
        <p className="text-muted-foreground">Please wait...</p>
      </div>
    );
  }
  
  // If authenticated but not showing the booking form yet
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
  
  // Show booking form for authenticated users
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
