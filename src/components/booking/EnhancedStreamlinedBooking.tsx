import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Clock, Check, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useExpertPricing } from '@/hooks/useExpertPricing';
import { useExpertAvailability } from '@/hooks/useExpertAvailability';
import { useRazorpayPayment } from '@/hooks/call/useRazorpayPayment';

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  date: string;
  duration: number; // in minutes
}

interface EnhancedStreamlinedBookingProps {
  expertId: string;
  expertName: string;
  onBookingComplete?: () => void;
}

const EnhancedStreamlinedBooking: React.FC<EnhancedStreamlinedBookingProps> = ({
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

  // Use the expert pricing hook
  const { 
    pricing, 
    userCurrency, 
    loading: pricingLoading, 
    formatPrice, 
    getSlotPrice 
  } = useExpertPricing(expertId);
  
  console.log('🔧 EnhancedStreamlinedBooking: Hook results - pricing:', pricing, 'pricingLoading:', pricingLoading, 'userCurrency:', userCurrency);

  // Use the expert availability hook
  const {
    getAvailableSlots,
    loading: availabilityLoading,
    error: availabilityError,
    hasAvailability
  } = useExpertAvailability(expertId);

  // Use the payment hook
  const { processPayment, isLoading: paymentLoading } = useRazorpayPayment();

  // Fetch expert data
  useEffect(() => {
    fetchExpertData();
  }, [expertId]);

  // Fetch available time slots for selected date
  useEffect(() => {
    if (selectedDate && expert?.auth_id && !availabilityLoading && hasAvailability) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDate, expert?.auth_id, availabilityLoading, hasAvailability]);

  const fetchExpertData = async () => {
    try {
      console.log('BookingTab: Fetching expert data for expertId:', expertId);
      
      // Use the RPC function to get public expert profile
      const { data, error } = await supabase
        .rpc('get_public_expert_profile', { p_auth_id: expertId });

      if (error) {
        console.error('BookingTab: Error fetching expert:', error);
        throw error;
      }
      
      console.log('BookingTab: Expert data loaded:', data);
      setExpert(data?.[0] || null);
    } catch (error) {
      console.error('BookingTab: Error fetching expert:', error);
      toast.error('Failed to load expert information');
    }
  };

  const fetchAvailableTimeSlots = async () => {
    if (!selectedDate || !expert?.auth_id || availabilityLoading || !hasAvailability) {
      setAvailableSlots([]);
      setLoadingSlots(false);
      return;
    }

    try {
      setLoadingSlots(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      console.log('BookingTab: Fetching availability for date:', dateStr, 'expert:', expert.auth_id);
      
      // Get expert's actual availability slots using the hook
      const expertSlots = getAvailableSlots(dateStr);
      console.log('BookingTab: Expert availability slots:', expertSlots);
      
      if (expertSlots.length === 0) {
        console.log('BookingTab: No slots found for date:', dateStr);
        console.log('BookingTab: Availability loading:', availabilityLoading, 'Has availability:', hasAvailability);
        setAvailableSlots([]);
        setLoadingSlots(false);
        return;
      }
      
      // Convert expert availability to our TimeSlot format
      const timeSlots: TimeSlot[] = expertSlots.map(slot => {       
        return {
          id: slot.id, // Use the actual database slot ID
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_booked: false,
          date: dateStr,
          duration: 30
        };
      });

      // Check which slots are already booked
      const { data: bookedSlots, error } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('expert_id', expert.auth_id)
        .eq('appointment_date', dateStr)
        .in('status', ['confirmed', 'completed']);

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

      console.log('BookingTab: Final time slots:', timeSlots);
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

  // Helper function to check if slots are continuous
  const areSlotsContinuous = (slots: string[]): boolean => {
    if (slots.length <= 1) return true;
    
    // Sort slots by start_time using availableSlots reference
    const sortedSlots = [...slots].sort((a, b) => {
      const slotA = availableSlots.find(s => s.id === a);
      const slotB = availableSlots.find(s => s.id === b);
      if (!slotA || !slotB) return 0;
      return slotA.start_time.localeCompare(slotB.start_time);
    });
    
    // Check if each slot follows the previous one
    for (let i = 1; i < sortedSlots.length; i++) {
      const prevSlot = availableSlots.find(s => s.id === sortedSlots[i - 1]);
      const currentSlot = availableSlots.find(s => s.id === sortedSlots[i]);
      
      if (!prevSlot || !currentSlot) return false;
      
      // Check if current slot start time equals previous slot end time
      if (currentSlot.start_time !== prevSlot.end_time) {
        return false;
      }
    }
    
    return true;
  };

  const calculateTotalCost = (): number => {
    console.log('🔧 EnhancedStreamlinedBooking: calculateTotalCost called');
    console.log('🔧 EnhancedStreamlinedBooking: pricing:', pricing);
    console.log('🔧 EnhancedStreamlinedBooking: selectedSlots:', selectedSlots);
    console.log('🔧 EnhancedStreamlinedBooking: userCurrency:', userCurrency);
    
    if (selectedSlots.length === 0) {
      return 0;
    }

    const fallback30 = userCurrency === 'INR' ? 450 : 25;
    const fallback60 = userCurrency === 'INR' ? 800 : 40;

    const session60Price = pricing ? (userCurrency === 'INR' ? pricing.session_60_inr : pricing.session_60_eur) : fallback60;
    const session30Price = pricing ? (userCurrency === 'INR' ? pricing.session_30_inr : pricing.session_30_eur) : fallback30;
    
    console.log('🔧 EnhancedStreamlinedBooking: Prices - 30min:', session30Price, '60min:', session60Price);
    
    // If slots are continuous, calculate as blocks of 60-min sessions + remaining 30-min
    if (areSlotsContinuous(selectedSlots)) {
      const totalMinutes = selectedSlots.length * 30;
      const fullHours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;
      
      let totalCost = 0;
      
      // Add full hour sessions at 60-min rate (every 2 slots = 60 minutes)
      totalCost += fullHours * session60Price;
      
      // Add remaining 30-minute session at 30-min rate
      if (remainingMinutes === 30) {
        totalCost += session30Price;
      }
      
      console.log('🔧 EnhancedStreamlinedBooking: Continuous slots calculation:', { fullHours, remainingMinutes, totalCost });
      return totalCost;
    } else {
      // If slots are not continuous, charge each 30-min slot at 30-min rate
      const totalCost = selectedSlots.length * session30Price;
      console.log('🔧 EnhancedStreamlinedBooking: Non-continuous slots calculation:', { slotsCount: selectedSlots.length, session30Price, totalCost });
      return totalCost;
    }
  };


  const getSessionBreakdown = () => {
    if (selectedSlots.length === 0) return '';
    
    if (areSlotsContinuous(selectedSlots)) {
      const totalMinutes = selectedSlots.length * 30;
      const fullHours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;
      
      let breakdown = '';
      if (fullHours > 0) {
        breakdown += `${fullHours} × 60min session${fullHours > 1 ? 's' : ''}`;
      }
      if (remainingMinutes > 0) {
        if (breakdown) breakdown += ' + ';
        breakdown += `1 × 30min session`;
      }
      
      return breakdown;
    } else {
      return `${selectedSlots.length} × 30min session${selectedSlots.length > 1 ? 's' : ''}`;
    }
  };

  const handleBookAppointments = async () => {
    console.log('🔧 Payment: Starting booking process');
    console.log('🔧 Payment: selectedDate:', selectedDate);
    console.log('🔧 Payment: selectedSlots:', selectedSlots);
    console.log('🔧 Payment: user:', user);
    console.log('🔧 Payment: expert:', expert);

    if (!selectedDate || selectedSlots.length === 0 || !user || !expert) {
      console.log('🔧 Payment: Missing required data');
      toast.error('Please select at least one time slot');
      return;
    }

    const totalCost = calculateTotalCost();
    console.log('🔧 Payment: totalCost calculated:', totalCost);
    console.log('🔧 Payment: userCurrency:', userCurrency);
    
    if (totalCost <= 0) {
      console.log('🔧 Payment: Invalid total cost, aborting');
      toast.error('Unable to calculate session cost. Please try again.');
      return;
    }

    try {
      setLoading(true);
      console.log('🔧 Payment: Initiating payment process');
      
      // Process payment first using Razorpay
      await processPayment(
        totalCost,
        userCurrency,
        `Booking ${selectedSlots.length} session(s) with ${expertName}`,
        async (paymentId: string, orderId: string) => {
          console.log('🔧 Payment: Payment successful:', paymentId, orderId);
          // Payment successful, create appointments
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
              status: 'confirmed',
              duration: 30,
              payment_status: 'completed',
              payment_id: paymentId,
              razorpay_payment_id: paymentId,
              order_id: orderId
            };
          }).filter(Boolean);

          const { data, error } = await supabase
            .from('appointments')
            .insert(appointments);

          if (error) {
            console.error('Error creating appointments:', error);
            throw error;
          }

          toast.success(`Successfully booked ${selectedSlots.length} session(s)!`, {
            description: `Total cost: ${formatPrice(totalCost)}`
          });
          
          onBookingComplete();
          
          // Reset form
          setSelectedSlots([]);
          fetchAvailableTimeSlots(); // Refresh slots
        },
        (error: any) => {
          console.error('Payment failed:', error);
          toast.error('Payment failed. Please try again.');
        }
      );
    } catch (error) {
      console.error('Error booking appointments:', error);
      toast.error('Failed to initiate booking process');
    } finally {
      setLoading(false);
    }
  };

  if (!expert || pricingLoading) {
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
    <div className="space-y-6">
      {/* Header with session pricing info */}
      <Card className="border-ifind-teal/20 bg-ifind-offwhite">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-ifind-charcoal">
            <span>Book Session with {expertName}</span>
              <div className="text-right text-sm space-y-1">
                <div className="text-ifind-charcoal/70">Session Rates ({userCurrency})</div>
                <div className="font-medium text-ifind-charcoal">
                  30min: {formatPrice(userCurrency === 'INR' ? (pricing?.session_30_inr || 450) : (pricing?.session_30_eur || 25))} • 
                  60min: {formatPrice(userCurrency === 'INR' ? (pricing?.session_60_inr || 800) : (pricing?.session_60_eur || 40))}
                </div>
              </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Date Selection */}
        <Card className="border-ifind-teal/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-ifind-charcoal">
              <CalendarIcon className="h-5 w-5" />
              <span>Select Date</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
              className="rounded-md border w-full"
            />
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card className="border-ifind-teal/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-ifind-charcoal">
              <Clock className="h-5 w-5" />
              <span>Available 30-Min Slots</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate && (
              <>
                {loadingSlots ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ifind-aqua"></div>
                  </div>
                 ) : availabilityError ? (
                   <div className="text-center py-8 text-red-500">
                     Failed to load expert availability. Please try again.
                   </div>
                 ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlots.includes(slot.id);
                      const isBooked = slot.is_booked;
                      
                      return (
                        <Button
                          key={slot.id}
                          variant={isSelected ? "default" : isBooked ? "secondary" : "outline"}
                          size="sm"
                          className={`h-auto py-3 px-2 text-xs ${
                            isBooked ? 'opacity-50 cursor-not-allowed' : ''
                          } ${
                            isSelected 
                              ? 'bg-ifind-aqua text-white hover:bg-ifind-aqua/90' 
                              : 'border-ifind-teal/30 text-ifind-charcoal hover:bg-ifind-teal/10'
                          }`}
                          onClick={() => !isBooked && toggleSlotSelection(slot.id)}
                          disabled={isBooked}
                        >
                          <div className="text-center w-full">
                            <div className="font-medium">
                              {formatTime(slot.start_time)}
                            </div>
                            {isBooked && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Booked
                              </div>
                            )}
                            {isSelected && (
                              <Check className="h-3 w-3 mx-auto mt-1" />
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-ifind-charcoal/70">
                    No available time slots for this date.
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Selected Slots Summary & Booking */}
      {selectedSlots.length > 0 && (
        <Card className="border-ifind-teal/50 bg-ifind-teal/5">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-semibold text-ifind-charcoal">Selected Sessions</h5>
                <Badge variant="secondary" className="bg-ifind-teal/20 text-ifind-charcoal">
                  {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} selected
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {selectedSlots.map(slotId => {
                  const slot = availableSlots.find(s => s.id === slotId);
                  return slot ? (
                    <div key={slotId} className="text-sm flex items-center space-x-2 bg-white p-2 rounded border border-ifind-teal/20">
                      <Check className="h-3 w-3 text-ifind-teal flex-shrink-0" />
                      <span className="truncate text-ifind-charcoal">{formatTime(slot.start_time)} - {formatTime(slot.end_time)}</span>
                    </div>
                  ) : null;
                })}
              </div>
              
               <div className="border-t border-ifind-teal/20 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-ifind-charcoal/70">
                  <span>Session breakdown:</span>
                  <span>{getSessionBreakdown()}</span>
                </div>
                 <div className="flex justify-between items-center font-semibold text-lg text-ifind-charcoal">
                   <span>Total Cost:</span>
                   <span className="text-2xl font-bold text-ifind-teal">{formatPrice(calculateTotalCost())}</span>
                 </div>
              </div>
              
               <Button
                onClick={handleBookAppointments}
                disabled={loading}
                size="lg"
                className="w-full bg-ifind-aqua hover:bg-ifind-aqua/90 text-white"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Booking...</span>
                  </div>
                ) : (
                   <div className="flex items-center justify-between w-full">
                     <span>Book {selectedSlots.length} Session{selectedSlots.length > 1 ? 's' : ''}</span>
                     <span className="font-bold">{formatPrice(calculateTotalCost())}</span>
                   </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedStreamlinedBooking;