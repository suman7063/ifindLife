/**
 * Expert In Call Modal
 * Full-screen modal for expert during active call
 */

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AgoraCallInterface from '@/components/expert-dashboard/call/AgoraCallInterface';

interface ExpertInCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callRequest: {
    id: string;
    user_id: string;
    call_type: 'audio' | 'video';
    channel_name: string;
    agora_token: string | null;
    agora_uid: number | null;
    user_metadata: {
      name?: string;
      avatar?: string;
    };
    call_session_id?: string | null;
  } | null;
  onCallEnd: () => void;
}

const ExpertInCallModal: React.FC<ExpertInCallModalProps> = ({
  isOpen,
  onClose,
  callRequest,
  onCallEnd
}) => {
  if (!callRequest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onCallEnd();
        onClose();
      }
    }}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] max-h-[95vh] p-0 overflow-hidden [&>button]:hidden">
        <div className="h-full flex flex-col overflow-hidden">
          <AgoraCallInterface
            callRequest={callRequest}
            onCallEnd={() => {
              onCallEnd();
              onClose();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertInCallModal;

