
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserAuth } from '@/hooks/user-auth';
import { useAppointments, TimeSlot, Availability } from '@/hooks/useAppointments';
import { format, isAfter, isBefore, parseISO, isWithinInterval, isSameDay, getDay } from 'date-fns';
import TimeSlotPicker from './TimeSlotPicker';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
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
  
  // Determine available dates for the calendar (based on expert availability)
  const getAvailableDates = () => {
    const today = new Date();
    
    return (date: Date) => {
      // Don't allow booking in the past
      if (isBefore(date, today) && !isSameDay(date, today)) {
        return true;
      }
      
      // Check if date is within any availability period
      for (const availability of availabilities) {
        const startDate = parseISO(availability.start_date);
        const endDate = parseISO(availability.end_date);
        
        if (isWithinInterval(date, { start: startDate, end: endDate })) {
          // For recurring availability, check day of week
          if (availability.availability_type === 'recurring') {
            const dayOfWeek = getDay(date); // 0 for Sunday, 1 for Monday, etc.
            
            // Check if this day of week has any time slots
            const hasDaySlots = availability.time_slots?.some(
              slot => slot.day_of_week === dayOfWeek
            );
            
            if (hasDaySlots) {
              return false; // Date is available
            }
          } else {
            // For date range availability
            return false; // Date is available
          }
        }
      }
      
      return true; // Date is unavailable
    };
  };
  
  // Update available time slots when date is selected
  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimeSlots([]);
      return;
    }
    
    const dayOfWeek = getDay(selectedDate);
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    
    // Get all possible time slots for this date from availabilities
    const possibleSlots: TimeSlot[] = [];
    
    availabilities.forEach(availability => {
      const startDate = parseISO(availability.start_date);
      const endDate = parseISO(availability.end_date);
      
      if (isWithinInterval(selectedDate, { start: startDate, end: endDate })) {
        availability.time_slots?.forEach(slot => {
          if (
            (availability.availability_type === 'recurring' && slot.day_of_week === dayOfWeek) ||
            (availability.availability_type === 'date_range' && slot.specific_date === formattedDate)
          ) {
            possibleSlots.push(slot);
          }
        });
      }
    });
    
    // Filter out slots that are already booked
    const filteredSlots = possibleSlots.filter(slot => {
      // Check against existing appointments
      return !existingAppointments.some(appointment => 
        appointment.appointment_date === formattedDate &&
        (
          (appointment.start_time <= slot.start_time && appointment.end_time > slot.start_time) ||
          (appointment.start_time < slot.end_time && appointment.end_time >= slot.end_time) ||
          (appointment.start_time >= slot.start_time && appointment.end_time <= slot.end_time)
        )
      );
    });
    
    setAvailableTimeSlots(filteredSlots);
  }, [selectedDate, availabilities, existingAppointments]);
  
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
        <div className="space-y-2">
          <h3 className="text-sm font-medium">1. Select a Date</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="border rounded-md"
            disabled={getAvailableDates()}
          />
        </div>
        
        {selectedDate && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">2. Select a Time Slot</h3>
            {availableTimeSlots.length > 0 ? (
              <TimeSlotPicker
                timeSlots={availableTimeSlots}
                selectedTimeSlot={selectedTimeSlot}
                onSelectTimeSlot={setSelectedTimeSlot}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                No available time slots for this date.
              </p>
            )}
          </div>
        )}
        
        {selectedTimeSlot && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">3. Additional Notes (Optional)</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded-md p-2 h-24"
              placeholder="Add any notes or specific requirements for your appointment..."
            />
          </div>
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
