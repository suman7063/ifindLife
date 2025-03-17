
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';

interface ReferralCodeSectionProps {
  referralCode: string;
  onCopyReferralCode: () => void;
}

const ReferralCodeSection: React.FC<ReferralCodeSectionProps> = ({ 
  referralCode, 
  onCopyReferralCode 
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <div className="flex flex-col gap-2">
        <Label htmlFor="referral-code" className="text-gray-500 text-sm">Your Referral Code</Label>
        <div className="flex items-center gap-2">
          <Input id="referral-code" value={referralCode} readOnly className="font-mono bg-white" />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onCopyReferralCode}
            className="min-w-10 shrink-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReferralCodeSection;
