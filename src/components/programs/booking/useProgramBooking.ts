
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

  const submitBooking = useCallback(async (programId: string) => {
    if (!bookingData.selectedDate || !bookingData.selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for your session.",
        variant: "destructive"
      });
      return false;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement actual booking API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Booking Confirmed",
        description: `Your session is booked for ${bookingData.selectedDate} at ${bookingData.selectedTime}`,
      });
      
      closeBookingDialog();
      return true;
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Failed to book your session. Please try again.",
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
    handleBookingComplete
  };
};
