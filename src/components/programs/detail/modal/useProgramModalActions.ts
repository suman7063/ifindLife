
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

    if (!programData) {
      toast({
        title: "Error",
        description: "Program information is not available. Please try again.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newWishlistState = !isWishlisted;
      setIsWishlisted(newWishlistState);
      
      // Show immediate feedback
      toast({
        title: newWishlistState ? "Adding to Wishlist..." : "Removing from Wishlist...",
        description: "Please wait while we update your wishlist.",
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: newWishlistState ? "Added to Wishlist" : "Removed from Wishlist",
        description: newWishlistState 
          ? `"${programData.title}" has been added to your wishlist successfully` 
          : `"${programData.title}" has been removed from your wishlist`,
      });
      
      console.log(`Program ${programData?.id} ${newWishlistState ? 'added to' : 'removed from'} wishlist`);
    } catch (error) {
      // Revert the state change on error
      setIsWishlisted(!isWishlisted);
      toast({
        title: "Operation Failed",
        description: "Failed to update your wishlist. Please check your connection and try again.",
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

    if (!programData) {
      toast({
        title: "Error",
        description: "Program information is not available. Please refresh and try again.",
        variant: "destructive"
      });
      return;
    }

    // Validation checks
    if (!programData.pricing?.individual?.perSession) {
      toast({
        title: "Pricing Information Missing",
        description: "Program pricing information is not available. Please contact support.",
        variant: "destructive"
      });
      return;
    }

    setIsEnrolling(true);
    try {
      toast({
        title: "Processing Enrollment",
        description: `Enrolling you in "${programData.title}". Please wait...`,
      });
      
      // Simulate enrollment process with validation
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate potential validation failure
          const random = Math.random();
          if (random < 0.1) { // 10% chance of failure for demo
            reject(new Error('Payment validation failed'));
          } else {
            resolve(true);
          }
        }, 2500);
      });
      
      toast({
        title: "Enrollment Successful!",
        description: `You have been successfully enrolled in "${programData.title}". Check your dashboard for program access and next steps.`,
      });
      
      console.log('Successfully enrolled in program:', programData.id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Enrollment Failed",
        description: `Failed to complete enrollment: ${errorMessage}. Please try again or contact support.`,
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
