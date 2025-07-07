import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpayPayment = () => {
  const [isLoading, setIsLoading] = useState(false);

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
    amount: number,
    currency: 'INR' | 'USD',
    description: string,
    onSuccess: (paymentId: string, orderId: string) => void,
    onFailure: (error: any) => void
  ) => {
    try {
      setIsLoading(true);

      // Initialize Razorpay
      const isRazorpayLoaded = await initializeRazorpay();
      if (!isRazorpayLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Convert amount to smallest currency unit (paise for INR, cents for USD)
      const amountInSmallestUnit = currency === 'INR' ? amount * 100 : amount * 100;

      // Create order on backend
      const { data: orderData, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: amountInSmallestUnit,
          currency: currency,
          receipt: `call_${Date.now()}`,
          notes: {
            description: description
          }
        }
      });

      if (error || !orderData) {
        throw new Error(error?.message || 'Failed to create payment order');
      }

      // Configure Razorpay options
      const options = {
        key: 'rzp_test_placeholder', // TODO: Replace with actual Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'iFindLife',
        description: description,
        order_id: orderData.id,
        handler: function (response: any) {
          console.log('Payment successful:', response);
          onSuccess(response.razorpay_payment_id, response.razorpay_order_id);
          toast.success('Payment successful!');
        },
        prefill: {
          name: 'User',
          email: 'user@example.com',
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            onFailure({ message: 'Payment cancelled by user' });
          }
        }
      };

      // Open Razorpay payment modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed');
      onFailure(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    processPayment,
    isLoading
  };
};