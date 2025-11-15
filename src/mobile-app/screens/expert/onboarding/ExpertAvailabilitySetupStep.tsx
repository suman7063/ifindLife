import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';

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
  const [availability, setAvailability] = useState<Record<string, DayAvailability>>(
    DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] }
    }), {})
  );

  const [saving, setSaving] = useState(false);

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
    <div className="p-4 space-y-6 pb-32">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Set Your Availability
        </h1>
        <p className="text-muted-foreground">
          Choose when you're available for client bookings
        </p>
      </div>

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
