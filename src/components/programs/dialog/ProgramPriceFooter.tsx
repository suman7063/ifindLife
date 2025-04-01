
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ProgramPriceFooterProps {
  price: number;
  onEnroll: () => void;
}

const ProgramPriceFooter: React.FC<ProgramPriceFooterProps> = ({ price, onEnroll }) => {
  return (
    <DialogFooter className="flex-col sm:flex-row gap-3 items-center justify-between">
      <div className="text-2xl font-bold text-ifind-teal">₹{price}</div>
      <Button onClick={onEnroll} className="w-full sm:w-auto">
        Enroll Now
      </Button>
    </DialogFooter>
  );
};

export default ProgramPriceFooter;
