
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Mail, Phone, User, Gift } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReferralSettings } from '@/types/supabase';

// List of common countries
const COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'China',
  'Brazil',
  // Add more as needed
];

interface RegisterFormProps {
  onRegister: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city: string;
    referralCode?: string;
  }) => Promise<void>;
  loading: boolean;
  initialReferralCode?: string | null;
  referralSettings: ReferralSettings | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onRegister, 
  loading, 
  initialReferralCode,
  referralSettings
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [referralCode, setReferralCode] = useState(initialReferralCode || '');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (initialReferralCode) {
      setReferralCode(initialReferralCode);
    }
  }, [initialReferralCode]);

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }
    
    if (!country) {
      alert('Please select a country');
      return;
    }
    
    onRegister({
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
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            id="name"
            type="text"
            placeholder="Your full name"
            className="pl-10"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-email">Email Address</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            id="register-email"
            type="email"
            placeholder="your@email.com"
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 9876543210"
            className="pl-10"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select value={country} onValueChange={setCountry} required>
            <SelectTrigger id="country" className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
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
            placeholder="Your city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
      </div>
      
      {/* Referral Code Field */}
      <div className="space-y-2">
        <Label htmlFor="referral-code">Referral Code (Optional)</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Gift className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            id="referral-code"
            type="text"
            placeholder="Enter referral code"
            className="pl-10"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
          />
        </div>
        
        {referralSettings && (
          <div className="text-xs text-gray-500 mt-1 flex items-center p-2 bg-ifind-aqua/5 rounded-md">
            <Gift className="h-3 w-3 mr-1 text-ifind-aqua" />
            Get ${referralSettings.referred_reward} credit when you sign up with a referral code!
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <div className="relative">
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Password must be at least 8 characters long
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        {passwordError && (
          <p className="text-xs text-red-500">{passwordError}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-ifind-aqua hover:bg-ifind-teal transition-colors"
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
      
      <p className="text-xs text-center text-muted-foreground">
        By registering, you agree to our{' '}
        <Link to="/terms" className="text-ifind-aqua hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="text-ifind-aqua hover:underline">
          Privacy Policy
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
