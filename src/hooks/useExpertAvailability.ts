import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ExpertAvailability {
  id: string;
  expert_id: string;
  start_date: string;
  end_date: string;
  availability_type: 'date_range' | 'recurring';
  time_slots: Array<{
    id: string;
    start_time: string;
    end_time: string;
    day_of_week: number;
    specific_date?: string;
    is_booked: boolean;
  }>;
}

export function useExpertAvailability(expertId?: string) {
  const [availabilities, setAvailabilities] = useState<ExpertAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpertAvailability = async (id: string) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);

      // Fetch expert availabilities with time slots
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('expert_availabilities')
        .select(`
          *,
          time_slots:expert_time_slots(*)
        `)
        .eq('expert_id', id);

      if (availabilityError) throw availabilityError;

      const formattedAvailabilities: ExpertAvailability[] = availabilityData?.map(availability => ({
        id: availability.id,
        expert_id: availability.expert_id,
        start_date: availability.start_date,
        end_date: availability.end_date,
        availability_type: availability.availability_type as 'date_range' | 'recurring',
        time_slots: availability.time_slots || []
      })) || [];

      setAvailabilities(formattedAvailabilities);
    } catch (err: any) {
      console.error('Error fetching expert availability:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate 30-minute slots from availability periods
  const generate30MinuteSlots = (date: string) => {
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay() === 0 ? 7 : targetDate.getDay();
    
    const generatedSlots: Array<{
      id: string;
      start_time: string;
      end_time: string;
      expert_id: string;
      availability_id: string;
    }> = [];

    availabilities.forEach(availability => {
      const startDate = new Date(availability.start_date);
      const endDate = new Date(availability.end_date);
      
      // Check if the target date is within the availability range
      if (targetDate >= startDate && targetDate <= endDate) {
        availability.time_slots.forEach(slot => {
          let shouldInclude = false;
          
          // For recurring availability, match day of week
          if (availability.availability_type === 'recurring' && slot.day_of_week === dayOfWeek && !slot.is_booked) {
            shouldInclude = true;
          }
          // For date range availability with specific dates
          else if (availability.availability_type === 'date_range' && slot.specific_date === date && !slot.is_booked) {
            shouldInclude = true;
          }

          if (shouldInclude) {
            // Generate 30-minute slots between start_time and end_time
            const startTime = new Date(`2000-01-01T${slot.start_time}`);
            const endTime = new Date(`2000-01-01T${slot.end_time}`);
            
            let currentSlot = new Date(startTime);
            let slotIndex = 0;
            
            while (currentSlot < endTime) {
              const slotStart = new Date(currentSlot);
              const slotEnd = new Date(currentSlot.getTime() + 30 * 60 * 1000); // Add 30 minutes
              
              // Don't create slot if it would extend beyond the availability end time
              if (slotEnd <= endTime) {
                generatedSlots.push({
                  id: `${slot.id}-${slotIndex}`,
                  start_time: slotStart.toTimeString().slice(0, 8),
                  end_time: slotEnd.toTimeString().slice(0, 8),
                  expert_id: availability.expert_id,
                  availability_id: availability.id
                });
              }
              
              currentSlot = slotEnd;
              slotIndex++;
            }
          }
        });
      }
    });

    return generatedSlots.sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  // Get available time slots for a specific date (original function for compatibility)
  const getAvailableSlots = (date: string) => {
    return generate30MinuteSlots(date);
  };

  // Check if expert is available on a specific date
  const isAvailableOnDate = (date: string) => {
    return getAvailableSlots(date).length > 0;
  };

  // Get next 30 days of availability
  const getAvailabilityCalendar = () => {
    const calendar: Record<string, boolean> = {};
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      calendar[dateString] = isAvailableOnDate(dateString);
    }
    
    return calendar;
  };

  useEffect(() => {
    if (expertId) {
      fetchExpertAvailability(expertId);
    }
  }, [expertId]);

  return {
    availabilities,
    loading,
    error,
    getAvailableSlots,
    generate30MinuteSlots,
    isAvailableOnDate,
    getAvailabilityCalendar,
    refetch: () => expertId && fetchExpertAvailability(expertId),
    hasAvailability: availabilities && availabilities.length > 0
  };
}