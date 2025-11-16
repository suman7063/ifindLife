import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Plus, Trash2, Clock, CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

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
  const [availabilityType, setAvailabilityType] = useState<'date_range' | 'recurring'>('date_range');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [durationOption, setDurationOption] = useState<string>('3');
  
  const [availability, setAvailability] = useState<Record<string, DayAvailability>>(
    DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] }
    }), {})
  );

  const [saving, setSaving] = useState(false);

  const calculateEndDate = (start: Date, months: number): Date => {
    const end = new Date(start);
    end.setMonth(end.getMonth() + months);
    return end;
  };

  const handleDurationChange = (value: string) => {
    setDurationOption(value);
    if (value !== 'custom' && startDate) {
      const months = parseInt(value);
      setEndDate(calculateEndDate(startDate, months));
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date && durationOption !== 'custom') {
      const months = parseInt(durationOption);
      setEndDate(calculateEndDate(date, months));
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
    } else if (type === 'evening') {
      DAYS.forEach(day => {
        newAvailability[day] = { enabled: true, slots: [{ start: '18:00', end: '21:00' }] };
      });
    } else if (type === 'weekend') {
      ['Saturday', 'Sunday'].forEach(day => {
        newAvailability[day] = { enabled: true, slots: [{ start: '10:00', end: '16:00' }] };
      });
    }
    
    setAvailability(newAvailability);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} hours applied`);
  };

  const handleSave = () => {
    if (availabilityType === 'date_range' && (!startDate || !endDate)) {
      toast.error('Please select start and end dates');
      return;
    }

    const enabledDays = Object.entries(availability).filter(([_, data]) => data.enabled);
    
    if (enabledDays.length === 0) {
      toast.error('Please select at least one day');
      return;
    }

    setSaving(true);
    // Simulate save delay
    setTimeout(() => {
      setSaving(false);
      toast.success('Availability saved successfully');
      onNext();
    }, 1000);
  };

  const handleSkip = () => {
    toast.info('You can set availability later from your profile');
    onNext();
  };

  const enabledDaysCount = Object.values(availability).filter(d => d.enabled).length;

  return (
    <div className="p-4 space-y-6 pb-48">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Set Your Availability
        </h1>
        <p className="text-muted-foreground">
          Define when you're available for client sessions
        </p>
      </div>

      {/* Availability Type Selection */}
      <Card className="p-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Availability Type</Label>
          <Select 
            value={availabilityType} 
            onValueChange={(value) => setAvailabilityType(value as 'date_range' | 'recurring')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_range">Specific Date Range</SelectItem>
              <SelectItem value="recurring">Recurring Weekly Schedule</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Date Range Selection (only for date_range type) */}
      {availabilityType === 'date_range' && (
        <Card className="p-4">
          <div className="space-y-4">
            <Label className="text-sm font-medium">Select Date Range</Label>
            
            {/* Duration Selector */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Duration</Label>
              <Select value={durationOption} onValueChange={handleDurationChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="9">9 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                  <SelectItem value="custom">Custom Date Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Start Date</Label>
              <div className="border rounded-md w-full max-w-full overflow-x-hidden">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateChange}
                  disabled={(date) => date < new Date()}
                  className="pointer-events-auto w-full"
                />
              </div>
              {startDate && (
                <p className="text-xs text-primary flex items-center">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  {format(startDate, 'PPP')}
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">End Date</Label>
              <div className="border rounded-md w-full max-w-full overflow-x-hidden">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => date < (startDate || new Date())}
                  className="pointer-events-auto w-full"
                />
              </div>
              {endDate && (
                <p className="text-xs text-primary flex items-center">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  {format(endDate, 'PPP')}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Quick Options */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Quick Setup</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickAvailability('business')}
            className="text-xs"
          >
            <Clock className="w-3 h-3 mr-1" />
            Business Hours
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickAvailability('evening')}
            className="text-xs"
          >
            <Clock className="w-3 h-3 mr-1" />
            Evenings
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickAvailability('weekend')}
            className="text-xs"
          >
            <Calendar className="w-3 h-3 mr-1" />
            Weekends
          </Button>
        </div>
      </Card>

      {/* Days List */}
      <div className="space-y-3">
        {DAYS.map(day => (
          <Card key={day} className={`p-4 ${availability[day].enabled ? 'border-primary' : ''}`}>
            <div className="space-y-3">
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={day}
                    checked={availability[day].enabled}
                    onCheckedChange={() => toggleDay(day)}
                  />
                  <Label htmlFor={day} className="font-medium cursor-pointer">
                    {day}
                  </Label>
                </div>
                {availability[day].enabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addTimeSlot(day)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Time Slots */}
              {availability[day].enabled && (
                <div className="space-y-2 pl-9">
                  {availability[day].slots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <select
                        value={slot.start}
                        onChange={(e) => updateTimeSlot(day, index, 'start', e.target.value)}
                        className="flex-1 text-sm border border-border rounded-md px-2 py-1.5 bg-background"
                      >
                        {TIME_OPTIONS.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      <span className="text-muted-foreground">to</span>
                      <select
                        value={slot.end}
                        onChange={(e) => updateTimeSlot(day, index, 'end', e.target.value)}
                        className="flex-1 text-sm border border-border rounded-md px-2 py-1.5 bg-background"
                      >
                        {TIME_OPTIONS.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      {availability[day].slots.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimeSlot(day, index)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>{enabledDaysCount} day(s) selected</span>
        </div>
        <Button
          onClick={handleSave}
          disabled={enabledDaysCount === 0 || saving}
          className="w-full"
          size="lg"
        >
          {saving ? 'Saving...' : 'Complete Setup'}
        </Button>
        <div className="flex items-center gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            Back
          </Button>
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="flex-1"
            size="lg"
          >
            Skip for Now
          </Button>
        </div>
      </div>
    </div>
  );
};
