
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useProgramBooking = () => {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const { toast } = useToast();

  const openBookingDialog = useCallback(() => {
    setIsBookingDialogOpen(true);
  }, []);

  const closeBookingDialog = useCallback(() => {
    setIsBookingDialogOpen(false);
  }, []);

  const handleBookingComplete = useCallback(() => {
    toast({
      title: "Success",
      description: "Your session has been successfully booked!",
    });
  }, [toast]);

  return {
    isBookingDialogOpen,
    openBookingDialog,
    closeBookingDialog,
    handleBookingComplete
  };
};
