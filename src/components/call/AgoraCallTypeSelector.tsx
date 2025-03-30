
import React from 'react';
import { Button } from '@/components/ui/button';
import { Video, PhoneCall, DollarSign } from 'lucide-react';
import { useUserAuth } from '@/hooks/useUserAuth';

interface AgoraCallTypeSelectorProps {
  expert: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
  onSelectCallType: (callType: 'audio' | 'video') => void;
}

const AgoraCallTypeSelector: React.FC<AgoraCallTypeSelectorProps> = ({ expert, onSelectCallType }) => {
  const { currentUser } = useUserAuth();
  
  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="flex justify-center w-full space-x-4">
        <Button 
          onClick={() => onSelectCallType('audio')} 
          variant="outline" 
          className="flex flex-col items-center justify-center h-32 w-32 rounded-xl border-2 hover:border-ifind-aqua hover:bg-ifind-aqua/5"
        >
          <PhoneCall className="h-12 w-12 mb-2 text-ifind-aqua" />
          <span>Audio Call</span>
        </Button>
        <Button 
          onClick={() => onSelectCallType('video')} 
          variant="outline" 
          className="flex flex-col items-center justify-center h-32 w-32 rounded-xl border-2 hover:border-ifind-aqua hover:bg-ifind-aqua/5"
        >
          <Video className="h-12 w-12 mb-2 text-ifind-aqua" />
          <span>Video Call</span>
        </Button>
      </div>
      
      <div className="w-full max-w-lg text-center space-y-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="font-medium mb-2 flex items-center justify-center">
            <DollarSign className="h-4 w-4 mr-1 text-ifind-aqua" />
            Call Information
          </h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>First 15 minutes are free for your initial consultation</li>
            <li>After 15 minutes, you will be charged at {currentUser?.currency || 'USD'} {expert.price}/minute</li>
            <li>You can extend your call as needed</li>
            <li>A minimum balance of {currentUser?.currency || 'USD'} {(expert.price * 15).toFixed(2)} is required to start a call</li>
          </ul>
        </div>
        
        <p className="text-sm text-gray-500">
          By starting a call, you agree to our terms of service and call billing policies.
        </p>
      </div>
    </div>
  );
};

export default AgoraCallTypeSelector;
