
import { useState, useEffect } from 'react';

export type ChatStatus = 'choosing' | 'connecting' | 'connected' | 'ended' | 'error';
export type ChatType = 'text' | 'video';

export const useChatModalState = (isOpen: boolean, resetTimerFn: () => void, endCallFn: () => void) => {
  const [chatStatus, setChatStatus] = useState<ChatStatus>('choosing');
  const [chatType, setChatType] = useState<ChatType>('text');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setChatStatus('choosing');
        setChatType('text');
        setErrorMessage(null);
        setShowChat(false);
        resetTimerFn();
        endCallFn();
      }, 300);
    }
  }, [isOpen, resetTimerFn, endCallFn]);

  const handleToggleChatPanel = () => {
    setShowChat(!showChat);
  };

  const handleRetry = () => {
    setChatStatus('choosing');
    setErrorMessage(null);
  };

  return {
    chatStatus,
    setChatStatus,
    chatType,
    setChatType,
    errorMessage,
    setErrorMessage,
    showChat,
    setShowChat,
    handleToggleChatPanel,
    handleRetry
  };
};
