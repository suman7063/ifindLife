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

  // Get available time slots for a specific date
  const getAvailableSlots = (date: string) => {
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay() === 0 ? 7 : targetDate.getDay(); // Convert Sunday (0) to 7
    
    const availableSlots: Array<{
      id: string;
      start_time: string;
      end_time: string;
      expert_id: string;
    }> = [];

    availabilities.forEach(availability => {
      const startDate = new Date(availability.start_date);
      const endDate = new Date(availability.end_date);
      
      // Check if the target date is within the availability range
      if (targetDate >= startDate && targetDate <= endDate) {
        availability.time_slots.forEach(slot => {
          // For recurring availability, match day of week
          if (availability.availability_type === 'recurring' && slot.day_of_week === dayOfWeek && !slot.is_booked) {
            availableSlots.push({
              id: slot.id,
              start_time: slot.start_time,
              end_time: slot.end_time,
              expert_id: availability.expert_id
            });
          }
          // For date range availability with specific dates
          else if (availability.availability_type === 'date_range' && slot.specific_date === date && !slot.is_booked) {
            availableSlots.push({
              id: slot.id,
              start_time: slot.start_time,
              end_time: slot.end_time,
              expert_id: availability.expert_id
            });
          }
        });
      }
    });

    return availableSlots.sort((a, b) => a.start_time.localeCompare(b.start_time));
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
    isAvailableOnDate,
    getAvailabilityCalendar,
    refetch: () => expertId && fetchExpertAvailability(expertId)
  };
}