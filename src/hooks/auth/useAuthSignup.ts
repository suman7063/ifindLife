
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { getCurrencyByCountry, handleAuthError } from '@/utils/authUtils';

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  city?: string;
  referralCode?: string;
}

export const useAuthSignup = (setLoading: (value: boolean) => void) => {
  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      setLoading(true);
      console.log("Starting signup process:", userData.email);
      
      // Validate required fields
      if (!userData.email || !userData.password || !userData.name || !userData.phone || !userData.country) {
        toast.error('Please fill in all required fields');
        return false;
      }
      
      // Determine currency based on country
      const currency = getCurrencyByCountry(userData.country);
      console.log("Determined currency:", currency);

      // Create new user
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            country: userData.country,
            city: userData.city || '',
            currency,
            referralCode: userData.referralCode || null,
          },
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        }
      });

      console.log("Signup response:", data ? "Data received" : "No data", error ? "Error:" + error.message : "No error");

      if (error) {
        // Handle specific error cases with user-friendly messages
        if (error.message.includes('already registered')) {
          toast.error('This email is already registered. Please login instead.');
        } else if (error.message.includes('password')) {
          toast.error('Password does not meet security requirements.');
        } else {
          toast.error(error.message);
        }
        return false;
      }

      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        toast.error('This email is already registered. Please login instead.');
        return false;
      }

      // Process referral if provided
      if (userData.referralCode && data.user) {
        try {
          console.log("Processing referral code:", userData.referralCode);
          // Attempt to verify referral code
          const { error: referralError } = await supabase
            .from('referrals')
            .insert({
              referrer_id: null, // This will be populated by the backend function
              referred_id: data.user.id,
              referral_code: userData.referralCode,
              status: 'pending'
            });
            
          if (referralError) {
            console.error('Error processing referral:', referralError);
            // Don't fail the whole signup if just the referral fails
          }
        } catch (referralError) {
          console.error('Error processing referral:', referralError);
        }
      }

      toast.success('Account created successfully! Please check your email for verification.');
      return true;
    } catch (error: any) {
      console.error("Unexpected signup error:", error);
      handleAuthError(error, 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { signup };
};
