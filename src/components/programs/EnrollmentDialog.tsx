import React, { useState } from 'react';
import { Program } from '@/types/supabase/tables';
import { UserProfile } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  CheckCircle, 
  CreditCard, 
  Loader2, 
  Wallet 
} from 'lucide-react';
import { toast } from 'sonner';
import { from, supabase } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface EnrollmentDialogProps {
  program: Program;
  currentUser: UserProfile;
}

const EnrollmentDialog: React.FC<EnrollmentDialogProps> = ({ 
  program, 
  currentUser 
}) => {
  const [enrollmentMethod, setEnrollmentMethod] = useState<'wallet' | 'gateway'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  
  const hasEnoughBalance = (currentUser.walletBalance || 0) >= program.price;
  
  const handleEnroll = async () => {
    setIsProcessing(true);
    
    try {
      if (enrollmentMethod === 'wallet') {
        if (!hasEnoughBalance) {
          toast.error("Insufficient wallet balance");
          setEnrollmentMethod('gateway');
          return;
        }
        
        // Create enrollment
        const { error: enrollmentError } = await from('program_enrollments')
          .insert({
            program_id: program.id,
            user_id: currentUser.id,
            enrollment_date: new Date().toISOString(),
            payment_status: 'completed',
            payment_method: 'wallet',
            amount_paid: program.price
          });
          
        if (enrollmentError) throw enrollmentError;
        
        // Update wallet balance
        const { error: walletError } = await from('profiles')
          .update({
            wallet_balance: (currentUser.walletBalance || 0) - program.price
          })
          .eq('id', currentUser.id);
          
        if (walletError) throw walletError;
        
        // Create transaction record
        const { error: transactionError } = await from('user_transactions')
          .insert({
            user_id: currentUser.id,
            date: new Date().toISOString(),
            type: 'program_purchase',
            amount: program.price,
            currency: currentUser.currency || 'INR',
            description: `Enrolled in program: ${program.title}`
          });
          
        if (transactionError) throw transactionError;
        
        // Update program enrollments count
        const { error: programError } = await supabase
          .rpc('increment_program_enrollments', {
            program_id: program.id
          });
          
        if (programError) throw programError;
        
        toast.success("Successfully enrolled in program!");
        navigate('/user-dashboard');
      } else {
        // In a real application, redirect to payment gateway
        toast.info("Redirecting to payment gateway...");
        // Simulating gateway payment for this demo
        setTimeout(() => {
          toast.success("Payment successful! You are now enrolled.");
          navigate('/user-dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Error enrolling in program:', error);
      toast.error("Failed to complete enrollment");
    } finally {
      setIsProcessing(false);
    }
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
        <div className="flex items-center justify-between border p-4 rounded-lg">
          <div>
            <h3 className="font-medium">{program.title}</h3>
            <p className="text-sm text-muted-foreground">{program.duration} • {program.sessions} sessions</p>
          </div>
          <div className="text-lg font-semibold text-ifind-teal">₹{program.price}</div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium">Choose payment method:</h4>
          
          <div 
            className={`flex items-center justify-between border p-4 rounded-lg cursor-pointer ${
              enrollmentMethod === 'wallet' ? 'border-ifind-purple bg-ifind-purple/5' : ''
            }`}
            onClick={() => setEnrollmentMethod('wallet')}
          >
            <div className="flex items-center gap-3">
              <Wallet className="h-5 w-5 text-ifind-purple" />
              <div>
                <h3 className="font-medium">Pay with Wallet</h3>
                <p className="text-sm text-muted-foreground">Current Balance: ₹{currentUser.walletBalance || 0}</p>
              </div>
            </div>
            {enrollmentMethod === 'wallet' && (
              <CheckCircle className="h-5 w-5 text-ifind-purple" />
            )}
          </div>
          
          {!hasEnoughBalance && (
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Insufficient Balance</AlertTitle>
              <AlertDescription>
                Your wallet balance is less than the program fee. Please recharge your wallet or choose another payment method.
              </AlertDescription>
            </Alert>
          )}
          
          <div 
            className={`flex items-center justify-between border p-4 rounded-lg cursor-pointer ${
              enrollmentMethod === 'gateway' ? 'border-ifind-purple bg-ifind-purple/5' : ''
            }`}
            onClick={() => setEnrollmentMethod('gateway')}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-ifind-purple" />
              <div>
                <h3 className="font-medium">Pay with Card/UPI</h3>
                <p className="text-sm text-muted-foreground">Secure online payment</p>
              </div>
            </div>
            {enrollmentMethod === 'gateway' && (
              <CheckCircle className="h-5 w-5 text-ifind-purple" />
            )}
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          onClick={handleEnroll} 
          disabled={isProcessing || (enrollmentMethod === 'wallet' && !hasEnoughBalance)}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Complete Enrollment (₹${program.price})`
          )}
        </Button>
      </DialogFooter>
    </>
  );
};

export default EnrollmentDialog;
