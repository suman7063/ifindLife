import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const EmailVerificationTest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<'user' | 'expert'>('user');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    setResult('');
    
    try {
      // Test signup with email verification
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: 'TestPassword123!',
        options: {
          emailRedirectTo: `${window.location.origin}/auth-callback?type=${userType}`,
          data: {
            user_type: userType,
            name: 'Test User'
          }
        }
      });
      
      if (error) {
        setResult(`Error: ${error.message}`);
        toast.error('Signup failed: ' + error.message);
      } else {
        setResult(`Success! Check your email for verification link.\nUser ID: ${data.user?.id}\nUser Type: ${userType}\nRedirect URL: ${window.location.origin}/auth-callback?type=${userType}`);
        toast.success('Signup successful! Check your email.');
      }
    } catch (error) {
      setResult(`Exception: ${error}`);
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const testResend = async () => {
    if (!email) {
      toast.error('Please enter an email address first');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth-callback?type=${userType}`
        }
      });
      
      if (error) {
        setResult(`Resend Error: ${error.message}`);
        toast.error('Resend failed: ' + error.message);
      } else {
        setResult(`Resend successful! Check your email.\nRedirect URL: ${window.location.origin}/auth-callback?type=${userType}`);
        toast.success('Verification email resent!');
      }
    } catch (error) {
      setResult(`Resend Exception: ${error}`);
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Email Verification Test</CardTitle>
          <p className="text-gray-600">
            Test email verification flow for production: {window.location.origin}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={testSignup} className="space-y-4">
            <div>
              <Label htmlFor="userType">User Type</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="userType"
                    value="user"
                    checked={userType === 'user'}
                    onChange={(e) => setUserType(e.target.value as 'user' | 'expert')}
                    disabled={loading}
                  />
                  User
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="userType"
                    value="expert"
                    checked={userType === 'expert'}
                    onChange={(e) => setUserType(e.target.value as 'user' | 'expert')}
                    disabled={loading}
                  />
                  Expert
                </label>
              </div>
            </div>
            <div>
              <Label htmlFor="email">Test Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter test email address"
                required
                disabled={loading}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Testing...' : 'Test Signup'}
              </Button>
              
              <Button 
                type="button"
                onClick={testResend}
                disabled={loading || !email}
                variant="outline"
                className="flex-1"
              >
                Test Resend
              </Button>
            </div>
          </form>
          
          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="text-sm whitespace-pre-wrap">{result}</pre>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">Debugging Info:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Current URL: {window.location.origin}</li>
              <li>• Redirect URL: {window.location.origin}/auth-callback?type={userType}</li>
              <li>• Supabase URL: {import.meta.env.VITE_SUPABASE_URL }</li>
              <li>• User Type: {userType}</li>
            </ul>
            <div className="mt-4 p-3 bg-yellow-50 rounded-md border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Make sure this redirect URL is whitelisted in Supabase Dashboard → URL Configuration
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationTest;
