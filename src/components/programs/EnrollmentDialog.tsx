
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Program } from '@/types/programs';
import { UserProfile } from '@/types/supabase/user';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface EnrollmentDialogProps {
  program: Program;
  currentUser: UserProfile;
  onClose?: () => void;
}

const EnrollmentDialog: React.FC<EnrollmentDialogProps> = ({
  program,
  currentUser,
  onClose
}) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  
  const handleEnroll = async () => {
    setIsEnrolling(true);
    
    try {
      // This is a placeholder for actual enrollment logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Successfully enrolled in ${program.title}`);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error enrolling in program:', error);
      toast.error('Failed to enroll in the program');
    } finally {
      setIsEnrolling(false);
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enroll in {program.title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex justify-between text-sm">
            <span>Program Fee:</span>
            <span className="font-medium">${program.price}</span>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">
              Your wallet balance: <span className="font-medium">${currentUser.wallet_balance || 0}</span>
            </p>
            
            {(currentUser.wallet_balance || 0) < program.price && (
              <p className="text-red-500 text-sm mt-2">
                Insufficient balance. Please recharge your wallet.
              </p>
            )}
          </div>
          
          <p className="text-sm text-gray-600">
            By enrolling, you agree to the terms and conditions for this program.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isEnrolling}>
            Cancel
          </Button>
          <Button 
            onClick={handleEnroll} 
            disabled={isEnrolling || (currentUser.wallet_balance || 0) < program.price}
          >
            {isEnrolling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enrolling...
              </>
            ) : (
              'Confirm Enrollment'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentDialog;
