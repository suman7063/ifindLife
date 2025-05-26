
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUserAuth } from '@/contexts/auth/hooks/useUserAuth';
import { ProgramDetail } from '@/types/programDetail';

export const useProgramModalActions = (programData: ProgramDetail | null) => {
  const { currentUser, isAuthenticated } = useUserAuth();
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add programs to your wishlist.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsWishlisted(!isWishlisted);
      toast({
        title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
        description: isWishlisted 
          ? "Program removed from your wishlist" 
          : "Program added to your wishlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEnrollNow = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to enroll in programs.",
        variant: "destructive"
      });
      return;
    }

    if (!programData) return;

    setIsEnrolling(true);
    try {
      toast({
        title: "Enrollment Initiated",
        description: "Redirecting to payment...",
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Enrolling in program:', programData.id);
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description: "Failed to start enrollment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  return {
    isWishlisted,
    isEnrolling,
    handleWishlistToggle,
    handleEnrollNow,
    isAuthenticated,
    currentUser
  };
};
