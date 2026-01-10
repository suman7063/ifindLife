import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AvailabilitySetupStepProps {
  expertAccount: any;
  onComplete: () => void;
}

interface TimeSlot {
  start_time: string;
  end_time: string;
}

interface DayAvailability {
  day: string;
  enabled: boolean;
  timeSlots: TimeSlot[];
}

const DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
  'Friday', 'Saturday', 'Sunday'
];

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return [`${hour}:00`, `${hour}:30`];
}).flat();

export const AvailabilitySetupStep: React.FC<AvailabilitySetupStepProps> = ({
  expertAccount,
  onComplete
}) => {
  const [availability, setAvailability] = useState<DayAvailability[]>(
    DAYS.map(day => ({
      day,
      enabled: false,
      timeSlots: [{ start_time: '09:00', end_time: '17:00' }]
    }))
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExistingAvailability();
  }, [expertAccount]);

  const fetchExistingAvailability = async () => {
    try {
      console.log('🔍 Fetching existing availability for expert:', expertAccount.auth_id);
      
      const { data, error } = await supabase
        .from('expert_availabilities')
        .select('*')
        .eq('expert_id', expertAccount.auth_id);

      console.log('🔍 Availability query result:', data, 'Error:', error);

      if (error) throw error;

      if (data && data.length > 0) {
        console.log('✅ Found existing availability:', data);
        // Convert existing data to our format
        // Group by day of week and convert to our interface
        const dayMap: { [key: number]: DayAvailability } = {};
        
        data.forEach((record: any) => {
          const dayIndex = record.day_of_week;
          const dayName = DAYS[dayIndex];
          
          if (!dayMap[dayIndex]) {
            dayMap[dayIndex] = {
              day: dayName,
              enabled: true,
              timeSlots: []
            };
          }
          
          dayMap[dayIndex].timeSlots.push({
            start_time: record.start_time,
            end_time: record.end_time
          });
        });
        
        // Convert to array format
        const convertedAvailability = DAYS.map((day, index) => 
          dayMap[index] || { day, enabled: false, timeSlots: [{ start_time: '09:00', end_time: '17:00' }] }
        );
        
        setAvailability(convertedAvailability);
      } else {
        console.log('ℹ️ No existing availability found');
      }

      
      // Presence of existing availability will be treated by parent for completion UI
    } catch (error) {
      console.error('Error fetching existing availability:', error);
    }
  };

  const handleDayToggle = (dayIndex: number, enabled: boolean) => {
    setAvailability(prev => prev.map((day, index) => 
      index === dayIndex ? { ...day, enabled } : day
    ));
  };

  const handleTimeSlotChange = (
    dayIndex: number, 
    slotIndex: number, 
    field: 'start_time' | 'end_time', 
    value: string
  ) => {
    setAvailability(prev => prev.map((day, dIndex) => 
      dIndex === dayIndex 
        ? {
            ...day,
            timeSlots: day.timeSlots.map((slot, sIndex) => 
              sIndex === slotIndex 
                ? { ...slot, [field]: value }
                : slot
            )
          }
        : day
    ));
  };

  const addTimeSlot = (dayIndex: number) => {
    setAvailability(prev => prev.map((day, index) => 
      index === dayIndex 
        ? {
            ...day,
            timeSlots: [...day.timeSlots, { start_time: '09:00', end_time: '17:00' }]
          }
        : day
    ));
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setAvailability(prev => prev.map((day, index) => 
      index === dayIndex 
        ? {
            ...day,
            timeSlots: day.timeSlots.filter((_, sIndex) => sIndex !== slotIndex)
          }
        : day
    ));
  };

  const handleSaveAvailability = async () => {
    setLoading(true);
    
    try {
      console.log('💾 Saving availability for expert:', expertAccount.auth_id);
      
      // Delete existing availability
      const { error: deleteError } = await supabase
        .from('expert_availabilities')
        .delete()
        .eq('expert_id', expertAccount.auth_id);

      if (deleteError) {
        console.error('Error deleting existing availability:', deleteError);
        throw deleteError;
      }

      // Prepare new availability records
      // Set default date range: today to 1 year from now
      const today = new Date();
      const oneYearLater = new Date(today);
      oneYearLater.setFullYear(today.getFullYear() + 1);
      const startDate = today.toISOString().split('T')[0];
      const endDate = oneYearLater.toISOString().split('T')[0];
      
      const availabilityRecords: any[] = [];
      
      availability
        .filter(day => day.enabled)
        .forEach(day => {
          const dayIndex = DAYS.indexOf(day.day);
          
          day.timeSlots.forEach(slot => {
            availabilityRecords.push({
              expert_id: expertAccount.auth_id,
              day_of_week: dayIndex,
              start_time: slot.start_time,
              end_time: slot.end_time,
              start_date: startDate, // Availability start date
              end_date: endDate, // Availability end date
              is_available: true,
              timezone: 'UTC'
            });
          });
        });

      console.log('💾 Records to insert:', availabilityRecords);

      if (availabilityRecords.length > 0) {
        const { error: insertError } = await supabase
          .from('expert_availabilities')
          .insert(availabilityRecords);

        if (insertError) {
          console.error('Error inserting availability:', insertError);
          throw insertError;
        }
      }

      // Update flags on expert_accounts as the single source of truth
      console.log('💾 Updating expert_accounts.availability_set flag...');
      const { error: eaUpdateError } = await supabase
        .from('expert_accounts')
        .update({ availability_set: true })
        .eq('auth_id', expertAccount.auth_id);

      if (eaUpdateError) {
        console.error('Error updating expert_accounts.availability_set:', eaUpdateError);
      }

      // If all flags are true, set onboarding_completed on expert_accounts as well
      // Check services from expert_service_specializations table
      const { data: specializationsCheck } = await supabase
        .from('expert_service_specializations')
        .select('id')
        .eq('expert_id', expertAccount.auth_id)
        .limit(1);

      const { data: eaFlags } = await supabase
        .from('expert_accounts')
        .select('pricing_set, availability_set, onboarding_completed')
        .eq('auth_id', expertAccount.auth_id)
        .single();

      const hasServices = (specializationsCheck?.length || 0) > 0;
      const hasPricing = !!eaFlags?.pricing_set;
      const hasAvailability = !!eaFlags?.availability_set;

      if (hasServices && hasPricing && hasAvailability && !eaFlags?.onboarding_completed) {
        console.log('🎉 All steps complete, marking expert_accounts.onboarding_completed = true');
        await supabase
          .from('expert_accounts')
          .update({ onboarding_completed: true })
          .eq('auth_id', expertAccount.auth_id);

        // Email notification is now automatically sent via Database Webhook (Supabase native)
        // When expert_accounts.onboarding_completed is set to true, the database trigger automatically calls
        // the send-expert-email-welcome-status Edge Function
        // No manual call needed - handled by Supabase Database Webhook
        
        /* Manual email call removed - now handled automatically by Database Webhook
        try {
          console.log('📧 Sending welcome email to expert:', expertAccount.email);
          const { error: emailError } = await supabase.functions.invoke('send-expert-email-welcome-status', {
            body: {
              expertName: expertAccount.name,
              expertEmail: expertAccount.email,
            },
          });

          if (emailError) {
            console.warn('⚠️ Failed to send welcome email (non-critical):', emailError);
          } else {
            console.log('✅ Welcome email sent successfully');
          }
        } catch (emailErr) {
          console.warn('⚠️ Error sending welcome email (non-critical):', emailErr);
        }
        */
      }

      console.log('✅ Availability saved successfully');
      toast.success('Availability saved successfully!');
      onComplete();
    } catch (error) {
      console.error('Error saving availability:', error);
      toast.error('Failed to save availability');
    } finally {
      setLoading(false);
    }
  };

  const setQuickAvailability = (type: 'business' | 'evening' | 'weekend') => {
    const templates = {
      business: DAYS.slice(0, 5).map(day => ({ // Mon-Fri
        day,
        enabled: true,
        timeSlots: [{ start_time: '09:00', end_time: '17:00' }]
      })),
      evening: DAYS.map(day => ({
        day,
        enabled: true,
        timeSlots: [{ start_time: '18:00', end_time: '22:00' }]
      })),
      weekend: DAYS.slice(5).map(day => ({ // Sat-Sun
        day,
        enabled: true,
        timeSlots: [{ start_time: '10:00', end_time: '16:00' }]
      }))
    };

    if (type === 'business' || type === 'evening') {
      setAvailability(templates[type].concat(
        DAYS.slice(templates[type].length).map(day => ({
          day,
          enabled: false,
          timeSlots: [{ start_time: '09:00', end_time: '17:00' }]
        }))
      ));
    } else {
      setAvailability(prev => prev.map((day, index) => 
        index >= 5 ? templates.weekend[index - 5] : { ...day, enabled: false }
      ));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Set Your Availability</h3>
        <p className="text-muted-foreground mb-4">
          Configure when you're available for consultations. Users will only be able to book during these times.
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setQuickAvailability('business')}
        >
          Business Hours (9-5, Mon-Fri)
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setQuickAvailability('evening')}
        >
          Evening Hours (6-10 PM)
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setQuickAvailability('weekend')}
        >
          Weekends Only
        </Button>
      </div>

      <div className="space-y-4">
        {availability.map((day, dayIndex) => (
          <Card key={day.day} className={day.enabled ? 'border-green-200' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={day.enabled}
                    onCheckedChange={(checked) => handleDayToggle(dayIndex, checked as boolean)}
                  />
                  <Label className="font-medium">{day.day}</Label>
                </div>
                {day.enabled && day.timeSlots.length < 3 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTimeSlot(dayIndex)}
                  >
                    Add Time Slot
                  </Button>
                )}
              </div>
            </CardHeader>
            {day.enabled && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {day.timeSlots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center gap-3">
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <div>
                          <Label className="text-xs">Start Time</Label>
                          <Select
                            value={slot.start_time}
                            onValueChange={(value) => handleTimeSlotChange(dayIndex, slotIndex, 'start_time', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">End Time</Label>
                          <Select
                            value={slot.end_time}
                            onValueChange={(value) => handleTimeSlotChange(dayIndex, slotIndex, 'end_time', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {day.timeSlots.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSaveAvailability}
          disabled={loading || !availability.some(day => day.enabled)}
          className="px-8"
        >
          {loading ? 'Saving...' : 'Save Availability'}
        </Button>
      </div>
    </div>
  );
};