import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

  // Get available time slots for a specific date
  const generate30MinuteSlots = (date: string) => {
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    console.log('Generating slots for date:', date, 'dayOfWeek:', dayOfWeek, 'availabilities:', availabilities);

    const availableSlots: Array<{
      id: string;
      start_time: string;
      end_time: string;
      expert_id: string;
      availability_id: string;
    }> = [];
    
    const seenSlotIds = new Set<string>(); // Prevent duplicates

    availabilities.forEach(availability => {
      const startDate = new Date(availability.start_date);
      const endDate = new Date(availability.end_date);
      
      console.log('Checking availability:', availability.id, 'type:', availability.availability_type, 'date range:', startDate, 'to', endDate);
      
      // Check if the target date is within the availability range
      if (targetDate >= startDate && targetDate <= endDate) {
        console.log('Date is within range, checking time slots:', availability.time_slots?.length);
        
        availability.time_slots?.forEach(slot => {
          // Skip if we've already seen this slot
          if (seenSlotIds.has(slot.id)) {
            console.log('Skipping duplicate slot:', slot.id);
            return;
          }
          
          let shouldInclude = false;
          
          console.log('Checking slot:', slot.id, 'day_of_week:', slot.day_of_week, 'specific_date:', slot.specific_date, 'is_booked:', slot.is_booked, 'target dayOfWeek:', dayOfWeek);
          
          // For recurring availability, match day of week
          if (availability.availability_type === 'recurring' && slot.day_of_week === dayOfWeek && !slot.is_booked) {
            shouldInclude = true;
            console.log('✅ Slot included (recurring match)');
          }
          // For date range availability with specific dates
          else if (availability.availability_type === 'date_range' && slot.specific_date === date && !slot.is_booked) {
            shouldInclude = true;
            console.log('✅ Slot included (date range match)');
          } else {
            console.log('❌ Slot excluded - no match');
          }

          if (shouldInclude) {
            seenSlotIds.add(slot.id);
            // Use the existing slot directly (they're already 30-minute slots)
            availableSlots.push({
              id: slot.id,
              start_time: slot.start_time,
              end_time: slot.end_time,
              expert_id: availability.expert_id,
              availability_id: availability.id
            });
          }
        });
      } else {
        console.log('Date NOT within range');
      }
    });

    console.log('Generated slots:', availableSlots.length, availableSlots);
    return availableSlots.sort((a, b) => a.start_time.localeCompare(b.start_time));
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