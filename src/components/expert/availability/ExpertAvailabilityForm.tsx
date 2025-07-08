
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAvailabilityManagement } from '@/hooks/useAvailabilityManagement';
import { toast } from 'sonner';
import { Calendar, Clock } from 'lucide-react';

interface ExpertAvailabilityFormProps {
  user: any;
}

const ExpertAvailabilityForm: React.FC<ExpertAvailabilityFormProps> = ({ user }) => {
  const { createAvailability, loading } = useAvailabilityManagement(user);
  const [formData, setFormData] = useState({
    selectedDays: [] as number[],
    startTime: '09:00',
    endTime: '17:00',
    startDate: '',
    endDate: '',
    availabilityType: 'recurring' as 'date_range' | 'recurring'
  });

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleDayToggle = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(dayIndex)
        ? prev.selectedDays.filter(d => d !== dayIndex)
        : [...prev.selectedDays, dayIndex].sort()
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.selectedDays.length === 0) {
      toast.error('Please select at least one day');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      // Create time slots for each selected day
      const timeSlots = formData.selectedDays.map(dayIndex => ({
        start_time: formData.startTime,
        end_time: formData.endTime,
        day_of_week: dayIndex + 1, // Database expects 1-7 for Monday-Sunday
        specific_date: null
      }));

      const result = await createAvailability(
        user.id,
        formData.startDate,
        formData.endDate,
        formData.availabilityType,
        timeSlots
      );

      if (result) {
        toast.success('Availability created successfully!');
        // Reset form
        setFormData({
          selectedDays: [],
          startTime: '09:00',
          endTime: '17:00',
          startDate: '',
          endDate: '',
          availabilityType: 'recurring'
        });
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
          Set Your Availability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Days Selection */}
          <div className="space-y-2">
            <Label>Select Days</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {dayNames.map((day, index) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${index}`}
                    checked={formData.selectedDays.includes(index)}
                    onCheckedChange={() => handleDayToggle(index)}
                  />
                  <Label 
                    htmlFor={`day-${index}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {day.substring(0, 3)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating Availability...' : 'Create Availability'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpertAvailabilityForm;
