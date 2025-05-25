
import React, { lazy, Suspense } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

// Lazy load the actual Agora call component
const AgoraCallModalComponent = lazy(() => import('./modals/AgoraCallModal'));

interface LazyAgoraCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
}

const LazyAgoraCallModal: React.FC<LazyAgoraCallModalProps> = (props) => {
  // Only load Agora when modal is actually opened
  if (!props.isOpen) {
    return null;
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={(open) => !open && props.onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <Suspense fallback={
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
            <span>Loading call interface...</span>
          </div>
        }>
          <AgoraCallModalComponent {...props} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};

export default LazyAgoraCallModal;
