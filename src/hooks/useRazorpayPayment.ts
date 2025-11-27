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
  amount: number; // Amount in currency units (e.g., 500 for ₹500 INR, 10 for €10 EUR)
  currency: 'INR' | 'EUR'; // Currency code - defaults to 'INR' if not specified
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
    onSuccess: (paymentId: string, orderId: string, newBalance?: number) => void,
    onFailure: (error: any) => void,
    onPaymentReceived?: () => void // Callback called immediately when payment is received (before verification)
  ): Promise<void> => {
    try {
      setIsLoading(true);

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Validate amount
      if (!paymentDetails.amount || paymentDetails.amount <= 0) {
        throw new Error('Invalid payment amount');
      }

      // Use the user's currency directly in Razorpay (Razorpay supports multiple currencies)
      // This will make Razorpay show EUR in the modal if user selected EUR
      let razorpayCurrency = paymentDetails.currency || 'INR';
      let razorpayAmount = paymentDetails.amount;
      
      // If currency is not supported by Razorpay, convert to INR
      // Razorpay supports: INR, EUR, USD, GBP, and many others
      // Check Razorpay dashboard for full list of supported currencies
      const supportedCurrencies = ['INR', 'EUR', 'USD', 'GBP', 'AED', 'SGD', 'AUD', 'CAD', 'JPY'];
      if (!supportedCurrencies.includes(razorpayCurrency)) {
        // Convert to INR if currency not supported
        const { convertEURToINR } = await import('@/utils/currencyConversion');
        razorpayAmount = convertEURToINR(paymentDetails.amount);
        razorpayCurrency = 'INR';
      }

      // Initialize Razorpay
      const res = await initializeRazorpay();
      if (!res) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order on backend
      // Pass amount in user's currency (EUR, USD, etc.) - Razorpay supports multiple currencies
      // Backend will convert to smallest unit (cents for EUR, paise for INR)
      // Also pass original amount and currency (same as razorpay amount/currency for supported currencies)
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'create-razorpay-order',
        {
          body: {
            amount: razorpayAmount, // Amount in user's currency (e.g., 25 EUR or 4500 INR)
            currency: razorpayCurrency, // User's currency (EUR, USD, INR, etc.) - Razorpay will show this
            original_amount: paymentDetails.amount, // Original amount (same as razorpayAmount for supported currencies)
            original_currency: paymentDetails.currency, // Original currency (e.g., 'EUR')
            description: paymentDetails.description,
            expertId: paymentDetails.expertId,
            serviceId: paymentDetails.serviceId,
            callSessionId: paymentDetails.callSessionId,
            itemType: (!paymentDetails.expertId || paymentDetails.expertId === '') && 
                      (!paymentDetails.serviceId || paymentDetails.serviceId === '') && 
                      (!paymentDetails.callSessionId || paymentDetails.callSessionId === '') 
              ? 'wallet' 
              : 'consultation', // Determine if this is a wallet top-up
          },
        }
      );

      if (orderError) {
        console.error('❌ Order creation error:', orderError);
        throw orderError;
      }

      if (!orderData?.id) {
        console.error('❌ Order creation failed - missing order ID:', orderData);
        throw new Error('Failed to create payment order');
      }

      // Validate order data before proceeding
      if (!orderData.razorpayKeyId) {
        console.error('❌ Missing Razorpay key ID in order response:', orderData);
        throw new Error('Payment gateway configuration error');
      }

      if (!orderData.amount || orderData.amount <= 0) {
        console.error('❌ Invalid amount in order response:', orderData);
        throw new Error('Invalid payment amount');
      }

      console.log('✅ Order received from backend:', {
        orderId: orderData.id,
        amount: orderData.amount,
        amountInRupees: orderData.amount / 100,
        currency: orderData.currency,
        keyId: orderData.razorpayKeyId,
        isTestMode: orderData.isTestMode,
      });

      // Show test mode indicator if in test mode
      if (orderData.isTestMode) {
        console.log('🧪 TEST MODE: Using Razorpay test keys - No real money will be charged');
        toast.info('🧪 Test Mode: Using test payment gateway', {
          description: 'No real money will be charged. Use test card: 4111 1111 1111 1111',
          duration: 5000,
        });
      }

      // Close any open dialogs before opening Razorpay modal to prevent overlap
      const closeAllDialogs = () => {
        // Find all Radix UI dialog roots with open state
        const openDialogs = document.querySelectorAll('[data-radix-dialog-root][data-state="open"]');
        openDialogs.forEach((dialogRoot) => {
          // Find the close button within this dialog
          const closeButton = dialogRoot.querySelector('[data-radix-dialog-close]');
          if (closeButton) {
            (closeButton as HTMLElement).click();
          }
        });
        
        // Also find dialogs by overlay and trigger escape
        const dialogOverlays = document.querySelectorAll('[data-radix-dialog-overlay][data-state="open"]');
        dialogOverlays.forEach((overlay) => {
          // Create and dispatch escape key event
          const escapeEvent = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            bubbles: true,
            cancelable: true,
          });
          overlay.dispatchEvent(escapeEvent);
          
          // Also try clicking the overlay to close (Radix UI behavior)
          (overlay as HTMLElement).click();
        });
        
        // Fallback: Find any elements with data-state="open" that look like dialogs
        const anyOpenDialogs = document.querySelectorAll('[data-state="open"]');
        anyOpenDialogs.forEach((element) => {
          // Check if it's a dialog-related element
          if (element.hasAttribute('data-radix-dialog-content') || 
              element.hasAttribute('data-radix-dialog-overlay') ||
              element.closest('[data-radix-dialog-root]')) {
            const closeBtn = element.querySelector('[data-radix-dialog-close], button[aria-label*="Close"]');
            if (closeBtn) {
              (closeBtn as HTMLElement).click();
            }
          }
        });
      };

      // Close dialogs before opening Razorpay
      console.log('🔒 Closing all dialogs before opening Razorpay...');
      closeAllDialogs();
      
      // Minimal delay - just enough for dialog close event to propagate
      // Use requestAnimationFrame for instant visual update, then open Razorpay
      await new Promise(resolve => {
        requestAnimationFrame(() => {
          // Double-check: Force close any remaining dialogs
          const remainingDialogs = document.querySelectorAll('[data-radix-dialog-overlay][data-state="open"], [data-radix-alert-dialog-overlay][data-state="open"]');
          if (remainingDialogs.length > 0) {
            console.log(`⚠️ Found ${remainingDialogs.length} remaining dialogs, force closing...`);
            remainingDialogs.forEach((dialog) => {
              const closeBtn = dialog.querySelector('[data-radix-dialog-close], [data-radix-alert-dialog-close]');
              if (closeBtn) {
                (closeBtn as HTMLElement).click();
              }
              // Also try clicking the overlay itself
              (dialog as HTMLElement).click();
            });
          }
          resolve(undefined);
        });
      });
      
      console.log('✅ Opening Razorpay immediately...');

      // Show currency conversion notice if user currency is not INR
      if (paymentDetails.currency === 'EUR') {
        const { convertEURToINR } = await import('@/utils/currencyConversion');
        const convertedAmount = convertEURToINR(paymentDetails.amount);
        toast.info(
          `Payment in ${paymentDetails.currency}: ${paymentDetails.amount} ${paymentDetails.currency} = ₹${convertedAmount} INR`,
          {
            description: 'Razorpay will show the amount in INR. Your wallet will be credited with the EUR amount you selected.',
            duration: 6000,
          }
        );
      }



      // Customize description - Razorpay will show the currency from the order
      // If order is in EUR, Razorpay modal will show EUR
      // If order is in INR, Razorpay modal will show INR
      let displayDescription = paymentDetails.description;
      if (paymentDetails.currency === 'EUR') {
        // If using EUR, description can be simpler since Razorpay will show EUR
        displayDescription = `Add €${paymentDetails.amount} EUR Credits to Wallet`;
      }

      const options = {
        key: orderData.razorpayKeyId, // Use key from backend only
        amount: orderData.amount, // Amount in smallest unit (cents for EUR, paise for INR)
        currency: orderData.currency || 'INR', // Use currency from order (EUR, USD, INR, etc.) - Razorpay will show this currency
        name: 'iFindLife',
        description: displayDescription, // Description visible in Razorpay modal
        order_id: orderData.id, // Must match the order created on backend
        // Add notes with original currency information - these are visible in Razorpay
        notes: paymentDetails.currency === 'EUR' ? {
          original_amount: paymentDetails.amount.toString(),
          original_currency: paymentDetails.currency,
          user_message: `Adding €${paymentDetails.amount} EUR to wallet`,
          display_currency: `€${paymentDetails.amount} EUR`, // Make EUR visible in Razorpay notes
          payment_note: `You are adding €${paymentDetails.amount} EUR credits. Payment will be processed in INR.`
        } : {},
        prefill: {
          email: user.email || '',
          name: user.user_metadata?.name || user.email || '',
        },
        theme: {
          color: '#3B82F6',
        },
        // Enable all payment methods - Razorpay will show all enabled methods
        // NOTE: The payment methods shown depend on your Razorpay Dashboard settings
        // To enable UPI, Wallets, Net Banking: Go to Razorpay Dashboard > Settings > Payment Methods
        // If only Cards show, check your Razorpay account configuration
        method: {
          upi: true,           // UPI (Google Pay, PhonePe, Paytm, etc.) - Requires Razorpay Dashboard activation
          card: true,          // Credit/Debit Cards (Visa, Mastercard, RuPay, etc.) - Usually enabled by default
          netbanking: true,    // Net Banking (All major banks) - Requires Razorpay Dashboard activation
          wallet: true,        // Wallets (Paytm, PhonePe, Freecharge, etc.) - Requires Razorpay Dashboard activation
          emi: false,          // EMI (disabled)
          paylater: false,     // Pay Later (disabled)
        },
        // NOTE: "Invalid VPA" error is Razorpay's built-in validation for UPI IDs
        // Valid UPI format: username@bankname (e.g., "yourname@paytm", "yourname@ybl", "yourname@okaxis")
        // This validation happens inside Razorpay's modal UI and cannot be controlled from our code
        // Users must enter a valid UPI ID format to proceed with UPI payment

        handler: async (response: any) => {
          try {
            console.log('🔍 Razorpay payment response:', {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              has_signature: !!response.razorpay_signature,
              signature_length: response.razorpay_signature?.length,
              callSessionId: paymentDetails.callSessionId,
            });

            // Validate response data before sending
            if (!response.razorpay_order_id) {
              throw new Error('Missing razorpay_order_id in payment response');
            }
            if (!response.razorpay_payment_id) {
              throw new Error('Missing razorpay_payment_id in payment response');
            }
            if (!response.razorpay_signature) {
              throw new Error('Missing razorpay_signature in payment response');
            }

            // Call onPaymentReceived immediately when payment is received (before verification)
            // This allows UI to show loader immediately
            if (onPaymentReceived) {
              onPaymentReceived();
            }

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
            ).catch(async (err) => {
              // If invoke fails, try to extract error from response
              console.error('Function invoke error:', err);
              if (err.response) {
                try {
                  const errorBody = await err.response.json();
                  console.error('Error response body:', errorBody);
                  return { data: null, error: { message: errorBody.error || errorBody.details || err.message } };
                } catch (e) {
                  console.error('Failed to parse error response:', e);
                }
              }
              return { data: null, error: err };
            });

            if (verifyError) {
              console.error('❌ Payment verification error (full object):', verifyError);
              console.error('Error details:', {
                message: verifyError.message,
                error: verifyError.error,
                context: verifyError.context,
                status: verifyError.status,
                statusText: verifyError.statusText,
                name: verifyError.name
              });
              
              // Try to extract error message from response
              let errorMessage = 'Payment verification failed';
              
              // Try to read from Response object if context is a Response
              if (verifyError.context && typeof verifyError.context.json === 'function') {
                try {
                  // Clone the response to read it (body can only be read once)
                  const clonedResponse = verifyError.context.clone();
                  const errorBody = await clonedResponse.json();
                  console.log('Error response body:', errorBody);
                  errorMessage = errorBody?.error || errorBody?.details || errorMessage;
                } catch (e) {
                  console.error('Failed to read error response body:', e);
                  // Try text() instead
                  try {
                    const clonedResponse = verifyError.context.clone();
                    const errorText = await clonedResponse.text();
                    console.log('Error response text:', errorText);
                    const parsed = JSON.parse(errorText);
                    errorMessage = parsed?.error || parsed?.details || errorMessage;
                  } catch (e2) {
                    console.error('Failed to parse error text:', e2);
                  }
                }
              } else if (verifyError.message && verifyError.message !== 'Edge Function returned a non-2xx status code') {
                errorMessage = verifyError.message;
              } else if (verifyError.error) {
                errorMessage = typeof verifyError.error === 'string' 
                  ? verifyError.error 
                  : verifyError.error?.message || verifyError.error?.error || errorMessage;
              }
              
              // If we still don't have a good error message, provide helpful guidance
              if (errorMessage === 'Payment verification failed' || errorMessage.includes('non-2xx')) {
                errorMessage = 'Payment verification failed. Most likely causes: 1) Invalid payment signature (check RAZORPAY_KEY_SECRET in Supabase secrets), 2) Missing required fields, 3) Order not found in database. Check function logs for details.';
              }
              
              console.error('Final error message:', errorMessage);
              throw new Error(errorMessage);
            }

            if (verifyData?.success) {
              console.log('✅ Payment verified successfully:', verifyData);
              // Pass newBalance from database response if available
              const newBalance = verifyData?.newBalance;
              onSuccess(response.razorpay_payment_id, response.razorpay_order_id, newBalance);
              toast.success('Payment successful!');
            } else {
              console.error('❌ Payment verification failed - no success flag:', verifyData);
              throw new Error(verifyData?.error || 'Payment verification failed');
            }
          } catch (error: any) {
            console.error('❌ Payment verification error:', error);
            const errorMessage = error?.message || error?.error || 'Payment verification failed';
            onFailure(error);
            toast.error(errorMessage);
          }
        },
        modal: {
          ondismiss: () => {
            onFailure(new Error('Payment cancelled by user'));
            toast.info('Payment cancelled');
          },
        },
      };

      // Open Razorpay modal with error handling
      try {
        const razorpay = new window.Razorpay(options);
        
        // Add additional error handlers
        razorpay.on('payment.failed', (response: any) => {
          console.error('❌ Razorpay payment failed:', {
            error: response.error,
            fullResponse: response,
            orderId: orderData.id,
            amount: orderData.amount,
          });
          
          // Extract error message with better handling for different error types
          let errorMessage = 'Payment failed. Please try again.';
          let errorDetails = '';
          
          if (response.error) {
            // Handle SERVER_ERROR specifically
            if (response.error.code === 'SERVER_ERROR') {
              errorMessage = response.error.description || 
                'We are facing some trouble completing your request at the moment. Please try again shortly.';
              errorDetails = 'This is a temporary server issue. Please wait a moment and try again.';
            } else if (response.error.code === 'BAD_REQUEST_ERROR' || response.error.code === 'BAD_REQUEST') {
              // Handle 400 Bad Request errors
              if (response.error.reason === 'incorrect_card_details') {
                // Specific handling for incorrect card details
                errorMessage = response.error.description || 
                  'You\'ve entered incorrect card details. Try again or retry the payment with another card or method.';
                errorDetails = 'Please check: Card number, CVV, expiry date, and cardholder name. Use test card: 4111 1111 1111 1111 for testing.';
              } else {
                // Other bad request errors
                errorMessage = response.error.description || 
                  'Invalid payment details. Please check your card/UPI information and try again.';
                errorDetails = 'Common causes: Invalid card number, expired card, incorrect CVV, or invalid UPI ID.';
              }
            } else {
              // For other errors, use description or reason
              errorMessage = response.error.description || 
                             response.error.reason || 
                             response.error.code ||
                             errorMessage;
              errorDetails = response.error.metadata?.step || '';
            }
          }
          
          console.error('❌ Payment Error Details:', {
            code: response.error?.code,
            description: response.error?.description,
            reason: response.error?.reason,
            step: response.error?.step,
            source: response.error?.source,
            metadata: response.error?.metadata,
            orderId: response.error?.metadata?.order_id,
            paymentId: response.error?.metadata?.payment_id,
          });
          
          onFailure(new Error(errorMessage));
          
          // Show error toast with helpful description
          toast.error(errorMessage, {
            duration: response.error?.code === 'SERVER_ERROR' ? 8000 : 
                     response.error?.reason === 'incorrect_card_details' ? 7000 : 5000,
            description: errorDetails || 
              (response.error?.code === 'SERVER_ERROR' 
                ? 'This is a temporary issue. Please wait a moment and try again.'
                : undefined),
          });
        });

        razorpay.open();
      } catch (razorpayError: any) {
        console.error('Error opening Razorpay modal:', razorpayError);
        throw new Error(razorpayError.message || 'Failed to open payment gateway');
      }

    } catch (error: any) {
      console.error('Payment processing error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to process payment';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error?.description) {
        errorMessage = error.error.description;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      onFailure(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    processPayment,
    isLoading,
  };
};