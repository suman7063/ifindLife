
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useEnhancedCallTimer } from '@/hooks/call/useEnhancedCallTimer';
import { useCallOperations } from '@/hooks/call/useCallOperations';
import { useCallState } from '@/hooks/call/useCallState';
import { useEnhancedCallSession } from '@/hooks/call/useEnhancedCallSession';
import { useCallPricing } from '@/hooks/call/useCallPricing';

interface CallModalContextType {
  // State
  callStatus: 'choosing' | 'connecting' | 'connected' | 'ended' | 'error';
  errorMessage: string | null;
  showChat: boolean;
  currentSessionId: string | null;
  
  // Actions
  setCallStatus: (status: 'choosing' | 'connecting' | 'connected' | 'ended' | 'error') => void;
  setErrorMessage: (message: string | null) => void;
  setShowChat: (show: boolean) => void;
  setCurrentSessionId: (id: string | null) => void;
  handleRetry: () => void;
  handleToggleChatPanel: () => void;
  
  // Hooks data
  userProfile: any;
  isAuthenticated: boolean;
  authLoading: boolean;
  formatPrice: (price: number) => string;
  currentSession: any;
  endCallSession: any;
  
  callState: any;
  setCallState: any;
  initializeCall: any;
  endCall: any;
  timerData: any;
  callOperations: any;
}

const CallModalContext = createContext<CallModalContextType | null>(null);

export const useCallModal = () => {
  const context = useContext(CallModalContext);
  if (!context) {
    throw new Error('useCallModal must be used within CallModalProvider');
  }
  return context;
};

interface CallModalProviderProps {
  children: React.ReactNode;
  expert: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
  isOpen: boolean;
}

export const CallModalProvider: React.FC<CallModalProviderProps> = ({
  children,
  expert,
  isOpen
}) => {
  const { isAuthenticated, isLoading: authLoading, userProfile } = useAuth();
  const [callStatus, setCallStatus] = useState<'choosing' | 'connecting' | 'connected' | 'ended' | 'error'>('choosing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const { formatPrice } = useCallPricing();
  const { currentSession, endCallSession } = useEnhancedCallSession();
  const { callState, setCallState, initializeCall, endCall } = useCallState();
  
  const timerData = useEnhancedCallTimer(expert.price);
  const callOperations = useCallOperations(
    expert.id,
    setCallState,
    callState,
    timerData.startTimers,
    timerData.stopTimers,
    timerData.calculateFinalCost
  );

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCallStatus('choosing');
        setErrorMessage(null);
        setShowChat(false);
        setCurrentSessionId(null);
        endCall();
      }, 300);
    }
  }, [isOpen, endCall]);

  const handleRetry = () => {
    setCallStatus('choosing');
    setErrorMessage(null);
  };

  const handleToggleChatPanel = () => {
    setShowChat(!showChat);
  };

  const value: CallModalContextType = {
    // State
    callStatus,
    errorMessage,
    showChat,
    currentSessionId,
    
    // Actions
    setCallStatus,
    setErrorMessage,
    setShowChat,
    setCurrentSessionId,
    handleRetry,
    handleToggleChatPanel,
    
    // Hooks data
    userProfile,
    isAuthenticated,
    authLoading,
    formatPrice,
    currentSession,
    endCallSession,
    
    callState,
    setCallState,
    initializeCall,
    endCall,
    timerData,
    callOperations
  };

  return (
    <CallModalContext.Provider value={value}>
      {children}
    </CallModalContext.Provider>
  );
};
