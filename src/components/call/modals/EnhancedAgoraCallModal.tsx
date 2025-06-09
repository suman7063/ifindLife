
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth/AuthContext';
import AgoraCallModalHeader from './AgoraCallModalHeader';
import { CallModalProvider } from './context/CallModalProvider';
import { CallModalContent } from './content/CallModalContent';

interface EnhancedAgoraCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
}

const EnhancedAgoraCallModal: React.FC<EnhancedAgoraCallModalProps> = ({
  isOpen,
  onClose,
  expert,
}) => {
  const { userProfile } = useAuth();

  return (
    <CallModalProvider expert={expert} isOpen={isOpen}>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
          <div className="p-4">
            <AgoraCallModalHeader
              callStatus="choosing" // This will be managed by context now
              expertName={expert.name}
              currency={userProfile?.currency || '$'}
              expertPrice={expert.price}
            />
            
            <div className="my-4">
              <CallModalContent expert={expert} onClose={onClose} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </CallModalProvider>
  );
};

export default EnhancedAgoraCallModal;
