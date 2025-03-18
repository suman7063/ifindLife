
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useAppointments } from '@/hooks/auth/useAppointments';
import { toast } from 'sonner';

interface AstrologerInfo {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  astrologer: AstrologerInfo;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, astrologer }) => {
  const { currentUser } = useUserAuth();
  const { bookAppointment, isLoading } = useAppointments();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState('');
  
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time for your appointment');
      return;
    }
    
    // Combine date and time
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(hours, minutes);
    
    // Book the appointment
    const result = await bookAppointment(
      currentUser,
      astrologer.id.toString(),
      astrologer.name,
      appointmentDate.toISOString(),
      duration,
      undefined,
      notes
    );
    
    if (result) {
      onClose();
    }
  };
  
  const timeSlots = generateTimeSlots();
  
  function generateTimeSlots() {
    const slots = [];
    for (let hour = 9; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        slots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return slots;
  }
  
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Session with {astrologer.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <img 
              src={astrologer.imageUrl} 
              alt={astrologer.name} 
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <div className="font-medium">{astrologer.name}</div>
              <div className="text-sm text-muted-foreground">₹{astrologer.price}/min</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Select Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))}
              className="border rounded-md p-3"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Select Time</Label>
            <select
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select a time</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min={15}
              max={120}
              step={15}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific topics you'd like to discuss..."
              className="resize-none"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleBooking} disabled={isLoading || !selectedDate || !selectedTime}>
            {isLoading ? 'Booking...' : 'Book Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
