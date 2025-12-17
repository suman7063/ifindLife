import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Clock, Check, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useExpertPricing } from '@/hooks/useExpertPricing';
import { useExpertAvailability } from '@/hooks/useExpertAvailability';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';
import { useWallet } from '@/hooks/useWallet';
import PaymentMethodSelector from './PaymentMethodSelector';
import { format } from 'date-fns';

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{
    appointmentIds: string[];
    totalCost: number;
    slotsCount: number;
  } | null>(null);
  const [userBookedSlots, setUserBookedSlots] = useState<Set<string>>(new Set());
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateSlotInfo, setDuplicateSlotInfo] = useState<{ startTime: string; endTime: string; date: string } | null>(null);

  // Use the expert pricing hook
  const { 
    pricing, 
    userCurrency, 
    loading: pricingLoading, 
    formatPrice, 
    getSlotPrice 
  } = useExpertPricing(expertId);

  // Wallet integration
  const { balance: walletBalance, deductCredits, checkBalance, loading: walletLoading } = useWallet();
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'gateway'>('gateway');
  
  // Ensure walletBalance is always a number
  const safeWalletBalance = typeof walletBalance === 'number' && !isNaN(walletBalance) ? walletBalance : 0;
  
  console.log('🔧 EnhancedStreamlinedBooking: Hook results - pricing:', pricing, 'pricingLoading:', pricingLoading, 'userCurrency:', userCurrency);

  // Use the expert availability hook
  const {
    getAvailableSlots,
    loading: availabilityLoading,
    error: availabilityError,
    hasAvailability,
    availabilities
  } = useExpertAvailability(expertId);
  
  // Get expert's timezone from availability data
  const expertTimezone = availabilities?.[0]?.timezone || 'UTC';
  

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

      // Check which slots are already booked (by anyone)
      const { data: bookedSlots, error } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('expert_id', expert.auth_id)
        .eq('appointment_date', dateStr)
        .in('status', ['scheduled', 'completed']);

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

      // Check which slots are already booked by the current user
      if (user?.id) {
        const { data: userBookings, error: userBookingError } = await supabase
          .from('appointments')
          .select('start_time, end_time')
          .eq('user_id', user.id)
          .eq('expert_id', expert.auth_id)
          .eq('appointment_date', dateStr)
          .in('status', ['scheduled', 'completed']);

        if (userBookingError) {
          console.error('Error fetching user bookings:', userBookingError);
        } else if (userBookings) {
          // Create a set of user's booked slot times for quick lookup
          const userBookedSet = new Set<string>();
          userBookings.forEach(booking => {
            userBookedSet.add(`${booking.start_time}-${booking.end_time}`);
          });
          setUserBookedSlots(userBookedSet);
        } else {
          setUserBookedSlots(new Set());
        }
      }

      // Filter out past time slots - only show future slots
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      
      const futureSlots = timeSlots.filter(slot => {
        // If selected date is today, check if slot time is in the future
        if (selectedDateOnly.getTime() === today.getTime()) {
          const [hours, minutes] = slot.start_time.split(':').map(Number);
          const slotDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
          return slotDateTime > now;
        }
        // If selected date is in the future, show all slots
        return true;
      });

      console.log('BookingTab: Final time slots (filtered for future):', futureSlots);
      setAvailableSlots(futureSlots);
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
    // Find the slot being clicked
    const slot = availableSlots.find(s => s.id === slotId);
    if (!slot) {
      console.log('❌ Slot not found:', slotId);
      return;
    }

    // Quick check: Use cached userBookedSlots first for immediate feedback
    const slotKey = `${slot.start_time}-${slot.end_time}`;
    if (userBookedSlots.has(slotKey)) {
      // Show popup dialog
      const formatDateLocal = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      setDuplicateSlotInfo({
        startTime: formatTime(slot.start_time),
        endTime: formatTime(slot.end_time),
        date: selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : ''
      });
      setShowDuplicateWarning(true);
      return;
    }

    // Check if slot is already booked by someone else
    if (slot.is_booked) {
      toast.warning('This slot is no longer available', {
        description: 'This time slot has been booked by another user. Please select a different slot.',
        duration: 4000,
      });
      return;
    }

    // Allow selection/deselection immediately
    setSelectedSlots(prev => 
      prev.includes(slotId) 
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );

    // Do async verification in background (non-blocking)
    if (selectedDate && user?.id && expert?.auth_id) {
      const formatDateLocal = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const appointmentDate = formatDateLocal(selectedDate);
      
      // Background check - if duplicate found, remove from selection
      supabase
        .from('appointments')
        .select('id, start_time, end_time, status')
        .eq('user_id', user.id)
        .eq('expert_id', expert.auth_id)
        .eq('appointment_date', appointmentDate)
        .eq('start_time', slot.start_time)
        .eq('end_time', slot.end_time)
        .in('status', ['scheduled', 'completed'])
        .maybeSingle()
        .then(({ data: existingBooking, error: checkError }) => {
          if (checkError) {
            console.error('❌ Error checking duplicate booking:', checkError);
            return;
          }

          if (existingBooking) {
            console.log('⚠️ Duplicate booking found in background check:', existingBooking);
            // Remove from selection if duplicate found
            setSelectedSlots(prev => prev.filter(id => id !== slotId));
            
            // Show popup dialog
            const formatDateLocal = (date: Date): string => {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              return `${year}-${month}-${day}`;
            };
            
            setDuplicateSlotInfo({
              startTime: formatTime(slot.start_time),
              endTime: formatTime(slot.end_time),
              date: selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : ''
            });
            setShowDuplicateWarning(true);
            
            // Refresh slots to update UI
            fetchAvailableTimeSlots();
          }
        });
    }
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
    console.log('🔧 Payment: paymentMethod:', paymentMethod);
    console.log('🔧 Payment: walletBalance:', safeWalletBalance);
    
    if (totalCost <= 0) {
      console.log('🔧 Payment: Invalid total cost, aborting');
      toast.error('Unable to calculate session cost. Please try again.');
      return;
    }

    // Check wallet balance if using wallet
    if (paymentMethod === 'wallet') {
      if (safeWalletBalance < totalCost) {
        toast.error('Insufficient wallet balance. Please add credits or use payment gateway.');
        return;
      }
      const hasBalance = await checkBalance(totalCost);
      if (!hasBalance) {
        toast.error('Insufficient wallet balance. Please add credits or use payment gateway.');
        return;
      }
    }

    try {
      setLoading(true);
      console.log('🔧 Payment: Initiating payment process');

      let paymentId: string | null = null;
      let orderId: string | null = null;

      // Handle wallet payment
      if (paymentMethod === 'wallet') {
        console.log('🔧 Payment: Using wallet payment');
        
        // Format date in local timezone (not UTC) to avoid date shift
        const formatDateLocal = (date: Date): string => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        const appointmentDate = formatDateLocal(selectedDate);

        // Check for duplicate bookings before creating appointments
        const slotsToBook = selectedSlots.map(slotId => {
          const slot = availableSlots.find(s => s.id === slotId);
          if (!slot) return null;
          return { slot, start_time: slot.start_time, end_time: slot.end_time };
        }).filter(Boolean) as Array<{ slot: TimeSlot; start_time: string; end_time: string }>;

        // Check if user has already booked any of these slots
        const { data: existingUserBookings, error: checkError } = await supabase
          .from('appointments')
          .select('start_time, end_time')
          .eq('user_id', user.id)
          .eq('expert_id', expert.auth_id)
          .eq('appointment_date', appointmentDate)
          .in('status', ['scheduled', 'completed']);

        if (checkError) {
          console.error('Error checking existing bookings:', checkError);
          toast.error('Failed to verify slot availability');
          setLoading(false);
          return;
        }

        // Check for duplicates - user already booked this slot
        const duplicateBookings = slotsToBook.filter(slotData => {
          return existingUserBookings?.some(existing => 
            existing.start_time === slotData.start_time && existing.end_time === slotData.end_time
          );
        });

        if (duplicateBookings.length > 0) {
          toast.error(`You have already booked ${duplicateBookings.length} of the selected slot(s). Please select different slots.`);
          setLoading(false);
          // Refresh slots to show updated availability
          fetchAvailableTimeSlots();
          return;
        }

        // Check if slots are still available (not booked by someone else)
        const { data: conflictingBookings, error: conflictError } = await supabase
          .from('appointments')
          .select('start_time, end_time')
          .eq('expert_id', expert.auth_id)
          .eq('appointment_date', appointmentDate)
          .in('status', ['scheduled', 'completed']);

        if (conflictError) {
          console.error('Error checking conflicting bookings:', conflictError);
          toast.error('Failed to verify slot availability');
          setLoading(false);
          return;
        }

        const unavailableSlots = slotsToBook.filter(slotData => {
          return conflictingBookings?.some(conflicting => 
            conflicting.start_time === slotData.start_time && conflicting.end_time === slotData.end_time
          );
        });

        if (unavailableSlots.length > 0) {
          toast.error(`${unavailableSlots.length} selected slot(s) are no longer available. Please refresh and select different slots.`);
          setLoading(false);
          // Refresh slots to show updated availability
          fetchAvailableTimeSlots();
          return;
        }

        // Create appointments - all checks passed
        const appointments = slotsToBook.map(({ slot }) => ({
          user_id: user.id,
          expert_id: expert.auth_id,
          expert_name: expert.name,
          appointment_date: appointmentDate,
          start_time: slot.start_time,
          end_time: slot.end_time,
          status: 'scheduled',
          duration: 30,
          payment_status: 'pending'
        }));

        const { data: appointmentData, error: appointmentError } = await supabase
          .from('appointments')
          .insert(appointments)
          .select();

        if (appointmentError) {
          console.error('Error creating appointments:', appointmentError);
          throw appointmentError;
        }

        // Deduct credits from wallet with appointment reference
        const result = await deductCredits(
          totalCost,
          'booking',
          appointmentData?.[0]?.id || null,
          'appointment',
          `Booking ${selectedSlots.length} session(s) with ${expertName}`,
          (userCurrency || 'INR') as 'INR' | 'EUR'
        );

        if (!result.success) {
          // Rollback: delete appointments if wallet deduction fails
          if (appointmentData) {
            await supabase
              .from('appointments')
              .delete()
              .in('id', appointmentData.map(a => a.id));
          }
          toast.error(result.error || 'Failed to deduct credits from wallet');
          return;
        }

        // Update appointments with payment info
        paymentId = `wallet_${Date.now()}`;
        orderId = paymentId;

        await supabase
          .from('appointments')
          .update({
            payment_status: 'completed',
            razorpay_payment_id: paymentId,
            order_id: orderId
          })
          .in('id', appointmentData.map(a => a.id));

        console.log('🔧 Payment: Wallet deduction successful:', result);
        
        // Store booking details for confirmation modal
        const appointmentIds = appointmentData?.map(a => a.id) || [];
        setBookingDetails({
          appointmentIds,
          totalCost,
          slotsCount: selectedSlots.length
        });
        setShowConfirmation(true);
        
        toast.success(`Successfully booked ${selectedSlots.length} session(s)!`, {
          description: `Total cost: ${formatPrice(totalCost)} (Paid with wallet)`
        });
        
        onBookingComplete();
        setSelectedSlots([]);
        fetchAvailableTimeSlots();
        return;
      } else {
        // Process payment via Razorpay
        console.log('🔧 Payment: Using Razorpay payment gateway');
        
        // Format date in local timezone (not UTC) to avoid date shift
        const formatDateLocal = (date: Date): string => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        const appointmentDate = formatDateLocal(selectedDate);

        // Prepare slots to book
        const slotsToBook = selectedSlots.map(slotId => {
          const slot = availableSlots.find(s => s.id === slotId);
          if (!slot) return null;
          return { slot, start_time: slot.start_time, end_time: slot.end_time };
        }).filter(Boolean) as Array<{ slot: TimeSlot; start_time: string; end_time: string }>;

        // Check for duplicate bookings before processing payment
        const { data: existingUserBookings, error: checkError } = await supabase
          .from('appointments')
          .select('start_time, end_time')
          .eq('user_id', user.id)
          .eq('expert_id', expert.auth_id)
          .eq('appointment_date', appointmentDate)
          .in('status', ['scheduled', 'completed']);

        if (checkError) {
          console.error('Error checking existing bookings:', checkError);
          toast.error('Failed to verify slot availability');
          setLoading(false);
          return;
        }

        // Check for duplicates - user already booked this slot
        const duplicateBookings = slotsToBook.filter(slotData => {
          return existingUserBookings?.some(existing => 
            existing.start_time === slotData.start_time && existing.end_time === slotData.end_time
          );
        });

        if (duplicateBookings.length > 0) {
          toast.error(`You have already booked ${duplicateBookings.length} of the selected slot(s). Please select different slots.`);
          setLoading(false);
          fetchAvailableTimeSlots();
          return;
        }

        // Check if slots are still available (not booked by someone else)
        const { data: conflictingBookings, error: conflictError } = await supabase
          .from('appointments')
          .select('start_time, end_time')
          .eq('expert_id', expert.auth_id)
          .eq('appointment_date', appointmentDate)
          .in('status', ['scheduled', 'completed']);

        if (conflictError) {
          console.error('Error checking conflicting bookings:', conflictError);
          toast.error('Failed to verify slot availability');
          setLoading(false);
          return;
        }

        const unavailableSlots = slotsToBook.filter(slotData => {
          return conflictingBookings?.some(conflicting => 
            conflicting.start_time === slotData.start_time && conflicting.end_time === slotData.end_time
          );
        });

        if (unavailableSlots.length > 0) {
          toast.error(`${unavailableSlots.length} selected slot(s) are no longer available. Please refresh and select different slots.`);
          setLoading(false);
          fetchAvailableTimeSlots();
          return;
        }
        
        await processPayment(
          {
            amount: totalCost, // Amount in INR/EUR, edge function will convert to smallest unit
            currency: userCurrency as 'INR' | 'EUR',
            description: `Booking ${selectedSlots.length} session(s) with ${expertName}`,
            expertId: expert.auth_id
          },
          async (paymentIdReceived: string, orderIdReceived: string) => {
            paymentId = paymentIdReceived;
            orderId = orderIdReceived;
            console.log('🔧 Payment: Payment successful:', paymentId, orderId);

            // Double-check availability after payment (race condition protection)
            const { data: finalCheck, error: finalCheckError } = await supabase
              .from('appointments')
              .select('start_time, end_time')
              .eq('expert_id', expert.auth_id)
              .eq('appointment_date', appointmentDate)
              .in('status', ['scheduled', 'completed']);

            if (finalCheckError) {
              console.error('Error in final availability check:', finalCheckError);
              toast.error('Failed to verify slot availability after payment');
              setLoading(false);
              return;
            }

            const stillUnavailable = slotsToBook.filter(slotData => {
              return finalCheck?.some(conflicting => 
                conflicting.start_time === slotData.start_time && conflicting.end_time === slotData.end_time
              );
            });

            if (stillUnavailable.length > 0) {
              toast.error(`${stillUnavailable.length} slot(s) were booked by someone else during payment. Refunding...`);
              setLoading(false);
              // Note: Payment will need to be refunded - this should be handled by payment gateway
              fetchAvailableTimeSlots();
              return;
            }

            // Create appointments after successful payment
            const appointments = slotsToBook.map(({ slot }) => ({
              user_id: user.id,
              expert_id: expert.auth_id,
              expert_name: expert.name,
              appointment_date: appointmentDate,
              start_time: slot.start_time,
              end_time: slot.end_time,
              status: 'scheduled',
              duration: 30,
              payment_status: 'completed',
              razorpay_payment_id: paymentId,
              order_id: orderId
            }));

            const { data, error } = await supabase
              .from('appointments')
              .insert(appointments)
              .select();

            if (error) {
              console.error('Error creating appointments:', error);
              toast.error('Failed to create appointments after payment');
              throw error;
            }

            // Store booking details for confirmation modal
            const appointmentIds = data?.map(a => a.id) || [];
            setBookingDetails({
              appointmentIds,
              totalCost,
              slotsCount: selectedSlots.length
            });
            setShowConfirmation(true);

            toast.success(`Successfully booked ${selectedSlots.length} session(s)!`, {
              description: `Total cost: ${formatPrice(totalCost)}`
            });
            
            onBookingComplete();
            setSelectedSlots([]);
            fetchAvailableTimeSlots();
          },
          (error: any) => {
            console.error('Payment failed:', error);
            toast.error('Payment failed. Please try again.');
            setLoading(false);
          }
        );
        return; // Exit early for Razorpay flow
      }
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
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const dateToCheck = new Date(date);
                dateToCheck.setHours(0, 0, 0, 0);
                const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                maxDate.setHours(23, 59, 59, 999);
                return dateToCheck < today || dateToCheck > maxDate;
              }}
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
            {expertTimezone && expertTimezone !== 'UTC' && (
              <p className="text-xs text-muted-foreground mt-1">
                Times shown in {expertTimezone.replace('_', ' ')} timezone
              </p>
            )}
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
                      const slotKey = `${slot.start_time}-${slot.end_time}`;
                      const isUserBooked = userBookedSlots.has(slotKey);
                      
                      return (
                        <Button
                          key={slot.id}
                          variant={isSelected ? "default" : isBooked || isUserBooked ? "secondary" : "outline"}
                          size="sm"
                          className={`h-auto py-3 px-2 text-xs ${
                            isBooked || isUserBooked ? 'opacity-50 cursor-not-allowed' : ''
                          } ${
                            isSelected 
                              ? 'bg-ifind-aqua text-white hover:bg-ifind-aqua/90' 
                              : 'border-ifind-teal/30 text-ifind-charcoal hover:bg-ifind-teal/10'
                          }`}
                          onClick={() => !isBooked && !isUserBooked && toggleSlotSelection(slot.id)}
                          disabled={isBooked || isUserBooked}
                        >
                          <div className="text-center w-full">
                            <div className="font-medium">
                              {formatTime(slot.start_time)}-{formatTime(slot.end_time)}
                            </div>
                            {isUserBooked && (
                              <div className="text-xs text-orange-600 font-medium mt-1">
                                You booked
                              </div>
                            )}
                            {isBooked && !isUserBooked && (
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

              {/* Payment Method Selection */}
              <div className="border-t border-ifind-teal/20 pt-4">
                <PaymentMethodSelector
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                  walletBalance={safeWalletBalance}
                  requiredAmount={calculateTotalCost()}
                  currency={userCurrency || 'INR'}
                  loading={loading || walletLoading}
                />
              </div>
              
               <Button
                onClick={handleBookAppointments}
                disabled={loading || walletLoading || (paymentMethod === 'wallet' && safeWalletBalance < calculateTotalCost())}
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

      {/* Booking Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Booking Confirmed!</DialogTitle>
            <DialogDescription className="text-center">
              Your booking has been successfully completed
            </DialogDescription>
          </DialogHeader>
          
          {bookingDetails && selectedDate && (
            <div className="space-y-4 py-4">
              <div className="bg-muted/50 p-4 rounded-md space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Expert:</span>
                  <span className="font-medium">{expertName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sessions:</span>
                  <span className="font-medium">{bookingDetails.slotsCount} session{bookingDetails.slotsCount > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-semibold text-lg text-ifind-teal">{formatPrice(bookingDetails.totalCost)}</span>
                </div>
                {bookingDetails.appointmentIds.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Booking ID:</span>
                    <span className="font-medium text-xs">{bookingDetails.appointmentIds[0].slice(0, 8).toUpperCase()}</span>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                <div className="flex gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    A confirmation email has been sent to you. You can view your session details on your appointments page.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => {
                setShowConfirmation(false);
                setBookingDetails(null);
              }}
            >
              Close
            </Button>
            <Button 
              className="w-full bg-ifind-aqua hover:bg-ifind-aqua/90" 
              onClick={() => {
                setShowConfirmation(false);
                setBookingDetails(null);
                // Navigate to booking history page
                window.location.href = '/user-dashboard/booking-history';
              }}
            >
              View My Appointments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate Booking Warning Dialog */}
      <Dialog open={showDuplicateWarning} onOpenChange={setShowDuplicateWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Already Booked</DialogTitle>
            <DialogDescription className="text-center">
              You have already booked this time slot
            </DialogDescription>
          </DialogHeader>
          
          {duplicateSlotInfo && (
            <div className="space-y-4 py-4">
              <div className="bg-muted/50 p-4 rounded-md space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{duplicateSlotInfo.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{duplicateSlotInfo.startTime} - {duplicateSlotInfo.endTime}</span>
                </div>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-md">
                <div className="flex gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    You already have a booking for this time slot. Please select a different time slot to book another session.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              className="w-full bg-ifind-aqua hover:bg-ifind-aqua/90" 
              onClick={() => {
                setShowDuplicateWarning(false);
                setDuplicateSlotInfo(null);
              }}
            >
              OK, I Understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedStreamlinedBooking;