import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RazorpayPaymentData {
  amount: number;
  currency: 'INR' | 'EUR';
  description: string;
  itemId?: string; // for program_id, session_id, etc.
  itemType?: 'program' | 'session' | 'consultation';
}

export const useRazorpayIntegration = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const initializeRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const processPayment = async (
    paymentData: RazorpayPaymentData,
    onSuccess: (paymentId: string, orderId: string) => void,
    onFailure: (error: any) => void
  ) => {
    try {
      setIsProcessing(true);

      // Initialize Razorpay SDK
      const isLoaded = await initializeRazorpay();
      if (!isLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order via Supabase function
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: paymentData.amount,
          currency: paymentData.currency,
          description: paymentData.description,
          itemId: paymentData.itemId,
          itemType: paymentData.itemType
        }
      });

      if (orderError) {
        throw new Error(orderError.message);
      }

      // Get user profile for prefilled data
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      // Configure Razorpay options
      const options = {
        key: 'rzp_test_uOKfCFJW5YE7zb', // This should come from environment
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'iFind',
        description: paymentData.description,
        order_id: orderData.id,
        prefill: {
          name: profile?.name || '',
          email: user?.email || '',
          contact: profile?.phone || ''
        },
        theme: {
          color: '#10b981'
        },
        handler: async (response: any) => {
          try {
            // Verify payment via Supabase function
            const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                itemId: paymentData.itemId,
                itemType: paymentData.itemType
              }
            });

            if (verificationError) {
              throw new Error(verificationError.message);
            }

            toast.success('Payment successful!');
            onSuccess(response.razorpay_payment_id, response.razorpay_order_id);
          } catch (error: any) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed');
            onFailure(error);
          }
        },
        modal: {
          ondismiss: () => {
            onFailure(new Error('Payment cancelled by user'));
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      toast.error(error.message || 'Payment failed to initialize');
      onFailure(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processPayment,
    isProcessing
  };
};