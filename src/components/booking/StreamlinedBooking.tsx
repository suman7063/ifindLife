import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Clock, User, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { getInitials } from '@/utils/getInitials';

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  date: string;
}

interface StreamlinedBookingProps {
  expertId: string;
  expertName: string;
  onBookingComplete?: () => void;
}

const StreamlinedBooking: React.FC<StreamlinedBookingProps> = ({
  expertId,
  expertName,
  onBookingComplete = () => {}
}) => {
  const { user } = useSimpleAuth();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [expert, setExpert] = useState<any>(null);

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
      
      // Generate 30-minute slots from 9 AM to 9 PM
      const timeSlots: TimeSlot[] = [];
      for (let hour = 9; hour < 21; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const endTime = minute === 30 
            ? `${(hour + 1).toString().padStart(2, '0')}:00`
            : `${hour.toString().padStart(2, '0')}:30`;
          
          timeSlots.push({
            id: `${dateStr}-${startTime}`,
            start_time: startTime,
            end_time: endTime,
            is_booked: false,
            date: dateStr
          });
        }
      }

      // Check which slots are already booked
      const { data: bookedSlots, error } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('expert_id', expert.auth_id)
        .eq('appointment_date', dateStr)
        .eq('status', 'scheduled');

      if (error) {
        console.error('Error fetching booked slots:', error);
      } else if (bookedSlots) {
        // Mark booked slots
        bookedSlots.forEach(booked => {
          const slot = timeSlots.find(s => s.start_time === booked.start_time);
          if (slot) {
            slot.is_booked = true;
          }
        });
      }

      setAvailableSlots(timeSlots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast.error('Failed to load available time slots');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const toggleSlotSelection = (slotId: string) => {
    setSelectedSlots(prev => 
      prev.includes(slotId) 
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

  const calculateTotalCost = (): number => {
    if (!expert?.price) return 0;
    return selectedSlots.length * (expert.price / 2); // 30-min slots are half the hourly rate
  };

  const handleBookAppointments = async () => {
    if (!selectedDate || selectedSlots.length === 0 || !user || !expert) {
      toast.error('Please select at least one time slot');
      return;
    }

    try {
      setLoading(true);
      
      const appointments = selectedSlots.map(slotId => {
        const slot = availableSlots.find(s => s.id === slotId);
        if (!slot) return null;

        return {
          user_id: user.id,
          expert_id: expert.auth_id,
          expert_name: expert.name,
          appointment_date: selectedDate.toISOString().split('T')[0],
          start_time: slot.start_time,
          end_time: slot.end_time,
          status: 'scheduled',
          duration: 30,
        };
      }).filter(Boolean);

      const { data, error } = await supabase
        .from('appointments')
        .insert(appointments)
        .select();

      if (error) {
        console.error('Error creating appointments:', error);
        throw error;
      }

      toast.success(`Successfully booked ${selectedSlots.length} session(s)!`);
      onBookingComplete();
      
      // Reset form
      setSelectedSlots([]);
      fetchAvailableTimeSlots(); // Refresh slots
    } catch (error) {
      console.error('Error booking appointments:', error);
      toast.error('Failed to book appointments');
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Expert Info */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Expert Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={expert.profile_picture || ''} alt={expert.name} />
              <AvatarFallback>{getInitials(expert.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-lg">{expert.name}</h4>
              <p className="text-sm text-muted-foreground">{expert.specialization}</p>
              {expert.price && (
                <Badge variant="secondary" className="mt-1">
                  ₹{expert.price}/hour (₹{expert.price / 2}/30min)
                </Badge>
              )}
            </div>
          </div>
          
          {selectedSlots.length > 0 && (
            <div className="border-t pt-4">
              <h5 className="font-medium mb-2">Selected Sessions</h5>
              <div className="space-y-1">
                {selectedSlots.map(slotId => {
                  const slot = availableSlots.find(s => s.id === slotId);
                  return slot ? (
                    <div key={slotId} className="text-sm flex items-center space-x-2">
                      <Check className="h-3 w-3 text-green-600" />
                      <span>{formatTime(slot.start_time)} - {formatTime(slot.end_time)}</span>
                    </div>
                  ) : null;
                })}
              </div>
              <div className="mt-3 pt-2 border-t">
                <div className="flex justify-between font-medium">
                  <span>Total Cost:</span>
                  <span>₹{calculateTotalCost()}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Date and Time Selection */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Select Date & Time Slots</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Selection */}
          <div>
            <h5 className="font-medium mb-3">Select Date</h5>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
              className="rounded-md border"
            />
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div>
              <h5 className="font-medium mb-3">Available 30-Minute Time Slots</h5>
              {loadingSlots ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlots.includes(slot.id);
                    const isBooked = slot.is_booked;
                    
                    return (
                      <Button
                        key={slot.id}
                        variant={isSelected ? "default" : isBooked ? "secondary" : "outline"}
                        size="sm"
                        className={`h-auto py-2 ${isBooked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => !isBooked && toggleSlotSelection(slot.id)}
                        disabled={isBooked}
                      >
                        <div className="text-center">
                          <Clock className="h-3 w-3 mx-auto mb-1" />
                          <div className="text-xs">
                            {formatTime(slot.start_time)}
                          </div>
                          {isBooked && (
                            <div className="text-xs text-muted-foreground">
                              Booked
                            </div>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No available time slots for this date.
                </div>
              )}
            </div>
          )}

          {/* Book Button */}
          {selectedSlots.length > 0 && (
            <div className="pt-4 border-t">
              <Button
                onClick={handleBookAppointments}
                disabled={loading}
                size="lg"
                className="w-full"
              >
                {loading ? 'Booking...' : `Book ${selectedSlots.length} Session(s) - ₹${calculateTotalCost()}`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StreamlinedBooking;