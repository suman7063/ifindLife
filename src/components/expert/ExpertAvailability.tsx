
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tables } from '@/types/supabase';
import { getTable } from '@/lib/supabase';
import { useExpertAuth } from './hooks/useExpertAuth';
import { format } from "date-fns";
import { TimeSlot } from '@/types/supabase/appointments';
import { toast } from 'sonner';

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

const ExpertAvailability: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<'single' | 'recurring'>('single');
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<TimeSlot | null>(null);

  const { expert } = useExpertAuth();

  useEffect(() => {
    if (date && expert?.id) {
      fetchAvailableSlots();
    }
  }, [date, expert]);

  const fetchAvailableSlots = async () => {
    if (!date || !expert?.id) return;
    
    try {
      setIsLoading(true);
      const formattedDate = formatDate(date);
      
      // Using the getTable helper function to access the expert_availability table
      const { data, error } = await getTable('expert_availability')
        .select()
        .eq('expert_id', expert.id.toString())
        .eq('date', formattedDate);
      
      if (error) {
        console.error("Error fetching availability:", error);
        toast.error("Failed to load availability");
        return;
      }
      
      // Map the data to TimeSlot format
      const slots: TimeSlot[] = data ? data.map(slot => ({
        id: slot.id,
        expertId: slot.expert_id,
        date: slot.date,
        startTime: slot.start_time,
        endTime: slot.end_time,
        isAvailable: slot.is_available
      })) : [];
      
      setAvailableSlots(slots);
    } catch (error) {
      console.error("Error in fetchAvailableSlots:", error);
      toast.error("An error occurred while loading availability");
    } finally {
      setIsLoading(false);
    }
  };

  const isTimeSlotAvailable = (time: string) => {
    return availableSlots.some(slot => 
      slot.startTime === time && slot.isAvailable
    );
  };

  const isTimeSlotBooked = (time: string) => {
    return availableSlots.some(slot => 
      slot.startTime === time && !slot.isAvailable
    );
  };

  const isTimeSlotScheduled = (time: string) => {
    return availableSlots.some(slot => slot.startTime === time);
  };

  const handleOpenSlotDialog = (time: string) => {
    setSelectedTime(time);
    setOpenDialog(true);
  };

  const getCurrentTimeSlot = (time: string) => {
    return availableSlots.find(slot => slot.startTime === time);
  };

  const handleToggleAvailability = async (time: string) => {
    if (!date || !expert?.id) return;
    
    try {
      const currentSlot = getCurrentTimeSlot(time);
      const formattedDate = formatDate(date);
      
      if (currentSlot) {
        // Update existing slot
        const { error } = await getTable('expert_availability')
          .update({ 
            is_available: !currentSlot.isAvailable 
          })
          .eq('id', currentSlot.id);
          
        if (error) throw error;
        
        setAvailableSlots(prev => 
          prev.map(slot => 
            slot.id === currentSlot.id 
              ? { ...slot, isAvailable: !slot.isAvailable } 
              : slot
          )
        );
        
        toast.success(`Time slot ${currentSlot.isAvailable ? 'marked as unavailable' : 'marked as available'}`);
      } else {
        // Create new slot
        const endTime = time.split(':').map(Number);
        endTime[0] += 1;
        const endTimeString = `${endTime[0].toString().padStart(2, '0')}:00`;
        
        const newSlot = {
          expert_id: expert.id.toString(),
          date: formattedDate,
          start_time: time,
          end_time: endTimeString,
          is_available: true
        };
        
        const { data, error } = await getTable('expert_availability')
          .insert(newSlot)
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          const addedSlot: TimeSlot = {
            id: data[0].id,
            expertId: data[0].expert_id,
            date: data[0].date,
            startTime: data[0].start_time,
            endTime: data[0].end_time,
            isAvailable: data[0].is_available
          };
          
          setAvailableSlots(prev => [...prev, addedSlot]);
          toast.success('Time slot added as available');
        }
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast.error("Failed to update availability");
    }
  };

  const handleSetRecurring = async () => {
    if (!date || !expert?.id || !selectedTime || repeatDays.length === 0) {
      toast.error("Please select all required information");
      return;
    }
    
    try {
      setIsLoading(true);
      const currentDate = new Date(date);
      const promises = [];
      
      // Process each selected day of the week
      for (let i = 0; i < 4; i++) { // Set for the next 4 weeks
        for (const dayOffset of repeatDays) {
          const targetDate = new Date(currentDate);
          targetDate.setDate(currentDate.getDate() + (dayOffset - currentDate.getDay()) + (i * 7));
          
          // Skip dates in the past
          if (targetDate < new Date()) continue;
          
          const formattedDate = formatDate(targetDate);
          
          // Check if slot already exists
          const { data: existingSlots } = await getTable('expert_availability')
            .select()
            .eq('expert_id', expert.id.toString())
            .eq('date', formattedDate)
            .eq('start_time', selectedTime);
            
          if (existingSlots && existingSlots.length > 0) {
            // Update existing slot
            promises.push(
              getTable('expert_availability')
                .update({ is_available: true })
                .eq('id', existingSlots[0].id)
            );
          } else {
            // Create new slot
            const endTime = selectedTime.split(':').map(Number);
            endTime[0] += 1;
            const endTimeString = `${endTime[0].toString().padStart(2, '0')}:00`;
            
            promises.push(
              getTable('expert_availability')
                .insert({
                  expert_id: expert.id.toString(),
                  date: formattedDate,
                  start_time: selectedTime,
                  end_time: endTimeString,
                  is_available: true
                })
            );
          }
        }
      }
      
      await Promise.all(promises);
      setOpenDialog(false);
      fetchAvailableSlots();
      toast.success('Recurring availability set successfully');
    } catch (error) {
      console.error("Error setting recurring availability:", error);
      toast.error("Failed to set recurring availability");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSlot = () => {
    if (!slotToDelete) return;
    
    setIsLoading(true);
    getTable('expert_availability')
      .delete()
      .eq('id', slotToDelete.id)
      .then(({ error }) => {
        if (error) {
          throw error;
        }
        setAvailableSlots(prev => 
          prev.filter(slot => slot.id !== slotToDelete.id)
        );
        toast.success('Time slot removed');
      })
      .catch(error => {
        console.error("Error deleting slot:", error);
        toast.error("Failed to delete time slot");
      })
      .finally(() => {
        setDeleteDialogOpen(false);
        setSlotToDelete(null);
        setIsLoading(false);
      });
  };

  const confirmDeleteSlot = (slot: TimeSlot) => {
    setSlotToDelete(slot);
    setDeleteDialogOpen(true);
  };

  const toggleRepeatDay = (day: number) => {
    setRepeatDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };

  const getDayLabel = (day: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[day];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border rounded-md"
              disabled={{ before: new Date() }}
            />
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Legend</h3>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-4 h-4 bg-ifind-teal/20 rounded"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-4 h-4 bg-red-100 rounded"></div>
                <span className="text-sm">Unavailable</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <span className="text-sm">Not set</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">
              Time Slots for {date ? format(date, 'EEEE, MMMM do, yyyy') : ''}
            </h3>
            
            {isLoading ? (
              <div className="py-8 text-center">Loading availability...</div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map(time => {
                  const currentSlot = getCurrentTimeSlot(time);
                  const isAvailable = isTimeSlotAvailable(time);
                  const isBooked = isTimeSlotBooked(time);
                  const isScheduled = isTimeSlotScheduled(time);
                  
                  return (
                    <div key={time} className="relative">
                      <Button
                        variant={isAvailable ? "default" : isBooked ? "destructive" : "outline"}
                        className={`w-full ${isAvailable ? 'bg-ifind-teal/20 hover:bg-ifind-teal/30 text-ifind-teal border border-ifind-teal/20' : 
                          isBooked ? 'bg-red-100 hover:bg-red-200 text-red-600 border border-red-200' : 
                          'bg-gray-100'}`}
                        onClick={() => handleOpenSlotDialog(time)}
                      >
                        {time}
                      </Button>
                      
                      {isScheduled && (
                        <button 
                          className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (currentSlot) confirmDeleteSlot(currentSlot);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 hover:text-red-500">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedTime} - {date ? format(date, 'EEEE, MMMM do, yyyy') : ''}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeframe">Time Frame</Label>
                <Select 
                  value={selectedTimeFrame} 
                  onValueChange={(value) => setSelectedTimeFrame(value as 'single' | 'recurring')}
                >
                  <SelectTrigger id="timeframe">
                    <SelectValue placeholder="Select time frame" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single day</SelectItem>
                    <SelectItem value="recurring">Recurring weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedTimeFrame === 'recurring' && (
                <div className="space-y-2">
                  <Label>Repeat on these days</Label>
                  <div className="flex flex-wrap gap-2">
                    {[0, 1, 2, 3, 4, 5, 6].map(day => (
                      <Badge 
                        key={day}
                        variant={repeatDays.includes(day) ? "default" : "outline"}
                        className={`cursor-pointer ${repeatDays.includes(day) ? 'bg-ifind-teal hover:bg-ifind-teal/80' : ''}`}
                        onClick={() => toggleRepeatDay(day)}
                      >
                        {getDayLabel(day)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="availability">Mark as available</Label>
                  <Switch 
                    id="availability"
                    checked={!getCurrentTimeSlot(selectedTime) || getCurrentTimeSlot(selectedTime)?.isAvailable}
                    onCheckedChange={() => handleToggleAvailability(selectedTime)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                {selectedTimeFrame === 'single' ? (
                  <Button 
                    onClick={() => {
                      handleToggleAvailability(selectedTime);
                      setOpenDialog(false);
                    }}
                    className="bg-ifind-aqua hover:bg-ifind-teal"
                  >
                    Save
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSetRecurring}
                    className="bg-ifind-aqua hover:bg-ifind-teal"
                    disabled={repeatDays.length === 0}
                  >
                    Set Recurring
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this time slot?</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteSlot}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ExpertAvailability;
