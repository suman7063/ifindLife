import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Eye } from 'lucide-react';
import AgoraCallDemoModal from './modals/AgoraCallDemoModal';

interface AgoraCallDemoButtonProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const AgoraCallDemoButton: React.FC<AgoraCallDemoButtonProps> = ({
  variant = 'outline',
  size = 'default',
  className = ''
}) => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsDemoOpen(true)}
      >
        <Eye className="w-4 h-4 mr-2" />
        Preview Call Interface
      </Button>

      <AgoraCallDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />
    </>
  );
};

export default AgoraCallDemoButton;