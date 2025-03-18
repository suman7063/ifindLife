
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useUserAuth } from '@/hooks/useUserAuth';
import { from } from '@/lib/supabase';
import { useAppointments } from '@/hooks/auth/useAppointments';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, expert }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [duration, setDuration] = useState<number>(15); // Default 15 minutes
  const [notes, setNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card' | ''>('');
  const [availableSlots, setAvailableSlots] = useState<{ startTime: string; endTime: string; isAvailable: boolean }[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const { currentUser } = useUserAuth();
  const { bookAppointment } = useAppointments();
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setDate(undefined);
      setTimeSlot('');
      setDuration(15);
      setNotes('');
      setPaymentMethod('');
    }
  }, [isOpen]);
  
  // Calculate total price when duration or expert changes
  useEffect(() => {
    setTotalPrice(expert.price * duration);
  }, [expert.price, duration]);
  
  // Fetch available time slots when date changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!date) return;
      
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      try {
        // Fetch expert's availability for the selected date
        const { data, error } = await from('expert_availability')
          .select('*')
          .eq('expert_id', expert.id.toString())
          .eq('date', formattedDate);
        
        if (error) throw error;
        
        // Transform the data to time slots
        const slots = data?.map(slot => ({
          startTime: slot.start_time,
          endTime: slot.end_time,
          isAvailable: slot.is_available
        })) || [];
        
        // If no slots defined for this date, generate default slots (9 AM to 7 PM)
        if (slots.length === 0) {
          const defaultSlots = [];
          for (let hour = 9; hour < 19; hour++) {
            const startHour = hour.toString().padStart(2, '0');
            const endHour = (hour + 1).toString().padStart(2, '0');
            defaultSlots.push({
              startTime: `${startHour}:00`,
              endTime: `${startHour}:30`,
              isAvailable: true
            });
            defaultSlots.push({
              startTime: `${startHour}:30`,
              endTime: `${endHour}:00`,
              isAvailable: true
            });
          }
          setAvailableSlots(defaultSlots);
        } else {
          setAvailableSlots(slots);
        }
      } catch (error) {
        console.error('Error fetching available slots:', error);
        toast.error('Failed to fetch available time slots');
      }
    };
    
    fetchAvailableSlots();
  }, [date, expert.id]);
  
  const handleSubmit = async () => {
    if (!currentUser) {
      toast.error('Please log in to book a session');
      return;
    }
    
    if (!date) {
      toast.error('Please select a date');
      return;
    }
    
    if (!timeSlot) {
      toast.error('Please select a time slot');
      return;
    }
    
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setIsLoading(true);
    
    try {
      // Format selected date and time for the appointment
      const formattedDate = format(date, 'yyyy-MM-dd');
      const appointmentDateTime = `${formattedDate}T${timeSlot}`;
      
      // Book the appointment
      const result = await bookAppointment(
        currentUser,
        expert.id.toString(),
        expert.name,
        appointmentDateTime,
        duration,
        totalPrice,
        'INR'
      );
      
      if (result) {
        toast.success('Appointment booked successfully!');
        onClose();
      } else {
        toast.error('Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book a Session with {expert.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-md overflow-hidden">
              <img 
                src={expert.imageUrl}
                alt={expert.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium">{expert.name}</div>
              <div className="text-sm text-muted-foreground">₹{expert.price}/min</div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))}
              className="border rounded-md"
            />
          </div>
          
          {date && (
            <div className="grid gap-2">
              <Label>Select Time</Label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot">
                    {timeSlot ? (
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{timeSlot}</span>
                      </div>
                    ) : (
                      "Select time slot"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableSlots.filter(slot => slot.isAvailable).map((slot, index) => (
                    <SelectItem key={index} value={slot.startTime}>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{slot.startTime}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label>Duration</Label>
            <RadioGroup value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="15" id="duration-15" />
                  <Label htmlFor="duration-15">15 mins</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30" id="duration-30" />
                  <Label htmlFor="duration-30">30 mins</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="45" id="duration-45" />
                  <Label htmlFor="duration-45">45 mins</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="60" id="duration-60" />
                  <Label htmlFor="duration-60">60 mins</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid gap-2">
            <Label>Notes (Optional)</Label>
            <Textarea 
              placeholder="Add any notes for the expert..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'wallet' | 'card')}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2 p-3 border rounded-md">
                  <RadioGroupItem value="wallet" id="payment-wallet" />
                  <Label htmlFor="payment-wallet" className="flex-1">Wallet Balance</Label>
                  <span>₹500.00</span>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-md">
                  <RadioGroupItem value="card" id="payment-card" />
                  <Label htmlFor="payment-card">Credit/Debit Card</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex justify-between items-center border-t pt-4 mt-2">
            <div className="font-medium">Total Price</div>
            <div className="text-lg font-semibold">₹{totalPrice.toFixed(2)}</div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
