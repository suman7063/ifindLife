
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { TimeInput } from './TimeInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserAuth } from '@/hooks/user-auth';
import { useAppointments } from '@/hooks/useAppointments';
import { format, addMonths, isAfter, parseISO } from 'date-fns';

type DurationOption = '3' | '6' | '9' | '12' | 'custom';

const ExpertAvailabilityForm = () => {
  const { currentUser } = useUserAuth();
  const { createAvailability, loading } = useAppointments(currentUser);
  
  const [availabilityType, setAvailabilityType] = useState<'date_range' | 'recurring'>('date_range');
  const [durationOption, setDurationOption] = useState<DurationOption>('3');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addMonths(new Date(), 3));
  const [timeSlots, setTimeSlots] = useState([{ startTime: '09:00', endTime: '17:00', dayOfWeek: 1 }]);
  const [error, setError] = useState<string | null>(null);
  
  const handleDurationChange = (value: DurationOption) => {
    setDurationOption(value);
    
    if (value !== 'custom' && startDate) {
      setEndDate(addMonths(startDate, parseInt(value)));
    }
  };
  
  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { startTime: '09:00', endTime: '17:00', dayOfWeek: 1 }]);
  };
  
  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };
  
  const updateTimeSlot = (index: number, field: string, value: any) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setTimeSlots(updatedSlots);
  };
  
  const validateForm = () => {
    if (!startDate || !endDate) {
      setError('Please select start and end dates');
      return false;
    }
    
    if (isAfter(startDate, endDate)) {
      setError('End date must be after start date');
      return false;
    }
    
    if (timeSlots.length === 0) {
      setError('Please add at least one time slot');
      return false;
    }
    
    for (const slot of timeSlots) {
      if (slot.startTime >= slot.endTime) {
        setError('End time must be after start time');
        return false;
      }
    }
    
    setError(null);
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm() || !currentUser || !startDate || !endDate) return;
    
    const formattedTimeSlots = timeSlots.map(slot => ({
      start_time: slot.startTime,
      end_time: slot.endTime,
      day_of_week: availabilityType === 'recurring' ? slot.dayOfWeek : undefined,
      specific_date: availabilityType === 'date_range' ? format(startDate, 'yyyy-MM-dd') : undefined
    }));
    
    await createAvailability(
      currentUser.id,
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd'),
      availabilityType,
      formattedTimeSlots
    );
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Set Your Availability</CardTitle>
        <CardDescription>
          Define when you're available for appointments. You can set a date range or recurring availability.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Availability Type</h3>
          <Select 
            value={availabilityType} 
            onValueChange={(value) => setAvailabilityType(value as 'date_range' | 'recurring')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select availability type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_range">Specific Date Range</SelectItem>
              <SelectItem value="recurring">Recurring Weekly Schedule</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Duration</h3>
          <Select value={durationOption} onValueChange={(value) => handleDurationChange(value as DurationOption)}>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Start Date</h3>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              className="border rounded-md"
              disabled={(date) => date < new Date()}
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">End Date</h3>
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              className="border rounded-md"
              disabled={(date) => date < (startDate || new Date())}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Time Slots</h3>
            <Button type="button" variant="outline" size="sm" onClick={addTimeSlot}>
              Add Time Slot
            </Button>
          </div>
          
          {timeSlots.map((slot, index) => (
            <div key={index} className="flex flex-wrap gap-4 items-center p-3 border rounded-md">
              {availabilityType === 'recurring' && (
                <div className="w-full sm:w-auto">
                  <h4 className="text-xs font-medium mb-1">Day of Week</h4>
                  <Select
                    value={slot.dayOfWeek?.toString()}
                    onValueChange={(value) => updateTimeSlot(index, 'dayOfWeek', parseInt(value))}
                  >
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sunday</SelectItem>
                      <SelectItem value="1">Monday</SelectItem>
                      <SelectItem value="2">Tuesday</SelectItem>
                      <SelectItem value="3">Wednesday</SelectItem>
                      <SelectItem value="4">Thursday</SelectItem>
                      <SelectItem value="5">Friday</SelectItem>
                      <SelectItem value="6">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <TimeInput
                label="Start Time"
                value={slot.startTime}
                onChange={(value) => updateTimeSlot(index, 'startTime', value)}
              />
              
              <TimeInput
                label="End Time"
                value={slot.endTime}
                onChange={(value) => updateTimeSlot(index, 'endTime', value)}
              />
              
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-8 w-8 rounded-full self-end mb-1"
                onClick={() => removeTimeSlot(index)}
                disabled={timeSlots.length === 1}
              >
                <span className="sr-only">Remove</span>
                <span>×</span>
              </Button>
            </div>
          ))}
        </div>
        
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
      
      <CardFooter>
        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? 'Saving...' : 'Save Availability'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExpertAvailabilityForm;
