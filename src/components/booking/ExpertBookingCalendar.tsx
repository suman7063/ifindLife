
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserAuth } from '@/hooks/user-auth';
import { useAppointments } from '@/hooks/useAppointments';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import CalendarDatePicker from './CalendarDatePicker';
import AvailableTimeSlotsSection from './AvailableTimeSlotsSection';
import AppointmentNotes from './AppointmentNotes';

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
  const { availabilities, fetchAvailabilities, bookAppointment, loading } = useAppointments(currentUser, expertId);
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    startTime: string;
    endTime: string;
    timeSlotId?: string;
  } | null>(null);
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);
  const [notes, setNotes] = useState('');
  
  // Fetch expert availability when component mounts
  useEffect(() => {
    if (expertId) {
      fetchAvailabilities(expertId);
    }
  }, [expertId]);
  
  // Fetch existing appointments for the expert
  useEffect(() => {
    const fetchExistingAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('appointment_date, start_time, end_time')
          .eq('expert_id', expertId)
          .in('status', ['pending', 'confirmed']);
        
        if (error) throw error;
        setExistingAppointments(data || []);
      } catch (error) {
        console.error('Error fetching existing appointments:', error);
      }
    };
    
    if (expertId) {
      fetchExistingAppointments();
    }
  }, [expertId]);
  
  const handleBookAppointment = async () => {
    if (!currentUser || !selectedDate || !selectedTimeSlot) {
      toast.error('Please select a date and time slot');
      return;
    }
    
    const appointment = await bookAppointment(
      expertId,
      currentUser.id,
      format(selectedDate, 'yyyy-MM-dd'),
      selectedTimeSlot.startTime,
      selectedTimeSlot.endTime,
      selectedTimeSlot.timeSlotId,
      notes
    );
    
    if (appointment) {
      setSelectedDate(undefined);
      setSelectedTimeSlot(null);
      setNotes('');
      
      if (onBookingComplete) {
        onBookingComplete();
      }
    }
  };
  
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
          setSelectedDate={setSelectedDate}
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
          disabled={!selectedDate || !selectedTimeSlot || loading}
          onClick={handleBookAppointment}
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExpertBookingCalendar;
