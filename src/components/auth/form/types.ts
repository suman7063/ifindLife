
import { z } from 'zod';

// Create form validation schema
export const registerFormSchema = z.object({
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

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
