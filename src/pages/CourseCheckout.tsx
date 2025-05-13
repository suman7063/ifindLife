import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Course } from '@/types/courses';
import { useCourses } from '@/hooks/useCourses';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, CheckCircle, CreditCard, Wallet } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CourseCheckout: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, loading: loadingCourses } = useCourses();
  const { profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'gateway'>('wallet');
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to continue");
      navigate('/user-login');
      return;
    }
    
    if (courseId && courses.length > 0) {
      const foundCourse = courses.find(c => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        toast.error("Course not found");
        navigate('/courses');
      }
    }
  }, [courseId, courses, isAuthenticated, navigate]);
  
  const hasEnoughBalance = (profile?.wallet_balance || 0) >= (course?.price || 0);
  
  const handleCheckout = async () => {
    if (!course) return;
    
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (paymentMethod === 'wallet') {
        if (!hasEnoughBalance) {
          toast.error("Insufficient wallet balance");
          setProcessing(false);
          return;
        }
        
        // In a real implementation, this would be a call to Supabase
        // to update wallet balance and create enrollment record
        toast.success("Enrollment successful!");
        navigate(`/course/${course.id}`);
      } else {
        // In a real implementation, this would redirect to a payment gateway
        toast.loading("Redirecting to payment gateway...");
        // Simulate redirection to payment gateway
        setTimeout(() => {
          // For demo purposes, simulate successful payment
          toast.success("Payment successful! You are now enrolled.");
          navigate(`/course/${course.id}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error processing enrollment:', error);
      toast.error("Failed to complete enrollment");
    } finally {
      setProcessing(false);
    }
  };
  
  if (loadingCourses || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ifind-teal"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-12 px-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">Complete Your Enrollment</h1>
        <p className="text-muted-foreground mb-8">
          You're just one step away from accessing your course
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Course Summary</h2>
              
              <div className="flex gap-4 items-start">
                <div className="w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={course?.thumbnailUrl} 
                    alt={course?.title || "Course"} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="font-medium">{course?.title}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    {course?.totalModules} modules • {course?.duration}
                  </div>
                  <div className="flex gap-2 mt-1">
                    {course?.instructorName && (
                      <span className="text-sm text-muted-foreground">
                        By {course.instructorName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value) => setPaymentMethod(value as 'wallet' | 'gateway')}
                className="space-y-4"
              >
                <div className={`border rounded-md p-4 ${paymentMethod === 'wallet' ? 'border-ifind-teal bg-muted/10' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-ifind-teal" />
                      <div>
                        <div>Pay with Wallet</div>
                        <div className="text-sm text-muted-foreground">
                          Balance: ₹{profile?.wallet_balance || 0}
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
                
                {!hasEnoughBalance && paymentMethod === 'wallet' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Insufficient Balance</AlertTitle>
                    <AlertDescription>
                      Your wallet balance is less than the course fee. Please choose another payment method or add funds to your wallet.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className={`border rounded-md p-4 ${paymentMethod === 'gateway' ? 'border-ifind-teal bg-muted/10' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="gateway" id="gateway" />
                    <Label htmlFor="gateway" className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-ifind-teal" />
                      <div>
                        <div>Pay with Card/UPI</div>
                        <div className="text-sm text-muted-foreground">
                          Secure online payment
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Course Price</span>
                  <span>₹{course?.price || 0}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>₹0</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{course?.price || 0}</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                disabled={paymentMethod === 'wallet' && !hasEnoughBalance || processing}
                onClick={handleCheckout}
              >
                {processing ? (
                  <>
                    <span className="animate-spin mr-2">◌</span>
                    Processing...
                  </>
                ) : (
                  'Complete Enrollment'
                )}
              </Button>
              
              <div className="flex items-center justify-center text-sm text-muted-foreground mt-4">
                <CheckCircle className="h-4 w-4 mr-1" />
                Secure payment
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseCheckout;
