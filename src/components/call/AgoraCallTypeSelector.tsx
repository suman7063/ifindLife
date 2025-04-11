import React from 'react';
import { Button } from '@/components/ui/button';
import { Video, Phone } from 'lucide-react';

interface AgoraCallTypeSelectorProps {
  selectedType: 'audio' | 'video';
  onSelect: (type: 'audio' | 'video') => void;
}

export const AgoraCallTypeSelector: React.FC<AgoraCallTypeSelectorProps> = ({ 
  selectedType, 
  onSelect 
}) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <h3 className="text-base font-medium text-center">Call Type</h3>
      
      <div className="flex gap-4">
        <Button
          onClick={() => onSelect('video')}
          variant={selectedType === 'video' ? 'default' : 'outline'}
          className={`flex-1 flex items-center justify-center gap-2 h-16 ${
            selectedType === 'video' ? 'bg-ifind-aqua hover:bg-ifind-teal' : ''
          }`}
        >
          <Video className="h-5 w-5" />
          <span>Video Call</span>
        </Button>
        
        <Button
          onClick={() => onSelect('audio')}
          variant={selectedType === 'audio' ? 'default' : 'outline'}
          className={`flex-1 flex items-center justify-center gap-2 h-16 ${
            selectedType === 'audio' ? 'bg-ifind-aqua hover:bg-ifind-teal' : ''
          }`}
        >
          <Phone className="h-5 w-5" />
          <span>Audio Call</span>
        </Button>
      </div>
    </div>
  );
};

export default AgoraCallTypeSelector;
