
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface ExpertLoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  isLoggingIn: boolean;
  loginError: string | null;
  setActiveTab: (tab: string) => void;
}

const ExpertLoginForm: React.FC<ExpertLoginFormProps> = ({
  onLogin,
  isLoggingIn,
  loginError,
  setActiveTab
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState<{ message: string; expertData: {
    auth_id: string;
    email: string;
    status: string;
    feedback_message?: string | null;
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    specialization?: string;
    experience?: string;
    bio?: string;
    category?: string;
  } } | null>(null);
  const navigate = useNavigate();
  
  console.log('ExpertLoginForm: Rendered - authentication only');

  // Fetch expert data when email is entered and account is rejected
  useEffect(() => {
    const fetchRejectedExpertData = async () => {
      if (!email || email.length < 5) {
        setRejectionFeedback(null);
        return;
      }

      try {
        const emailToCheck = email.toLowerCase().trim();
        console.log('ExpertLoginForm: Checking expert status for email:', emailToCheck);
        
        // Try to fetch expert account by email to check if it's rejected
        // RLS policy allows public read access for status checking
        const { data: expertData, error } = await supabase
          .from('expert_accounts')
          .select('auth_id, email, status, feedback_message, name, phone, address, city, state, country, specialization, experience, bio, category')
          .eq('email', emailToCheck)
          .maybeSingle();

        if (error) {
          console.error('ExpertLoginForm: Error fetching expert data:', error);
          // Don't return early, continue to check if data exists
        }

        console.log('ExpertLoginForm: Expert data fetched:', expertData);

        interface ExpertDataWithFeedback {
          auth_id: string;
          email: string;
          status: string;
          feedback_message?: string | null;
          name?: string;
          phone?: string;
          address?: string;
          city?: string;
          state?: string;
          country?: string;
          specialization?: string;
          experience?: string;
          bio?: string;
          category?: string;
        }

        if (expertData && !error) {
          const expert = expertData as unknown as ExpertDataWithFeedback;
          if (expert.status === 'rejected') {
            const feedbackMsg = expert.feedback_message || 'Your expert account has been rejected by admin. Please contact support for more information.';
            console.log('ExpertLoginForm: Rejected expert found, feedback:', feedbackMsg);
            setRejectionFeedback({
              message: feedbackMsg,
              expertData: {
                auth_id: expert.auth_id,
                email: expert.email,
                status: expert.status,
                feedback_message: expert.feedback_message,
                name: expert.name,
                phone: expert.phone,
                address: expert.address,
                city: expert.city,
                state: expert.state,
                country: expert.country,
                specialization: expert.specialization,
                experience: expert.experience,
                bio: expert.bio,
                category: expert.category,
              }
            });
          } else {
            console.log('ExpertLoginForm: Expert not rejected, status:', expert.status);
            setRejectionFeedback(null);
          }
        } else {
          console.log('ExpertLoginForm: Expert not found or error occurred');
          setRejectionFeedback(null);
        }
      } catch (error) {
        console.error('ExpertLoginForm: Error checking expert status:', error);
        setRejectionFeedback(null);
      }
    };

    // Debounce the check
    const timeoutId = setTimeout(fetchRejectedExpertData, 500);
    return () => clearTimeout(timeoutId);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setFormError('Email is required');
      return;
    }
    
    if (!password) {
      setFormError('Password is required');
      return;
    }
    
    setFormError(null);
    
    console.log('ExpertLoginForm: Submit handler called with:', { email });
    
    try {
      if (typeof onLogin !== 'function') {
        console.error('ExpertLoginForm: onLogin is not a function', typeof onLogin);
        setFormError('Authentication service unavailable');
        return;
      }
      
      const result = await onLogin(email, password);
      
      // Check if login failed due to specific reasons
      if (result === false) {
        // If we have rejection feedback, use it
        if (rejectionFeedback) {
          setFormError(null); // Clear form error, we'll show rejection feedback instead
        }
        // Error will be handled by the parent component or rejection feedback
        return;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('ExpertLoginForm: Error in submit handler:', error);
      
      // Handle specific error types
      if (errorMessage.includes('verify your email') || errorMessage.includes('Email not confirmed')) {
        setFormError('Please verify your email address before logging in. Check your inbox for the verification link.');
      } else if (errorMessage.includes('pending approval')) {
        setFormError('Your expert account is pending approval by admin. Please wait for approval before logging in.');
      } else if (errorMessage.includes('rejected') || errorMessage.includes('disapproved')) {
        // If we have rejection feedback, it will be shown separately
        if (!rejectionFeedback) {
          setFormError('Your expert account has been rejected by admin. Please contact support for more information.');
        }
      } else if (errorMessage.includes('suspended')) {
        setFormError('Your expert account has been suspended by admin. Please contact support for more information.');
      } else if (errorMessage.includes('not approved')) {
        setFormError('Your expert account is not approved by admin. Please contact support for assistance.');
      } else {
        setFormError(errorMessage || 'An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleUpdateProfile = () => {
    if (!rejectionFeedback?.expertData) return;
    
    const expertData = rejectionFeedback.expertData;
    // Create URL params with expert data
    const params = new URLSearchParams({
      update: 'true',
      name: expertData.name || '',
      email: expertData.email || '',
      phone: expertData.phone || '',
      address: expertData.address || '',
      city: expertData.city || '',
      state: expertData.state || '',
      country: expertData.country || '',
      title: expertData.specialization || '',
      experience: expertData.experience || '0',
      bio: expertData.bio || '',
      category: expertData.category || 'listening-volunteer',
    });
    
    navigate(`/expert-register?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {rejectionFeedback && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="mt-2">
            <div className="flex items-start justify-between gap-3">
              <span className="flex-1">{rejectionFeedback.message}</span>
              <Link
                to={`/expert-register?update=true&auth_id=${rejectionFeedback.expertData.auth_id}`}
                className="text-primary hover:underline text-sm font-medium whitespace-nowrap flex-shrink-0"
              >
                Update Profile
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}
      {(loginError || formError) && !rejectionFeedback && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{loginError || formError}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="expert-email">Email</Label>
          <Input
            id="expert-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFormError(null);
            }}
            required
            disabled={isLoggingIn}
            className="bg-white"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="expert-password">Password</Label>
            <Link 
              to="/forgot-password" 
              className="text-xs text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            id="expert-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFormError(null);
            }}
            required
            disabled={isLoggingIn}
            className="bg-white"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoggingIn || !email || !password}
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
      
      <div className="text-center text-sm mt-4">
        <p className="text-muted-foreground">
          Don't have an expert account?{' '}
          <button
            onClick={() => setActiveTab('register')}
            className="text-primary font-medium hover:underline cursor-pointer"
          >
            Register here
          </button>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Looking to access your user account?{' '}
          <Link to="/user-login" className="text-primary hover:underline">
            User Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ExpertLoginForm;
