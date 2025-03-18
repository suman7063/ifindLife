
import React, { useState, useEffect } from 'react';
import { format, addMonths, parseISO, isBefore, addDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Expert } from '@/types/supabase/tables';

interface TimeSlot {
  id: string;
  expertId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface ExpertAvailabilityProps {
  expert: Expert;
}

const ExpertAvailability: React.FC<ExpertAvailabilityProps> = ({ expert }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [isAvailable, setIsAvailable] = useState(true);

  // Fetch time slots for the selected date
  useEffect(() => {
    if (selectedDate && expert?.id) {
      fetchTimeSlotsForDate(format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedDate, expert?.id]);

  const fetchTimeSlotsForDate = async (dateString: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('expert_availability')
        .select('*')
        .eq('expert_id', expert.id)
        .eq('date', dateString);

      if (error) throw error;

      // Transform from database format
      const formattedTimeSlots: TimeSlot[] = data?.map(slot => ({
        id: String(slot.id),
        expertId: String(slot.expert_id),
        date: String(slot.date),
        startTime: String(slot.start_time),
        endTime: String(slot.end_time),
        isAvailable: Boolean(slot.is_available)
      })) || [];

      setTimeSlots(formattedTimeSlots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast.error('Failed to load availability');
    } finally {
      setIsLoading(false);
    }
  };

  const addTimeSlot = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    // Validate time slot
    if (startTime >= endTime) {
      toast.error('End time must be after start time');
      return;
    }

    setIsLoading(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      // Check for overlapping slots
      const overlapping = timeSlots.some(slot => {
        return (
          (startTime >= slot.startTime && startTime < slot.endTime) ||
          (endTime > slot.startTime && endTime <= slot.endTime) ||
          (startTime <= slot.startTime && endTime >= slot.endTime)
        );
      });

      if (overlapping) {
        toast.error('This time slot overlaps with an existing one');
        return;
      }

      // Add new time slot
      const { data, error } = await supabase
        .from('expert_availability')
        .insert({
          expert_id: expert.id,
          date: formattedDate,
          start_time: startTime,
          end_time: endTime,
          is_available: isAvailable
        })
        .select();

      if (error) throw error;

      // Add the new slot to the UI
      if (data && data.length > 0) {
        const newSlot: TimeSlot = {
          id: String(data[0].id),
          expertId: String(data[0].expert_id),
          date: String(data[0].date),
          startTime: String(data[0].start_time),
          endTime: String(data[0].end_time),
          isAvailable: Boolean(data[0].is_available)
        };

        setTimeSlots([...timeSlots, newSlot]);
        toast.success('Time slot added successfully');
      }
    } catch (error) {
      console.error('Error adding time slot:', error);
      toast.error('Failed to add time slot');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTimeSlot = async (slotId: string, isAvailable: boolean) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('expert_availability')
        .update({ 
          is_available: isAvailable 
        })
        .eq('id', slotId);

      if (error) throw error;

      // Update the UI
      setTimeSlots(timeSlots.map(slot => 
        slot.id === slotId ? { ...slot, isAvailable } : slot
      ));

      toast.success('Time slot updated successfully');
    } catch (error) {
      console.error('Error updating time slot:', error);
      toast.error('Failed to update time slot');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTimeSlot = async (slotId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('expert_availability')
        .delete()
        .eq('id', slotId);

      if (error) throw error;

      // Update the UI
      setTimeSlots(timeSlots.filter(slot => slot.id !== slotId));
      toast.success('Time slot removed successfully');
    } catch (error) {
      console.error('Error deleting time slot:', error);
      toast.error('Failed to remove time slot');
    } finally {
      setIsLoading(false);
    }
  };

  // Disable dates in the past or more than 3 months in the future
  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return isBefore(date, today) || isBefore(addMonths(today, 3), date);
  };

  // Block a full day as unavailable
  const blockFullDay = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    setIsLoading(true);
    try {
      // First, delete any existing slots for this day
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      await supabase
        .from('expert_availability')
        .delete()
        .eq('expert_id', expert.id)
        .eq('date', formattedDate);

      // Add a full-day unavailable slot
      const { data, error } = await supabase
        .from('expert_availability')
        .insert({
          expert_id: expert.id,
          date: formattedDate,
          start_time: '00:00',
          end_time: '23:59',
          is_available: false
        })
        .select();

      if (error) throw error;

      // Update the UI
      fetchTimeSlotsForDate(formattedDate);
      toast.success('Day marked as unavailable');
    } catch (error) {
      console.error('Error blocking day:', error);
      toast.error('Failed to block day');
    } finally {
      setIsLoading(false);
    }
  };

  // Set standard working hours for a range of days
  const setStandardHours = async () => {
    if (!selectedDate) {
      toast.error('Please select a starting date');
      return;
    }

    const startDate = selectedDate;
    const endDate = addDays(startDate, 6); // Set for one week

    setIsLoading(true);
    try {
      // Standard working hours (9am-5pm)
      const workingHours = [
        { startTime: '09:00', endTime: '12:00' },
        { startTime: '13:00', endTime: '17:00' }
      ];

      // Loop through each day in the range
      let currentDate = startDate;
      const bulkInsertData = [];

      while (!isBefore(endDate, currentDate)) {
        const formattedDate = format(currentDate, 'yyyy-MM-dd');
        
        // Add morning and afternoon slots
        for (const hours of workingHours) {
          bulkInsertData.push({
            expert_id: expert.id,
            date: formattedDate,
            start_time: hours.startTime,
            end_time: hours.endTime,
            is_available: true
          });
        }

        currentDate = addDays(currentDate, 1);
      }

      // Batch insert all slots
      const { error } = await supabase
        .from('expert_availability')
        .insert(bulkInsertData);

      if (error) throw error;

      // Refresh the current view
      fetchTimeSlotsForDate(format(selectedDate, 'yyyy-MM-dd'));
      toast.success('Standard working hours set for the week');
    } catch (error) {
      console.error('Error setting standard hours:', error);
      toast.error('Failed to set standard hours');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
          <CardDescription>Choose a date to manage your availability</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={disabledDays}
            className="rounded-md border"
          />
          
          <div className="mt-4 space-y-2">
            <Button 
              onClick={blockFullDay} 
              variant="outline" 
              className="w-full"
              disabled={isLoading}
            >
              Block Entire Day
            </Button>
            
            <Button 
              onClick={setStandardHours} 
              variant="outline" 
              className="w-full"
              disabled={isLoading}
            >
              Set Standard Hours (Week)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Time Slots'}
          </CardTitle>
          <CardDescription>Manage your availability for this date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="available"
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
              />
              <Label htmlFor="available">Available for Booking</Label>
            </div>
            
            <Button 
              onClick={addTimeSlot} 
              className="w-full"
              disabled={isLoading}
            >
              Add Time Slot
            </Button>
          </div>

          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-medium">Current Time Slots</h3>
            
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : timeSlots.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No time slots set for this date
              </div>
            ) : (
              <div className="space-y-2">
                {timeSlots.map(slot => (
                  <div 
                    key={slot.id} 
                    className={`flex items-center justify-between p-3 rounded-md border ${
                      slot.isAvailable ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div>
                      <p className="font-medium">
                        {slot.startTime} - {slot.endTime}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {slot.isAvailable ? 'Available' : 'Unavailable'}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateTimeSlot(slot.id, !slot.isAvailable)}
                      >
                        {slot.isAvailable ? 'Block' : 'Unblock'}
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTimeSlot(slot.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpertAvailability;
