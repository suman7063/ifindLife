
import { useState } from 'react';
import { Program } from '@/types/programs';
import { UserProfile } from '@/types/supabase/user';
import { useRazorpayIntegration } from '@/hooks/useRazorpayIntegration';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { checkAndCompleteReferral } from '@/utils/referralCompletion';

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
          currency: currentUser.currency === 'EUR' ? 'EUR' : 'INR',
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
            await checkAndCompleteReferral(currentUser.id);
            
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


  const handleEnroll = async () => {
    await handleRazorpayPayment();
  };

  return {
    isProcessing,
    handleEnroll
  };
}
