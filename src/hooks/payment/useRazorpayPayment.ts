import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentData {
  amount: number;
  currency: 'INR' | 'EUR';
  expertId: string;
  duration: number;
}

export const useRazorpayPayment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const initiatePayment = async (paymentData: PaymentData) => {
    setIsLoading(true);
    
    try {
      // Create Razorpay order
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: paymentData
      });

      if (error) {
        throw new Error(error.message);
      }

      const { orderId, amount, currency, keyId } = data;

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Get user data for payment form
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('users')
        .select('name, email, phone')
        .eq('id', user?.id)
        .single();

      return new Promise((resolve, reject) => {
        const options = {
          key: keyId,
          amount: amount,
          currency: currency,
          name: 'Expert Consultation',
          description: `${paymentData.duration} minute consultation`,
          order_id: orderId,
          prefill: {
            name: profile?.name || '',
            email: profile?.email || user?.email || '',
            contact: profile?.phone || ''
          },
          theme: {
            color: '#3B82F6'
          },
          handler: async (response: any) => {
            try {
              // Verify payment
              const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                }
              });

              if (verifyError) {
                throw new Error(verifyError.message);
              }

              toast.success('Payment successful! Starting your session...');
              resolve(verifyData);
            } catch (error) {
              console.error('Payment verification failed:', error);
              toast.error('Payment verification failed');
              reject(error);
            }
          },
          modal: {
            ondismiss: () => {
              toast.error('Payment cancelled');
              reject(new Error('Payment cancelled'));
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      });

    } catch (error) {
      console.error('Payment initiation failed:', error);
      toast.error('Failed to initiate payment');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initiatePayment,
    isLoading
  };
};