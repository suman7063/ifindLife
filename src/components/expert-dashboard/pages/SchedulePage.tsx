
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import UpcomingAppointments from '../widgets/UpcomingAppointments';

interface TimeSlot {
  id: string;
  availability_id: string;
  start_time: string;
  end_time: string;
  specific_date: string | null;
  day_of_week: number | null;
  is_booked: boolean;
}

interface Availability {
  id: string;
  expert_id: string;
  start_date: string;
  end_date: string;
  availability_type: string;
  time_slots: TimeSlot[];
}

const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
});

const SchedulePage = () => {
  const { expertProfile } = useAuth();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingAvailability, setIsAddingAvailability] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri by default

  const days = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  useEffect(() => {
    if (expertProfile?.id) {
      fetchAvailabilities();
    }
  }, [expertProfile]);

  const fetchAvailabilities = async () => {
    if (!expertProfile?.id) return;
    
    setIsLoading(true);
    try {
      // Fetch availabilities
      const { data: availabilitiesData, error: availabilitiesError } = await supabase
        .from('expert_availabilities')
        .select('*')
        .eq('expert_id', expertProfile.id);
        
      if (availabilitiesError) throw availabilitiesError;
      
      // For each availability, fetch time slots
      const availabilitiesWithSlots = await Promise.all((availabilitiesData || []).map(async (availability) => {
        const { data: timeSlotsData, error: timeSlotsError } = await supabase
          .from('expert_time_slots')
          .select('*')
          .eq('availability_id', availability.id);
          
        if (timeSlotsError) throw timeSlotsError;
        
        return {
          ...availability,
          time_slots: timeSlotsData || []
        };
      }));
      
      setAvailabilities(availabilitiesWithSlots);
    } catch (error) {
      console.error('Error fetching availabilities:', error);
      toast.error('Failed to load availability schedule');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecurringAvailability = async () => {
    if (!expertProfile?.id || !startTime || !endTime || selectedDays.length === 0) {
      toast.error('Please select days, start time and end time');
      return;
    }
    
    setIsAddingAvailability(true);
    try {
      // Create availability record
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('expert_availabilities')
        .insert({
          expert_id: expertProfile.id,
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0], // 3 months ahead
          availability_type: 'recurring'
        })
        .select();
        
      if (availabilityError) throw availabilityError;
      
      if (!availabilityData || availabilityData.length === 0) {
        throw new Error('Failed to create availability record');
      }
      
      const availabilityId = availabilityData[0].id;
      
      // Create time slots for each selected day
      const timeSlots = selectedDays.map(day => ({
        availability_id: availabilityId,
        day_of_week: day,
        start_time: startTime + ':00',
        end_time: endTime + ':00',
        is_booked: false
      }));
      
      const { error: timeSlotsError } = await supabase
        .from('expert_time_slots')
        .insert(timeSlots);
        
      if (timeSlotsError) throw timeSlotsError;
      
      toast.success('Availability added successfully');
      setIsDialogOpen(false);
      fetchAvailabilities();
    } catch (error) {
      console.error('Error adding availability:', error);
      toast.error('Failed to add availability');
    } finally {
      setIsAddingAvailability(false);
    }
  };

  const handleAddSpecificDateAvailability = async () => {
    if (!expertProfile?.id || !selectedDate || !startTime || !endTime) {
      toast.error('Please select date, start time and end time');
      return;
    }
    
    setIsAddingAvailability(true);
    try {
      // Create availability record
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('expert_availabilities')
        .insert({
          expert_id: expertProfile.id,
          start_date: format(selectedDate, 'yyyy-MM-dd'),
          end_date: format(selectedDate, 'yyyy-MM-dd'),
          availability_type: 'specific'
        })
        .select();
        
      if (availabilityError) throw availabilityError;
      
      if (!availabilityData || availabilityData.length === 0) {
        throw new Error('Failed to create availability record');
      }
      
      const availabilityId = availabilityData[0].id;
      
      // Create time slot for specific date
      const { error: timeSlotError } = await supabase
        .from('expert_time_slots')
        .insert({
          availability_id: availabilityId,
          specific_date: format(selectedDate, 'yyyy-MM-dd'),
          start_time: startTime + ':00',
          end_time: endTime + ':00',
          is_booked: false
        });
        
      if (timeSlotError) throw timeSlotError;
      
      toast.success('Availability added successfully');
      setIsDialogOpen(false);
      fetchAvailabilities();
    } catch (error) {
      console.error('Error adding availability:', error);
      toast.error('Failed to add availability');
    } finally {
      setIsAddingAvailability(false);
    }
  };

  const handleDeleteTimeSlot = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from('expert_time_slots')
        .delete()
        .eq('id', slotId);
        
      if (error) throw error;
      
      toast.success('Time slot deleted successfully');
      fetchAvailabilities();
    } catch (error) {
      console.error('Error deleting time slot:', error);
      toast.error('Failed to delete time slot');
    }
  };

  const handleDayToggle = (day: number) => {
    setSelectedDays(prevDays => {
      if (prevDays.includes(day)) {
        return prevDays.filter(d => d !== day);
      } else {
        return [...prevDays, day];
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Schedule Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Availability
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Availability</DialogTitle>
              <DialogDescription>
                Set your availability for specific dates or recurring weekly schedule.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Availability Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="recurring" 
                        name="availability-type" 
                        value="recurring" 
                        defaultChecked 
                        className="rounded text-primary focus:ring-primary" 
                      />
                      <label htmlFor="recurring">Recurring Weekly</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="specific" 
                        name="availability-type" 
                        value="specific" 
                        className="rounded text-primary focus:ring-primary" 
                      />
                      <label htmlFor="specific">Specific Date</label>
                    </div>
                  </div>
                </div>
                
                {/* Recurring Weekly Settings */}
                <div id="recurring-options" className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Days of the Week</label>
                    <div className="grid grid-cols-4 gap-2">
                      {days.map(day => (
                        <div key={day.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`day-${day.value}`}
                            checked={selectedDays.includes(day.value)}
                            onChange={() => handleDayToggle(day.value)}
                            className="rounded text-primary focus:ring-primary"
                          />
                          <label htmlFor={`day-${day.value}`}>{day.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Specific Date Settings */}
                <div id="specific-options" className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                {/* Time Range Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map(time => (
                          <SelectItem key={`start_${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <Select value={endTime} onValueChange={setEndTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map(time => (
                          <SelectItem key={`end_${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddRecurringAvailability}
                disabled={isAddingAvailability}
              >
                {isAddingAvailability ? 'Adding...' : 'Add Availability'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Availabilities */}
        <Card>
          <CardHeader>
            <CardTitle>Your Availability</CardTitle>
            <CardDescription>
              Manage your recurring and specific date availabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading availabilities...</div>
            ) : availabilities.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No availabilities set. Add your first availability to start accepting appointments.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Recurring Availabilities */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Weekly Schedule</h3>
                  {availabilities
                    .filter(a => a.availability_type === 'recurring')
                    .map(availability => (
                      <div key={availability.id} className="border rounded-md p-3 mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Recurring Weekly</h4>
                        </div>
                        <div className="space-y-2">
                          {availability.time_slots.map(slot => (
                            <div key={slot.id} className="flex justify-between items-center p-2 bg-muted rounded-sm">
                              <div className="flex items-center">
                                <div className="mr-3">{days.find(d => d.value === slot.day_of_week)?.label}</div>
                                <div className="flex items-center text-sm">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTimeSlot(slot.id)}
                                disabled={slot.is_booked}
                                title={slot.is_booked ? "Can't delete booked slots" : "Delete slot"}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
                
                {/* Specific Date Availabilities */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Specific Dates</h3>
                  {availabilities
                    .filter(a => a.availability_type === 'specific')
                    .map(availability => (
                      <div key={availability.id} className="border rounded-md p-3 mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{availability.start_date}</h4>
                        </div>
                        <div className="space-y-2">
                          {availability.time_slots.map(slot => (
                            <div key={slot.id} className="flex justify-between items-center p-2 bg-muted rounded-sm">
                              <div className="flex items-center">
                                <div className="flex items-center text-sm">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTimeSlot(slot.id)}
                                disabled={slot.is_booked}
                                title={slot.is_booked ? "Can't delete booked slots" : "Delete slot"}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              Your scheduled appointments with clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingAppointments expertId={expertProfile?.id} limit={5} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchedulePage;
