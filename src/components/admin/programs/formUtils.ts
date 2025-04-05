
import { z } from 'zod';
import { Program, ProgramType, ProgramCategory } from '@/types/programs';

// Validation schema for program form
export const programFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
  duration: z.string().min(1, { message: 'Duration is required' }),
  sessions: z.coerce.number().min(1, { message: 'Number of sessions must be at least 1' }),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  category: z.string().min(1, { message: 'Category is required' }),
  programType: z.string(),
  image: z.string().min(1, { message: 'Image URL is required' }),
});

export type ProgramFormValues = z.infer<typeof programFormSchema>;

// Get default values for form
export const getProgramFormDefaults = (program: Program | null): ProgramFormValues => {
  if (!program) {
    return {
      title: '',
      description: '',
      duration: '',
      sessions: 0,
      price: 0,
      category: '',
      programType: 'wellness',
      image: '',
    };
  }
  
  return {
    title: program.title,
    description: program.description,
    duration: program.duration || '',
    sessions: program.sessions || 0,
    price: program.price,
    category: program.category,
    image: program.image || '',
    programType: program.programType || 'wellness',
  };
};

// Prepare program data for saving
export const prepareProgramData = (values: ProgramFormValues, id?: number): Program => {
  if (id) {
    // Update existing program
    return {
      id,
      title: values.title,
      description: values.description,
      duration: values.duration,
      sessions: values.sessions,
      price: values.price,
      image: values.image,
      category: values.category as ProgramCategory,
      programType: values.programType as ProgramType,
      created_at: new Date().toISOString(), // Add required created_at field
    };
  }
  
  // Create new program
  return {
    id: Math.floor(Math.random() * 10000), // Temporary ID until saved
    title: values.title,
    description: values.description,
    duration: values.duration,
    sessions: values.sessions,
    price: values.price,
    image: values.image,
    category: values.category as ProgramCategory,
    programType: values.programType as ProgramType,
    created_at: new Date().toISOString(), // Add required created_at field
  };
};
