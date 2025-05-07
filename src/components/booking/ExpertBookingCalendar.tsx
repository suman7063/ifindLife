import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserAuth } from '@/hooks/user-auth';
import { useAppointmentManagement } from '@/hooks/useAppointmentManagement';
import { useAvailabilityManagement } from '@/hooks/useAvailabilityManagement';
import { format, isWithinInterval } from 'date-fns';
import { toast } from 'sonner';
import CalendarDatePicker from './CalendarDatePicker';
import AvailableTimeSlotsSection from './AvailableTimeSlotsSection';
import AppointmentNotes from './AppointmentNotes';
import BookingConfirmation from './BookingConfirmation';
import { isValidBookingTime } from '@/utils/bookingValidation';
import { Loader2 } from 'lucide-react';

interface ExpertBookingCalendarProps {
  expertId: string;
  expertName: string;
  onBookingComplete?: () => void;
}

const ExpertBookingCalendar: React.FC<ExpertBookingCalendarProps> = ({ 
  expertId, 
  expertName,
  onBookingComplete 
}) => {
  const { currentUser } = useUserAuth();
  const { availabilities, fetchAvailabilities } = useAvailabilityManagement(currentUser);
  const { bookAppointment, loading, error } = useAppointmentManagement(currentUser);
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    startTime: string;
    endTime: string;
    timeSlotId?: string;
  } | null>(null);
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookedAppointmentId, setBookedAppointmentId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Fetch expert availability when component mounts or refreshKey changes
  useEffect(() => {
    if (expertId) {
      fetchAvailabilities(expertId);
    }
  }, [expertId, refreshKey, fetchAvailabilities]);
  
  // Fetch existing appointments for the expert with a refresh mechanism
  useEffect(() => {
    const fetchExistingAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('id, appointment_date, start_time, end_time, time_slot_id')
          .eq('expert_id', expertId)
          .in('status', ['pending', 'confirmed']);
        
        if (error) {
          console.error('Error fetching existing appointments:', error);
          toast.error('Failed to load appointment data');
          return;
        }
        
        setExistingAppointments(data || []);
      } catch (error) {
        console.error('Error fetching existing appointments:', error);
      }
    };
    
    if (expertId) {
      fetchExistingAppointments();
    }
    
    // Set up a polling mechanism to refresh appointments every 30 seconds
    const pollingInterval = setInterval(fetchExistingAppointments, 30000);
    
    return () => clearInterval(pollingInterval);
  }, [expertId, refreshKey]);
  
  const handleBookAppointment = async () => {
    if (!currentUser || !selectedDate || !selectedTimeSlot) {
      toast.error('Please select a date and time slot');
      return;
    }
    
    // Additional validation before booking
    if (!isValidBookingTime(selectedDate, selectedTimeSlot.startTime)) {
      toast.error('Cannot book appointments in the past');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      // One final real-time check to ensure the slot is still available
      if (selectedTimeSlot.timeSlotId) {
        const { data, error } = await supabase
          .from('expert_time_slots')
          .select('is_booked')
          .eq('id', selectedTimeSlot.timeSlotId)
          .single();
          
        if (error) {
          toast.error('Error checking time slot availability');
          setIsSubmitting(false);
          return;
        }
        
        if (data.is_booked) {
          toast.error('This time slot has just been booked by someone else. Please select another slot.');
          // Refresh the available slots
          setRefreshKey(prev => prev + 1);
          setSelectedTimeSlot(null);
          setIsSubmitting(false);
          return;
        }
      }
      
      const appointmentId = await bookAppointment(
        expertId,
        currentUser.id,
        formattedDate,
        selectedTimeSlot.startTime,
        selectedTimeSlot.endTime,
        selectedTimeSlot.timeSlotId,
        notes
      );
      
      if (appointmentId) {
        setBookedAppointmentId(appointmentId);
        setBookingSuccess(true);
        
        // Refresh the available slots
        setRefreshKey(prev => prev + 1);
      } else {
        toast.error('Failed to book appointment. Please try again.');
      }
    } catch (err) {
      console.error('Error in booking process:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCloseConfirmation = () => {
    setBookingSuccess(false);
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
    setNotes('');
    
    if (onBookingComplete) {
      onBookingComplete();
    }
  };
  
  const handleViewAppointments = () => {
    // Navigate to appointments page
    window.location.href = '/user/appointments';
  };
  
  // If booking was successful, show confirmation
  if (bookingSuccess && selectedDate && selectedTimeSlot && bookedAppointmentId) {
    return (
      <BookingConfirmation
        appointmentId={bookedAppointmentId}
        expertName={expertName}
        date={selectedDate}
        startTime={selectedTimeSlot.startTime}
        endTime={selectedTimeSlot.endTime}
        onClose={handleCloseConfirmation}
        onViewAppointments={handleViewAppointments}
      />
    );
  }
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Book an Appointment with {expertName}</CardTitle>
        <CardDescription>
          Select a date and time to book your appointment.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <CalendarDatePicker 
          selectedDate={selectedDate}
          setSelectedDate={(date) => {
            setSelectedDate(date);
            setSelectedTimeSlot(null);
          }}
          availabilities={availabilities}
          existingAppointments={existingAppointments}
        />
        
        {selectedDate && (
          <AvailableTimeSlotsSection 
            selectedDate={selectedDate}
            availabilities={availabilities}
            existingAppointments={existingAppointments}
            selectedTimeSlot={selectedTimeSlot}
            setSelectedTimeSlot={setSelectedTimeSlot}
          />
        )}
        
        {selectedTimeSlot && (
          <AppointmentNotes 
            notes={notes}
            setNotes={setNotes}
          />
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={!selectedDate || !selectedTimeSlot || isSubmitting}
          onClick={handleBookAppointment}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Booking...
            </>
          ) : 'Book Appointment'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExpertBookingCalendar;
