
import { TimeSlot, Appointment } from '@/types/appointments';
import { format, parseISO, isWithinInterval, isBefore } from 'date-fns';

/**
 * Checks if a time slot is already booked for a specific date
 */
export const isTimeSlotBooked = (
  timeSlotId: string,
  existingAppointments: Appointment[]
): boolean => {
  return existingAppointments.some(apt => apt.time_slot_id === timeSlotId);
};

/**
 * Checks if there is an appointment time conflict
 */
export const hasTimeConflict = (
  date: string,
  startTime: string,
  endTime: string,
  existingAppointments: Appointment[]
): boolean => {
  const formattedDate = format(parseISO(date), 'yyyy-MM-dd');
  
  return existingAppointments.some(appointment => {
    // Only check appointments on the same date
    if (appointment.appointment_date !== formattedDate) return false;
    
    // Check for time overlap
    return (
      (appointment.start_time <= startTime && appointment.end_time > startTime) ||
      (appointment.start_time < endTime && appointment.end_time >= endTime) ||
      (appointment.start_time >= startTime && appointment.end_time <= endTime)
    );
  });
};

/**
 * Validates booking time is in the future
 */
export const isValidBookingTime = (date: Date, startTime: string): boolean => {
  const now = new Date();
  const [hours, minutes] = startTime.split(':').map(Number);
  
  const bookingDateTime = new Date(date);
  bookingDateTime.setHours(hours, minutes, 0, 0);
  
  return bookingDateTime > now;
};

/**
 * Formats time slot for display
 */
export const formatTimeSlot = (startTime: string, endTime: string): string => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

/**
 * Gets available time slots for a selected date
 */
export const getAvailableTimeSlots = (
  selectedDate: Date,
  availabilities: any[],
  existingAppointments: Appointment[]
): TimeSlot[] => {
  const dayOfWeek = selectedDate.getDay();
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
  // Get all possible time slots for this date from availabilities
  const possibleSlots: TimeSlot[] = [];
  
  availabilities.forEach(availability => {
    const startDate = parseISO(availability.start_date);
    const endDate = parseISO(availability.end_date);
    
    if (isWithinInterval(selectedDate, { start: startDate, end: endDate })) {
      availability.time_slots?.forEach((slot: any) => {
        if (
          (availability.availability_type === 'recurring' && slot.day_of_week === dayOfWeek) ||
          (availability.availability_type === 'date_range' && slot.specific_date === formattedDate)
        ) {
          possibleSlots.push(slot);
        }
      });
    }
  });
  
  // Filter out slots that are already booked or in the past
  return possibleSlots.filter(slot => {
    // Check if slot is already booked
    if (isTimeSlotBooked(slot.id, existingAppointments)) {
      return false;
    }
    
    // Check for time conflicts
    if (hasTimeConflict(formattedDate, slot.start_time, slot.end_time, existingAppointments)) {
      return false;
    }
    
    // Check if slot is in the past
    if (!isValidBookingTime(selectedDate, slot.start_time)) {
      return false;
    }
    
    return true;
  });
};
