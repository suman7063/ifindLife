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
  const [isProcessing, setIsProcessing] = useState(false);
  const { processPayment } = useRazorpayIntegration();
  const navigate = useNavigate();

  const initiateProgrammePayment = async (programme: ProgrammeData) => {
    setIsProcessing(true);
    
    try {
      await processPayment(
        {
          amount: programme.price * 100, // Convert to cents/paise
          currency: programme.currency === '€' ? 'EUR' : 'INR',
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

  return {
    isProcessing,
    initiateProgrammePayment
  };
};