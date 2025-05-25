
import React from 'react';
import LazyAgoraChatModal from './chat/LazyAgoraChatModal';

// This is now a simple wrapper that uses lazy loading
interface AgoraChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
}

export default function AgoraChatModal(props: AgoraChatModalProps) {
  return <LazyAgoraChatModal {...props} />;
}
