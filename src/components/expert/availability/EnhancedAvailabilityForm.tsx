import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useAvailabilityManagement } from '@/hooks/useAvailabilityManagement';
import { toast } from 'sonner';
import { Calendar, Clock, Globe, Plus, X } from 'lucide-react';

interface EnhancedAvailabilityFormProps {
  user: any;
  onAvailabilityUpdated?: () => void;
}

interface TimeSlot {
  start: string;
  end: string;
  enabled: boolean;
}

interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (EST/EDT)', offset: 'UTC-5/-4' },
  { value: 'America/Chicago', label: 'Central Time (CST/CDT)', offset: 'UTC-6/-5' },
  { value: 'America/Denver', label: 'Mountain Time (MST/MDT)', offset: 'UTC-7/-6' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PST/PDT)', offset: 'UTC-8/-7' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)', offset: 'UTC+0/+1' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)', offset: 'UTC+1/+2' },
  { value: 'Europe/Berlin', label: 'Central European Time (CET)', offset: 'UTC+1/+2' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)', offset: 'UTC+5:30' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)', offset: 'UTC+9' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)', offset: 'UTC+8' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AEST)', offset: 'UTC+10/+11' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Generate 30-minute time slots from 00:00 to 23:30
const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

const EnhancedAvailabilityForm: React.FC<EnhancedAvailabilityFormProps> = ({
  user,
  onAvailabilityUpdated
}) => {
  const { createAvailability, loading } = useAvailabilityManagement(user);
  const [selectedTimezone, setSelectedTimezone] = useState('America/New_York');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, DaySchedule>>(
    DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: {
        enabled: false,
        slots: [{ start: '09:00', end: '17:00', enabled: true }]
      }
    }), {})
  );

  // Set default dates (next 30 days)
  useEffect(() => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(nextMonth.toISOString().split('T')[0]);
  }, []);

  const addTimeSlot = (day: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [
          ...prev[day].slots,
          { start: '09:00', end: '17:00', enabled: true }
        ]
      }
    }));
  };

  const removeTimeSlot = (day: string, slotIndex: number) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, index) => index !== slotIndex)
      }
    }));
  };

  const updateTimeSlot = (day: string, slotIndex: number, field: 'start' | 'end', value: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, index) =>
          index === slotIndex ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const toggleDayEnabled = (day: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled
      }
    }));
  };

  const setQuickSchedule = (type: 'business' | 'evening' | 'weekend') => {
    const templates = {
      business: {
        days: DAYS.slice(0, 5), // Mon-Fri
        slots: [{ start: '09:00', end: '17:00', enabled: true }]
      },
      evening: {
        days: DAYS,
        slots: [{ start: '18:00', end: '22:00', enabled: true }]
      },
      weekend: {
        days: DAYS.slice(5), // Sat-Sun
        slots: [{ start: '10:00', end: '16:00', enabled: true }]
      }
    };

    const template = templates[type];
    const newSchedule = { ...weeklySchedule };
    
    // Reset all days
    DAYS.forEach(day => {
      newSchedule[day] = { enabled: false, slots: [{ start: '09:00', end: '17:00', enabled: true }] };
    });
    
    // Apply template
    template.days.forEach(day => {
      newSchedule[day] = { enabled: true, slots: [...template.slots] };
    });
    
    setWeeklySchedule(newSchedule);
  };

  // Convert time slots to 30-minute intervals
  const generate30MinuteSlots = (startTime: string, endTime: string): string[] => {
    const slots: string[] = [];
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    let current = new Date(start);
    while (current < end) {
      slots.push(current.toTimeString().slice(0, 5));
      current.setMinutes(current.getMinutes() + 30);
    }
    
    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!startDate || !endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    const enabledDays = Object.entries(weeklySchedule).filter(([_, schedule]) => schedule.enabled);
    if (enabledDays.length === 0) {
      toast.error('Please enable at least one day');
      return;
    }

    try {
      // Convert schedule to database format
      const timeSlots = enabledDays.flatMap(([day, schedule]) => {
        const dayIndex = DAYS.indexOf(day) + 1; // 1-7 for Monday-Sunday
        
        return schedule.slots.flatMap(slot => {
          // Generate 30-minute slots for each time range
          const thirtyMinSlots = generate30MinuteSlots(slot.start, slot.end);
          return thirtyMinSlots.map((slotStart, index) => {
            const nextSlot = thirtyMinSlots[index + 1];
            if (!nextSlot) return null; // Skip last slot as it doesn't have an end
            
            return {
              start_time: slotStart,
              end_time: nextSlot,
              day_of_week: dayIndex,
              specific_date: null,
              timezone: selectedTimezone
            };
          }).filter(Boolean);
        });
      }).filter(Boolean);

      const result = await createAvailability(
        user.auth_id || user.id,
        startDate,
        endDate,
        'recurring',
        timeSlots as any,
        selectedTimezone
      );

      if (result) {
        toast.success('Availability created successfully! Users can now book 30-minute slots.');
        onAvailabilityUpdated?.();
        
        // Reset form
        setWeeklySchedule(
          DAYS.reduce((acc, day) => ({
            ...acc,
            [day]: {
              enabled: false,
              slots: [{ start: '09:00', end: '17:00', enabled: true }]
            }
          }), {})
        );
      }
    } catch (error) {
      console.error('Error creating availability:', error);
      toast.error('Failed to create availability');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Enhanced Availability Setup
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Set your availability with 30-minute time slots that users can book on the frontend.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Timezone Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Timezone
            </Label>
            <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map(tz => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label} ({tz.offset})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Availability Start Date</Label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-input rounded-md"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Availability End Date</Label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-input rounded-md"
                required
              />
            </div>
          </div>

          {/* Quick Schedule Templates */}
          <div className="space-y-2">
            <Label>Quick Schedule Templates</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuickSchedule('business')}
              >
                Business Hours (9AM-5PM, Mon-Fri)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuickSchedule('evening')}
              >
                Evening Hours (6PM-10PM, All Days)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuickSchedule('weekend')}
              >
                Weekends Only (10AM-4PM, Sat-Sun)
              </Button>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="space-y-4">
            <Label>Weekly Availability Schedule</Label>
            <div className="space-y-4">
              {DAYS.map((day) => (
                <Card key={day} className={`transition-colors ${weeklySchedule[day].enabled ? 'border-primary/20 bg-primary/5' : 'border-border'}`}>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Day Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={`day-${day}`}
                            checked={weeklySchedule[day].enabled}
                            onCheckedChange={() => toggleDayEnabled(day)}
                          />
                          <Label htmlFor={`day-${day}`} className="font-medium cursor-pointer">
                            {day}
                          </Label>
                          {weeklySchedule[day].enabled && (
                            <Badge variant="secondary" className="text-xs">
                              {weeklySchedule[day].slots.length} slot{weeklySchedule[day].slots.length !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        
                        {weeklySchedule[day].enabled && weeklySchedule[day].slots.length < 3 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => addTimeSlot(day)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {/* Time Slots */}
                      {weeklySchedule[day].enabled && (
                        <div className="space-y-3 pl-6">
                          {weeklySchedule[day].slots.map((slot, slotIndex) => (
                            <div key={slotIndex} className="flex items-center gap-3">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              
                              <div className="flex items-center gap-2 flex-1">
                                <Select
                                  value={slot.start}
                                  onValueChange={(value) => updateTimeSlot(day, slotIndex, 'start', value)}
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {TIME_SLOTS.map(time => (
                                      <SelectItem key={time} value={time}>{time}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                
                                <span className="text-muted-foreground">to</span>
                                
                                <Select
                                  value={slot.end}
                                  onValueChange={(value) => updateTimeSlot(day, slotIndex, 'end', value)}
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {TIME_SLOTS.map(time => (
                                      <SelectItem key={time} value={time}>{time}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                
                                <Badge variant="outline" className="text-xs">
                                  {generate30MinuteSlots(slot.start, slot.end).length - 1} × 30min slots
                                </Badge>
                              </div>

                              {weeklySchedule[day].slots.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTimeSlot(day, slotIndex)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
            size="lg"
          >
            {loading ? 'Creating Availability...' : 'Create 30-Minute Slot Availability'}
          </Button>
          
          <div className="text-xs text-muted-foreground text-center">
            Users will see these time slots as 30-minute booking options on the frontend.
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedAvailabilityForm;