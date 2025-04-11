
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Calendar as CalendarIcon } from 'lucide-react';

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  specific_date?: string;
  day_of_week?: number;
  is_booked: boolean;
}

interface ExpertAvailabilityProps {
  expertId: string;
}

const ExpertAvailability: React.FC<ExpertAvailabilityProps> = ({ expertId }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDate) return;
      
      try {
        setLoading(true);
        
        // Format the selected date as YYYY-MM-DD
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Fetch availabilities and time slots
        const { data: availabilities, error: availabilityError } = await supabase
          .from('expert_availabilities')
          .select(`
            id,
            availability_type,
            start_date,
            end_date,
            expert_time_slots (
              id,
              start_time,
              end_time,
              day_of_week,
              specific_date,
              is_booked
            )
          `)
          .eq('expert_id', expertId)
          .lte('start_date', formattedDate)
          .gte('end_date', formattedDate);
          
        if (availabilityError) throw availabilityError;
        
        // Extract and flatten time slots
        const slots: TimeSlot[] = [];
        
        availabilities?.forEach(availability => {
          const availabilitySlots = availability.expert_time_slots?.filter((slot: any) => {
            // For specific date time slots
            if (slot.specific_date && slot.specific_date === formattedDate) {
              return true;
            }
            
            // For recurring weekly time slots
            if (slot.day_of_week !== null && slot.day_of_week === dayOfWeek) {
              return true;
            }
            
            return false;
          });
          
          if (availabilitySlots?.length) {
            slots.push(...availabilitySlots);
          }
        });
        
        // Sort by start time
        const sortedSlots = slots.sort((a, b) => {
          return a.start_time.localeCompare(b.start_time);
        });
        
        setTimeSlots(sortedSlots);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching availability:", err);
        setError(err.message || "Failed to load availability");
      } finally {
        setLoading(false);
      }
    };

    if (expertId && selectedDate) {
      fetchAvailability();
    }
  }, [expertId, selectedDate]);

  const formatTimeSlot = (start: string, end: string): string => {
    // Convert "HH:MM:SS" to "HH:MM AM/PM"
    const formatTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };
    
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5 text-gray-500" />
          Select a Date
        </h3>
        <Card>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Available Time Slots</h3>
        {loading ? (
          <div className="py-8 flex justify-center">
            <LoadingSpinner size="md" />
          </div>
        ) : error ? (
          <Card className="p-4">
            <p className="text-red-500 text-center">{error}</p>
          </Card>
        ) : timeSlots.length === 0 ? (
          <Card className="p-4">
            <p className="text-center text-gray-500">
              No available time slots for the selected date.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {timeSlots.map((slot) => (
              <Button
                key={slot.id}
                variant={slot.is_booked ? "outline" : "default"}
                className={`
                  ${slot.is_booked ? 'opacity-50 cursor-not-allowed' : 'bg-ifind-aqua hover:bg-ifind-teal'}
                `}
                disabled={slot.is_booked}
              >
                {formatTimeSlot(slot.start_time, slot.end_time)}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertAvailability;
