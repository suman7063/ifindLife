
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReferralSettings } from '@/types/supabase';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type CountryType = {
  name: string;
  code: string;
  flag: string;
};

const countries: CountryType[] = [
  { name: 'India', code: 'IN', flag: '🇮🇳' },
  { name: 'United States', code: 'US', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'Singapore', code: 'SG', flag: '🇸🇬' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪' },
];

interface RegisterFormProps {
  onRegister: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city?: string;
    referralCode?: string;
  }) => Promise<void>;
  loading: boolean;
  initialReferralCode?: string | null;
  referralSettings?: ReferralSettings | null;
  userType?: 'user' | 'expert';
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onRegister, 
  loading, 
  initialReferralCode,
  referralSettings,
  userType = 'user'
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState<string>('India');
  const [city, setCity] = useState('');
  const [referralCode, setReferralCode] = useState(initialReferralCode || '');
  
  // Validation states
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  
  // Update referral code if initialReferralCode changes
  useEffect(() => {
    if (initialReferralCode) {
      setReferralCode(initialReferralCode);
    }
  }, [initialReferralCode]);

  const validateInputs = () => {
    let isValid = true;
    
    // Name validation
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError(null);
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError(null);
    }
    
    // Phone validation - simple validation for now
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else if (phone.length < 10) {
      setPhoneError('Phone number is too short');
      isValid = false;
    } else {
      setPhoneError(null);
    }
    
    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    } else {
      setPasswordError(null);
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError(null);
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }
    
    await onRegister({
      name,
      email,
      phone,
      password,
      country,
      city,
      referralCode: referralCode || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-invalid={nameError ? 'true' : 'false'}
        />
        {nameError && <p className="text-red-500 text-xs">{nameError}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-invalid={emailError ? 'true' : 'false'}
        />
        {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="123-456-7890"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          aria-invalid={phoneError ? 'true' : 'false'}
        />
        {phoneError && <p className="text-red-500 text-xs">{phoneError}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  <span className="flex items-center">
                    <span className="mr-2">{country.flag}</span>
                    {country.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">City (Optional)</Label>
          <Input
            id="city"
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-invalid={passwordError ? 'true' : 'false'}
        />
        {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          aria-invalid={confirmPasswordError ? 'true' : 'false'}
        />
        {confirmPasswordError && <p className="text-red-500 text-xs">{confirmPasswordError}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="referralCode">Referral Code (Optional)</Label>
        <Input
          id="referralCode"
          type="text"
          placeholder="Enter referral code"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
        />
        
        {referralSettings && (
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <InfoCircledIcon className="mr-1 h-4 w-4 flex-shrink-0" />
            Get {referralSettings.referredReward} credits when you sign up with a referral
          </div>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-ifind-aqua hover:bg-ifind-teal transition-colors"
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
      
      <Alert className="bg-blue-50 text-blue-700 border-blue-200">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </AlertDescription>
      </Alert>
    </form>
  );
};

export default RegisterForm;
