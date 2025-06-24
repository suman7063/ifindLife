
import { useState } from 'react';
import { Program } from '@/types/programs';
import { UserProfile } from '@/types/database/unified';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getUserWalletBalance } from '@/utils/profileHelpers';

export function useEnrollmentHandler(program: Program, currentUser: UserProfile) {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  
  const walletBalance = getUserWalletBalance(currentUser);
  const hasEnoughBalance = walletBalance >= program.price;
  
  const handleWalletPayment = async () => {
    try {
      // Create enrollment
      const { error: enrollmentError } = await supabase
        .from('program_enrollments')
        .insert({
          program_id: program.id,
          user_id: currentUser.id,
          enrollment_date: new Date().toISOString(),
          payment_status: 'completed',
          payment_method: 'wallet',
          amount_paid: program.price
        });
        
      if (enrollmentError) throw enrollmentError;
      
      // Update wallet balance
      const { error: walletError } = await supabase
        .from('profiles')
        .update({
          wallet_balance: walletBalance - program.price
        })
        .eq('id', currentUser.id);
        
      if (walletError) throw walletError;
      
      // Create transaction record
      const { error: transactionError } = await supabase
        .from('user_transactions')
        .insert({
          user_id: currentUser.id,
          date: new Date().toISOString(),
          type: 'program_purchase',
          amount: program.price,
          currency: currentUser.currency || 'INR',
          description: `Enrolled in program: ${program.title}`
        });
        
      if (transactionError) throw transactionError;
      
      // Update program enrollments count
      const { error: programError } = await supabase
        .rpc('increment_program_enrollments', {
          program_id: program.id
        });
        
      if (programError) throw programError;
      
      toast.success("Successfully enrolled in program!");
      navigate('/user-dashboard');
    } catch (error) {
      console.error('Error enrolling in program:', error);
      toast.error("Failed to complete enrollment");
      return false;
    }
    
    return true;
  };

  const handleGatewayPayment = () => {
    // Redirect to payment gateway
    toast.info("Redirecting to payment gateway...");
    
    // Store enrollment details in session storage for after payment
    sessionStorage.setItem('pendingEnrollment', JSON.stringify({
      programId: program.id,
      programTitle: program.title,
      amount: program.price
    }));
    
    // In a real application, this would redirect to payment gateway
    window.location.href = `/payment-gateway?program=${program.id}&amount=${program.price}`;
    return true;
  };

  const handleEnroll = async (enrollmentMethod: 'wallet' | 'gateway') => {
    setIsProcessing(true);
    
    try {
      if (enrollmentMethod === 'wallet') {
        if (!hasEnoughBalance) {
          toast.error("Insufficient wallet balance");
          setIsProcessing(false);
          return;
        }
        
        const success = await handleWalletPayment();
        if (!success) {
          setIsProcessing(false);
          return;
        }
      } else {
        handleGatewayPayment();
        // Note: This code will not run due to redirect, just here for completeness
        return;
      }
    } catch (error) {
      console.error('Error enrolling in program:', error);
      toast.error("Failed to complete enrollment");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    hasEnoughBalance,
    handleEnroll
  };
}
