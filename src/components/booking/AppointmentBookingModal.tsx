import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';
import { ExpertCardData } from '@/components/expert-card/types';

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: ExpertCardData;
  serviceTitle: string;
  serviceId?: string;
}

const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  expert,
  serviceTitle,
  serviceId
}) => {
  const { user } = useSimpleAuth();
  const { processPayment } = useRazorpayPayment();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch available time slots for selected date
  useEffect(() => {
    if (selectedDate && expert.auth_id) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDate, expert.auth_id]);

  const fetchAvailableTimeSlots = async () => {
    if (!selectedDate || !expert.auth_id) return;

    try {
      setLoadingSlots(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      // Get expert's availability for the selected date
      const { data: availability, error: availError } = await supabase
        .from('expert_availabilities')
        .select(`
          id,
          expert_time_slots (
            id,
            start_time,
            end_time,
            is_booked
          )
        `)
        .eq('expert_id', expert.auth_id)
        .lte('start_date', dateStr)
        .gte('end_date', dateStr);

      if (availError) {
        console.error('Error fetching availability:', availError);
        throw availError;
      }

      // Flatten time slots from all availability periods
      const timeSlots: TimeSlot[] = [];
      availability?.forEach(avail => {
        if (avail.expert_time_slots) {
          timeSlots.push(...avail.expert_time_slots);
        }
      });

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
    if (!selectedTimeSlot) return 0;
    
    // Calculate duration in hours (assuming 1-hour default sessions)
    const duration = 1; // hours
    return expert.price * duration;
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTimeSlot || !user) {
      toast.error('Please select a date and time slot');
      return;
    }

    try {
      setLoading(true);
      const sessionCost = calculateSessionCost();
      
      // Process payment first
      await processPayment(
        {
          amount: sessionCost * 100, // Convert to cents
          currency: 'USD',
          description: `Appointment with ${expert.name} for ${serviceTitle}`,
          expertId: expert.auth_id,
          serviceId: serviceId,
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
              time_slot_id: selectedTimeSlot.id,
              service_id: serviceId ? parseInt(serviceId) : null,
              status: 'confirmed',
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

            // Mark time slot as booked
            await supabase
              .from('expert_time_slots')
              .update({ is_booked: true })
              .eq('id', selectedTimeSlot.id);

            toast.success('Appointment booked successfully!');
            onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Book Appointment with {expert.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Expert Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <img
              src={expert.profilePicture}
              alt={expert.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h4 className="font-semibold">{expert.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{expert.specialization}</p>
              <Badge variant="secondary" className="mt-1">
                ${expert.price}/hour
              </Badge>
            </div>
          </div>

          {/* Service Info */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-medium mb-2">Service: {serviceTitle}</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              60-minute consultation session
            </p>
          </div>

          {/* Date Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Select Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
              className="rounded-md border"
            />
          </div>

          {/* Time Slot Selection */}
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

          {/* Notes */}
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

          {/* Cost Summary */}
          {selectedTimeSlot && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Cost:</span>
                <span className="text-lg font-bold">${calculateSessionCost()}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                60-minute session with {expert.name}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleBookAppointment}
              disabled={!selectedDate || !selectedTimeSlot || loading}
              className="flex-1"
            >
              {loading ? 'Processing...' : `Book Appointment ($${calculateSessionCost()})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentBookingModal;