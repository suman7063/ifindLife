
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface BookingFormData {
  selectedDate: string;
  selectedTime: string;
  notes?: string;
}

export const useProgramBooking = () => {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    selectedDate: '',
    selectedTime: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const openBookingDialog = useCallback(() => {
    setIsBookingDialogOpen(true);
    // Reset booking data when opening
    setBookingData({
      selectedDate: '',
      selectedTime: '',
      notes: ''
    });
  }, []);

  const closeBookingDialog = useCallback(() => {
    setIsBookingDialogOpen(false);
    setBookingData({
      selectedDate: '',
      selectedTime: '',
      notes: ''
    });
  }, []);

  const updateBookingData = useCallback((updates: Partial<BookingFormData>) => {
    setBookingData(prev => ({ ...prev, ...updates }));
  }, []);

  const validateBookingData = (data: BookingFormData): string | null => {
    if (!data.selectedDate) {
      return "Please select a date for your session";
    }
    
    if (!data.selectedTime) {
      return "Please select a time slot for your session";
    }

    // Validate date is not in the past
    const selectedDateTime = new Date(`${data.selectedDate}T${data.selectedTime}`);
    const now = new Date();
    if (selectedDateTime <= now) {
      return "Please select a future date and time for your session";
    }

    // Validate notes length if provided
    if (data.notes && data.notes.length > 500) {
      return "Session notes must be 500 characters or less";
    }

    return null;
  };

  const submitBooking = useCallback(async (programId: string) => {
    // Comprehensive validation
    const validationError = validateBookingData(bookingData);
    if (validationError) {
      toast({
        title: "Booking Validation Failed",
        description: validationError,
        variant: "destructive"
      });
      return false;
    }

    if (!programId) {
      toast({
        title: "Error",
        description: "Program information is missing. Please try again.",
        variant: "destructive"
      });
      return false;
    }

    setIsSubmitting(true);
    
    try {
      // Show processing message
      toast({
        title: "Processing Booking",
        description: "We're confirming your session booking. Please wait...",
      });

      // Simulate booking API call with potential validation failures
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          const random = Math.random();
          if (random < 0.15) { // 15% chance of failure for demo
            reject(new Error('Time slot no longer available'));
          } else {
            resolve(true);
          }
        }, 2000);
      });
      
      const formattedDate = new Date(bookingData.selectedDate).toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const formattedTime = new Date(`2000-01-01T${bookingData.selectedTime}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      toast({
        title: "Booking Confirmed!",
        description: `Your session is successfully booked for ${formattedDate} at ${formattedTime}. You will receive a confirmation email shortly.`,
      });
      
      console.log('Booking confirmed:', {
        programId,
        date: bookingData.selectedDate,
        time: bookingData.selectedTime,
        notes: bookingData.notes
      });
      
      closeBookingDialog();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Booking Failed",
        description: `Unable to complete your booking: ${errorMessage}. Please try selecting a different time slot or contact support.`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [bookingData, toast, closeBookingDialog]);

  const handleBookingComplete = useCallback(() => {
    toast({
      title: "Success",
      description: "Your session has been successfully booked!",
    });
  }, [toast]);

  return {
    isBookingDialogOpen,
    bookingData,
    isSubmitting,
    openBookingDialog,
    closeBookingDialog,
    updateBookingData,
    submitBooking,
    handleBookingComplete,
    validateBookingData
  };
};
