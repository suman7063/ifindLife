
import React from 'react';
import EnhancedAgoraCallModal from './call/modals/EnhancedAgoraCallModal';

interface AgoraCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
}

export default function AgoraCallModal(props: AgoraCallModalProps) {
  return <EnhancedAgoraCallModal {...props} />;
}
