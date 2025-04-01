
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface EnrollmentButtonProps {
  price: number;
  isProcessing: boolean;
  disabled: boolean;
  onClick: () => void;
}

const EnrollmentButton: React.FC<EnrollmentButtonProps> = ({ 
  price, 
  isProcessing, 
  disabled, 
  onClick 
}) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={isProcessing || disabled}
      className="w-full"
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        `Complete Enrollment (₹${price})`
      )}
    </Button>
  );
};

export default EnrollmentButton;
