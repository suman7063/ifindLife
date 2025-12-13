import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Calendar as CalendarIcon, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

interface ExpertData {
  id: string;
  auth_id: string;
  name: string;
  profile_picture: string;
  specialization: string;
  price?: number;
}

interface IntegratedExpertBookingProps {
  expertId: string;
  expertName: string;
  onBookingComplete?: () => void;
}

const IntegratedExpertBooking: React.FC<IntegratedExpertBookingProps> = ({
  expertId,
  expertName,
  onBookingComplete = () => {}
}) => {
  const { user } = useSimpleAuth();
  const { processPayment } = useRazorpayPayment();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [expert, setExpert] = useState<ExpertData | null>(null);
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Details, 3: Payment

  // Fetch expert data
  useEffect(() => {
    fetchExpertData();
  }, [expertId]);

  // Fetch available time slots for selected date
  useEffect(() => {
    if (selectedDate && expert?.auth_id) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDate, expert?.auth_id]);

  const fetchExpertData = async () => {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', expertId)
        .single();

      if (error) throw error;
      setExpert(data);
    } catch (error) {
      console.error('Error fetching expert:', error);
      toast.error('Failed to load expert information');
    }
  };

  const fetchAvailableTimeSlots = async () => {
    if (!selectedDate || !expert?.auth_id) return;

    try {
      setLoadingSlots(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      // Get expert's availability for the selected date (simple schema)
      const targetDate = new Date(dateStr);
      const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      const { data: availability, error: availError } = await supabase
        .from('expert_availabilities')
        .select('*')
        .eq('expert_id', expert.auth_id)
        .eq('day_of_week', dayOfWeek) // Match day of week (0-6)
        .eq('is_available', true);

      if (availError) {
        console.error('Error fetching availability:', availError);
        throw availError;
      }

      // Generate 30-minute slots from availability time ranges
      const timeSlots: TimeSlot[] = [];
      
      availability?.forEach(avail => {
        const [startHour, startMin] = avail.start_time.split(':').map(Number);
        const [endHour, endMin] = avail.end_time.split(':').map(Number);
        
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        
        // Generate 30-minute slots
        for (let currentMinutes = startMinutes; currentMinutes < endMinutes; currentMinutes += 30) {
          const slotStartHour = Math.floor(currentMinutes / 60);
          const slotStartMin = currentMinutes % 60;
          const slotEndMinutes = currentMinutes + 30;
          const slotEndHour = Math.floor(slotEndMinutes / 60);
          const slotEndMin = slotEndMinutes % 60;
          
          const slotStartTime = `${slotStartHour.toString().padStart(2, '0')}:${slotStartMin.toString().padStart(2, '0')}`;
          const slotEndTime = `${slotEndHour.toString().padStart(2, '0')}:${slotEndMin.toString().padStart(2, '0')}`;
          
          if (slotEndMinutes <= endMinutes) {
            timeSlots.push({
              id: `${avail.id}-${slotStartTime}`,
              start_time: slotStartTime,
              end_time: slotEndTime,
              is_booked: false
            });
          }
        }
      });

      // Check which slots are already booked by checking appointments
      const { data: bookedAppointments } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('expert_id', expert.auth_id)
        .eq('appointment_date', dateStr)
        .in('status', ['scheduled', 'completed']);

      // Mark booked slots
      if (bookedAppointments) {
        timeSlots.forEach(slot => {
          const isBooked = bookedAppointments.some(apt => 
            apt.start_time === slot.start_time || 
            (apt.start_time <= slot.start_time && apt.end_time > slot.start_time)
          );
          if (isBooked) {
            slot.is_booked = true;
          }
        });
      }

      setAvailableTimeSlots(timeSlots.filter(slot => !slot.is_booked));
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast.error('Failed to load available time slots');
      setAvailableTimeSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const formatTime = (timeStr: string): string => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const calculateSessionCost = (): number => {
    if (!selectedTimeSlot || !expert?.price) return 0;
    return expert.price; // Price per hour
  };

  const handleNext = () => {
    if (step === 1 && (!selectedDate || !selectedTimeSlot)) {
      toast.error('Please select a date and time slot');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTimeSlot || !user || !expert) {
      toast.error('Missing required information');
      return;
    }

    try {
      setLoading(true);
      const sessionCost = calculateSessionCost();
      
      // Process payment first
      await processPayment(
        {
          amount: Math.round(sessionCost * 100), // Convert to paise
          currency: 'INR',
          description: `Appointment with ${expert.name}`,
          expertId: expert.auth_id,
        },
        async (paymentId: string, orderId: string) => {
          // Payment successful, create appointment
          try {
            const appointmentData = {
              user_id: user.id,
              expert_id: expert.auth_id,
              expert_name: expert.name,
              appointment_date: selectedDate.toISOString().split('T')[0],
              start_time: selectedTimeSlot.start_time,
              end_time: selectedTimeSlot.end_time,
              time_slot_id: null, // Not using expert_time_slots table anymore
              status: 'scheduled',
              notes: notes,
              duration: 60, // 1 hour default
            };

            const { data, error } = await supabase
              .from('appointments')
              .insert(appointmentData)
              .select()
              .single();

            if (error) {
              console.error('Error creating appointment:', error);
              throw error;
            }

            // No need to mark time slot as booked - we check appointments table instead

            toast.success('Appointment booked successfully!');
            onBookingComplete();
            
            // Reset form
            setStep(1);
            setSelectedDate(new Date());
            setSelectedTimeSlot(null);
            setNotes('');
          } catch (error) {
            console.error('Error creating appointment:', error);
            toast.error('Failed to create appointment after payment');
          }
        },
        (error: any) => {
          console.error('Payment failed:', error);
          toast.error('Payment failed. Please try again.');
        }
      );
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  if (!expert) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5" />
          <span>Book Appointment with {expert.name}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Expert Info */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <img
            src={expert.profile_picture || ''}
            alt={expert.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold">{expert.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{expert.specialization}</p>
            {expert.price && (
              <Badge variant="secondary" className="mt-1">
                ₹{expert.price}/hour
              </Badge>
            )}
          </div>
        </div>

        {/* Step 1: Date and Time Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                className="rounded-md border mt-2"
              />
            </div>

            {selectedDate && (
              <div className="space-y-4">
                <Label className="text-base font-medium">Available Time Slots</Label>
                {loadingSlots ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : availableTimeSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {availableTimeSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={selectedTimeSlot?.id === slot.id ? "default" : "outline"}
                        className="h-auto py-3"
                        onClick={() => setSelectedTimeSlot(slot)}
                      >
                        <div className="text-center">
                          <Clock className="h-4 w-4 mx-auto mb-1" />
                          <div className="text-sm">
                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No available time slots for this date. Please select another date.
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                disabled={!selectedDate || !selectedTimeSlot}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Session Details</Label>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">
                      {selectedTimeSlot && `${formatTime(selectedTimeSlot.start_time)} - ${formatTime(selectedTimeSlot.end_time)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">60 minutes</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Total Cost:</span>
                    <span className="text-lg font-bold">₹{calculateSessionCost()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any specific topics or concerns you'd like to discuss..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>
                Proceed to Payment
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Review & Pay</Label>
              <div className="mt-4 p-4 border rounded-lg">
                <h5 className="font-medium mb-3">Booking Summary</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Expert:</span>
                    <span>{expert.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{selectedDate?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>
                      {selectedTimeSlot && `${formatTime(selectedTimeSlot.start_time)} - ${formatTime(selectedTimeSlot.end_time)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>60 minutes</span>
                  </div>
                  {notes && (
                    <div className="flex justify-between">
                      <span>Notes:</span>
                      <span className="text-right max-w-xs">{notes}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span className="text-lg">₹{calculateSessionCost()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={handleBookAppointment}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>
                  {loading ? 'Processing...' : `Pay ₹${calculateSessionCost()}`}
                </span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntegratedExpertBooking;