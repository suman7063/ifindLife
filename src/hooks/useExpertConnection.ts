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
  isChatModalOpen: boolean;
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
    isChatModalOpen: false,
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
      isChatModalOpen: false,
      expertConnectOptions: {}
    });
  };

  const handleExpertCardClick = (expert: ExpertCardData) => {
    console.log('Expert card clicked:', expert);
    console.log('Expert ID:', expert.id);
    console.log('Expert auth_id:', expert.auth_id);
    
    const expertId = expert.auth_id || expert.id;
    console.log('Using expertId for navigation:', expertId);
    
    if (!expertId) {
      console.error('No valid expert ID found:', expert);
      toast.error('Unable to navigate to expert page - missing ID');
      return;
    }
    
    const targetUrl = `/experts/${expertId}`;
    console.log('Navigating to:', targetUrl);
    
    // Redirect to dedicated expert page instead of opening modal
    navigate(targetUrl);
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
      
      // Skip payment and directly start the call for now
      console.log('Starting call directly (payment bypassed)...');
      updateState({
        selectedExpert: expert,
        isCallModalOpen: true
      });
      toast.success(`Starting ${type} call with ${expert.name}...`);
      
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

  const handleChat = (expert: ExpertCardData) => {
    if (!isAuthenticated) {
      toast.error('Please log in to start a chat');
      return;
    }

    console.log(`Opening chat with ${expert.name}`);
    updateState({
      selectedExpert: expert,
      isChatModalOpen: true
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

  const closeChatModal = () => {
    updateState({
      isChatModalOpen: false,
      selectedExpert: null
    });
  };

  return {
    state,
    currentSession,
    handleExpertCardClick,
    handleConnectNow,
    handleBookNow,
    handleChat,
    handleShowConnectOptions,
    handleModalConnectNow,
    handleModalBookNow,
    closeExpertModal,
    closeBookingModal,
    closeCallModal,
    closeChatModal,
    resetState
  };
}