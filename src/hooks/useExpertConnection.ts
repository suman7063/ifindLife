import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
// TODO: Re-implement call session hook
// import { useCallSession } from '@/hooks/useCallSession';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';
import { ExpertCardData } from '@/components/expert-card/types';

export interface ExpertConnectionState {
  selectedExpert: ExpertCardData | null;
  isExpertModalOpen: boolean;
  isBookingModalOpen: boolean;
  isChatModalOpen: boolean;
  isCallModalOpen: boolean;
  expertConnectOptions: {[key: string]: boolean};
}

export function useExpertConnection() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSimpleAuth();
  // TODO: Re-implement call session functionality
  // const { createCallSession, currentSession } = useCallSession();
  const createCallSession = async () => ({ id: null });
  const currentSession = null;
  const { processPayment } = useRazorpayPayment();

  const [state, setState] = useState<ExpertConnectionState>({
    selectedExpert: null,
    isExpertModalOpen: false,
    isBookingModalOpen: false,
    isChatModalOpen: false,
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
      isChatModalOpen: false,
      isCallModalOpen: false,
      expertConnectOptions: {}
    });
  };

  const handleExpertCardClick = (expert: ExpertCardData) => {
    console.log('Expert card clicked:', expert);
    console.log('Expert auth_id:', expert.auth_id);
    console.log('Expert auth_id:', expert.auth_id);
    
    const expertId = expert.auth_id;
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
    console.log('🚀 handleConnectNow called', { expert: expert.name, type, isAuthenticated });
    
    if (!isAuthenticated) {
      console.log('❌ Not authenticated');
      toast.error('Please log in to start a call');
      return;
    }

    if (!user?.id) {
      console.log('❌ No user ID');
      toast.error('Unable to get user information');
      return;
    }

    // Don't create session yet - let UserCallInterface handle it after user selects type and duration
    // Just open the modal which will show the call type selection first
    console.log('🎬 Opening call modal for user to select call type and duration...');
    updateState({
      selectedExpert: expert,
      isCallModalOpen: true
    });
  };

  const handleBookNow = (expert: ExpertCardData) => {
    console.log('📅 handleBookNow called', { expert: expert.name, isAuthenticated });
    
    if (!isAuthenticated) {
      console.log('❌ Not authenticated');
      toast.error('Please log in to book a session');
      return;
    }

    console.log('🔗 Redirecting to expert booking page for:', expert.name);
    
    // Navigate to expert's booking page with booking tab active
    const expertUrl = `/experts/${expert.auth_id}?book=true`;
    console.log('🌐 Navigating to:', expertUrl);
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
    // Open chat modal
    updateState({
      selectedExpert: expert,
      isChatModalOpen: true
    });
  };

  const closeChatModal = () => {
    updateState({
      isChatModalOpen: false,
      selectedExpert: null
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
    // Don't clear selectedExpert immediately - let UserCallInterface handle cleanup
    // This ensures the component stays mounted during call flow
    updateState({
      isCallModalOpen: false
      // Keep selectedExpert until call is fully ended
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
    closeChatModal,
    closeCallModal,
    resetState
  };
}