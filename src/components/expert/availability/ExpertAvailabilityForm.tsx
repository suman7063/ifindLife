import React from 'react';
import { useAvailabilityManagement } from '@/hooks/useAvailabilityManagement';
import { withProfileTypeAdapter } from '@/components/wrappers/withProfileTypeAdapter';
import { UserProfile } from '@/types/supabase/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useUserAuth } from '@/hooks/user-auth';
import { useAppointments } from '@/hooks/useAppointments';
import { format } from 'date-fns';

import AvailabilityTypeSelector from './AvailabilityTypeSelector';
import DateRangeSelector from './DateRangeSelector';
import TimeSlotSection from './TimeSlotSection';
import { 
  DurationOption,
  validateAvailabilityForm, 
  formatTimeSlotsForSubmission 
} from './utils/availabilityUtils';

interface ExpertAvailabilityFormProps {
  user: UserProfile | null;
  onSuccess?: () => void;
}

const ExpertAvailabilityForm: React.FC<ExpertAvailabilityFormProps> = ({
  user,
  onSuccess
}) => {
  const { currentUser } = useUserAuth();
  const { createAvailability, loading } = useAppointments(currentUser);
  
  const [availabilityType, setAvailabilityType] = useState<'date_range' | 'recurring'>('date_range');
  const [durationOption, setDurationOption] = useState<DurationOption>('3');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState([{ startTime: '09:00', endTime: '17:00', dayOfWeek: 1 }]);
  const [error, setError] = useState<string | null>(null);
  
  const handleDurationChange = (value: DurationOption) => {
    setDurationOption(value);
    
    if (value !== 'custom' && startDate) {
      const newEndDate = new Date(startDate);
      newEndDate.setMonth(startDate.getMonth() + parseInt(value));
      setEndDate(newEndDate);
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
  
  const handleSubmit = async () => {
    if (!currentUser || !startDate || !endDate) return;
    
    const validation = validateAvailabilityForm(startDate, endDate, timeSlots);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }
    
    setError(null);
    
    const formattedTimeSlots = formatTimeSlotsForSubmission(
      timeSlots,
      availabilityType,
      startDate
    );
    
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
        <AvailabilityTypeSelector 
          availabilityType={availabilityType} 
          onAvailabilityTypeChange={setAvailabilityType} 
        />
        
        <DateRangeSelector 
          durationOption={durationOption}
          startDate={startDate}
          endDate={endDate}
          onDurationChange={handleDurationChange}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        
        <TimeSlotSection 
          availabilityType={availabilityType}
          timeSlots={timeSlots}
          onAddTimeSlot={addTimeSlot}
          onRemoveTimeSlot={removeTimeSlot}
          onUpdateTimeSlot={updateTimeSlot}
        />
        
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
      
      <CardFooter>
        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : 'Save Availability'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default withProfileTypeAdapter(ExpertAvailabilityForm, 'B');
