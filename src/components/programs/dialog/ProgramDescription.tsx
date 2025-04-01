
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { DialogDescription } from '@/components/ui/dialog';

interface ProgramDescriptionProps {
  description: string;
}

const ProgramDescription: React.FC<ProgramDescriptionProps> = ({ description }) => {
  return (
    <div className="space-y-3 mb-6">
      <DialogDescription className="text-base leading-relaxed mb-6">
        {description}
      </DialogDescription>
      
      <h4 className="font-semibold">What you'll learn:</h4>
      <ul className="space-y-2">
        <li className="flex items-start gap-2">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <span>Effective techniques for managing stress and anxiety</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <span>Practical mindfulness exercises for daily life</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <span>Building emotional resilience and self-awareness</span>
        </li>
      </ul>
    </div>
  );
};

export default ProgramDescription;
