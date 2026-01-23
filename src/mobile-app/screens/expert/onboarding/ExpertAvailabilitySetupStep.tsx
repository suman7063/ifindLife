import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { addMonths } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  enabled: boolean;
  slots: TimeSlot[];
}

interface ExpertAvailabilitySetupStepProps {
  onNext: () => void;
  onBack: () => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
});

export const ExpertAvailabilitySetupStep: React.FC<ExpertAvailabilitySetupStepProps> = ({
  onNext,
  onBack
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addMonths(new Date(), 3)
  });
  const [durationOption, setDurationOption] = useState<string>('3');
  
  const [availability, setAvailability] = useState<Record<string, DayAvailability>>(
    DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] }
    }), {})
  );

  const [saving, setSaving] = useState(false);

  const handleDurationChange = (value: string) => {
    setDurationOption(value);
    if (value !== 'custom' && dateRange?.from) {
      const months = parseInt(value);
      setDateRange({
        from: dateRange.from,
        to: addMonths(dateRange.from, months)
      });
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    // If user manually selects dates, switch to custom mode
    if (range?.from && range?.to) {
      setDurationOption('custom');
    }
  };

  const toggleDay = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  const addTimeSlot = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: '09:00', end: '17:00' }]
      }
    }));
  };

  const removeTimeSlot = (day: string, index: number) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index)
      }
    }));
  };

  const updateTimeSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const setQuickAvailability = (type: 'business' | 'evening' | 'weekend') => {
    const newAvailability = { ...availability };
    
    if (type === 'business') {
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
        newAvailability[day] = { enabled: true, slots: [{ start: '09:00', end: '17:00' }] };
      });
      ['Saturday', 'Sunday'].forEach(day => {
        newAvailability[day] = { enabled: false, slots: [{ start: '09:00', end: '17:00' }] };
      });
    } else if (type === 'evening') {
      DAYS.forEach(day => {
        newAvailability[day] = { enabled: true, slots: [{ start: '18:00', end: '21:00' }] };
      });
    } else if (type === 'weekend') {
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
        newAvailability[day] = { enabled: false, slots: [{ start: '09:00', end: '17:00' }] };
      });
      ['Saturday', 'Sunday'].forEach(day => {
        newAvailability[day] = { enabled: true, slots: [{ start: '09:00', end: '17:00' }] };
      });
    }
    
    setAvailability(newAvailability);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} hours preset applied`);
  };

  const handleSave = async () => {
    // Validation
    if (!dateRange?.from || !dateRange?.to) {
      toast.error('Please select a date range');
      return;
    }

    const enabledDays = Object.entries(availability).filter(([_, data]) => data.enabled);
    if (enabledDays.length === 0) {
      toast.error('Please select at least one day');
      return;
    }

    // Validate time slots
    for (const [day, data] of enabledDays) {
      for (const slot of data.slots) {
        if (slot.start >= slot.end) {
          toast.error(`Invalid time slot for ${day}: End time must be after start time`);
          return;
        }
      }
    }

    setSaving(true);
    
    try {
      // Simulated save - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Availability saved successfully!');
      onNext();
    } catch (error) {
      toast.error('Failed to save availability');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 overflow-x-hidden">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Set Your Availability</h2>
          <p className="text-muted-foreground">
            Choose when you're available for consultations
          </p>
        </div>

        {/* Date Range Selection */}
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-medium">Select Your Availability Period</Label>
            <p className="text-sm text-muted-foreground">
              Choose the date range when you'll be available for consultations
            </p>
          </div>

          <div className="flex justify-center">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeChange}
              disabled={(date) => date < new Date()}
              initialFocus
              numberOfMonths={1}
              className="rounded-md border"
            />
          </div>
        </Card>

        {/* Quick Setup */}
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Quick Setup</Label>
            <p className="text-sm text-muted-foreground">
              Choose a preset or customize below
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={() => setQuickAvailability('business')}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Clock className="h-4 w-4" />
              <span className="text-xs">Business Hours</span>
              <span className="text-xs text-muted-foreground">9AM-5PM M-F</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setQuickAvailability('evening')}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Clock className="h-4 w-4" />
              <span className="text-xs">Evenings</span>
              <span className="text-xs text-muted-foreground">6PM-9PM All</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setQuickAvailability('weekend')}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Clock className="h-4 w-4" />
              <span className="text-xs">Weekends</span>
              <span className="text-xs text-muted-foreground">Sat-Sun</span>
            </Button>
          </div>
        </Card>

        {/* Day-by-Day Availability */}
        <div className="space-y-3">
          {DAYS.map((day) => (
            <Card key={day} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={day}
                    checked={availability[day].enabled}
                    onCheckedChange={() => toggleDay(day)}
                  />
                  <Label
                    htmlFor={day}
                    className="text-base font-medium cursor-pointer"
                  >
                    {day}
                  </Label>
                </div>
                {availability[day].enabled && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addTimeSlot(day)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Slot
                  </Button>
                )}
              </div>

              {availability[day].enabled && (
                <div className="space-y-2 ml-6">
                  {availability[day].slots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Select
                        value={slot.start}
                        onValueChange={(value) => updateTimeSlot(day, index, 'start', value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">to</span>
                      <Select
                        value={slot.end}
                        onValueChange={(value) => updateTimeSlot(day, index, 'end', value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeTimeSlot(day, index)}
                        disabled={availability[day].slots.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
        <div className="max-w-2xl mx-auto flex gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
            disabled={saving}
          >
            Back
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};
