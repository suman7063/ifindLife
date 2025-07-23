import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useCallSession } from '@/hooks/useCallSession';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';
import { ExpertCardData } from '@/components/expert-card/types';

export interface ExpertConnectionState {
  selectedExpert: ExpertCardData | null;
  isExpertModalOpen: boolean;
  isBookingModalOpen: boolean;
  isCallModalOpen: boolean;
  expertConnectOptions: {[key: string]: boolean};
}

export function useExpertConnection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSimpleAuth();
  const { createCallSession, currentSession } = useCallSession();
  const { processPayment } = useRazorpayPayment();

  const [state, setState] = useState<ExpertConnectionState>({
    selectedExpert: null,
    isExpertModalOpen: false,
    isBookingModalOpen: false,
    isCallModalOpen: false,
    expertConnectOptions: {}
  });

  const updateState = (updates: Partial<ExpertConnectionState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState({
      selectedExpert: null,
      isExpertModalOpen: false,
      isBookingModalOpen: false,
      isCallModalOpen: false,
      expertConnectOptions: {}
    });
  };

  const handleExpertCardClick = (expert: ExpertCardData) => {
    // Redirect to dedicated expert page instead of opening modal
    navigate(`/experts/${expert.auth_id || expert.id}`);
  };

  const handleConnectNow = async (expert: ExpertCardData, type: 'video' | 'voice') => {
    if (!isAuthenticated) {
      toast.error('Please log in to start a call');
      return;
    }

    if (expert.status !== 'online') {
      toast.error('Expert is not available for immediate connection');
      return;
    }

    try {
      console.log(`Initiating ${type} call with ${expert.name}`);
      
      // Create call session with 30-minute default duration
      const selectedDuration = 30; // minutes
      const callCost = (expert.price || 30) * selectedDuration;
      
      const session = await createCallSession(
        expert.id,
        type,
        selectedDuration,
        callCost,
        'INR'
      );

      if (session) {
        console.log('Call session created, now processing payment...');
        
        // Process payment for the call
        await processPayment(
          {
            amount: Math.round(callCost * 100), // Convert to smallest currency unit (cents)
            currency: 'INR',
            description: `${type} call with ${expert.name} (${selectedDuration} minutes)`,
            expertId: expert.id,
            callSessionId: session.id,
          },
          (paymentId, orderId) => {
            console.log('Payment successful, starting call interface...');
            updateState({
              selectedExpert: expert,
              isCallModalOpen: true
            });
            toast.success(`Payment successful! Starting ${type} call with ${expert.name}...`);
          },
          (error) => {
            console.error('Payment failed:', error);
            toast.error('Payment failed. Please try again.');
          }
        );
      } else {
        toast.error('Failed to start call session');
      }
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Failed to start call');
    }
  };

  const handleBookNow = (expert: ExpertCardData) => {
    if (!isAuthenticated) {
      toast.error('Please log in to book a session');
      return;
    }

    console.log('🔗 Redirecting to expert booking page for:', expert.name);
    
    // Navigate to expert's booking page with booking tab active
    const expertUrl = `/experts/${expert.auth_id || expert.id}?book=true`;
    window.location.href = expertUrl;

    toast.success(`Redirecting to ${expert.name}'s booking page`, {
      description: 'Complete your appointment booking'
    });
  };

  const handleShowConnectOptions = (expertId: string, show: boolean) => {
    updateState({
      expertConnectOptions: {
        ...state.expertConnectOptions,
        [expertId]: show
      }
    });
  };

  const handleModalConnectNow = (type: 'video' | 'voice') => {
    if (state.selectedExpert) {
      updateState({ isExpertModalOpen: false });
      handleConnectNow(state.selectedExpert, type);
    }
  };

  const handleModalBookNow = () => {
    if (state.selectedExpert) {
      // Navigate to expert's booking page with booking tab active
      const expertUrl = `/experts/${state.selectedExpert.auth_id || state.selectedExpert.id}?book=true`;
      window.location.href = expertUrl;
      
      // Close the modal since we're navigating away
      updateState({
        isExpertModalOpen: false,
      });
    }
  };

  const closeExpertModal = () => {
    updateState({
      isExpertModalOpen: false,
      selectedExpert: null
    });
  };

  const closeBookingModal = () => {
    updateState({
      isBookingModalOpen: false,
      selectedExpert: null
    });
  };

  const closeCallModal = () => {
    updateState({
      isCallModalOpen: false,
      selectedExpert: null
    });
  };

  return {
    state,
    currentSession,
    handleExpertCardClick,
    handleConnectNow,
    handleBookNow,
    handleShowConnectOptions,
    handleModalConnectNow,
    handleModalBookNow,
    closeExpertModal,
    closeBookingModal,
    closeCallModal,
    resetState
  };
}