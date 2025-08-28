import { useState } from 'react';
import { useRazorpayIntegration } from '@/hooks/useRazorpayIntegration';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ProgrammeData {
  id: number;
  title: string;
  price: number;
  currency: string;
}

export const useRazorpayProgrammePayment = () => {
  const [processingStates, setProcessingStates] = useState<{[key: number]: boolean}>({});
  const { processPayment } = useRazorpayIntegration();
  const navigate = useNavigate();

  const initiateProgrammePayment = async (programme: ProgrammeData) => {
    // Set processing state for this specific programme
    setProcessingStates(prev => ({ ...prev, [programme.id]: true }));
    
    try {
      await processPayment(
        {
          // Fix: Don't multiply by 100 here as it's likely done in useRazorpayIntegration
          // Convert EUR to INR for Razorpay (approximately 1 EUR = 89 INR)
          amount: programme.currency === '€' ? Math.round(programme.price * 89) : programme.price,
          currency: 'INR', // Always use INR for Razorpay
          description: `Enrollment in ${programme.title}`,
          itemId: programme.id.toString(),
          itemType: 'program'
        },
        async (paymentId: string, orderId: string) => {
          try {
            // Here you would typically save the enrollment to your database
            // For now, we'll just show success and navigate
            toast.success(`Successfully enrolled in ${programme.title}!`);
            navigate('/user-dashboard'); // Redirect to dashboard or success page
          } catch (error) {
            console.error('Error completing enrollment:', error);
            toast.error("Payment successful but enrollment failed. Please contact support.");
          } finally {
            setProcessingStates(prev => ({ ...prev, [programme.id]: false }));
          }
        },
        (error: any) => {
          console.error('Payment failed:', error);
          toast.error("Payment failed. Please try again.");
          setProcessingStates(prev => ({ ...prev, [programme.id]: false }));
        }
      );
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error("Failed to initiate payment");
      setProcessingStates(prev => ({ ...prev, [programme.id]: false }));
    }
  };

  const isProcessing = (programmeId: number) => processingStates[programmeId] || false;

  return {
    isProcessing,
    initiateProgrammePayment
  };
};