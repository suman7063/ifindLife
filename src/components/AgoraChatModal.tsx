
import React from 'react';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Use lazy loading for the real component
const AgoraChatModalComponent = lazy(() => 
  import('./chat/modals/AgoraChatModal')
);

// This is just a wrapper that lazily loads the real component
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
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading chat component...</span>
      </div>
    }>
      <AgoraChatModalComponent {...props} />
    </Suspense>
  );
}
