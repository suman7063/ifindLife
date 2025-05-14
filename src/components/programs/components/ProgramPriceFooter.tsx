
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProgramPriceFooterProps {
  price: number;
  onEnroll: () => void;
}

const ProgramPriceFooter: React.FC<ProgramPriceFooterProps> = ({ price, onEnroll }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-lg font-bold">${price}</span>
        <span className="text-xs text-gray-500">One-time payment</span>
      </div>
      <Button onClick={onEnroll} className="px-8">
        Enroll Now
      </Button>
    </div>
  );
};

export default ProgramPriceFooter;
