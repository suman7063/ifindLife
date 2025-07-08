import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Phone, Loader2 } from 'lucide-react';
import { useCallPricing } from '@/hooks/call/useCallPricing';
import CallDurationSelector from '@/components/call/duration/CallDurationSelector';
import PaymentMethodSelector from '@/components/call/duration/PaymentMethodSelector';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useRazorpayPayment } from '@/hooks/call/useRazorpayPayment';
import { toast } from 'sonner';

interface Expert {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
}

interface AgoraCallTypeSelectorProps {
  callType?: 'voice' | 'video';
  onCallTypeChange?: (type: 'voice' | 'video') => void;
  expert: Expert;
  expertPrice?: number;
  onStartCall?: (selectedDuration: number) => Promise<void>;
  onSelectCallType?: (type: 'audio' | 'video') => Promise<void>;
}

const AgoraCallTypeSelector: React.FC<AgoraCallTypeSelectorProps> = ({ 
  callType = 'video', 
  onCallTypeChange,
  expert,
  expertPrice,
  onStartCall,
  onSelectCallType
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [selectedCallType, setSelectedCallType] = useState<'voice' | 'video'>(callType);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'wallet' | 'gateway' | null>(null);
  
  const { pricingOptions, userCurrency, isLoading, formatPrice } = useCallPricing();
  const { userProfile } = useSimpleAuth();
  const { processPayment, isLoading: isPaymentLoading } = useRazorpayPayment();

  const walletBalance = userProfile?.wallet_balance || 0;

  const handleSelectCallType = (type: 'voice' | 'video') => {
    setSelectedCallType(type);
    if (onCallTypeChange) {
      onCallTypeChange(type);
    }
    if (onSelectCallType) {
      onSelectCallType(type === 'voice' ? 'audio' : 'video');
    }
  };

  const handleSelectDuration = (duration: number, price: number) => {
    setSelectedDuration(duration);
    setSelectedPrice(price);
  };

  const handleSelectPaymentMethod = (method: 'wallet' | 'gateway') => {
    setSelectedPaymentMethod(method);
  };

  const handleStartCall = async () => {
    if (!selectedDuration || !selectedPaymentMethod) return;

    if (selectedPaymentMethod === 'gateway') {
      // Process payment via Razorpay
      await processPayment(
        selectedPrice,
        userCurrency,
        `${selectedCallType} call with ${expert.name} - ${selectedDuration} minutes`,
        async (paymentId: string, orderId: string) => {
          console.log('Payment successful:', { paymentId, orderId });
          // Start the call after successful payment
          if (onStartCall) {
            await onStartCall(selectedDuration);
          }
        },
        (error: any) => {
          console.error('Payment failed:', error);
          toast.error('Payment failed. Please try again.');
        }
      );
      return;
    }

    // Wallet payment - start call directly
    if (onStartCall) {
      await onStartCall(selectedDuration);
    }
  };

  const canStartCall = selectedDuration && selectedPaymentMethod && 
    (selectedPaymentMethod === 'gateway' || walletBalance >= selectedPrice);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading pricing...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Call Type Selection */}
      <Card className="border-0 shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Choose Call Type</CardTitle>
          <CardDescription>
            Select how you'd like to connect with {expert.name}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className={`border-2 hover:border-primary/50 transition-all cursor-pointer ${
                selectedCallType === 'video' ? 'border-primary' : ''
              }`}
              onClick={() => handleSelectCallType('video')}
            >
              <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <Video className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium text-lg">Video Call</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  See and hear the expert with both video and audio enabled
                </p>
              </CardContent>
            </Card>
            
            <Card 
              className={`border-2 hover:border-primary/50 transition-all cursor-pointer ${
                selectedCallType === 'voice' ? 'border-primary' : ''
              }`}
              onClick={() => handleSelectCallType('voice')}
            >
              <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <Phone className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-medium text-lg">Audio Call</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Connect with audio only for a more focused conversation
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Duration Selection */}
      <CallDurationSelector
        pricingOptions={pricingOptions}
        selectedDuration={selectedDuration}
        onSelectDuration={handleSelectDuration}
        formatPrice={formatPrice}
        userCurrency={userCurrency}
      />

      {/* Payment Method Selection */}
      {selectedDuration && (
        <PaymentMethodSelector
          selectedMethod={selectedPaymentMethod}
          onSelectMethod={handleSelectPaymentMethod}
          walletBalance={walletBalance}
          callCost={selectedPrice}
          formatPrice={formatPrice}
        />
      )}

      {/* Start Call Button */}
      {selectedDuration && selectedPaymentMethod && (
        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleStartCall} 
            className="w-full max-w-md"
            disabled={!canStartCall || isPaymentLoading}
          >
            {isPaymentLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing Payment...</span>
              </div>
            ) : (
              <>
                Start {selectedCallType === 'video' ? 'Video' : 'Audio'} Call
                {selectedPrice > 0 && ` - ${formatPrice(selectedPrice)}`}
              </>
            )}
          </Button>
        </div>
      )}

    </div>
  );
};

export default AgoraCallTypeSelector;