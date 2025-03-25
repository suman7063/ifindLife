
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Mail, Phone, User, Gift, MapPin, Check, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReferralSettings } from '@/types/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@/components/ui/checkbox';

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

// Create form validation schema
const registerFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(6, { message: "Phone number is too short" }),
  country: z.string().min(1, { message: "Please select a country" }),
  city: z.string().optional(),
  referralCode: z.string().optional(),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .refine(val => /[A-Z]/.test(val), { message: "Password must contain at least one uppercase letter" })
    .refine(val => /[a-z]/.test(val), { message: "Password must contain at least one lowercase letter" })
    .refine(val => /[0-9]/.test(val), { message: "Password must contain at least one number" })
    .refine(val => /[^A-Za-z0-9]/.test(val), { message: "Password must contain at least one special character" }),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

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
  setCaptchaVerified?: (verified: boolean) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onRegister, 
  loading, 
  initialReferralCode,
  referralSettings,
  setCaptchaVerified
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Set up form with validation
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      referralCode: initialReferralCode || "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  useEffect(() => {
    if (initialReferralCode) {
      form.setValue("referralCode", initialReferralCode);
    }
  }, [initialReferralCode, form]);

  // Update password strength when password changes
  useEffect(() => {
    const password = form.watch("password");
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Lowercase check
    if (/[a-z]/.test(password)) strength += 1;
    
    // Number check
    if (/[0-9]/.test(password)) strength += 1;
    
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [form.watch("password")]);

  // Determine password strength color and label
  const getPasswordStrengthInfo = () => {
    if (passwordStrength === 0) return { color: "bg-gray-200", label: "Password strength" };
    if (passwordStrength < 3) return { color: "bg-red-500", label: "Weak" };
    if (passwordStrength < 5) return { color: "bg-yellow-500", label: "Medium" };
    return { color: "bg-green-500", label: "Strong" };
  };

  const passwordStrengthInfo = getPasswordStrengthInfo();

  // Submit handler
  const onSubmit = (data: z.infer<typeof registerFormSchema>) => {
    onRegister({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      country: data.country,
      city: data.city || "",
      referralCode: data.referralCode,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Full Name</FormLabel>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <FormControl>
                  <Input
                    placeholder="Your full name"
                    className="pl-10"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Email Address</FormLabel>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Phone Number</FormLabel>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+91 9876543210"
                    className="pl-10"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Country</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>City (Optional)</FormLabel>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Your city"
                      className="pl-10"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="referralCode"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Referral Code (Optional)</FormLabel>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </div>
                <FormControl>
                  <Input
                    placeholder="Enter referral code"
                    className="pl-10"
                    {...field}
                  />
                </FormControl>
              </div>
              
              {referralSettings && (
                <div className="text-xs text-gray-500 mt-1 flex items-center p-2 bg-ifind-aqua/5 rounded-md">
                  <Gift className="h-3 w-3 mr-1 text-ifind-aqua" />
                  Get ${referralSettings.referred_reward} credit when you sign up with a referral code!
                </div>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
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
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{passwordStrengthInfo.label}</span>
                  <span className="text-xs text-muted-foreground">{passwordStrength}/5</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${passwordStrengthInfo.color} transition-all duration-300`} 
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
                
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li className="flex items-center">
                    {/[A-Z]/.test(field.value) ? 
                      <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                      <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />
                    }
                    One uppercase letter
                  </li>
                  <li className="flex items-center">
                    {/[a-z]/.test(field.value) ? 
                      <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                      <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />
                    }
                    One lowercase letter
                  </li>
                  <li className="flex items-center">
                    {/[0-9]/.test(field.value) ? 
                      <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                      <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />
                    }
                    One number
                  </li>
                  <li className="flex items-center">
                    {/[^A-Za-z0-9]/.test(field.value) ? 
                      <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                      <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />
                    }
                    One special character
                  </li>
                  <li className="flex items-center">
                    {field.value.length >= 8 ? 
                      <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                      <AlertCircle className="h-3 w-3 text-muted-foreground mr-1" />
                    }
                    Minimum 8 characters
                  </li>
                </ul>
              </div>
              
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Confirm Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="termsAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I accept the <Link to="/terms" className="text-ifind-aqua hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-ifind-aqua hover:underline">Privacy Policy</Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        <Alert className="bg-blue-50 text-blue-700 border-blue-200">
          <AlertDescription>
            By clicking "Create Account", you agree to receive a verification email to confirm your email address.
          </AlertDescription>
        </Alert>
        
        <Button 
          type="submit" 
          className="w-full bg-ifind-aqua hover:bg-ifind-teal transition-colors"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
