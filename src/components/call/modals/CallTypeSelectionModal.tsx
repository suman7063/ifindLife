/**
 * Call Type Selection Modal
 * Allows user to select call type (video/audio) and duration
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Video, Phone, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useUserCurrency } from '@/hooks/useUserCurrency';
import { supabase } from '@/lib/supabase';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';
import { useWallet } from '@/hooks/useWallet';

interface CallTypeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  expertName: string;
  expertId?: string;
  expertAuthId?: string;
  expertPrice?: number; // Fallback if expertId not provided
  onStartCall: (callType: 'audio' | 'video', duration: number, estimatedCost: number, currency: 'INR' | 'EUR', paymentResponseReceived?: boolean) => void;
  walletBalance?: number;
  walletLoading?: boolean; // Loading state for wallet balance
  isProcessingPayment?: boolean; // Processing payment state from parent
  setIsProcessingPayment?: (value: boolean) => void; // Set processing payment state
}

const DURATIONS = [30, 60];

const CallTypeSelectionModal: React.FC<CallTypeSelectionModalProps> = ({
  isOpen,
  onClose,
  expertName,
  expertId,
  expertAuthId,
  expertPrice = 30,
  onStartCall,
  walletBalance = 0,
  walletLoading = false,
  isProcessingPayment: isProcessingPaymentProp,
  setIsProcessingPayment: setIsProcessingPaymentProp
}) => {
  const navigate = useNavigate();
  const { symbol, code: currency } = useUserCurrency();
  const { processPayment, isLoading: isPaymentLoading } = useRazorpayPayment();
  const { fetchBalance } = useWallet();
  const [callType, setCallType] = useState<'audio' | 'video'>('video');
  const [duration, setDuration] = useState(30); // minutes
  const [pricing, setPricing] = useState<{ [key: number]: number }>({});
  const [pricingLoading, setPricingLoading] = useState(false);
  const [isProcessingPaymentLocal, setIsProcessingPaymentLocal] = useState(false);
  
  // Use prop if provided, otherwise use local state
  const isProcessingPayment = isProcessingPaymentProp !== undefined ? isProcessingPaymentProp : isProcessingPaymentLocal;
  const setIsProcessingPayment = setIsProcessingPaymentProp || setIsProcessingPaymentLocal;

  // Fetch pricing from database
  useEffect(() => {
    const fetchPricingFromDatabase = async () => {
      if (!isOpen || (!expertId && !expertAuthId)) return;
      
      setPricingLoading(true);
      try {
        // First, get expert's category using RPC function to bypass RLS
        let expertAccount = null;
        
        // Try with expertAuthId first (RPC function uses auth_id)
        if (expertAuthId) {
          try {
            const { data, error } = await supabase
              .rpc('get_public_expert_profile', { p_auth_id: expertAuthId })
              .maybeSingle();
            
            if (error) {
              console.error('Error querying by RPC with expertAuthId:', error);
            } else if (data && data.category) {
              expertAccount = { category: data.category };
              console.log('✅ Found expert via RPC:', { category: data.category });
            }
          } catch (rpcError) {
            console.error('RPC call failed:', rpcError);
          }
        }

        // If RPC didn't work, try direct query with expertId (which should be auth_id)
        if (!expertAccount && expertId) {
          const { data, error } = await supabase
            .from('expert_accounts')
            .select('category')
            .eq('auth_id', expertId)
            .maybeSingle();
          
          if (error) {
            console.error('Error querying by expertId:', error);
          } else if (data) {
            expertAccount = data;
            console.log('✅ Found expert via direct query:', data);
          }
        }

        // If still not found, try with expertAuthId direct query
        if (!expertAccount && expertAuthId) {
          const { data, error } = await supabase
            .from('expert_accounts')
            .select('category')
            .eq('auth_id', expertAuthId)
            .maybeSingle();
          
          if (error) {
            console.error('Error querying by expertAuthId:', error);
          } else if (data) {
            expertAccount = data;
            console.log('✅ Found expert via auth_id query:', data);
          }
        }

        if (!expertAccount?.category) {
          console.warn('⚠️ No category found for expert:', { expertId, expertAuthId, expertAccount });
          calculateFallbackPricing();
          return;
        }

        console.log('✅ Found expert account with category:', expertAccount.category);

        // Fetch category pricing
        const { data: categoryData, error: categoryError } = await supabase
          .from('expert_categories')
          .select('base_price_30_inr, base_price_30_eur, base_price_60_inr, base_price_60_eur')
          .eq('id', expertAccount.category)
          .maybeSingle();

        if (categoryError) {
          console.error('Error fetching category pricing:', categoryError);
          calculateFallbackPricing();
          return;
        }

        if (!categoryData) {
          console.warn('⚠️ No pricing data found for category:', expertAccount.category);
          calculateFallbackPricing();
          return;
        }

        // Get prices based on currency and convert to numbers
        // Use nullish coalescing to handle 0 values correctly
        const price30Raw = currency === 'INR' 
          ? categoryData.base_price_30_inr
          : categoryData.base_price_30_eur;
        const price60Raw = currency === 'INR'
          ? categoryData.base_price_60_inr
          : categoryData.base_price_60_eur;
        
        // Convert to numbers - handle string values from database
        const price30 = price30Raw != null ? parseFloat(String(price30Raw)) : 0;
        const price60 = price60Raw != null ? parseFloat(String(price60Raw)) : 0;

        console.log('📊 Fetched pricing from database:', {
          category: expertAccount.category,
          currency,
          price30,
          price60,
          price30Raw,
          price60Raw,
          price30Type: typeof price30Raw,
          price60Type: typeof price60Raw,
          categoryData
        });

        // Set pricing from database values
        // Note: We set pricing even if values are 0, as 0 is a valid price
        // Only use fallback if values are null/undefined
        const calculatedPricing: { [key: number]: number } = {};
        
        // Set prices if they exist (including 0)
        if (price30Raw != null) {
          calculatedPricing[30] = price30;
        }
        if (price60Raw != null) {
          calculatedPricing[60] = price60;
        }

        // If we got at least one valid price from database, use it
        if (Object.keys(calculatedPricing).length > 0) {
          console.log('✅ Setting pricing from database:', calculatedPricing, {
            note: 'These are the actual session prices, not per-minute rates'
          });
          setPricing(calculatedPricing);
        } else {
          // No valid prices found, use fallback
          console.warn('⚠️ Database prices are null/undefined, using fallback');
          console.warn('⚠️ This will cause incorrect pricing - check database values!');
          calculateFallbackPricing();
        }
      } catch (error) {
        console.error('❌ Error fetching pricing from database:', error);
        console.warn('⚠️ Using fallback pricing calculation');
        calculateFallbackPricing();
      } finally {
        setPricingLoading(false);
      }
    };

    const calculateFallbackPricing = () => {
      // Fallback: calculate from expertPrice (per minute rate)
      const fallbackPricing: { [key: number]: number } = {};
      DURATIONS.forEach(dur => {
        fallbackPricing[dur] = (dur * expertPrice) / 60;
      });
      console.log('🔄 Using fallback pricing:', fallbackPricing, 'expertPrice:', expertPrice);
      setPricing(fallbackPricing);
      // Ensure pricingLoading is set to false when using fallback
      setPricingLoading(false);
    };

    if (isOpen && (expertId || expertAuthId)) {
      fetchPricingFromDatabase();
    } else if (!isOpen) {
      // Reset pricing when modal closes to avoid stale data
      setPricing({});
      setPricingLoading(false);
    }
  }, [isOpen, expertId, expertAuthId, currency, expertPrice]);


  // Get estimated cost for current duration
  // IMPORTANT: Use pricing from database if available (should be the actual session price)
  // Only use fallback if pricing[duration] is undefined or null (not if it's 0, as 0 is a valid price)
  const pricingFromDB = pricing[duration];
  const fallbackCost = (duration * expertPrice) / 60;
  
  // CRITICAL: Check if pricingFromDB exists (not undefined/null)
  // If pricingFromDB is 0, that's a valid price, so we should use it
  // Only use fallback if pricingFromDB is undefined or null
  const estimatedCost = (pricingFromDB !== undefined && pricingFromDB !== null) 
    ? pricingFromDB 
    : fallbackCost;
  
  // Log pricing for debugging
  console.log('💰 CallTypeSelectionModal - Pricing calculation:', {
    duration,
    pricing,
    expertPrice,
    estimatedCost,
    pricingFromDB,
    pricingFromDBType: typeof pricingFromDB,
    usingDatabasePrice: (pricingFromDB !== undefined && pricingFromDB !== null),
    fallbackCalculation: fallbackCost,
    currency,
    warning: (pricingFromDB === undefined || pricingFromDB === null) 
      ? '⚠️ Using fallback - database price not available!' 
      : '✅ Using database price'
  });
  
  // Additional warning if using fallback when database price should be available
  // Only show warning if pricing has finished loading (not during loading state)
  if (!pricingLoading && (pricingFromDB === undefined || pricingFromDB === null)) {
    console.warn('⚠️ WARNING: Using fallback pricing calculation!', {
      duration,
      pricing,
      expectedPrice: 'Should be from database',
      fallbackPrice: fallbackCost,
      issue: 'Database pricing not loaded or duration not in pricing object',
      pricingLoading,
      isOpen
    });
  }
  
  const safeWalletBalance = typeof walletBalance === 'number' && !isNaN(walletBalance) ? walletBalance : 0;
  // Don't show insufficient message while loading
  const hasSufficientBalance = walletLoading ? true : safeWalletBalance >= estimatedCost;
  const balanceShortfall = Math.max(0, estimatedCost - safeWalletBalance);

  const handleStart = async () => {
    // Check wallet balance first
    if (!hasSufficientBalance) {
      // Instead of showing error, directly open Razorpay payment
      console.log('💰 Insufficient balance - Opening Razorpay payment directly');
      
      // Set processing state first so button shows "Processing Payment..."
      setIsProcessingPayment(true);
      
      // Close modal immediately - no delay needed
      // Processing state will persist in parent (UserCallInterface) loader overlay
      onClose();
      
      // Use single requestAnimationFrame to ensure state update is visible
      // Then immediately proceed to open Razorpay
      requestAnimationFrame(async () => {
        try {
          // Open Razorpay payment for the shortfall amount
          // Keep processing state true until Razorpay actually opens
          await processPayment(
          {
            amount: balanceShortfall, // Amount needed
            currency: currency,
            description: `Add ${symbol}${balanceShortfall.toFixed(2)} to wallet for call`,
          },
          async (paymentId: string, orderId: string, newBalance?: number) => {
            // Payment successful - database already updated wallet balance directly
            console.log('✅ Payment successful - wallet balance updated in database:', {
              paymentId,
              orderId,
              newBalance,
              note: 'Database handled payment and wallet update automatically'
            });
            
            // Database has already updated the wallet balance, so we can proceed immediately
            // If newBalance is provided, we know the exact balance
            // Otherwise, we trust the database update and proceed (balance will be checked again in proceedWithCall)
            if (newBalance !== undefined && newBalance !== null) {
              console.log('✅ Using balance from payment response:', newBalance);
            } else {
              console.log('ℹ️ Balance not in response, but database has updated it - proceeding with call');
            }
            
            // Hide payment processing state
            setIsProcessingPayment(false);
            
            // Connecting modal is already showing (from onPaymentReceived callback)
            // Now just complete the permission check and call setup in background
            console.log('✅ Payment verified - completing call setup (connecting modal already showing)');
            
            // Permission check and call setup (connecting modal is already visible)
            try {
              if (callType === 'video') {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                stream.getTracks().forEach(track => track.stop());
              } else {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach(track => track.stop());
              }
              console.log('✅ Permissions granted - call setup complete');
            } catch (error) {
              const err = error as Error & { name?: string };
              console.error('❌ Permission error after payment:', err);
              if (err.name === 'NotAllowedError') {
                toast.error('Please allow camera/microphone access to start the call');
              } else if (err.name === 'NotFoundError') {
                toast.error('No camera/microphone found. Please connect a device.');
              } else {
                toast.error('Unable to access camera/microphone. Please check your device settings.');
              }
            }
          },
          (error: Error) => {
            console.error('❌ Payment failed:', error);
            setIsProcessingPayment(false);
            toast.error('Payment failed. Please try again.');
          },
          // onPaymentReceived callback - called immediately when payment response is received
          () => {
            console.log('📞 Razorpay payment response received - showing connecting modal immediately');
            // Show connecting modal IMMEDIATELY when payment response is received
            // This gives instant feedback before payment verification completes
            // Pass a flag to indicate payment response was received
            onStartCall(callType, duration, estimatedCost, currency, true);
            setIsProcessingPayment(false);
          }
        );
        } catch (error: unknown) {
          console.error('❌ Error processing payment:', error);
          setIsProcessingPayment(false);
          const errorMessage = error instanceof Error ? error.message : 'Failed to process payment';
          toast.error(errorMessage);
        }
      });
      return;
    }

    // If balance is sufficient, proceed directly
    await proceedWithCall();
  };

  const proceedWithCall = async () => {
    console.log('🚀 proceedWithCall called - checking permissions and starting call');

    // Check browser permissions
    try {
      if (callType === 'video') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getTracks().forEach(track => track.stop());
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      }
      
      console.log('✅ Permissions granted - calling onStartCall with:', {
        callType,
        duration,
        estimatedCost,
        currency
      });
      
      // Pass the actual session price and currency
      // onStartCall will handle closing this modal and starting the call
      console.log('📞 Calling onStartCall to start the call:', {
        callType,
        duration,
        estimatedCost,
        currency,
        modalIsOpen: isOpen
      });
      
      // IMPORTANT: Call onStartCall which will update modalState to 'connecting' in UserCallInterface
      // This ensures the connecting modal shows before we close this modal
      console.log('📞 About to call onStartCall...');
      onStartCall(callType, duration, estimatedCost, currency);
      console.log('✅ onStartCall called - UserCallInterface should handle the call now');
      
      // Wait for UserCallInterface to update modalState to 'connecting'
      // This ensures the connecting modal is ready before we close this modal
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // IMPORTANT: Don't call onClose() here - it will unmount the entire UserCallInterface
      // Instead, just close this modal by setting isOpen to false
      // The parent will keep UserCallInterface mounted because modalState is 'connecting'
      // We'll handle this by not rendering CallTypeSelectionModal when modalState !== 'selection'
      setIsProcessingPayment(false);
      
      console.log('✅ Call started - CallTypeSelectionModal will hide, ConnectingModal should be visible now');
    } catch (error) {
      const err = error as Error & { name?: string };
      setIsProcessingPayment(false);
      console.error('❌ Permission error:', err);
      if (err.name === 'NotAllowedError') {
        alert('Please allow camera/microphone access to start the call');
      } else if (err.name === 'NotFoundError') {
        alert('No camera/microphone found. Please connect a device.');
      } else {
        alert('Unable to access camera/microphone. Please check your device settings.');
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}>
        <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start Call with {expertName}</DialogTitle>
          <DialogDescription>
            Choose call type and duration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Call Type Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">Call Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCallType('video')}
                className={`relative flex flex-row items-center justify-start gap-3 p-4 rounded-xl border transition-all duration-200 ${
                  callType === 'video'
                    ? 'border-primary bg-primary text-primary-foreground shadow-lg'
                    : 'border-border bg-card hover:border-primary/30 hover:bg-accent'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  callType === 'video' ? 'bg-primary-foreground/20' : 'bg-muted'
                }`}>
                  <Video className={`h-6 w-6 transition-colors ${
                    callType === 'video' ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`} />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-semibold text-sm ${
                    callType === 'video' ? 'text-primary-foreground' : 'text-foreground'
                  }`}>
                    Video Call
                  </p>
                </div>
                {callType === 'video' && (
                  <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary-foreground" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setCallType('audio')}
                className={`relative flex flex-row items-center justify-start gap-3 p-4 rounded-xl border transition-all duration-200 ${
                  callType === 'audio'
                    ? 'border-primary bg-primary text-primary-foreground shadow-lg'
                    : 'border-border bg-card hover:border-primary/30 hover:bg-accent'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  callType === 'audio' ? 'bg-primary-foreground/20' : 'bg-muted'
                }`}>
                  <Phone className={`h-6 w-6 transition-colors ${
                    callType === 'audio' ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`} />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-semibold text-sm ${
                    callType === 'audio' ? 'text-primary-foreground' : 'text-foreground'
                  }`}>
                    Audio Call
                  </p>
                </div>
                {callType === 'audio' && (
                  <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Duration Selection */}
          <div>
            <label className="text-sm font-medium mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duration
            </label>
            {pricingLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Loading pricing...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {DURATIONS.map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDuration(dur)}
                    className={`relative flex flex-col items-center justify-center py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                      duration === dur
                        ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg scale-105'
                        : 'border-dashed border-muted-foreground/30 bg-muted/30 hover:border-primary/30 hover:bg-muted/50 hover:scale-102'
                    }`}
                  >
                    <div className={`font-bold text-2xl ${
                      duration === dur ? 'text-primary' : 'text-foreground'
                    }`}>
                      {dur}
                      <span className="text-xs text-muted-foreground ml-1">Minutes</span>
                    </div>
                    <div className={`text-sm mt-1 ${
                      duration === dur ? 'text-primary font-semibold' : 'text-muted-foreground'
                    }`}>
                      {symbol}{(pricing[dur] || ((dur * expertPrice) / 60)).toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cost Estimate */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Estimated Cost:</span>
              {pricingLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">Loading...</span>
                </div>
              ) : (
                <span className="text-lg font-semibold">{symbol}{estimatedCost.toFixed(2)}</span>
              )}
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Wallet Balance:</span>
              {walletLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <span className={hasSufficientBalance ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {symbol}{safeWalletBalance < 0 ? '0.00' : safeWalletBalance.toFixed(2)}
                  {safeWalletBalance < 0 && (
                    <span className="text-xs ml-1 text-red-500">(Negative: {symbol}{Math.abs(safeWalletBalance).toFixed(2)})</span>
                  )}
                </span>
              )}
            </div>
            {!walletLoading && safeWalletBalance < 0 && (
              <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
                ⚠️ Your wallet has a negative balance. Please add credits to resolve this before starting a call.
              </div>
            )}
            {!walletLoading && !hasSufficientBalance && safeWalletBalance >= 0 && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                Insufficient balance. Need {symbol}{balanceShortfall.toFixed(2)} more. Payment gateway will open automatically.
              </div>
            )}
            {!walletLoading && !pricingLoading && hasSufficientBalance && (
              <div className="text-xs text-muted-foreground">
                {symbol}{estimatedCost.toFixed(2)} will be deducted from your wallet before the call starts
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1" 
              disabled={walletLoading || isProcessingPayment || isPaymentLoading}
            >
              Cancel
            </Button>
            {(walletLoading || pricingLoading) ? (
              <Button 
                disabled
                className="flex-1"
              >
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </Button>
            ) : isProcessingPayment || isPaymentLoading ? (
              <Button 
                disabled
                className="flex-1"
              >
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing Payment...
              </Button>
            ) : !hasSufficientBalance ? (
              <Button 
                onClick={handleStart}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Pay & Start Call
              </Button>
            ) : (
              <Button 
                onClick={handleStart} 
                className="flex-1"
                disabled={pricingLoading}
              >
                Start Call
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    
    {/* Full-screen loader overlay that stays visible until Razorpay modal opens */}
    {/* Same loader as AddCreditsDialog - shown when processing payment */}
    {(isPaymentLoading || isProcessingPayment) && (
      <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="text-center">
            <p className="text-lg font-semibold">Opening Payment Gateway</p>
            <p className="text-sm text-muted-foreground mt-1">Please wait while we connect to Razorpay...</p>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default CallTypeSelectionModal;

