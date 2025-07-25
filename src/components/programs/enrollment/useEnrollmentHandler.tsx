
import { useState } from 'react';
import { Program } from '@/types/programs';
import { UserProfile } from '@/types/supabase/user';
import { useRazorpayIntegration } from '@/hooks/useRazorpayIntegration';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function useEnrollmentHandler(program: Program, currentUser: UserProfile) {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { processPayment } = useRazorpayIntegration();
  
  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    
    try {
      await processPayment(
        {
          amount: program.price * 100, // Convert to paise for Razorpay
          currency: currentUser.currency === 'USD' ? 'USD' : 'INR',
          description: `Enrollment in ${program.title}`,
          itemId: program.id.toString(),
          itemType: 'program'
        },
        async (paymentId: string, orderId: string) => {
          try {
            // Create enrollment record
            const { error: enrollmentError } = await supabase
              .from('program_enrollments')
              .insert({
                program_id: program.id,
                user_id: currentUser.id,
                enrollment_date: new Date().toISOString(),
                payment_status: 'completed',
                payment_method: 'razorpay',
                amount_paid: program.price,
                transaction_id: paymentId
              });
              
            if (enrollmentError) throw enrollmentError;
            
            // Update program enrollments count
            const { error: programError } = await supabase
              .rpc('increment_program_enrollments', {
                program_id: program.id
              });
              
            if (programError) throw programError;
            
            // Check if this enrollment completes a referral
            await checkAndCompleteReferral();
            
            toast.success("Successfully enrolled in program!");
            navigate('/user-dashboard');
          } catch (error) {
            console.error('Error completing enrollment:', error);
            toast.error("Payment successful but enrollment failed. Please contact support.");
          } finally {
            setIsProcessing(false);
          }
        },
        (error: any) => {
          console.error('Payment failed:', error);
          toast.error("Payment failed. Please try again.");
          setIsProcessing(false);
        }
      );
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error("Failed to initiate payment");
      setIsProcessing(false);
    }
  };

  const checkAndCompleteReferral = async () => {
    try {
      // Check if user has a pending referral
      const { data: referral } = await supabase
        .from('referrals')
        .select('*')
        .eq('referred_id', currentUser.id)
        .eq('status', 'pending')
        .single();

      if (referral) {
        // Complete the referral - this will trigger reward points distribution
        await supabase.rpc('handle_completed_referral', {
          p_referral_id: referral.id
        });
      }
    } catch (error) {
      console.error('Error checking referral:', error);
      // Don't fail the enrollment for referral issues
    }
  };

  const handleEnroll = async () => {
    await handleRazorpayPayment();
  };

  return {
    isProcessing,
    handleEnroll
  };
}
