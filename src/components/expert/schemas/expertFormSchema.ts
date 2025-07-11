
import { z } from "zod";

// Define form schema with validation
export const expertFormSchema = z.object({
  // Personal Info
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Phone number is required"),
  
  // Address Info
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  country: z.string().min(1, "Country is required"),
  
  // Professional Info
  title: z.string().min(1, "Professional title is required"),
  experience: z.number().min(0, "Please specify years of experience"),
  
  bio: z.string().min(50, "Bio should be at least 50 characters"),
  expertCategory: z.enum(["listening-volunteer", "listening-expert", "mindfulness-coach", "mindfulness-expert", "spiritual-mentor"], {
    required_error: "Please select an expert category",
  }),
  certificate: z.instanceof(File, { message: "Please upload your Soulversity certificate" }),
  
  // CAPTCHA
  captchaAnswer: z.number(),
  
  // Account
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(value => value === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ExpertFormValues = z.infer<typeof expertFormSchema>;
