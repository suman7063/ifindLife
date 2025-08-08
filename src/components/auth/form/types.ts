
import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import { ReferralSettings } from '@/types/supabase';
import { Dispatch, SetStateAction } from 'react';

// Create form validation schema
export const registerFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(6, { message: "Phone number is too short" }),
  country: z.string().min(1, { message: "Please select a country" }),
  city: z.string().optional(),
  referralCode: z.string().optional(),
  password: z.string()
    .min(12, { message: "Password must be at least 12 characters" })
    .refine(val => /[A-Z]/.test(val), { message: "Password must contain at least one uppercase letter" })
    .refine(val => /[a-z]/.test(val), { message: "Password must contain at least one lowercase letter" })
    .refine(val => /[0-9]/.test(val), { message: "Password must contain at least one number" })
    .refine(val => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val), { message: "Password must contain at least one special character" })
    .refine(val => !/(.)\1{2,}/.test(val), { message: "Avoid repeating the same character multiple times" })
    .refine(val => !/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(val), { message: "Avoid sequential characters or numbers" }),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions" }),
  captcha: z.string().min(1, { message: "Please verify that you are not a robot" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

// Component prop types
export interface UserInfoFieldsProps {
  form: UseFormReturn<RegisterFormValues>;
  showCityField: boolean;
  setShowCityField: Dispatch<SetStateAction<boolean>>;
}

export interface PasswordFieldsProps {
  form: UseFormReturn<RegisterFormValues>;
}

export interface ReferralCodeFieldProps {
  form: UseFormReturn<RegisterFormValues>;
  initialReferralCode?: string | null;
  referralSettings?: ReferralSettings | null;
}

export interface TermsCheckboxProps {
  form: UseFormReturn<RegisterFormValues>;
}

export interface PasswordStrengthIndicatorProps {
  password: string;
}
