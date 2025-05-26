import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useUserAuth } from '@/hooks/user-auth/useUserAuth';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorPayCheckoutProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const RazorPayCheckout: React.FC<RazorPayCheckoutProps> = ({ 
  amount, 
  onSuccess, 
  onCancel 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useUserAuth();

  const loadRazorpayScript = () => {
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

  const handlePayment = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue with payment.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast({
          title: "Failed to load payment gateway",
          description: "Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Create order on the server
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: amount * 100 } // Amount in paise (Razorpay uses smallest currency unit)
      });

      if (orderError || !orderData?.id) {
        throw new Error(orderError?.message || 'Failed to create order');
      }

      const options = {
        key: 'rzp_test_yourkeyhere', // Replace with your Razorpay key (use test key for development)
        amount: amount * 100, // Amount in paise
        currency: currentUser.currency || 'INR',
        name: 'IFindLife',
        description: 'Wallet Recharge',
        order_id: orderData.id,
        prefill: {
          name: currentUser.name || '',
          email: currentUser.email || '',
          contact: currentUser.phone || '',
        },
        handler: async function (response: any) {
          try {
            // Verify payment on the server
            const { error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                user_id: currentUser.id,
                amount: amount
              }
            });

            if (verifyError) {
              throw new Error(verifyError.message || 'Payment verification failed');
            }
            
            toast({
              title: "Payment Successful",
              description: `₹${amount} has been added to your wallet.`,
            });
            
            onSuccess();
          } catch (error: any) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment Verification Failed",
              description: error.message || "There was an issue verifying your payment.",
              variant: "destructive",
            });
          }
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
            onCancel();
          }
        },
        theme: {
          color: '#16a3b7', // ifind-aqua color
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Razorpay error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an issue with your payment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isLoading} 
      className="w-full bg-ifind-aqua hover:bg-ifind-teal"
    >
      {isLoading ? 'Processing...' : `Pay ₹${amount}`}
    </Button>
  );
};

export default RazorPayCheckout;
