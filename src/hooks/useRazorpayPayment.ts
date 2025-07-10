import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentDetails {
  amount: number;
  currency: 'INR' | 'USD';
  description: string;
  expertId?: string;
  serviceId?: string;
  callSessionId?: string;
}

export const useRazorpayPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSimpleAuth();

  const initializeRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const processPayment = async (
    paymentDetails: PaymentDetails,
    onSuccess: (paymentId: string, orderId: string) => void,
    onFailure: (error: any) => void
  ): Promise<void> => {
    try {
      setIsLoading(true);

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Initialize Razorpay
      const res = await initializeRazorpay();
      if (!res) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order on backend
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'create-razorpay-order',
        {
          body: {
            amount: paymentDetails.amount,
            currency: paymentDetails.currency,
            description: paymentDetails.description,
            expertId: paymentDetails.expertId,
            serviceId: paymentDetails.serviceId,
            callSessionId: paymentDetails.callSessionId,
          },
        }
      );

      if (orderError) {
        throw orderError;
      }

      if (!orderData?.id) {
        throw new Error('Failed to create payment order');
      }

      // Configure Razorpay options
      const options = {
        key: orderData.razorpayKeyId, // Use key from backend only
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Expert Consultation',
        description: paymentDetails.description,
        order_id: orderData.id,
        prefill: {
          email: user.email || '',
          name: user.user_metadata?.name || user.email || '',
        },
        theme: {
          color: '#3B82F6',
        },
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              'verify-razorpay-payment',
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  callSessionId: paymentDetails.callSessionId,
                },
              }
            );

            if (verifyError) {
              throw verifyError;
            }

            if (verifyData?.success) {
              onSuccess(response.razorpay_payment_id, response.razorpay_order_id);
              toast.success('Payment successful!');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onFailure(error);
            toast.error('Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            onFailure(new Error('Payment cancelled by user'));
            toast.info('Payment cancelled');
          },
        },
      };

      // Open Razorpay modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment processing error:', error);
      onFailure(error);
      toast.error('Failed to process payment');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    processPayment,
    isLoading,
  };
};