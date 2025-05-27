
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { ReferralSettings } from '@/types/supabase';

interface RegisterTabProps {
  onRegister?: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city?: string;
    referralCode?: string;
  }) => Promise<boolean>;
  loading?: boolean;
  isRegistering?: boolean;
  registerError?: string | null;
  initialReferralCode?: string | null;
  referralSettings?: ReferralSettings | null;
  setCaptchaVerified?: () => void;
}

const RegisterTab: React.FC<RegisterTabProps> = ({
  onRegister,
  loading = false,
  isRegistering = false,
  registerError = null,
  initialReferralCode = null,
  referralSettings = null,
  setCaptchaVerified = () => {}
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [referralCode, setReferralCode] = useState(initialReferralCode || '');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !phone || !password || !country) {
      toast.error('Please fill all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    // If onRegister prop is provided, call it with the registration data
    if (onRegister) {
      try {
        const success = await onRegister({
          name,
          email,
          phone,
          password,
          country,
          city: city || undefined,
          referralCode: referralCode || undefined
        });
        
        if (success) {
          toast.success('Registration successful! Please log in.');
          // Reset form
          setName('');
          setEmail('');
          setPhone('');
          setPassword('');
          setConfirmPassword('');
          setCountry('');
          setCity('');
          setReferralCode('');
        }
      } catch (error) {
        console.error('Registration error:', error);
        toast.error('Failed to register. Please try again.');
      }
    } else {
      console.log('Registration data:', {
        name,
        email,
        phone,
        password,
        country,
        city,
        referralCode
      });
      toast.info('Registration functionality not implemented yet');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Full Name</label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          disabled={loading || isRegistering}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={loading || isRegistering}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          disabled={loading || isRegistering}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          disabled={loading || isRegistering}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          disabled={loading || isRegistering}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="country" className="text-sm font-medium">Country</label>
        <Select
          value={country}
          onValueChange={setCountry}
          disabled={loading || isRegistering}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="India">India</SelectItem>
            <SelectItem value="USA">USA</SelectItem>
            <SelectItem value="UK">UK</SelectItem>
            <SelectItem value="Canada">Canada</SelectItem>
            <SelectItem value="Australia">Australia</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="city" className="text-sm font-medium">City (Optional)</label>
        <Input
          id="city"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter your city"
          disabled={loading || isRegistering}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="referralCode" className="text-sm font-medium">Referral Code (Optional)</label>
        <Input
          id="referralCode"
          type="text"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          placeholder="Enter referral code if any"
          disabled={loading || isRegistering}
        />
      </div>
      
      {registerError && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {registerError}
        </div>
      )}
      
      <Button
        type="submit"
        className="w-full"
        disabled={loading || isRegistering}
      >
        {isRegistering ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registering...
          </>
        ) : (
          'Register'
        )}
      </Button>
      
      {referralSettings && (
        <div className="mt-4 text-sm text-center text-muted-foreground">
          <p>Refer friends and earn ₹{referralSettings.referrer_reward}!</p>
        </div>
      )}
    </form>
  );
};

export default RegisterTab;
