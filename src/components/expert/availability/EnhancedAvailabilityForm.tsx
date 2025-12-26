import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAvailabilityManagement } from '@/hooks/useAvailabilityManagement';
import { toast } from 'sonner';
import { Calendar, Clock, Globe, Plus, X, Info, Loader2 } from 'lucide-react';
import { validateTimeSlots, validateDateRange, normalizeExpertId } from '@/utils/availabilityValidation';
import AvailabilityErrorBoundary from './AvailabilityErrorBoundary';
import { ExpertProfile, UserProfile } from '@/types/database/unified';
import { supabase } from '@/lib/supabase';

interface EnhancedAvailabilityFormProps {
  user: ExpertProfile | UserProfile | null;
  onAvailabilityUpdated?: () => void;
  title?: string;
  showSaveButton?: boolean;
  hideCardWrapper?: boolean;
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

// Generate 30-minute time slots from 00:00 to 24:00 (midnight)
const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  // Add 24:00 (midnight) as a valid end time
  slots.push('24:00');
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

// Helper function to convert time string to minutes
const timeToMinutes = (time: string): number => {
  if (time === '24:00') return 24 * 60;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Simple helper: Convert any time to database format (HH:MM:SS)
// Handles 24:00 -> 23:59:59 conversion for PostgreSQL
const convertTimeForDB = (time: string): string => {
  // Convert 24:00 to 23:59:59 (PostgreSQL doesn't support 24:00)
  if (time === '24:00') return '23:59:59';
  
  // Add seconds if missing (HH:MM -> HH:MM:SS)
  if (time.includes(':') && time.split(':').length === 2) {
    return `${time}:00`;
  }
  
  return time; // Already in correct format
};

// Convert database time back to display format (HH:MM)
// Handles 23:59:59 -> 24:00 conversion for display
const convertTimeFromDB = (time: string): string => {
  // Convert 23:59:59 back to 24:00 for display
  if (time === '23:59:59' || time === '23:59:59.000000') {
    return '24:00';
  }
  
  // Remove seconds if present (HH:MM:SS -> HH:MM)
  if (time.includes(':') && time.split(':').length === 3) {
    return time.substring(0, 5); // Take only HH:MM
  }
  
  return time; // Already in correct format
};

// Helper function to check if two time slots overlap
const doSlotsOverlap = (slot1: { start: string; end: string }, slot2: { start: string; end: string }): boolean => {
  const start1 = timeToMinutes(slot1.start);
  const end1 = timeToMinutes(slot1.end);
  const start2 = timeToMinutes(slot2.start);
  const end2 = timeToMinutes(slot2.end);
  
  // Two slots overlap if one starts before the other ends and vice versa
  // But they don't overlap if one ends exactly when the other starts
  return start1 < end2 && start2 < end1;
};

// Helper function to check if a slot overlaps with any other slots (excluding a specific index)
const hasOverlap = (slots: TimeSlot[], newSlot: { start: string; end: string }, excludeIndex?: number): boolean => {
  return slots.some((slot, index) => {
    if (excludeIndex !== undefined && index === excludeIndex) return false;
    if (!slot.enabled) return false;
    return doSlotsOverlap(slot, newSlot);
  });
};

const EnhancedAvailabilityForm: React.FC<EnhancedAvailabilityFormProps> = ({
  user,
  onAvailabilityUpdated,
  title = 'Enhanced Availability Setup',
  showSaveButton = false,
  hideCardWrapper = false
}) => {
  const { createAvailability, loading, availabilities, fetchAvailabilities } = useAvailabilityManagement(user);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
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

  // Load existing availability from Supabase - only when user ID changes
  const expertAuthId = user?.auth_id || user?.id;
  useEffect(() => {
    if (expertAuthId) {
      // Check if we have cached data first
      if (availabilities && availabilities.length > 0) {
        // We have data, process it immediately
        setIsInitialLoad(false);
      } else {
        // No cached data, show loading and fetch
        setIsInitialLoad(true);
        fetchAvailabilities().finally(() => {
          setIsInitialLoad(false);
        });
      }
    } else {
      setIsInitialLoad(false);
    }
  }, [expertAuthId]); // Only depend on expertAuthId, not the whole user object or fetchAvailabilities
  
  // Track initial load completion
  useEffect(() => {
    if (!loading && availabilities !== undefined) {
      setIsInitialLoad(false);
    }
  }, [loading, availabilities]);

  // Track if form has been manually edited to prevent auto-reset
  const [formEdited, setFormEdited] = useState(false);

  // Memoize processed schedule from availabilities for better performance
  const processedSchedule = useMemo(() => {
    if (formEdited || !availabilities || availabilities.length === 0) {
      return null;
    }

    // SIMPLE SCHEMA: Each day is a separate row in expert_availabilities
    // Process ALL rows to get all days
    const newSchedule: Record<string, DaySchedule> = DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: {
        enabled: false,
        slots: []
      }
    }), {});

    // Group availability by day_of_week and merge time ranges
    const dayAvailabilityMap = new Map<number, Array<{start: string, end: string}>>();
    
    availabilities.forEach((availability: {
      day_of_week?: number;
      start_time?: string;
      end_time?: string;
      timezone?: string;
    }) => {
      if (availability.day_of_week !== undefined && availability.start_time && availability.end_time) {
        const dayOfWeek = availability.day_of_week;
        // Convert database times back to display format (23:59:59 -> 24:00)
        const startTime = convertTimeFromDB(availability.start_time);
        const endTime = convertTimeFromDB(availability.end_time);
        
        if (!dayAvailabilityMap.has(dayOfWeek)) {
          dayAvailabilityMap.set(dayOfWeek, []);
        }
        
        dayAvailabilityMap.get(dayOfWeek)!.push({ start: startTime, end: endTime });
      }
    });

    // Convert to weekly schedule format
    dayAvailabilityMap.forEach((timeRanges, dayOfWeek) => {
      // Handle day_of_week: Database uses 0-6 (Sunday=0, Monday=1, ..., Saturday=6)
      // But our DAYS array is ['Monday', 'Tuesday', ..., 'Sunday'] (index 0 = Monday)
      let dayIndex: number;
      
      if (dayOfWeek === 0) {
        // Sunday = last day in our array (index 6)
        dayIndex = 6;
      } else {
        // Monday-Saturday: day_of_week 1-6 maps to array index 0-5
        dayIndex = dayOfWeek - 1;
      }
      
      const dayName = DAYS[dayIndex];
      
      if (dayName) {
        newSchedule[dayName] = {
          enabled: true,
          slots: timeRanges.map(range => ({
            start: range.start,
            end: range.end,
            enabled: true
          }))
        };
      }
    });

    return newSchedule;
  }, [availabilities, formEdited]);

  // Populate form with processed schedule
  useEffect(() => {
    if (processedSchedule) {
      setWeeklySchedule(processedSchedule);
      // Set timezone from first record if available
      if (availabilities && availabilities[0]?.timezone) {
        setSelectedTimezone(availabilities[0].timezone);
      }
    } else if (!formEdited && availabilities && availabilities.length === 0) {
      console.log('ℹ️ No availabilities found - form will remain blank for new entry');
    }
  }, [processedSchedule, availabilities, formEdited]);

  const addTimeSlot = (day: string) => {
    setFormEdited(true);
    setWeeklySchedule(prev => {
      const existingSlots = prev[day].slots;
      
      // Check if there's already a slot ending at 24:00 (midnight)
      const hasMidnightSlot = existingSlots.some(slot => slot.end === '24:00' || slot.end === '00:00');
      if (hasMidnightSlot) {
        toast.info('You already have a slot ending at midnight (24:00). Please modify existing slots instead.');
        return prev;
      }
      
      let newStartTime = '23:30';
      let newEndTime = '24:00';
      
      // If there are existing slots, suggest a time after the last slot
      if (existingSlots.length > 0) {
        const lastSlot = existingSlots[existingSlots.length - 1];
        newStartTime = lastSlot.end;
        
        // Calculate end time: add 30 minutes to start time
        const [startHour, startMin] = newStartTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = startMinutes + 30; // Add 30 minutes
        
        // If we can reach exactly 24:00, use it
        if (endMinutes === 24 * 60) {
          newEndTime = '24:00';
        } else if (endMinutes < 24 * 60) {
          // Normal time within the day
          const endHour = Math.floor(endMinutes / 60);
          const endMin = endMinutes % 60;
          newEndTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
        } else {
          // Can't go beyond 24:00, if start is 23:30 or later, use 23:30-24:00
          if (startMinutes >= 23 * 60 + 30) {
            newStartTime = '23:30';
            newEndTime = '24:00';
          } else {
            // If start is before 23:30, cap at 24:00
            newEndTime = '24:00';
          }
        }
      }
      
      const newSlot = { start: newStartTime, end: newEndTime };
      
      // Check for overlap and show warning (but don't block)
      if (hasOverlap(existingSlots, newSlot)) {
        toast.warning(`⚠️ Time slot ${newStartTime} - ${newEndTime} overlaps with existing slots on ${day}`);
      }
      
      return {
        ...prev,
        [day]: {
          ...prev[day],
          slots: [
            ...prev[day].slots,
            { start: newStartTime, end: newEndTime, enabled: true }
          ]
        }
      };
    });
  };

  const removeTimeSlot = (day: string, slotIndex: number) => {
    setFormEdited(true);
    setWeeklySchedule(prev => {
      const newSlots = prev[day].slots.filter((_, index) => index !== slotIndex);
      
      // If no slots left, disable the day
      if (newSlots.length === 0) {
        return {
          ...prev,
          [day]: {
            enabled: false,
            slots: [{ start: '09:00', end: '17:00', enabled: true }]
          }
        };
      }
      
      return {
        ...prev,
        [day]: {
          ...prev[day],
          slots: newSlots
        }
      };
    });
  };

  const updateTimeSlot = (day: string, slotIndex: number, field: 'start' | 'end', value: string) => {
    setFormEdited(true);
    setWeeklySchedule(prev => {
      const updatedSlots = prev[day].slots.map((slot, index) =>
        index === slotIndex ? { ...slot, [field]: value } : slot
      );
      
      // Get the updated slot
      const updatedSlot = updatedSlots[slotIndex];
      
      // Validate: start time must be before end time (handle 24:00 specially)
      let endMinutes: number;
      if (updatedSlot.end === '24:00') {
        endMinutes = 24 * 60; // 1440 minutes for 24:00
      } else {
        endMinutes = timeToMinutes(updatedSlot.end);
      }
      
      if (timeToMinutes(updatedSlot.start) >= endMinutes) {
        toast.error('Start time must be before end time');
        return prev; // Revert the change
      }
      
      // Check for overlap and show warning (but don't block)
      if (hasOverlap(updatedSlots, updatedSlot, slotIndex)) {
        toast.warning(`⚠️ Time slot ${updatedSlot.start} - ${updatedSlot.end} overlaps with another slot on ${day}`);
      }
      
      // Allow expert to set any time, even if it overlaps
      return {
        ...prev,
        [day]: {
          ...prev[day],
          slots: updatedSlots
        }
      };
    });
  };

  const toggleDayEnabled = (day: string) => {
    setFormEdited(true);
    setWeeklySchedule(prev => {
      const newEnabled = !prev[day].enabled;
      // If enabling a day and it has no slots, add a default slot
      const slots = newEnabled && prev[day].slots.length === 0
        ? [{ start: '09:00', end: '17:00', enabled: true }]
        : prev[day].slots;
      
      return {
        ...prev,
        [day]: {
          ...prev[day],
          enabled: newEnabled,
          slots
        }
      };
    });
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
    const [startHour, startMin] = startTime.split(':').map(Number);
    
    // Handle 24:00 as midnight (1440 minutes)
    let endMinutes: number;
    if (endTime === '24:00') {
      endMinutes = 24 * 60; // 1440 minutes (midnight)
    } else {
      const [endHour, endMin] = endTime.split(':').map(Number);
      endMinutes = endHour * 60 + endMin;
    }
    
    const startMinutes = startHour * 60 + startMin;
    
    // Generate 30-minute intervals from start to end (inclusive of end)
    for (let currentMinutes = startMinutes; currentMinutes < endMinutes; currentMinutes += 30) {
      const hour = Math.floor(currentMinutes / 60);
      const minute = currentMinutes % 60;
      
      // Don't generate slots beyond 24:00
      if (hour >= 24) break;
      
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
    
    // If end time is exactly 24:00, add it as the final slot
    if (endTime === '24:00') {
      slots.push('24:00');
    } else {
      // Add the end time if it's not already included
      const endHour = Math.floor(endMinutes / 60);
      const endMin = endMinutes % 60;
      if (endHour < 24) {
        const endTimeString = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
        if (!slots.includes(endTimeString)) {
          slots.push(endTimeString);
        }
      }
    }
    
    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate date range
    if (!startDate || !endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    const dateValidation = validateDateRange(startDate, endDate);
    if (!dateValidation.isValid) {
      toast.error(`Date validation failed: ${dateValidation.errors.join(', ')}`);
      return;
    }

    // Show warnings if any
    dateValidation.warnings.forEach(warning => {
      toast.warning(warning);
    });

    const enabledDays = Object.entries(weeklySchedule).filter(([_, schedule]) => schedule.enabled);
    if (enabledDays.length === 0) {
      toast.error('Please enable at least one day');
      return;
    }

    try {
      console.log('📝 Form submission started. Weekly schedule:', weeklySchedule);
      console.log('📝 Enabled days:', enabledDays.length);
      
      // Convert schedule to database format - TIME-WISE APPROACH
      // Store time ranges directly (not individual 30-min slots)
      // Slots will be generated dynamically at booking time
      const timeSlots = enabledDays.flatMap(([day, schedule]) => {
        // Convert DAYS array index to database day_of_week (0-6)
        // DAYS: ['Monday', 'Tuesday', ..., 'Sunday'] (0-6)
        // Database: Sunday=0, Monday=1, ..., Saturday=6
        const arrayIndex = DAYS.indexOf(day);
        const dayOfWeek = arrayIndex === 6 ? 0 : arrayIndex + 1; // Sunday=0, Monday=1, etc.
        
        return schedule.slots
          .filter(slot => slot.enabled) // Only process enabled slots
          .map(slot => {
            // Skip invalid time ranges
            if (slot.end === '24:00') {
              // 24:00 is valid as end time, check if start is before it
              const startMinutes = timeToMinutes(slot.start);
              const endMinutes = 24 * 60; // 1440 minutes for 24:00
              if (startMinutes >= endMinutes) {
                console.warn(`Skipping invalid time range: ${slot.start} - ${slot.end}`);
                return null;
              }
            } else if (slot.start >= slot.end) {
              console.warn(`Skipping invalid time range: ${slot.start} - ${slot.end}`);
              return null;
            }
            
            // TIME-WISE: Store time range directly (e.g., 9:00-17:00)
            // Don't split into 30-min slots here - that happens at booking time
            const dbStartTime = convertTimeForDB(slot.start);
            const dbEndTime = convertTimeForDB(slot.end);
            
            console.log(`Storing time range for ${day}: ${slot.start} - ${slot.end} (${dbStartTime} - ${dbEndTime})`);
            
            return {
              start_time: dbStartTime,
              end_time: dbEndTime,
              day_of_week: dayOfWeek,
              specific_date: null,
              timezone: selectedTimezone
            };
          })
          .filter(Boolean); // Remove null entries
      }).filter(Boolean);

      console.log('📝 Total time ranges to save:', timeSlots.length);
      console.log('📝 Sample time ranges:', timeSlots.slice(0, 5));

      // Validate time slots before submission
      const slotsValidation = validateTimeSlots(timeSlots);
      if (!slotsValidation.isValid) {
        toast.error(`Time slot validation failed: ${slotsValidation.errors.join(', ')}`);
        return;
      }

      // Show warnings if any
      slotsValidation.warnings.forEach(warning => {
        toast.warning(warning);
      });

      const expertId = normalizeExpertId(user);
      if (!expertId) {
        toast.error('Expert authentication failed. Please log in again.');
        return;
      }

      console.log('📝 Calling createAvailability with:', {
        expertId,
        startDate,
        endDate,
        timeRangesCount: timeSlots.length, // Now storing time ranges (TIME-WISE approach)
        timezone: selectedTimezone
      });

      const result = await createAvailability(
        expertId,
        startDate,
        endDate,
        'recurring',
        timeSlots,
        selectedTimezone
      );

      console.log('📝 createAvailability result:', result);

      if (result) {
        // Update availability_set flag in expert_accounts (for onboarding completion)
        const expertId = normalizeExpertId(user);
        if (expertId) {
          console.log('✅ Updating availability_set flag for expert:', expertId);
          const { error: updateError } = await supabase
            .from('expert_accounts')
            .update({ availability_set: true })
            .eq('auth_id', expertId);
          
          if (updateError) {
            console.error('❌ Error updating availability_set flag:', updateError);
          } else {
            console.log('✅ availability_set flag updated successfully');
          }
        }
        
        toast.success('Availability created successfully! Your time ranges are saved. Users can book 30-minute slots from your available times.');
        
        // Call onAvailabilityUpdated callback (for onboarding step completion)
        if (onAvailabilityUpdated) {
          console.log('✅ Calling onAvailabilityUpdated callback for onboarding completion');
          onAvailabilityUpdated();
        }
        
        // Reset form edited flag so form can be auto-populated with saved data
        setFormEdited(false);
        
        // Refresh availabilities to show updated data
        await fetchAvailabilities();
      } else {
        toast.error('Failed to save availability. Please check console for details.');
      }
    } catch (error) {
      console.error('Error creating availability:', error);
      toast.error('Failed to create availability');
    }
  };

  // Show loader while initial data is loading
  if (isInitialLoad) {
    const loadingContent = (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-sm text-muted-foreground">Loading availability data...</p>
      </div>
    );

    if (hideCardWrapper) {
      return loadingContent;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {title}
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="inline-flex items-center">
                    <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm font-medium text-green-400">Set your time ranges (e.g., 9:00 AM - 5:00 PM). Users will be able to book 30-minute slots from your available times.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingContent}
        </CardContent>
      </Card>
    );
  }

  const formContent = (
    <form id="availability-form" onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex items-center justify-between">
              <Label>Weekly Availability Schedule</Label>
              {startDate && endDate && (
                <span className="text-xs text-muted-foreground">
                  Active: {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>
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
                              {weeklySchedule[day].slots.length} time range{weeklySchedule[day].slots.length !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Time Ranges */}
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
                                  {generate30MinuteSlots(slot.start, slot.end).length - 1} bookable slots
                                </Badge>
                              </div>

                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTimeSlot(day, slotIndex)}
                                className="text-destructive hover:text-destructive"
                                title="Remove time range"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          
                          {/* Add Time Range Button */}
                          <div className="pt-2">
                            {(() => {
                              // Check if there's already a time range ending at 24:00
                              const hasMidnightSlot = weeklySchedule[day].slots.some(
                                slot => slot.end === '24:00' || slot.end === '00:00'
                              );
                              
                              // Only disable if there's already a time range ending at 24:00
                              // Allow adding time ranges until we reach 24:00
                              const cannotAddMore = hasMidnightSlot;
                              
                              return (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addTimeSlot(day)}
                                  className="w-full gap-2 border-dashed"
                                  disabled={cannotAddMore}
                                  title={cannotAddMore ? 'Cannot add more time ranges after midnight (24:00)' : 'Add another time range'}
                                >
                                  <Plus className="h-4 w-4" />
                                  Add Another Time Range
                                </Button>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Submit button - shown when showSaveButton is true (e.g., in onboarding) */}
          {showSaveButton && (() => {
            // Check if at least one day is enabled with valid slots
            const hasEnabledSlots = Object.entries(weeklySchedule).some(([_, schedule]) => {
              if (!schedule.enabled) return false;
              return schedule.slots.some(slot => 
                slot.enabled && 
                (slot.end === '24:00' ? timeToMinutes(slot.start) < 24 * 60 : slot.start < slot.end) &&
                (slot.end === '24:00' ? timeToMinutes(slot.start) < 24 * 60 : timeToMinutes(slot.start) < timeToMinutes(slot.end))
              );
            });
            
            return (
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  className="px-8"
                  disabled={loading || !hasEnabledSlots}
                  size="lg"
                >
                  {loading ? 'Saving...' : 'Save Availability'}
                </Button>
              </div>
            );
          })()}
          
          {/* Hidden submit button for form submission (when not using save button) */}
          {!showSaveButton && (
            <button type="submit" className="hidden" aria-hidden="true" />
          )}
        </form>
  );

  if (hideCardWrapper) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 pt-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="inline-flex items-center">
                  <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm font-medium text-green-400">Set your availability with 30-minute time slots that users can book on the frontend.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {formContent}
      </div>
    );
  }

  const handleQuickSave = () => {
    // Scroll to form and trigger submission
    const form = document.querySelector('#availability-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton && !submitButton.disabled) {
        submitButton.click();
      }
    }
  };

  return (
    <>
      <Card className="relative">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {title}
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="inline-flex items-center">
                    <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm font-medium text-green-400">Set your time ranges (e.g., 9:00 AM - 5:00 PM). Users will be able to book 30-minute slots from your available times.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formContent}
        </CardContent>
      </Card>
      
      {/* Fixed floating save button - always visible */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={handleQuickSave}
          className="bg-primary hover:bg-primary/90 whitespace-nowrap shadow-lg"
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Availability'
          )}
        </Button>
      </div>
    </>
  );
};

const WrappedEnhancedAvailabilityForm: React.FC<EnhancedAvailabilityFormProps> = (props) => (
  <AvailabilityErrorBoundary>
    <EnhancedAvailabilityForm {...props} />
  </AvailabilityErrorBoundary>
);

export default WrappedEnhancedAvailabilityForm;