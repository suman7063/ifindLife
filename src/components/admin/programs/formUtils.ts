
import * as z from 'zod';
import { ProgramCategory, ProgramType } from '@/types/programs';
import { Program } from '@/types/programs';

// Form schema for program form validation
export const programFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  sessions: z.coerce.number().min(1, "Must have at least 1 session"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  image: z.string().url("Must be a valid URL"),
  category: z.enum(['quick-ease', 'resilience-building', 'super-human', 'issue-based'] as const),
  programType: z.enum(['wellness', 'academic', 'business'] as const)
});

// Type for the form values from the schema
export type ProgramFormValues = z.infer<typeof programFormSchema>;

// Helper function to prepare form defaults from a program
export const getProgramFormDefaults = (program?: Program | null): ProgramFormValues => {
  if (program) {
    return {
      title: program.title,
      description: program.description,
      duration: program.duration,
      sessions: program.sessions,
      price: program.price,
      image: program.image,
      category: program.category,
      programType: program.programType
    };
  }
  
  return {
    title: "",
    description: "",
    duration: "",
    sessions: 1,
    price: 0,
    image: "",
    category: 'quick-ease' as ProgramCategory,
    programType: 'wellness' as ProgramType
  };
};

// Helper function to prepare program data for saving
export const prepareProgramData = (values: ProgramFormValues, existingId?: number): Program => {
  if (existingId) {
    // For existing programs, ensure all required fields are present
    return { 
      id: existingId,
      title: values.title,
      description: values.description,
      duration: values.duration,
      sessions: values.sessions,
      price: values.price,
      image: values.image,
      category: values.category,
      programType: values.programType
    };
  }
  
  // For new programs, ensure all required fields are present with a temporary ID
  return { 
    id: -1,
    title: values.title,
    description: values.description,
    duration: values.duration,
    sessions: values.sessions,
    price: values.price,
    image: values.image,
    category: values.category,
    programType: values.programType
  };
};
