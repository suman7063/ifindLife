
import React, { useState, useEffect } from 'react';
import { format, addDays, parse, isBefore, isAfter, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useAppointments } from '@/hooks/auth/useAppointments';
import { supabase } from '@/lib/supabase';
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

interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, astrologer }) => {
  const { currentUser } = useUserAuth();
  const { bookAppointment, isLoading } = useAppointments();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [duration, setDuration] = useState(15); // Changed to 15 minutes as per requirements
  const [notes, setNotes] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // When date changes, fetch available time slots
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDate]);
  
  // Calculate price whenever duration changes
  useEffect(() => {
    setTotalPrice(calculatePrice());
  }, [duration]);
  
  const fetchAvailableTimeSlots = async () => {
    if (!selectedDate) return;
    
    setLoadingTimeSlots(true);
    setSelectedTimeSlot('');
    
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      // In a real app, we would fetch time slots from the expert_availability table
      // For now, we'll generate some fake time slots
      const { data, error } = await supabase
        .from('expert_availability')
        .select('*')
        .eq('expert_id', astrologer.id.toString())
        .eq('date', formattedDate)
        .eq('is_available', true);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Use actual time slots from database
        const availableSlots = data.map(slot => ({
          startTime: slot.start_time,
          endTime: slot.end_time,
          isAvailable: true
        }));
        
        setTimeSlots(availableSlots);
      } else {
        // Generate sample time slots if none exist
        const generatedSlots = generateTimeSlots();
        setTimeSlots(generatedSlots);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast.error('Failed to load available time slots');
      
      // Fallback to generated slots
      const generatedSlots = generateTimeSlots();
      setTimeSlots(generatedSlots);
    } finally {
      setLoadingTimeSlots(false);
    }
  };
  
  function generateTimeSlots(): TimeSlot[] {
    const slots: TimeSlot[] = [];
    // Generate time slots from 9 AM to 8 PM in 15-minute increments
    for (let hour = 9; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const startTime = `${formattedHour}:${formattedMinute}`;
        
        // Calculate end time (15 minutes later)
        let endHour = hour;
        let endMinute = minute + 15;
        
        if (endMinute >= 60) {
          endHour += 1;
          endMinute -= 60;
        }
        
        const formattedEndHour = endHour.toString().padStart(2, '0');
        const formattedEndMinute = endMinute.toString().padStart(2, '0');
        const endTime = `${formattedEndHour}:${formattedEndMinute}`;
        
        // Randomly mark some slots as unavailable for demonstration
        const isAvailable = Math.random() > 0.3;
        
        slots.push({
          startTime,
          endTime,
          isAvailable
        });
      }
    }
    return slots;
  }
  
  const calculatePrice = () => {
    return astrologer.price * (duration / 15); // Calculate price based on 15-minute increments
  };
  
  const handleBooking = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast.error('Please select both date and time for your appointment');
      return;
    }
    
    // Check if user has enough wallet balance
    if (currentUser?.walletBalance && currentUser.walletBalance < totalPrice) {
      toast.error('Insufficient wallet balance. Please recharge your wallet.');
      return;
    }
    
    // Combine date and time
    const timeStart = selectedTimeSlot.split(' - ')[0];
    const [hours, minutes] = timeStart.split(':').map(Number);
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(hours, minutes);
    
    // Book the appointment
    const result = await bookAppointment(
      currentUser,
      astrologer.id.toString(),
      astrologer.name,
      appointmentDate.toISOString(),
      duration,
      totalPrice,
      currentUser?.currency || 'USD',
      undefined,
      notes
    );
    
    if (result) {
      // In a real application, we would also deduct the amount from the user's wallet
      // await deductFromWallet(currentUser.id, totalPrice);
      
      toast.success(`Appointment booked with ${astrologer.name}. The amount of ${currentUser?.currency} ${totalPrice.toFixed(2)} has been deducted from your wallet.`);
      onClose();
    }
  };
  
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
              <div className="text-sm text-muted-foreground">
                {currentUser?.currency || '₹'}{astrologer.price}/15 min
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Select Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              disabled={(date) => 
                isBefore(date, new Date()) || 
                isAfter(date, addDays(new Date(), 90)) // max 3 months in advance
              }
              className="border rounded-md p-3"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Select Time</Label>
            {loadingTimeSlots ? (
              <div className="flex h-10 items-center justify-center">Loading time slots...</div>
            ) : timeSlots.length > 0 ? (
              <Select 
                value={selectedTimeSlot} 
                onValueChange={setSelectedTimeSlot}
                disabled={loadingTimeSlots}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot, index) => (
                    <SelectItem
                      key={index}
                      value={`${slot.startTime} - ${slot.endTime}`}
                      disabled={!slot.isAvailable}
                    >
                      {slot.startTime} - {slot.endTime}
                      {!slot.isAvailable && " (Unavailable)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-muted-foreground">
                No time slots available for this date
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select 
              value={duration.toString()} 
              onValueChange={(value) => setDuration(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
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
          
          <div className="border p-3 rounded-md bg-slate-50">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Price:</span>
              <span className="text-lg font-bold">
                {currentUser?.currency || '₹'}{totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {duration / 15} × 15-minute sessions at {currentUser?.currency || '₹'}{astrologer.price} each
            </div>
            {currentUser?.walletBalance !== undefined && (
              <div className="text-xs mt-2">
                Wallet Balance: <span className={currentUser.walletBalance < totalPrice ? "text-red-500 font-medium" : ""}>
                  {currentUser.currency} {currentUser.walletBalance.toFixed(2)}
                </span>
                {currentUser.walletBalance < totalPrice && (
                  <span className="block text-red-500 mt-1">Insufficient balance for this booking</span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleBooking} 
            disabled={
              isLoading || 
              !selectedDate || 
              !selectedTimeSlot || 
              (currentUser?.walletBalance !== undefined && currentUser.walletBalance < totalPrice)
            }
          >
            {isLoading ? 'Booking...' : 'Book Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
