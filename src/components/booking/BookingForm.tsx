
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserAuth } from '@/contexts/UserAuthContext';

interface BookingFormProps {
  expertId: string;
  expertName: string;
  onClose: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ expertId, expertName, onClose }) => {
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [duration, setDuration] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useUserAuth();

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '01:00 PM', '02:00 PM', 
    '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!date || !timeSlot) {
      alert('Please select both date and time');
      return;
    }
    
    try {
      setIsSubmitting(true);
      // Booking API call would go here
      console.log('Booking submitted:', {
        expertId,
        userId: currentUser?.id,
        date: format(date, 'yyyy-MM-dd'),
        timeSlot,
        duration
      });
      
      alert(`Booking scheduled with ${expertName} on ${format(date, 'PPP')} at ${timeSlot}`);
      onClose();
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to schedule booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Select Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => date < new Date()}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Select Time</label>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((slot) => (
            <Button 
              key={slot}
              type="button"
              variant={timeSlot === slot ? "default" : "outline"}
              className="text-sm"
              onClick={() => setTimeSlot(slot)}
            >
              {slot}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Duration</label>
        <div className="flex space-x-2">
          {[30, 45, 60].map((mins) => (
            <Button 
              key={mins}
              type="button"
              variant={duration === mins ? "default" : "outline"}
              className="flex-1"
              onClick={() => setDuration(mins)}
            >
              {mins} min
            </Button>
          ))}
        </div>
      </div>
      
      <div className="pt-4 flex space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1"
          disabled={isSubmitting || !date || !timeSlot}
        >
          {isSubmitting ? 'Scheduling...' : 'Schedule'}
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
