
import React from 'react';
import LazyAgoraCallModal from './call/LazyAgoraCallModal';

// This is now a simple wrapper that uses lazy loading
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
  return <LazyAgoraCallModal {...props} />;
}
