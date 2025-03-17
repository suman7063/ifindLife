
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Twitter, Send } from 'lucide-react';

interface ShareButtonsProps {
  onEmailShare: () => void;
  onWhatsAppShare: () => void;
  onTwitterShare: () => void;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ 
  onEmailShare, 
  onWhatsAppShare, 
  onTwitterShare 
}) => {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-3 text-gray-600">Share via</h4>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onEmailShare} variant="outline" size="sm" className="flex items-center">
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
        <Button onClick={onWhatsAppShare} variant="outline" size="sm" className="flex items-center">
          <Send className="mr-2 h-4 w-4" />
          WhatsApp
        </Button>
        <Button onClick={onTwitterShare} variant="outline" size="sm" className="flex items-center">
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </Button>
      </div>
    </div>
  );
};

export default ShareButtons;
