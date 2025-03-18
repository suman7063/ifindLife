
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomLinkSectionProps {
  customText: string;
  onCustomTextChange: (value: string) => void;
  onGetCustomLink: () => void;
  isGettingLink: boolean;
}

const CustomLinkSection: React.FC<CustomLinkSectionProps> = ({ 
  customText, 
  onCustomTextChange, 
  onGetCustomLink, 
  isGettingLink 
}) => {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="custom-text" className="text-gray-500 text-sm">Personalize Your Link</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="custom-text" 
            placeholder="e.g. join-my-community" 
            value={customText} 
            onChange={(e) => onCustomTextChange(e.target.value)}
          />
          <Button 
            variant="outline" 
            onClick={onGetCustomLink}
            disabled={isGettingLink}
            className="whitespace-nowrap"
          >
            {isGettingLink ? 'Getting...' : 'Get Link'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomLinkSection;
