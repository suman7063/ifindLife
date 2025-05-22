
import React, { lazy, Suspense } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

// Use lazy loading for Agora components
const AgoraCallContent = lazy(() => import('../AgoraCallContent'));

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

const AgoraCallModal: React.FC<AgoraCallModalProps> = ({ 
  isOpen, 
  onClose, 
  expert 
}) => {
  // We only load Agora components when the modal is actually open
  if (!isOpen) {
    return null;
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <Suspense fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading call interface...</span>
          </div>
        }>
          {isOpen && (
            <AgoraCallContent 
              callState={{
                localAudioTrack: null,
                localVideoTrack: null,
                remoteUsers: [],
                client: null,
                isJoined: false,
                isMuted: false,
                isVideoEnabled: true,
                isAudioEnabled: true
              }}
              callStatus="connecting"
              showChat={false}
              duration={0}
              remainingTime={0}
              cost={0}
              formatTime={(seconds) => '00:00:00'}
              expertPrice={expert.price}
              userName="You"
              expertName={expert.name}
            />
          )}
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};

export default AgoraCallModal;
