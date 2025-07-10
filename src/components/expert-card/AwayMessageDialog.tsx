import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send } from 'lucide-react';
import { useAwayMessaging } from '@/hooks/useAwayMessaging';

interface AwayMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  expertId: string;
  expertName: string;
}

const AwayMessageDialog: React.FC<AwayMessageDialogProps> = ({
  isOpen,
  onClose,
  expertId,
  expertName
}) => {
  const [message, setMessage] = useState('');
  const { sendAwayMessage, loading } = useAwayMessaging();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const success = await sendAwayMessage(expertId, message.trim());
    if (success) {
      setMessage('');
      onClose();
    }
  };

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <MessageCircle className="h-6 w-6 text-yellow-600" />
          </div>
          <DialogTitle>Expert is Away</DialogTitle>
          <DialogDescription>
            {expertName} is currently away. You can leave a message and they will be 
            notified when they return.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Your Message
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Send a message to ${expertName}...`}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {message.length}/500 characters
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={loading || !message.trim()}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AwayMessageDialog;