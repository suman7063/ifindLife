import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useExpertAvailability } from '@/hooks/useExpertAvailability';
import { Clock, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';

interface AvailabilityBasedBookingProps {
  expertId: string;
  expertName: string;
  onBookingConfirm: (slotId: string, date: string, time: string) => void;
}

const AvailabilityBasedBooking: React.FC<AvailabilityBasedBookingProps> = ({
  expertId,
  expertName,
  onBookingConfirm
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  const { 
    loading, 
    error, 
    getAvailableSlots, 
    isAvailableOnDate,
    getAvailabilityCalendar 
  } = useExpertAvailability(expertId);

  const selectedDateString = selectedDate?.toISOString().split('T')[0] || '';
  const availableSlots = selectedDate ? getAvailableSlots(selectedDateString) : [];
  const availabilityCalendar = getAvailabilityCalendar();

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedSlot) {
      toast.error('Please select a date and time slot');
      return;
    }

    const slot = availableSlots.find(s => s.id === selectedSlot);
    if (!slot) {
      toast.error('Selected time slot is no longer available');
      return;
    }

    onBookingConfirm(selectedSlot, selectedDateString, slot.start_time);
  };

  const isDateAvailable = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return availabilityCalendar[dateString] || false;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Book with {expertName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading availability...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Book with {expertName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading availability: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Book with {expertName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calendar */}
        <div>
          <h4 className="font-medium mb-3">Select Date</h4>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today || !isDateAvailable(date);
            }}
            className="rounded-md border"
          />
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Available Times for {selectedDate.toDateString()}
            </h4>
            
            {availableSlots.length === 0 ? (
              <div className="text-center py-8 bg-muted rounded-lg">
                <p className="text-muted-foreground">No available time slots for this date</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={selectedSlot === slot.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSlot(slot.id)}
                    className="justify-center"
                  >
                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Booking Confirmation */}
        {selectedDate && selectedSlot && (
          <div className="border-t pt-4">
            <div className="bg-muted p-4 rounded-lg mb-4">
              <h5 className="font-medium mb-2">Booking Summary</h5>
              <div className="space-y-1 text-sm">
                <p><strong>Expert:</strong> {expertName}</p>
                <p><strong>Date:</strong> {selectedDate.toDateString()}</p>
                <p><strong>Time:</strong> {
                  availableSlots.find(s => s.id === selectedSlot) && 
                  formatTime(availableSlots.find(s => s.id === selectedSlot)!.start_time)
                } - {
                  availableSlots.find(s => s.id === selectedSlot) && 
                  formatTime(availableSlots.find(s => s.id === selectedSlot)!.end_time)
                }</p>
              </div>
            </div>
            
            <Button onClick={handleBooking} className="w-full">
              Confirm Booking
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailabilityBasedBooking;