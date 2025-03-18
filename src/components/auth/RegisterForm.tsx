
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserAuth } from "@/hooks/useUserAuth";
import { Eye, EyeOff, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input as OTPInput } from "@/components/ui/input-otp";
import { toast } from "sonner";

interface RegisterFormProps {
  onSuccess?: () => void;
  referralCode?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, referralCode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const { 
    signUp, 
    verifyOtp, 
    resendVerificationEmail,
    isLoading,
    currentUser,
  } = useUserAuth();
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const result = await signUp(email, password, {
      name,
      phone,
      country,
      city,
      referralCode
    });
    
    if (result?.sessionId) {
      setSessionId(result.sessionId);
      setVerificationStep(true);
    }
  };
  
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || !sessionId) {
      toast.error('Please enter the verification code');
      return;
    }
    
    const success = await verifyOtp(sessionId, otp);
    
    if (success && onSuccess) {
      onSuccess();
    }
  };
  
  const handleResendVerification = async () => {
    if (!email) return;
    await resendVerificationEmail(email);
  };
  
  if (currentUser) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome, {currentUser.name}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-green-600">You are already logged in.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        {!verificationStep ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name*</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password*</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="Your country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            
            {referralCode && (
              <div className="rounded-md bg-blue-50 p-3">
                <div className="flex">
                  <div className="text-sm text-blue-700">
                    <p>You're signing up with a referral code!</p>
                    <p className="font-medium">Code: {referralCode}</p>
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-ifind-aqua hover:bg-ifind-teal"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium">Verify Your Email</h3>
              <p className="mt-1 text-sm text-gray-600">
                We've sent a verification code to {email}
              </p>
            </div>
            
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="flex justify-center">
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  maxLength={6}
                  type="number"
                  placeholder="•"
                  className="w-12 h-12 text-center text-xl"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-ifind-aqua hover:bg-ifind-teal"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
            
            <div className="text-center text-sm">
              <span className="text-gray-500">Didn't receive the code? </span>
              <button 
                onClick={handleResendVerification}
                className="text-ifind-aqua hover:text-ifind-teal"
                disabled={isLoading}
              >
                Resend
              </button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center">
          <span className="text-gray-500">Already have an account? </span>
          <a href="/login" className="text-ifind-aqua hover:text-ifind-teal">
            Log in
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
