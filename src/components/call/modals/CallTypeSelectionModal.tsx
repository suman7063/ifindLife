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

interface CallTypeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  expertName: string;
  expertId?: string;
  expertAuthId?: string;
  expertPrice?: number; // Fallback if expertId not provided
  onStartCall: (callType: 'audio' | 'video', duration: number) => void;
  walletBalance?: number;
  walletLoading?: boolean; // Loading state for wallet balance
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
  walletLoading = false
}) => {
  const navigate = useNavigate();
  const { symbol, code: currency } = useUserCurrency();
  const [callType, setCallType] = useState<'audio' | 'video'>('video');
  const [duration, setDuration] = useState(30); // minutes
  const [pricing, setPricing] = useState<{ [key: number]: number }>({});
  const [pricingLoading, setPricingLoading] = useState(false);

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

        // If RPC didn't work, try direct query with expertId
        if (!expertAccount && expertId) {
          const { data, error } = await supabase
            .from('expert_accounts')
            .select('category')
            .eq('id', expertId)
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
        
        const price30 = price30Raw != null ? Number(price30Raw) : 0;
        const price60 = price60Raw != null ? Number(price60Raw) : 0;

        console.log('📊 Fetched pricing from database:', {
          category: expertAccount.category,
          currency,
          price30,
          price60,
          categoryData
        });

        // Calculate pricing for durations
        // 30m and 60m use direct database values
        const calculatedPricing: { [key: number]: number } = {
          30: price30,
          60: price60
        };

        setPricing(calculatedPricing);
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
    };

    if (isOpen && (expertId || expertAuthId)) {
      fetchPricingFromDatabase();
    }
  }, [isOpen, expertId, expertAuthId, currency, expertPrice]);


  // Get estimated cost for current duration
  const estimatedCost = pricing[duration] || ((duration * expertPrice) / 60);
  const safeWalletBalance = typeof walletBalance === 'number' && !isNaN(walletBalance) ? walletBalance : 0;
  // Don't show insufficient message while loading
  const hasSufficientBalance = walletLoading ? true : safeWalletBalance >= estimatedCost;
  const balanceShortfall = Math.max(0, estimatedCost - safeWalletBalance);

  const handleStart = async () => {
    // Check wallet balance first
    if (!hasSufficientBalance) {
      toast.error('Insufficient wallet balance', {
        description: `You need ${symbol}${balanceShortfall.toFixed(2)} more. Please recharge your wallet first.`,
        action: {
          label: 'Add Credits',
          onClick: () => {
            onClose();
            navigate('/user-dashboard/wallet');
          }
        },
        duration: 5000
      });
      return;
    }

    // Check browser permissions
    try {
      if (callType === 'video') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getTracks().forEach(track => track.stop());
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      }
      
      onStartCall(callType, duration);
    } catch (error) {
      const err = error as Error & { name?: string };
      if (err.name === 'NotAllowedError') {
        alert('Please allow camera/microphone access to start the call');
      } else if (err.name === 'NotFoundError') {
        alert('No camera/microphone found. Please connect a device.');
      } else {
        alert('Unable to access camera/microphone. Please check your device settings.');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                  {symbol}{safeWalletBalance.toFixed(2)}
                </span>
              )}
            </div>
            {!walletLoading && !hasSufficientBalance && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                Insufficient balance. Need {symbol}{balanceShortfall.toFixed(2)} more. Please recharge your wallet.
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
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={walletLoading}>
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
            ) : !hasSufficientBalance ? (
              <Button 
                onClick={() => {
                  onClose();
                  navigate('/user-dashboard/wallet');
                }}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Recharge Wallet
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
  );
};

export default CallTypeSelectionModal;

