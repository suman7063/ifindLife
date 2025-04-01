
import React, { useState } from 'react';
import { Program } from '@/types/programs';
import { UserProfile } from '@/types/supabase';
import { 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader 
} from '@/components/ui/dialog';
import ProgramSummary from './enrollment/ProgramSummary';
import PaymentMethodSelector from './enrollment/PaymentMethodSelector';
import EnrollmentButton from './enrollment/EnrollmentButton';
import { useEnrollmentHandler } from './enrollment/useEnrollmentHandler';

interface EnrollmentDialogProps {
  program: Program;
  currentUser: UserProfile;
}

const EnrollmentDialog: React.FC<EnrollmentDialogProps> = ({ 
  program, 
  currentUser 
}) => {
  const [enrollmentMethod, setEnrollmentMethod] = useState<'wallet' | 'gateway'>('wallet');
  const { isProcessing, hasEnoughBalance, handleEnroll } = useEnrollmentHandler(program, currentUser);
  
  const processEnrollment = () => {
    handleEnroll(enrollmentMethod);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Enroll in Program</DialogTitle>
        <DialogDescription>
          Complete your enrollment for <span className="font-semibold">{program.title}</span>
        </DialogDescription>
      </DialogHeader>
      
      <div className="py-4 space-y-4">
        <ProgramSummary program={program} />
        
        <PaymentMethodSelector 
          currentUser={currentUser}
          enrollmentMethod={enrollmentMethod}
          hasEnoughBalance={hasEnoughBalance}
          setEnrollmentMethod={setEnrollmentMethod}
        />
      </div>
      
      <DialogFooter>
        <EnrollmentButton 
          price={program.price}
          isProcessing={isProcessing}
          disabled={enrollmentMethod === 'wallet' && !hasEnoughBalance}
          onClick={processEnrollment}
        />
      </DialogFooter>
    </>
  );
};

export default EnrollmentDialog;
