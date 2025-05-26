
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
      const newWishlistState = !isWishlisted;
      setIsWishlisted(newWishlistState);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: newWishlistState ? "Added to Wishlist" : "Removed from Wishlist",
        description: newWishlistState 
          ? "Program added to your wishlist successfully" 
          : "Program removed from your wishlist",
      });
      
      console.log(`Program ${programData?.id} ${newWishlistState ? 'added to' : 'removed from'} wishlist`);
    } catch (error) {
      // Revert the state change on error
      setIsWishlisted(!isWishlisted);
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
        title: "Enrollment Started",
        description: "Processing your enrollment request...",
      });
      
      // Simulate enrollment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Enrollment Successful!",
        description: `You have been enrolled in ${programData.title}. Check your dashboard for details.`,
      });
      
      console.log('Successfully enrolled in program:', programData.id);
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description: "Failed to complete enrollment. Please try again.",
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
