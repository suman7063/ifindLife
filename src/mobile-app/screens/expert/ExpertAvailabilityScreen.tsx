import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Clock, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useAvailabilityManagement, TimeSlot } from '@/hooks/useAvailabilityManagement';
import AvailabilityTypeSelector from '@/components/expert/availability/AvailabilityTypeSelector';
import TimeInput from '@/components/expert/availability/TimeInput';
import { cn } from '@/lib/utils';

const daysOfWeek = [
  { id: 0, label: 'Sunday' },
  { id: 1, label: 'Monday' },
  { id: 2, label: 'Tuesday' },
  { id: 3, label: 'Wednesday' },
  { id: 4, label: 'Thursday' },
  { id: 5, label: 'Friday' },
  { id: 6, label: 'Saturday' }
];

interface DayAvailability {
  enabled: boolean;
  slots: { start: string; end: string }[];
}

export const ExpertAvailabilityScreen: React.FC = () => {
  const { user } = useSimpleAuth();
  const { createAvailability, loading } = useAvailabilityManagement(user);
  
  const [availabilityType, setAvailabilityType] = useState<'date_range' | 'recurring'>('recurring');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  
  const [weeklyAvailability, setWeeklyAvailability] = useState<Record<number, DayAvailability>>({
    0: { enabled: false, slots: [] },
    1: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    2: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    3: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    4: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    5: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    6: { enabled: false, slots: [] }
  });

  const [dateRangeSlots, setDateRangeSlots] = useState<{ start: string; end: string }[]>([
    { start: '09:00', end: '17:00' }
  ]);

  const toggleDay = (dayId: number) => {
    setWeeklyAvailability(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        enabled: !prev[dayId].enabled,
        slots: !prev[dayId].enabled && prev[dayId].slots.length === 0 
          ? [{ start: '09:00', end: '17:00' }] 
          : prev[dayId].slots
      }
    }));
  };

  const addTimeSlot = (dayId?: number) => {
    if (availabilityType === 'recurring' && dayId !== undefined) {
      setWeeklyAvailability(prev => ({
        ...prev,
        [dayId]: {
          ...prev[dayId],
          slots: [...prev[dayId].slots, { start: '09:00', end: '17:00' }]
        }
      }));
    } else {
      setDateRangeSlots(prev => [...prev, { start: '09:00', end: '17:00' }]);
    }
  };

  const removeTimeSlot = (dayId: number | undefined, slotIndex: number) => {
    if (availabilityType === 'recurring' && dayId !== undefined) {
      setWeeklyAvailability(prev => ({
        ...prev,
        [dayId]: {
          ...prev[dayId],
          slots: prev[dayId].slots.filter((_, i) => i !== slotIndex)
        }
      }));
    } else {
      setDateRangeSlots(prev => prev.filter((_, i) => i !== slotIndex));
    }
  };

  const updateTimeSlot = (dayId: number | undefined, slotIndex: number, field: 'start' | 'end', value: string) => {
    if (availabilityType === 'recurring' && dayId !== undefined) {
      setWeeklyAvailability(prev => ({
        ...prev,
        [dayId]: {
          ...prev[dayId],
          slots: prev[dayId].slots.map((slot, i) => 
            i === slotIndex ? { ...slot, [field]: value } : slot
          )
        }
      }));
    } else {
      setDateRangeSlots(prev => prev.map((slot, i) => 
        i === slotIndex ? { ...slot, [field]: value } : slot
      ));
    }
  };

  const handleSaveAvailability = async () => {
    if (!user) {
      toast.error('Please login to save availability');
      return;
    }

    let timeSlots: TimeSlot[] = [];

    if (availabilityType === 'recurring') {
      // Convert weekly availability to time slots
      Object.entries(weeklyAvailability).forEach(([dayId, dayData]) => {
        if (dayData.enabled && dayData.slots.length > 0) {
          dayData.slots.forEach(slot => {
            timeSlots.push({
              start_time: slot.start,
              end_time: slot.end,
              day_of_week: parseInt(dayId),
              specific_date: null
            });
          });
        }
      });

      if (timeSlots.length === 0) {
        toast.error('Please enable at least one day with time slots');
        return;
      }

      const success = await createAvailability(
        user.id,
        format(new Date(), 'yyyy-MM-dd'),
        format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 'yyyy-MM-dd'),
        'recurring',
        timeSlots
      );

      if (success) {
        toast.success('Weekly availability saved successfully');
      }
    } else {
      // Date range availability
      if (!startDate || !endDate) {
        toast.error('Please select both start and end dates');
        return;
      }

      if (dateRangeSlots.length === 0) {
        toast.error('Please add at least one time slot');
        return;
      }

      // For date range, apply same slots to all days in range
      dateRangeSlots.forEach(slot => {
        timeSlots.push({
          start_time: slot.start,
          end_time: slot.end,
          day_of_week: 0, // Not used for date_range type
          specific_date: null // Will apply to all days in range
        });
      });

      const success = await createAvailability(
        user.id,
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd'),
        'date_range',
        timeSlots
      );

      if (success) {
        toast.success('Date range availability saved successfully');
      }
    }
  };

  return (
    <div className="flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-ifind-teal/10 via-ifind-aqua/10 to-ifind-purple/10 p-6 rounded-b-3xl">
        <h1 className="text-2xl font-poppins font-bold text-ifind-charcoal mb-2">
          Set Availability
        </h1>
        <p className="text-muted-foreground">
          Choose your availability type and set your schedule
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Availability Type Selector */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <AvailabilityTypeSelector
              availabilityType={availabilityType}
              onAvailabilityTypeChange={setAvailabilityType}
            />
          </CardContent>
        </Card>

        {/* Date Range Selection (for date_range type) */}
        {availabilityType === 'date_range' && (
          <Card className="border-border/50">
            <CardContent className="p-4 space-y-4">
              <h3 className="text-sm font-medium">Select Date Range</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Start Date</Label>
                  <div className="border rounded-lg p-3 bg-background">
                    {startDate ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{format(startDate, 'PPP')}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setStartDate(undefined)}
                        >
                          Clear
                        </Button>
                      </div>
                    ) : (
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="rounded-md border-0"
                      />
                    )}
                  </div>
                  {!startDate && (
                    <p className="text-xs text-muted-foreground mt-1">Select your availability start date</p>
                  )}
                </div>

                {startDate && (
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">End Date</Label>
                    <div className="border rounded-lg p-3 bg-background">
                      {endDate ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{format(endDate, 'PPP')}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEndDate(undefined)}
                          >
                            Clear
                          </Button>
                        </div>
                      ) : (
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => date < startDate}
                          className="rounded-md border-0"
                        />
                      )}
                    </div>
                    {!endDate && (
                      <p className="text-xs text-muted-foreground mt-1">Select your availability end date</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Time Slots Section */}
        <Card className="border-border/50">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                {availabilityType === 'recurring' ? 'Weekly Schedule' : 'Daily Time Slots'}
              </h3>
            </div>

            {availabilityType === 'recurring' ? (
              // Weekly recurring availability
              <div className="space-y-3">
                {daysOfWeek.map((day) => {
                  const dayData = weeklyAvailability[day.id];
                  return (
                    <div key={day.id} className="border rounded-lg p-3 bg-background/50">
                      <div className="flex items-center justify-between mb-3">
                        <Label htmlFor={`day-${day.id}`} className="text-sm font-medium">
                          {day.label}
                        </Label>
                        <Switch
                          id={`day-${day.id}`}
                          checked={dayData.enabled}
                          onCheckedChange={() => toggleDay(day.id)}
                        />
                      </div>

                      {dayData.enabled && (
                        <div className="space-y-2">
                          {dayData.slots.map((slot, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <TimeInput
                                label=""
                                value={slot.start}
                                onChange={(value) => updateTimeSlot(day.id, index, 'start', value)}
                                className="flex-1"
                              />
                              <span className="text-muted-foreground">-</span>
                              <TimeInput
                                label=""
                                value={slot.end}
                                onChange={(value) => updateTimeSlot(day.id, index, 'end', value)}
                                className="flex-1"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeTimeSlot(day.id, index)}
                                disabled={dayData.slots.length === 1}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addTimeSlot(day.id)}
                            className="w-full text-ifind-teal border-dashed mt-2"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Time Slot
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              // Date range time slots (apply same slots to all days in range)
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  These time slots will apply to all days in your selected date range
                </p>
                {dateRangeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
                    <TimeInput
                      label=""
                      value={slot.start}
                      onChange={(value) => updateTimeSlot(undefined, index, 'start', value)}
                      className="flex-1"
                    />
                    <span className="text-muted-foreground">-</span>
                    <TimeInput
                      label=""
                      value={slot.end}
                      onChange={(value) => updateTimeSlot(undefined, index, 'end', value)}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTimeSlot(undefined, index)}
                      disabled={dateRangeSlots.length === 1}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addTimeSlot()}
                  className="w-full text-ifind-teal border-dashed"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Time Slot
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Button 
          onClick={handleSaveAvailability}
          disabled={loading}
          className="w-full bg-gradient-to-r from-ifind-teal to-ifind-aqua hover:from-ifind-teal/90 hover:to-ifind-aqua/90"
        >
          {loading ? 'Saving...' : 'Save Availability'}
        </Button>
      </div>
    </div>
  );
};
