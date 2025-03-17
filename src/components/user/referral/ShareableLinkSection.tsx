
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';

interface ShareableLinkSectionProps {
  referralLink: string;
  onCopyLink: () => void;
}

const ShareableLinkSection: React.FC<ShareableLinkSectionProps> = ({ 
  referralLink, 
  onCopyLink 
}) => {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="referral-link" className="text-gray-500 text-sm">Shareable Link</Label>
        <div className="flex items-center gap-2">
          <Input id="referral-link" value={referralLink} readOnly className="text-xs sm:text-sm bg-white" />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onCopyLink}
            className="min-w-10 shrink-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareableLinkSection;
