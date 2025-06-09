
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Phone, Loader2 } from 'lucide-react';
import { useCallPricing } from '@/hooks/call/useCallPricing';
import { useEnhancedCallSession } from '@/hooks/call/useEnhancedCallSession';
import { useAuth } from '@/contexts/auth/AuthContext';
import CallDurationSelector from '../duration/CallDurationSelector';
import PaymentMethodSelector from '../duration/PaymentMethodSelector';
import { toast } from 'sonner';

interface EnhancedCallTypeSelectorProps {
  expert: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
  onCallStarted: (sessionId: string, callType: 'audio' | 'video') => void;
}

export const EnhancedCallTypeSelector: React.FC<EnhancedCallTypeSelectorProps> = ({
  expert,
  onCallStarted
}) => {
  const [selectedCallType, setSelectedCallType] = useState<'audio' | 'video' | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'wallet' | 'gateway' | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const { userProfile } = useAuth();
  const { 
    pricingOptions, 
    userCurrency, 
    isLoading: pricingLoading, 
    formatPrice 
  } = useCallPricing();
  
  const { 
    createCallSession, 
    processWalletPayment,
    isCreatingSession 
  } = useEnhancedCallSession();

  const handleDurationSelect = (duration: number, price: number) => {
    setSelectedDuration(duration);
    setSelectedPrice(price);
  };

  const handleStartCall = async () => {
    if (!selectedCallType || !selectedDuration || !selectedPaymentMethod || !userProfile) {
      toast.error('Please complete all selections');
      return;
    }

    setIsStarting(true);

    try {
      // Process payment if wallet is selected
      if (selectedPaymentMethod === 'wallet') {
        const paymentSuccess = await processWalletPayment(selectedPrice, userCurrency);
        if (!paymentSuccess) {
          setIsStarting(false);
          return;
        }
      }

      // Create call session
      const session = await createCallSession(
        expert.id,
        selectedCallType,
        selectedDuration,
        userCurrency,
        selectedPrice,
        selectedPaymentMethod
      );

      if (session) {
        onCallStarted(session.id, selectedCallType);
        toast.success(`${selectedCallType} call started successfully`);
      }
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Failed to start call');
    } finally {
      setIsStarting(false);
    }
  };

  const canProceed = selectedCallType && selectedDuration && selectedPaymentMethod;

  if (pricingLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading pricing options...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Start a Call with {expert.name}</CardTitle>
          <CardDescription>
            Choose your preferred call type, duration, and payment method
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Call Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>1. Choose Call Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={selectedCallType === 'video' ? "default" : "outline"}
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => setSelectedCallType('video')}
            >
              <Video className="h-8 w-8" />
              <div className="text-center">
                <div className="font-medium">Video Call</div>
                <div className="text-sm text-muted-foreground">
                  See and hear the expert
                </div>
              </div>
            </Button>

            <Button
              variant={selectedCallType === 'audio' ? "default" : "outline"}
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => setSelectedCallType('audio')}
            >
              <Phone className="h-8 w-8" />
              <div className="text-center">
                <div className="font-medium">Audio Call</div>
                <div className="text-sm text-muted-foreground">
                  Voice-only conversation
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Duration Selection */}
      {selectedCallType && (
        <CallDurationSelector
          pricingOptions={pricingOptions}
          selectedDuration={selectedDuration}
          onSelectDuration={handleDurationSelect}
          formatPrice={formatPrice}
          userCurrency={userCurrency}
        />
      )}

      {/* Payment Method Selection */}
      {selectedDuration && (
        <PaymentMethodSelector
          selectedMethod={selectedPaymentMethod}
          onSelectMethod={setSelectedPaymentMethod}
          walletBalance={userProfile?.wallet_balance || 0}
          callCost={selectedPrice}
          formatPrice={formatPrice}
        />
      )}

      {/* Start Call Button */}
      {canProceed && (
        <Card>
          <CardContent className="p-4">
            <Button
              onClick={handleStartCall}
              disabled={isStarting || isCreatingSession}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {(isStarting || isCreatingSession) ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Starting Call...
                </>
              ) : (
                `Start ${selectedCallType} Call - ${formatPrice(selectedPrice)}`
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedCallTypeSelector;
