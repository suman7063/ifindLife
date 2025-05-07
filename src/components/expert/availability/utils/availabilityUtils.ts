
import { format, addMonths, isAfter } from 'date-fns';
import { TimeSlot } from '@/types/appointments';

// Helper function to get day name from day of week number
export const getDayName = (dayOfWeek: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek];
};

export const validateAvailabilityForm = (
  startDate: Date | undefined,
  endDate: Date | undefined,
  timeSlots: { startTime: string; endTime: string; dayOfWeek: number }[]
): { isValid: boolean; error: string | null } => {
  if (!startDate || !endDate) {
    return { isValid: false, error: 'Please select start and end dates' };
  }
  
  if (isAfter(startDate, endDate)) {
    return { isValid: false, error: 'End date must be after start date' };
  }
  
  if (timeSlots.length === 0) {
    return { isValid: false, error: 'Please add at least one time slot' };
  }
  
  for (const slot of timeSlots) {
    if (slot.startTime >= slot.endTime) {
      return { isValid: false, error: 'End time must be after start time' };
    }
  }
  
  return { isValid: true, error: null };
};

export const formatTimeSlotsForSubmission = (
  timeSlots: { startTime: string; endTime: string; dayOfWeek: number }[],
  availabilityType: 'date_range' | 'recurring',
  startDate: Date | undefined
): Omit<TimeSlot, 'id' | 'availability_id'>[] => {
  if (!startDate) return [];
  
  return timeSlots.map(slot => ({
    start_time: slot.startTime,
    end_time: slot.endTime,
    day_of_week: availabilityType === 'recurring' ? slot.dayOfWeek : undefined,
    specific_date: availabilityType === 'date_range' ? format(startDate, 'yyyy-MM-dd') : undefined
  }));
};

export type DurationOption = '3' | '6' | '9' | '12' | 'custom';

export const calculateEndDate = (startDate: Date, durationOption: DurationOption): Date => {
  if (durationOption === 'custom') {
    return startDate; // Will be set manually
  }
  return addMonths(startDate, parseInt(durationOption));
};
