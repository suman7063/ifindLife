import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ExpertAvailability {
  id: string;
  expert_id: string;
  start_date: string;
  end_date: string;
  availability_type: 'date_range' | 'recurring';
  timezone?: string; // Expert's timezone
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

      // Fetch expert availabilities - current schema uses day_of_week, start_time, end_time, start_date, end_date
      // Note: TypeScript types are outdated, actual DB has day_of_week/start_time/end_time/start_date/end_date
      // @ts-expect-error - TypeScript types are outdated, actual DB schema has day_of_week/start_time/end_time/start_date/end_date
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('expert_availabilities')
        .select('id, expert_id, day_of_week, start_time, end_time, start_date, end_date, is_available, timezone')
        .eq('expert_id', id)
        .eq('is_available', true)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (availabilityError) {
        console.error('Error fetching availability:', availabilityError);
        throw availabilityError;
      }

      // Transform the data to match the expected interface
      // Group by day_of_week and create availability periods
      // Note: TypeScript types are outdated - actual DB has day_of_week/start_time/end_time/start_date/end_date
      const formattedAvailabilities: ExpertAvailability[] = ((availabilityData as unknown as Array<{
        id: string;
        expert_id: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        start_date: string | null;
        end_date: string | null;
        is_available: boolean;
        timezone: string | null;
      }>) || []).map((availability) => {
        // Use actual start_date and end_date from database, or default to wide range if not set
        const startDate = availability.start_date || new Date().toISOString().split('T')[0];
        const endDate = availability.end_date || new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        return {
          id: availability.id,
          expert_id: availability.expert_id,
          start_date: startDate,
          end_date: endDate,
          availability_type: 'recurring' as const,
          timezone: availability.timezone || 'UTC', // Store timezone from database
          time_slots: [{
            id: availability.id, // Use availability id as slot id
            start_time: availability.start_time,
            end_time: availability.end_time,
            day_of_week: availability.day_of_week,
            is_booked: false
          }]
        };
      });

      setAvailabilities(formattedAvailabilities);
      
      // Log what was fetched from database (to verify it's not hardcoded)
      if (formattedAvailabilities.length > 0) {
        console.log('📅 Fetched availability from DATABASE (not hardcoded):', {
          expertId: id,
          count: formattedAvailabilities.length,
          availabilities: formattedAvailabilities.map(a => ({
            day: a.time_slots[0]?.day_of_week,
            time: `${a.time_slots[0]?.start_time} - ${a.time_slots[0]?.end_time}`,
            source: 'DATABASE'
          }))
        });
      } else {
        console.warn('⚠️ No availability found in database for expert:', id);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching expert availability:', err);
      setError(errorMessage);
      // Don't set any fallback - return empty array if fetch fails
      setAvailabilities([]);
    } finally {
      setLoading(false);
    }
  };

  // Get available time slots for a specific date - split availability windows into 30-minute slots
  const generate30MinuteSlots = (date: string) => {
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    console.log('Getting expert slots for date:', date, 'dayOfWeek:', dayOfWeek);

    const availableSlots: Array<{
      id: string;
      start_time: string;
      end_time: string;
      expert_id: string;
      availability_id: string;
    }> = [];

    // Helper function to split a time range into 30-minute slots
    const splitInto30MinSlots = (startTime: string, endTime: string, availabilityId: string, expertId: string) => {
      // Parse start time (handle HH:MM:SS format)
      const startParts = startTime.split(':');
      const startHour = parseInt(startParts[0], 10);
      const startMin = parseInt(startParts[1] || '0', 10);
      const startMinutes = startHour * 60 + startMin;
      
      // Parse end time (handle HH:MM:SS format and 23:59:59 -> 24:00 conversion)
      let endMinutes: number;
      
      // If end time is 23:59:59, treat it as 24:00 (1440 minutes)
      if (endTime === '23:59:59' || endTime === '23:59:59.000000' || endTime.startsWith('23:59:59')) {
        endMinutes = 24 * 60; // 1440 minutes (midnight)
      } else {
        const endParts = endTime.split(':');
        const endHour = parseInt(endParts[0], 10);
        const endMin = parseInt(endParts[1] || '0', 10);
        endMinutes = endHour * 60 + endMin;
      }
      
      const slots: Array<{
        id: string;
        start_time: string;
        end_time: string;
        expert_id: string;
        availability_id: string;
      }> = [];
      
      // Generate 30-minute slots from start to end
      for (let currentMinutes = startMinutes; currentMinutes < endMinutes; currentMinutes += 30) {
        const slotStartHour = Math.floor(currentMinutes / 60);
        const slotStartMin = currentMinutes % 60;
        const slotEndMinutes = currentMinutes + 30;
        const slotEndHour = Math.floor(slotEndMinutes / 60);
        const slotEndMin = slotEndMinutes % 60;
        
        // Don't generate slots beyond 24:00
        if (slotStartHour >= 24) break;
        
        const slotStartTime = `${slotStartHour.toString().padStart(2, '0')}:${slotStartMin.toString().padStart(2, '0')}`;
        
        // If slot ends at exactly 24:00, use 24:00 as end time
        let slotEndTime: string;
        if (slotEndMinutes === 24 * 60) {
          slotEndTime = '24:00';
        } else if (slotEndHour >= 24) {
          // Cap at 24:00 if it exceeds
          slotEndTime = '24:00';
        } else {
          slotEndTime = `${slotEndHour.toString().padStart(2, '0')}:${slotEndMin.toString().padStart(2, '0')}`;
        }
        
        // Only add if the slot doesn't exceed the end time
        if (slotEndMinutes <= endMinutes) {
          slots.push({
            id: `${availabilityId}-${slotStartTime}`,
            start_time: slotStartTime,
            end_time: slotEndTime,
            expert_id: expertId,
            availability_id: availabilityId
          });
        }
      }
      
      return slots;
    };

    // Iterate through each availability and get matching slots
    availabilities.forEach(availability => {
      // Check BOTH date range AND day_of_week for recurring availability
      const startDate = new Date(availability.start_date);
      const endDate = new Date(availability.end_date);
      
      // Check if the target date is within the availability date range
      const isDateInRange = targetDate >= startDate && targetDate <= endDate;
      
      if (!isDateInRange) {
        console.log('Date not in range for availability:', availability.id, {
          targetDate: date,
          startDate: availability.start_date,
          endDate: availability.end_date
        });
        return;
      }
      
      console.log('Date within range for availability:', availability.id, 'type:', availability.availability_type);
      
      // Get slots that match this date
      availability.time_slots?.forEach(slot => {
        // Skip already booked slots
        if (slot.is_booked) {
          console.log('Skipping booked slot:', slot.id);
          return;
        }

        let includeSlot = false;
        
        // For recurring availability, check BOTH date range (already checked above) AND day of week
        if (availability.availability_type === 'recurring' && slot.day_of_week === dayOfWeek) {
          includeSlot = true;
          console.log('✅ Including recurring slot:', slot.id, 'for day:', dayOfWeek, 'date:', date);
        }
        // For date range availability, match specific date
        else if (availability.availability_type === 'date_range' && slot.specific_date === date) {
          includeSlot = true;
          console.log('✅ Including date-specific slot:', slot.id, 'for date:', date);
        }

        if (includeSlot) {
          // Split the time window into 30-minute slots
          const thirtyMinSlots = splitInto30MinSlots(
            slot.start_time,
            slot.end_time,
            availability.id,
            availability.expert_id
          );
          availableSlots.push(...thirtyMinSlots);
        }
      });
    });

    // Remove any potential duplicates based on start_time and end_time
    const uniqueSlots = availableSlots.filter((slot, index, self) =>
      index === self.findIndex(s => s.start_time === slot.start_time && s.end_time === slot.end_time)
    );
    
    console.log('Final available slots (after deduplication):', uniqueSlots.length, uniqueSlots);
    return uniqueSlots.sort((a, b) => a.start_time.localeCompare(b.start_time));
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